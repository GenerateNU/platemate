package menu_items

import (
	"context"
	"errors"
	"fmt"
	"log/slog"

	"github.com/GenerateNU/platemate/internal/handlers/review"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

/*
Menu Items Service to be used by Menu Items Handler to interact with the
Database layer of the application
*/
type Service struct {
	menuItems *mongo.Collection
	reviews   *mongo.Collection
}

func newService(collections map[string]*mongo.Collection) *Service {
	if collections["menuItems"] == nil {
		slog.Info("menuItems collection is nil!")
	}
	return &Service{collections["menuItems"], collections["reviews"]}
}

type MenuItemDocument struct {
	ID                  primitive.ObjectID   `bson:"_id,omitempty"`
	Name                string               `bson:"name"`
	Picture             string               `bson:"picture"`
	AvgRating           AvgRatingDocument    `bson:"avgRating,omitempty"`
	Reviews             []primitive.ObjectID `bson:"reviews"`
	Description         string               `bson:"description"`
	Location            []float64            `bson:"location"`
	Tags                []string             `bson:"tags"`
	DietaryRestrictions []string             `bson:"dietaryRestrictions"`
}

type AvgRatingDocument struct {
	Portion *float64 `bson:"portion"`
	Taste   *float64 `bson:"taste"`
	Value   *float64 `bson:"value"`
	Overall *float64 `bson:"overall"`
	Return  *bool    `bson:"return"` // @TODO: figure out if boolean or number
}

var ErrInvalidID = errors.New("the provided hex string is not a valid ObjectID")

func ParseMenuItemRequest(menuItemRequest MenuItemRequest) (MenuItemDocument, error) {
	avgRatingDoc := AvgRatingDocument{
		Portion: menuItemRequest.AvgRating.Portion,
		Taste:   menuItemRequest.AvgRating.Taste,
		Value:   menuItemRequest.AvgRating.Value,
		Overall: menuItemRequest.AvgRating.Overall,
		Return:  menuItemRequest.AvgRating.Return,
	}

	var reviewsObjectID []primitive.ObjectID
	for _, review := range menuItemRequest.Reviews {
		objectID, err := primitive.ObjectIDFromHex(review) // Convert each string to ObjectID
		if err != nil {
			return MenuItemDocument{}, fmt.Errorf("invalid review ID '%s': %w", review, ErrInvalidID)

		}

		reviewsObjectID = append(reviewsObjectID, objectID)
	}

	menuItemDoc := MenuItemDocument{
		Name:                menuItemRequest.Name,
		Picture:             menuItemRequest.Picture,
		AvgRating:           avgRatingDoc,
		Reviews:             reviewsObjectID,
		Description:         menuItemRequest.Description,
		Location:            menuItemRequest.Location,
		Tags:                menuItemRequest.Tags,
		DietaryRestrictions: menuItemRequest.DietaryRestrictions,
	}

	return menuItemDoc, nil
}

func ApplyRatingFilter(filter bson.M, field string, min *float64, max *float64) {
	if min == nil && max == nil {
		return
	}
	ratingFilter := bson.M{}

	if min != nil {
		ratingFilter["$gte"] = *min
	}
	if max != nil {
		ratingFilter["$lte"] = *max
	}

	// Apply the rating filter to the filter map
	filter[field] = ratingFilter
}

func ToMenuItemResponse(menuItem MenuItemDocument) MenuItemResponse {
	var reviews []string
	for _, review := range menuItem.Reviews {
		reviews = append(reviews, review.Hex())
	}
	return MenuItemResponse{
		ID: menuItem.ID.Hex(),
		MenuItemRequest: MenuItemRequest{
			Name:    menuItem.Name,
			Picture: menuItem.Picture,
			AvgRating: AvgRatingRequest{
				Portion: menuItem.AvgRating.Portion,
				Taste:   menuItem.AvgRating.Taste,
				Value:   menuItem.AvgRating.Value,
				Overall: menuItem.AvgRating.Overall,
				Return:  menuItem.AvgRating.Return,
			},
			Reviews:             reviews,
			Description:         menuItem.Description,
			Location:            menuItem.Location,
			Tags:                menuItem.Tags,
			DietaryRestrictions: menuItem.DietaryRestrictions,
		},
	}
}

func (s *Service) GetMenuItems(menuItemsQuery MenuItemsQuery) ([]MenuItemResponse, error) {
	filter := bson.M{}
	ApplyRatingFilter(filter, "avgRating.portion", menuItemsQuery.MinRatingPortion, menuItemsQuery.MaxRatingPortion)
	ApplyRatingFilter(filter, "avgRating.taste", menuItemsQuery.MinRatingTaste, menuItemsQuery.MaxRatingTaste)
	ApplyRatingFilter(filter, "avgRating.value", menuItemsQuery.MinRatingValue, menuItemsQuery.MaxRatingValue)
	ApplyRatingFilter(filter, "avgRating.overall", menuItemsQuery.MinRatingOverall, menuItemsQuery.MaxRatingOverall)

	slog.Info("tags", "tags", menuItemsQuery.Tags)
	if len(menuItemsQuery.Tags) > 0 {
		filter["tags"] = bson.M{"$in": menuItemsQuery.Tags}
	}

	// Dietary restrictions filter
	if len(menuItemsQuery.DietaryRestrictions) > 0 {
		filter["dietaryRestrictions"] = bson.M{
			"$all": menuItemsQuery.DietaryRestrictions,
			"$not": bson.M{"$size": 0},
		}
	}

	options := options.Find()
	options.SetSkip(int64(menuItemsQuery.Skip)) // Skip the first `Skip` items
	if menuItemsQuery.Limit != nil {
		options.SetLimit(int64(*menuItemsQuery.Limit)) // Limit the number of results to `Limit`
	}
	// Query the database
	cursor, err := s.menuItems.Find(context.Background(), filter, options)
	if err != nil {
		return nil, err
	}

	var menuItems []MenuItemDocument
	if err := cursor.All(context.Background(), &menuItems); err != nil {
		return nil, err
	}

	menuItemsResponse := make([]MenuItemResponse, len(menuItems))
	for i, menuItem := range menuItems {
		menuItemsResponse[i] = ToMenuItemResponse(menuItem)
	}

	return menuItemsResponse, nil
}

func (s *Service) UpdateMenuItem(idObj primitive.ObjectID, menuItemRequest MenuItemRequest) (MenuItemResponse, error) {
	menuItemDoc, errReviewID := ParseMenuItemRequest(menuItemRequest)
	if errReviewID != nil {
		return MenuItemResponse{}, errReviewID
	}
	errUpdate := s.menuItems.FindOneAndUpdate(
		context.Background(),
		bson.M{"_id": idObj},        // filter to match the document
		bson.M{"$set": menuItemDoc}, // update the document
		options.FindOneAndUpdate().SetReturnDocument(options.After), // return the updated document
	).Decode(&menuItemDoc)

	if errUpdate != nil {
		slog.Error("Error updating document", "error", errUpdate)
		return MenuItemResponse{}, errUpdate
	}

	updatedMenuItemResponse := ToMenuItemResponse(menuItemDoc)
	return updatedMenuItemResponse, nil

}

func (s *Service) CreateMenuItem(menuItemRequest MenuItemRequest) (MenuItemResponse, error) {
	menuItemDoc, errReviewID := ParseMenuItemRequest(menuItemRequest)
	if errReviewID != nil {
		return MenuItemResponse{}, errReviewID
	}
	slog.Info("doc", "menuItemDocument", menuItemDoc)

	result, err := s.menuItems.InsertOne(context.Background(), menuItemDoc)
	if err != nil {
		slog.Error("Error inserting document", "error", err)
		return MenuItemResponse{}, err
	}
	// set the ID of the menuItem to the ID of the inserted document
	menuItemID := result.InsertedID.(primitive.ObjectID).Hex()
	menuItemResponse := MenuItemResponse{
		ID:              menuItemID,
		MenuItemRequest: menuItemRequest,
	}
	return menuItemResponse, nil
}

func (s *Service) GetMenuItemById(idObj primitive.ObjectID) (MenuItemResponse, error) {
	var menuItemDoc MenuItemDocument

	errGet := s.menuItems.FindOne(context.Background(), bson.M{"_id": idObj}).Decode(&menuItemDoc)
	if errGet != nil {
		slog.Error("Error finding document", "error", errGet)
		return MenuItemResponse{}, errGet
	}
	menuItem := ToMenuItemResponse(menuItemDoc)
	return menuItem, nil

}

func (s *Service) DeleteMenuItem(idObj primitive.ObjectID) (MenuItemResponse, error) {
	var menuItemDoc MenuItemDocument
	err := s.menuItems.FindOneAndDelete(context.Background(), bson.M{"_id": idObj}).Decode(&menuItemDoc)
	if err != nil {
		slog.Error("Error deleting document", "error", err)
		return MenuItemResponse{}, err
	}
	menuItemResponse := ToMenuItemResponse(menuItemDoc)
	return menuItemResponse, nil
}

func (s *Service) GetMenuItemReviews(idObj primitive.ObjectID) ([]review.ReviewDocument, error) {
	var menuItemDoc MenuItemDocument
	ctx := context.Background()
	err := s.menuItems.FindOne(ctx, bson.M{"_id": idObj}).Decode(&menuItemDoc)
	if err != nil {
		slog.Error("Error finding document", "error", err)
		if err == mongo.ErrNoDocuments {
			return []review.ReviewDocument{}, nil
		}
		return nil, err
	}

	if len(menuItemDoc.Reviews) == 0 {
		return []review.ReviewDocument{}, nil
	}

	// Query reviews that match menu item
	reviewsCursor, err := s.reviews.Find(ctx,
		bson.M{
			"_id": bson.M{"$in": menuItemDoc.Reviews},
		},
		options.Find().SetSort(bson.D{{Key: "timestamp", Value: -1}}),
	)
	if err != nil {
		slog.Error("Error finding reviews", "error", err)
		return nil, err
	}
	defer reviewsCursor.Close(ctx)

	var reviews []review.ReviewDocument
	if err = reviewsCursor.All(context.Background(), &reviews); err != nil {
		slog.Error("Error finding reviews", "error", err)
		return nil, err
	}

	return reviews, nil
}
