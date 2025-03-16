package restaurant

import (
	"context"
	"fmt"

	"github.com/GenerateNU/platemate/internal/handlers/menu_items"
	"github.com/GenerateNU/platemate/internal/handlers/review"
	"github.com/GenerateNU/platemate/internal/handlers/user_connections"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type Service struct {
	restaurants            *mongo.Collection
	userConnectionsService *user_connections.Service
	menuItemsService       *menu_items.Service
	reviewService          *review.Service
}

func newService(collections map[string]*mongo.Collection, userConnectionsService *user_connections.Service, menuItemsService *menu_items.Service, reviewService *review.Service) *Service {
	return &Service{
		restaurants:            collections["restaurants"],
		userConnectionsService: userConnectionsService,
		menuItemsService:       menuItemsService,
		reviewService:          reviewService,
	}
}

// SearchRestaurants optionally takes a search string and runs a text query
// If empty -> returns all restaurants.
func (s *Service) SearchRestaurants(search string) ([]RestaurantDocument, error) {
	ctx := context.Background()

	filter := bson.M{}
	if search != "" {
		filter = bson.M{"$text": bson.M{"$search": search}}
	}

	cursor, err := s.restaurants.Find(ctx, filter)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var results []RestaurantDocument
	if err := cursor.All(ctx, &results); err != nil {
		return nil, err
	}
	return results, nil
}

// GetRestaurantByID returns a single RestaurantDocument
func (s *Service) GetRestaurantByID(id primitive.ObjectID) (*RestaurantDocument, error) {
	ctx := context.Background()

	var doc RestaurantDocument
	err := s.restaurants.FindOne(ctx, bson.M{"_id": id}).Decode(&doc)
	if err == mongo.ErrNoDocuments {
		// No matching restaurant found
		return nil, mongo.ErrNoDocuments
	} else if err != nil {
		// Different error occurred
		return nil, err
	}
	return &doc, nil
}

// UpdateRestaurant updates an existing document by ID
func (s *Service) UpdateRestaurant(id primitive.ObjectID, updateDoc RestaurantDocument) error {
	ctx := context.Background()
	filter := bson.M{"_id": id}

	updateFields := bson.M{

		"name":              updateDoc.Name,
		"description":       updateDoc.Description,
		"address.street":    updateDoc.Address.Street,
		"address.zipcode":   updateDoc.Address.Zipcode,
		"address.state":     updateDoc.Address.State,
		"address.location":  updateDoc.Address.Location,
		"menuItems":         updateDoc.MenuItems,
		"style":             updateDoc.Style,
		"picture":           updateDoc.Picture,
		"tags":              updateDoc.Tags,
		"ratingAvg.overall": updateDoc.RatingAvg.Overall,
		"ratingAvg.return":  updateDoc.RatingAvg.Return,
	}

	update := bson.M{"$set": updateFields}

	_, err := s.restaurants.UpdateOne(ctx, filter, update)
	return err
}

// UpdatePartialRestaurant updates only specified (non-zero) fields of a restaurant document by ID
func (s *Service) UpdatePartialRestaurant(id primitive.ObjectID, updated RestaurantDocument) error {
	ctx := context.Background()
	filter := bson.M{"_id": id}

	updateFields := bson.M{}

	if updated.Name != "" {
		updateFields["name"] = updated.Name
	}
	if updated.Description != "" {
		updateFields["description"] = updated.Description
	}
	if updated.Address.Street != "" {
		updateFields["address.street"] = updated.Address.Street
	}
	if updated.Address.Zipcode != "" {
		updateFields["address.zipcode"] = updated.Address.Zipcode
	}
	if updated.Address.State != "" {
		updateFields["address.state"] = updated.Address.State
	}
	if len(updated.Address.Location) > 0 {
		updateFields["address.location"] = updated.Address.Location
	}
	if len(updated.MenuItems) > 0 {
		updateFields["menuItems"] = updated.MenuItems
	}

	// Check non-zero for floats
	if updated.Style != "" {
		updateFields["style"] = updated.Style
	}
	if updated.Picture != "" {
		updateFields["picture"] = updated.Picture
	}
	if len(updated.Tags) > 0 {
		updateFields["tags"] = updated.Tags
	}
	// For nested numeric fields,
	if updated.RatingAvg.Overall != 0 {
		updateFields["ratingAvg.overall"] = updated.RatingAvg.Overall
	}
	if updated.RatingAvg.Return != 0 {
		updateFields["ratingAvg.return"] = updated.RatingAvg.Return
	}

	// If no fields to update, return early with no error
	if len(updateFields) == 0 {
		// Could also return an error if wanted
		return nil
	}

	update := bson.M{"$set": updateFields}

	_, err := s.restaurants.UpdateOne(ctx, filter, update)
	return err
}

// DeleteRestaurant removes a restaurant by ID
func (s *Service) DeleteRestaurant(id primitive.ObjectID) error {
	ctx := context.Background()
	filter := bson.M{"_id": id}

	res, err := s.restaurants.DeleteOne(ctx, filter)
	if err != nil {
		return err
	}
	if res.DeletedCount == 0 {
		return mongo.ErrNoDocuments
	}
	return nil
}

// GetRestaurantFriendsFav
// average of all your friends reviews for all menu items at restaurant --> if above 4 its a friend fav
// if its a friend fav -- display all of the friends that have been to the restaurant
func (s *Service) GetRestaurantFriendsFav(uid primitive.ObjectID, rid primitive.ObjectID) (*FriendsFav, error) {
	ctx := context.Background()

	var restaurant RestaurantDocument
	var friends []string
	var totalRating int
	var numOfRatings int
	var avgRating float64
	var friendsFav *FriendsFav
	// restaurant is stored in doc
	err := s.restaurants.FindOne(ctx, bson.M{"_id": rid}).Decode(&restaurant)
	if err == mongo.ErrNoDocuments {
		// No matching restaurant found
		return nil, mongo.ErrNoDocuments
	} else if err != nil {
		// Different error occurred
		return nil, err
	}
	for _, menuItemId := range restaurant.MenuItems {
		// why are the inputs for this method strings when all id's are represented as ObjectID's ???
		fmt.Println(menuItemId)
		friendReviews, err := s.userConnectionsService.GetFriendReviewsForItem(uid.Hex(), menuItemId.Hex())
		fmt.Println(err)
		fmt.Println("friend reviews for menuItem", len(friendReviews))
		for _, friendReview := range friendReviews {
			// storing the friends of the user that reviewed menuItems at the restaurant
			fmt.Println(friendReview.Reviewer)
			friend := friendReview.Reviewer.ID
			fmt.Println("friend id:", friend)
			if doesNotContain(friends, friend) {
				friends = append(friends, friend)
			}
			totalRating += friendReview.Rating.Overall
			numOfRatings += 1
		}
	}
	avgRating = float64(totalRating) / float64(numOfRatings)
	// the restaurant is a friends fav
	if avgRating >= 4 {
		friendsFav = &FriendsFav{
			IsFriendsFav:    true,
			FriendsReviewed: len(friends),
		}
	} else {
		friendsFav = &FriendsFav{
			IsFriendsFav:    false,
			FriendsReviewed: len(friends),
		}
	}

	return friendsFav, nil
}

// checks if an element is not in a slice
func doesNotContain(slice []string, item string) bool {
	for _, element := range slice {
		if element == item {
			return false
		}
	}
	return true
}

// super stars: go through all of the reviews for all the menu items at a restaurant and count how many are 5 star reviews
func (s *Service) GetSuperStars(rid primitive.ObjectID) (int, error) {
	ctx := context.Background()

	var restaurant RestaurantDocument
	var superStars int

	// restaurant is stored in doc
	err := s.restaurants.FindOne(ctx, bson.M{"_id": rid}).Decode(&restaurant)
	if err == mongo.ErrNoDocuments {
		// No matching restaurant found
		return 0, mongo.ErrNoDocuments
	} else if err != nil {
		// Different error occurred
		return 0, err
	}
	for _, menuItemId := range restaurant.MenuItems {
		menuItem, _ := s.menuItemsService.GetMenuItemById(menuItemId)
		reviews := menuItem.Reviews
		for _, reviewId := range reviews {
			reviewIdObj, _ := primitive.ObjectIDFromHex(reviewId)
			review, _ := s.reviewService.GetReviewByID(reviewIdObj)
			rating := review.Rating.Overall
			if rating == 5 {
				superStars += 1
			}
		}
	}

	return superStars, nil
}
