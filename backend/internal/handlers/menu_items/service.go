package menu_items

import (
	"context"
	"errors"
	"fmt"
	"log/slog"
	"strings"

	"github.com/GenerateNU/platemate/internal/handlers/review"
	"github.com/GenerateNU/platemate/internal/xvalidator"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func NewService(collections map[string]*mongo.Collection) *Service {
	if collections["menuItems"] == nil {
		slog.Info("menuItems collection is nil!")
	}
	return &Service{collections["menuItems"], collections["reviews"], collections["users"]}
}

var ErrInvalidID = errors.New("the provided hex string is not a valid ObjectID")

const MAX_SIMILAR_ITEMS = 5

func ParseMenuItemRequest(menuItemRequest MenuItemRequest) (MenuItemDocument, error) {
	avgRatingDoc := AvgRatingDocument{
		Portion: 0,
		Taste:   0,
		Value:   0,
		Overall: 0,
		Return:  0,
	}

	var reviewsObjectID []primitive.ObjectID
	for _, review := range menuItemRequest.Reviews {
		objectID, err := primitive.ObjectIDFromHex(review) // Convert each string to ObjectID
		if err != nil {
			return MenuItemDocument{}, fmt.Errorf("invalid review ID '%s': %w", review, ErrInvalidID)

		}

		reviewsObjectID = append(reviewsObjectID, objectID)
	}

	// create a new ObjectID for the menu item
	menuItemDoc := MenuItemDocument{
		ID:                  primitive.NewObjectID(),
		Name:                menuItemRequest.Name,
		Picture:             menuItemRequest.Picture,
		AvgRating:           avgRatingDoc,
		Reviews:             reviewsObjectID,
		RestaurantID:        menuItemRequest.RestaurantID,
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
	var reviews = make([]string, len(menuItem.Reviews))
	for i, review := range menuItem.Reviews {
		reviews[i] = review.Hex()
	}
	return MenuItemResponse{
		ID: menuItem.ID.Hex(),
		MenuItemRequest: MenuItemRequest{
			Name:                menuItem.Name,
			Picture:             menuItem.Picture,
			Reviews:             reviews,
			Description:         menuItem.Description,
			Location:            menuItem.Location,
			Tags:                menuItem.Tags,
			DietaryRestrictions: menuItem.DietaryRestrictions,
			RestaurantID:        menuItem.RestaurantID,
		},
	}
}

func (s *Service) GetMenuItems(menuItemsQuery MenuItemsQuery) ([]MenuItemResponse, error) {
	filter := bson.M{}
	ApplyRatingFilter(filter, "avgRating.portion", menuItemsQuery.MinRatingPortion, menuItemsQuery.MaxRatingPortion)
	ApplyRatingFilter(filter, "avgRating.taste", menuItemsQuery.MinRatingTaste, menuItemsQuery.MaxRatingTaste)
	ApplyRatingFilter(filter, "avgRating.value", menuItemsQuery.MinRatingValue, menuItemsQuery.MaxRatingValue)
	ApplyRatingFilter(filter, "avgRating.overall", menuItemsQuery.MinRatingOverall, menuItemsQuery.MaxRatingOverall)

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

	// Sorting
	if menuItemsQuery.SortBy != "" {
		sortOrder := 1 // default: asc
		if strings.ToLower(menuItemsQuery.SortOrder) == "desc" {
			sortOrder = -1
		}
		// This respects the sortBy and sortOrder passed via query parameters,
		// so we rely on menuItemsQuery.SortBy being a valid, known field
		// e.g. sort by "avgRating.overall" or "name"
		options.SetSort(bson.D{{Key: menuItemsQuery.SortBy, Value: sortOrder}})
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

func (s *Service) GetRandomMenuItems(limit int) ([]MenuItemResponse, error) {
	ctx := context.Background()

	cursor, err := s.menuItems.Aggregate(ctx, mongo.Pipeline{
		bson.D{{
			Key: "$sample",
			Value: bson.M{
				"size": limit,
			},
		}},
	})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var menuItems []MenuItemDocument
	if err := cursor.All(ctx, &menuItems); err != nil {
		return nil, err
	}

	menuItemsResponse := make([]MenuItemResponse, len(menuItems))
	for i, menuItem := range menuItems {
		menuItemsResponse[i] = ToMenuItemResponse(menuItem)
	}

	return menuItemsResponse, nil
}

func (s *Service) GetMenuItemByRestaurant(idObj primitive.ObjectID) ([]MenuItemDocument, error) {
	var menuItemDocs []MenuItemDocument

	cursor, err := s.menuItems.Find(context.Background(), bson.M{"restaurantid": idObj})
	if err != nil {
		slog.Error("Error finding document", "error", err)
		return []MenuItemDocument{}, err
	}
	defer cursor.Close(context.Background())

	if err := cursor.All(context.Background(), &menuItemDocs); err != nil {
		slog.Error("Error finding document", "error", err)
		return []MenuItemDocument{}, err
	}
	return menuItemDocs, nil

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

func (s *Service) GetMenuItemReviews(idObj primitive.ObjectID, userID *primitive.ObjectID, sortParam string) ([]review.ReviewDocument, error) {
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

	// Query reviews that match menu item and user and sorts if provided

	// edits the sorting paramater to properly query
	if sortParam != "timestamp" {
		sortParam = "rating." + sortParam
	}
	reviewsCursor, err := s.reviews.Find(ctx, filter, options.Find().SetSort(bson.D{{Key: sortParam, Value: -1}}))
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

// Aggregates friend reviews to rank items by popularity.
func (s *Service) GetPopularWithFriends(userID primitive.ObjectID, limit int) ([]MenuItemResponse, error) {
	ctx := context.Background()

	if limit <= 0 {
		limit = 20 // default or however many we want
	}

	/*
		This pipeline starts from the "users" collection.
		1) Match the user doc
		2) $lookup reviews whose "reviewer._id" is in that user's "following"
		3) Unwind the resulting array of "friendReviews" so we can group them
		4) Group by friendReviews.menuItem => compute count (quantity), averageOverall (quality)
		5) Project a final "score" that weighs quantity + quality using score = averageOverall + 0.5 * ln(count + 1)
			The formula can be adjusted by:
			- Changing the weight of review count (using a different multiplier instead of 0.5)
			- Applying a different scaling function (e.g., sqrt(count + 1))
			- (later) Incorporating additional factors like recency or variance in ratings
		6) Sort by score (default desc)
		7) Limit (default 20)
		8) $lookup the actual menuItems for each group result by _id => menuItem doc
	*/

	pipeline := mongo.Pipeline{
		// 1) Match the user doc
		bson.D{{Key: "$match", Value: bson.M{"_id": userID}}},

		// 2) Lookup reviews where the reviewer is in the user's "following" list
		bson.D{{
			Key: "$lookup",
			Value: bson.M{
				"from": "reviews",
				"let":  bson.M{"friendIDs": "$following"},
				"pipeline": bson.A{
					// Cast reviewer.id to an ObjectID so it can match friendIDs (ObjectIDs)
					bson.M{
						"$match": bson.M{
							"$expr": bson.M{
								"$in": bson.A{
									bson.M{"$toObjectId": "$reviewer.id"},
									"$$friendIDs",
								},
							},
						},
					},
					// Convert "menuItem" string field to ObjectId so we can join with menuItems
					bson.M{
						"$addFields": bson.M{
							"menuItemObjId": bson.M{"$toObjectId": "$menuItem"},
						},
					},
				},
				"as": "friendReviews",
			},
		}},

		// 3) Unwind "friendReviews" so we can group them
		bson.D{{Key: "$unwind", Value: "$friendReviews"}},

		// 4) Group by friendReviews.menuItemObjId (converted ObjectId)
		bson.D{{
			Key: "$group",
			Value: bson.M{
				"_id":            "$friendReviews.menuItemObjId",
				"count":          bson.M{"$sum": 1},
				"averageOverall": bson.M{"$avg": "$friendReviews.rating.overall"},
			},
		}},

		// 5) Project a "score"
		bson.D{{
			Key: "$project",
			Value: bson.M{
				"count":          1,
				"averageOverall": 1,
				"score": bson.M{"$add": bson.A{
					"$averageOverall",
					bson.M{"$multiply": bson.A{
						0.5,
						bson.M{"$ln": bson.M{"$add": bson.A{"$count", 1}}},
					}},
				}},
			},
		}},

		// 6) Sort by "score" descending
		bson.D{{Key: "$sort", Value: bson.M{"score": -1}}},

		// 7) Limit
		bson.D{{Key: "$limit", Value: limit}},

		// 8) Lookup menuItems where _id matches the converted menuItemObjId
		bson.D{{
			Key: "$lookup",
			Value: bson.M{
				"from":         "menuItems",
				"localField":   "_id", // This is now ObjectID
				"foreignField": "_id",
				"as":           "itemDoc",
			},
		}},
		// Unwind itemDoc to get a single doc per record
		bson.D{{Key: "$unwind", Value: "$itemDoc"}},
	}

	// Pipeline starts from the "users" collection
	cursor, err := s.users.Aggregate(ctx, pipeline)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	// Decode into a temporary struct
	type popResult struct {
		ID             primitive.ObjectID `bson:"_id"`
		Count          int                `bson:"count"`
		AverageOverall float64            `bson:"averageOverall"`
		Score          float64            `bson:"score"`

		// The looked-up menu item doc
		ItemDoc MenuItemDocument `bson:"itemDoc"`
	}

	var results []popResult
	if err := cursor.All(ctx, &results); err != nil {
		return nil, err
	}

	// Convert each popResult.ItemDoc to MenuItemResponse
	final := make([]MenuItemResponse, 0, len(results))
	for _, r := range results {
		final = append(final, ToMenuItemResponse(r.ItemDoc))
	}

	return final, nil
}

// GetMenuItemMetrics retrieves analytics for a specific menu item
func (s *Service) GetMenuItemMetrics(menuItemID primitive.ObjectID) (*MenuItemMetrics, error) {
	ctx := context.Background()

	var menuItemDoc MenuItemDocument
	err := s.menuItems.FindOne(ctx, bson.M{"_id": menuItemID}).Decode(&menuItemDoc)
	if err != nil {
		slog.Error("Error finding menu item for metrics", "error", err)
		return nil, err
	}

	// Create metrics from the document
	metrics := &MenuItemMetrics{
		ID:                  menuItemDoc.ID.Hex(),
		Name:                menuItemDoc.Name,
		OverallRating:       menuItemDoc.AvgRating.Overall,
		TasteRating:         menuItemDoc.AvgRating.Taste,
		PortionRating:       menuItemDoc.AvgRating.Portion,
		ValueRating:         menuItemDoc.AvgRating.Value,
		ReturnRate:          menuItemDoc.AvgRating.Return,
		ReviewCount:         len(menuItemDoc.Reviews),
		PopularTags:         menuItemDoc.Tags,
		DietaryRestrictions: menuItemDoc.DietaryRestrictions,
	}

	return metrics, nil
}
