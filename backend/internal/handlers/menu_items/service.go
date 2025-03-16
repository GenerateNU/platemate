package menu_items

import (
	"context"
	"errors"
	"fmt"
	"log/slog"

	"github.com/GenerateNU/platemate/internal/handlers/review"
	"github.com/GenerateNU/platemate/internal/xvalidator"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func newService(collections map[string]*mongo.Collection) *Service {
	if collections["menuItems"] == nil {
		slog.Info("menuItems collection is nil!")
	}
	return &Service{collections["menuItems"], collections["reviews"]}
}

var ErrInvalidID = errors.New("the provided hex string is not a valid ObjectID")

const MAX_SIMILAR_ITEMS = 5

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

	if menuItemsQuery.Name != "" {
		filter["$text"] = bson.M{
			"$search": menuItemsQuery.Name,
		}
	}

	if menuItemsQuery.Longitude != nil && menuItemsQuery.Latitude != nil { // return menu items in order of closest location
		filter["location"] = bson.M{
			"$near": bson.M{
				"$geometry": bson.M{
					"type":        "Point",
					"coordinates": []float64{*menuItemsQuery.Longitude, *menuItemsQuery.Latitude},
				},
				"$maxDistance": 6437.38, // Optional: 4 mile search radius
			},
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

func (s *Service) GetSimilarMenuItems(itemID primitive.ObjectID) ([]MenuItemResponse, error) {
	originalItem, err := s.GetMenuItemById(itemID)
	if err != nil {
		return nil, err
	}

	if validationErrors := xvalidator.Validator.Validate(originalItem.MenuItemRequest); len(validationErrors) > 0 {
		return nil, fmt.Errorf("validation errors: %v", validationErrors)
	}

	pipeline := mongo.Pipeline{
		bson.D{{
			Key: "$search",
			Value: bson.M{
				"index": "similar",
				"compound": bson.M{
					"must": []bson.M{
						{
							"moreLikeThis": bson.M{
								"like": bson.M{
									"name":                originalItem.MenuItemRequest.Name,
									"description":         originalItem.MenuItemRequest.Description,
									"tags":                originalItem.MenuItemRequest.Tags,
									"dietaryRestrictions": originalItem.MenuItemRequest.DietaryRestrictions,
								},
							},
						},
					},
					"mustNot": []bson.M{
						{
							"equals": bson.M{
								"path":  "_id",
								"value": itemID,
							},
						},
					},
				},
			},
		}},
		bson.D{{
			Key:   "$limit",
			Value: MAX_SIMILAR_ITEMS,
		}},
	}

	cursor, err := s.menuItems.Aggregate(context.Background(), pipeline)
	if err != nil {
		slog.Error("Error executing moreLikeThis search", "error", err)
		return nil, err
	}
	defer cursor.Close(context.Background())

	var menuItems []MenuItemDocument
	if err := cursor.All(context.Background(), &menuItems); err != nil {
		slog.Error("Error decoding results", "error", err)
		return nil, err
	}

	similarItems := make([]MenuItemResponse, len(menuItems))
	for i, item := range menuItems {
		similarItems[i] = ToMenuItemResponse(item)
	}

	return similarItems, nil
}

func (s *Service) GetMenuItemReviews(idObj primitive.ObjectID, userID *primitive.ObjectID) ([]review.ReviewDocument, error) {
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

	filter := bson.M{"_id": bson.M{"$in": menuItemDoc.Reviews}}
	if userID != nil {
		filter["reviewer._id"] = *userID

	}

	// Query reviews that match menu item and user, if provided
	reviewsCursor, err := s.reviews.Find(ctx, filter, options.Find().SetSort(bson.D{{Key: "timestamp", Value: -1}}))
	if err != nil {
		slog.Error("Error finding reviews", "error", err)
		return nil, err
	}
	defer reviewsCursor.Close(ctx)

	var reviews []review.ReviewDocument
	if err = reviewsCursor.All(ctx, &reviews); err != nil {
		slog.Error("Error finding reviews", "error", err)
		return nil, err
	}
	if reviews == nil {
		reviews = []review.ReviewDocument{}
	}

	return reviews, nil
}

func (s *Service) GetMenuItemReviewPictures(idObj primitive.ObjectID) ([]string, error) {
	var menuItemDoc MenuItemDocument
	err := s.menuItems.FindOne(context.Background(), bson.M{"_id": idObj}).Decode(&menuItemDoc)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return []string{}, nil
		}
		slog.Error("Error finding document", "error", err)
		return nil, err
	}

	if len(menuItemDoc.Reviews) == 0 {
		return []string{}, nil
	}

	filter := bson.M{"_id": bson.M{"$in": menuItemDoc.Reviews}}
	projection := bson.M{"picture": 1} // Only include the picture field
	// Query reviews that match menu item and project only the picture field
	reviewsCursor, err := s.reviews.Find(context.Background(), filter, options.Find().SetProjection(projection))

	if err != nil {
		slog.Error("Error finding reviews", "error", err)
		return nil, err
	}
	defer reviewsCursor.Close(context.Background())

	var reviews []struct {
		Picture string `bson:"picture"` // The picture field in the review
	}

	if err = reviewsCursor.All(context.Background(), &reviews); err != nil {
		slog.Error("Error decoding reviews", "error", err)
		return nil, err
	}
	if reviews == nil {
		return []string{}, nil
	}

	var reviewPictures []string
	for _, review := range reviews {
		reviewPictures = append(reviewPictures, review.Picture)
	}

	return reviewPictures, nil
}
