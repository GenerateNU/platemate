package users

import (
	"context"
	"errors"
	"fmt"

	"github.com/GenerateNU/platemate/internal/handlers/menu_items"
	"github.com/GenerateNU/platemate/internal/handlers/review"
	"github.com/GenerateNU/platemate/internal/xerr"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var (
	ErrAlreadyFollowing = errors.New("already following this user")
	ErrNotFollowing     = errors.New("not following this user")
)

type Service struct {
	users     *mongo.Collection
	reviews   *mongo.Collection
	menuItems *mongo.Collection
}

func NewService(collections map[string]*mongo.Collection) *Service {
	return &Service{
		users:     collections["users"],
		reviews:   collections["reviews"],
		menuItems: collections["menuItems"],
	}
}

func (s *Service) GetUserById(userId string) (UserResponse, error) {
	ctx := context.Background()
	userObjID, err := primitive.ObjectIDFromHex(userId)
	if err != nil {
		badReq := xerr.BadRequest(err)
		return UserResponse{}, &badReq
	}

	var user User
	err = s.users.FindOne(ctx, bson.M{"_id": userObjID}).Decode(&user)
	if err != nil {
		return UserResponse{}, err
	}

	reviews := make([]string, len(user.Reviews))
	for i, reviewID := range user.Reviews {
		reviews[i] = reviewID.Hex()
	}

	return UserResponse{
		ID:             user.ID.Hex(),
		Email:          user.Email,
		Username:       user.Username,
		ProfilePicture: user.ProfilePicture,
		FollowersCount: user.FollowersCount,
		FollowingCount: user.FollowingCount,
		Reviews:        reviews,
		Name:           user.Name,
	}, nil
}

func (s *Service) GetUsers() ([]User, error) {
	ctx := context.Background()

	cursor, err := s.users.Find(ctx, bson.M{})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var results []User
	if err := cursor.All(ctx, &results); err != nil {
		return nil, err
	}

	return results, nil
}

// GetUserFollowers retrieves a paginated list of users who follow the specified user
func (s *Service) GetUserFollowers(userId string, page, limit int) ([]UserResponse, error) {
	ctx := context.Background()
	userObjID, err := primitive.ObjectIDFromHex(userId)
	if err != nil {
		badReq := xerr.BadRequest(err)
		return nil, &badReq
	}

	// Find the user and get their followers
	var user User
	err = s.users.FindOne(ctx, bson.M{"_id": userObjID}).Decode(&user)
	if err != nil {
		return nil, err
	}

	// Calculate total pages and adjust page number if out of bounds
	totalFollowers := len(user.Followers)
	totalPages := (totalFollowers + limit - 1) / limit // Ceiling division

	if totalPages == 0 {
		return []UserResponse{}, nil
	}

	// Adjust page to be within bounds
	if page > totalPages {
		page = totalPages
	}
	if page < 1 {
		page = 1
	}

	// Calculate pagination bounds
	skip := (page - 1) * limit
	end := skip + limit
	if end > totalFollowers {
		end = totalFollowers
	}

	// Get the slice of follower IDs for this page
	pageFollowers := user.Followers[skip:end]

	// Fetch the actual user documents for these followers
	cursor, err := s.users.Find(ctx, bson.M{
		"_id": bson.M{"$in": pageFollowers},
	})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var followers []User
	if err = cursor.All(ctx, &followers); err != nil {
		return nil, err
	}

	// Convert to response format
	response := make([]UserResponse, len(followers))
	for i, follower := range followers {
		reviews := make([]string, len(follower.Reviews))
		for j, reviewID := range follower.Reviews {
			reviews[j] = reviewID.Hex()
		}

		response[i] = UserResponse{
			ID:             follower.ID.Hex(),
			Username:       follower.Username,
			ProfilePicture: follower.ProfilePicture,
			FollowersCount: follower.FollowersCount,
			FollowingCount: follower.FollowingCount,
			Reviews:        reviews,
			Preferences:    follower.Preferences,
		}
	}

	return response, nil
}

func (s *Service) GetUserFollowing(userId string, page, limit int) ([]UserResponse, error) {
	ctx := context.Background()
	fmt.Println((userId))
	userObjID, err := primitive.ObjectIDFromHex(userId)
	if err != nil {
		badReq := xerr.BadRequest(err)
		return nil, &badReq
	}

	// Find the user and get their followers
	var user User
	err = s.users.FindOne(ctx, bson.M{"_id": userObjID}).Decode(&user)
	if err != nil {
		return nil, err
	}

	// Calculate total pages and adjust page number if out of bounds
	totalFollowing := len(user.Following)
	totalPages := (totalFollowing + limit - 1) / limit // Ceiling division

	if totalPages == 0 {
		return []UserResponse{}, nil
	}

	// Adjust page to be within bounds
	if page > totalPages {
		page = totalPages
	}
	if page < 1 {
		page = 1
	}

	// Calculate pagination bounds
	skip := (page - 1) * limit
	end := skip + limit
	if end > totalFollowing {
		end = totalFollowing
	}

	// Get the slice of follower IDs for this page, could be an issue if the value is 0
	pageFollowers := user.Following[skip:end]

	// Fetch the actual user documents for these followers
	cursor, err := s.users.Find(ctx, bson.M{
		"_id": bson.M{"$in": pageFollowers},
	})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var following []User
	if err = cursor.All(ctx, &following); err != nil {
		return nil, err
	}

	// Convert to response format
	response := make([]UserResponse, len(following))
	for i, followingUser := range following {
		reviews := make([]string, len(followingUser.Reviews))
		for j, reviewID := range followingUser.Reviews {
			reviews[j] = reviewID.Hex()
		}

		response[i] = UserResponse{
			ID:             followingUser.ID.Hex(),
			Name:           followingUser.Name,
			Username:       followingUser.Username,
			ProfilePicture: followingUser.ProfilePicture,
			FollowersCount: followingUser.FollowersCount,
			FollowingCount: followingUser.FollowingCount,
			Reviews:        reviews,
			Preferences:    followingUser.Preferences,
		}
	}

	return response, nil
}

// CreateConnection creates a new follow relationship between users
func (s *Service) CreateConnection(followerId, followeeId string) error {
	ctx := context.Background()
	followerObjID, err := primitive.ObjectIDFromHex(followerId)
	if err != nil {
		badReq := xerr.BadRequest(err)
		return &badReq
	}

	followeeObjID, err := primitive.ObjectIDFromHex(followeeId)
	if err != nil {
		badReq := xerr.BadRequest(err)
		return &badReq
	}

	// Start a session for the transaction
	session, err := s.users.Database().Client().StartSession()
	if err != nil {
		return err
	}
	defer session.EndSession(ctx)

	// Perform operations in a transaction
	_, err = session.WithTransaction(ctx, func(sessCtx mongo.SessionContext) (interface{}, error) {
		// Check if already following
		var follower User
		err := s.users.FindOne(sessCtx, bson.M{
			"_id":       followerObjID,
			"following": followeeObjID,
		}).Decode(&follower)
		if err == nil {
			return nil, ErrAlreadyFollowing
		}
		if err != mongo.ErrNoDocuments {
			return nil, err
		}

		// Initialize arrays and counts if they don't exist
		_, err = s.users.UpdateMany(sessCtx,
			bson.M{
				"_id": bson.M{
					"$in": []primitive.ObjectID{followerObjID, followeeObjID},
				},
				"$or": []bson.M{
					{"following": bson.M{"$exists": false}},
					{"followers": bson.M{"$exists": false}},
					{"followingCount": bson.M{"$exists": false}},
					{"followersCount": bson.M{"$exists": false}},
				},
			},
			bson.M{
				"$set": bson.M{
					"following":      []primitive.ObjectID{},
					"followers":      []primitive.ObjectID{},
					"followingCount": 0,
					"followersCount": 0,
				},
			},
		)
		if err != nil {
			return nil, err
		}

		// Now update the following/followers relationships
		_, err = s.users.UpdateOne(sessCtx,
			bson.M{"_id": followerObjID},
			bson.M{
				"$addToSet": bson.M{"following": followeeObjID},
				"$inc":      bson.M{"followingCount": 1},
			},
		)
		if err != nil {
			return nil, err
		}

		// Update followee's document
		_, err = s.users.UpdateOne(sessCtx,
			bson.M{"_id": followeeObjID},
			bson.M{
				"$addToSet": bson.M{"followers": followerObjID},
				"$inc":      bson.M{"followersCount": 1},
			},
		)
		if err != nil {
			return nil, err
		}

		return nil, nil
	})

	return err
}

// DeleteConnection removes a follow relationship between users
func (s *Service) DeleteConnection(followerId, followeeId string) error {
	ctx := context.Background()
	followerObjID, err := primitive.ObjectIDFromHex(followerId)
	if err != nil {
		badReq := xerr.BadRequest(err)
		return &badReq
	}

	followeeObjID, err := primitive.ObjectIDFromHex(followeeId)
	if err != nil {
		badReq := xerr.BadRequest(err)
		return &badReq
	}

	// Start a session for the transaction
	session, err := s.users.Database().Client().StartSession()
	if err != nil {
		return err
	}
	defer session.EndSession(ctx)

	// Perform operations in a transaction
	_, err = session.WithTransaction(ctx, func(sessCtx mongo.SessionContext) (interface{}, error) {
		// Check if following
		var follower User
		err := s.users.FindOne(sessCtx, bson.M{
			"_id":       followerObjID,
			"following": followeeObjID,
		}).Decode(&follower)
		if err == mongo.ErrNoDocuments {
			return nil, ErrNotFollowing
		}
		if err != nil {
			return nil, err
		}

		// Update follower's document
		_, err = s.users.UpdateOne(sessCtx,
			bson.M{"_id": followerObjID},
			bson.M{
				"$pull": bson.M{"following": followeeObjID},
				"$inc":  bson.M{"followingCount": -1},
			},
		)
		if err != nil {
			return nil, err
		}

		// Update followee's document
		_, err = s.users.UpdateOne(sessCtx,
			bson.M{"_id": followeeObjID},
			bson.M{
				"$pull": bson.M{"followers": followerObjID},
				"$inc":  bson.M{"followersCount": -1},
			},
		)
		if err != nil {
			return nil, err
		}

		return nil, nil
	})

	return err
}

// GetFollowingReviewsForItem gets reviews for a specific menu item from users that the current user follows
func (s *Service) GetFollowingReviewsForItem(userId string, menuItemId string) ([]review.ReviewDocument, error) {
	ctx := context.Background()
	userObjID, err := primitive.ObjectIDFromHex(userId)
	if err != nil {
		badReq := xerr.BadRequest(err)
		return nil, &badReq
	}

	menuItemObjID, err := primitive.ObjectIDFromHex(menuItemId)
	if err != nil {
		badReq := xerr.BadRequest(err)
		return nil, &badReq
	}

	// Get the menu item to check its reviews
	var menuItem menu_items.MenuItemDocument
	err = s.menuItems.FindOne(ctx, bson.M{"_id": menuItemObjID}).Decode(&menuItem)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return []review.ReviewDocument{}, nil
		}
		return nil, err
	}

	// Get the user's following list
	var user User
	err = s.users.FindOne(ctx, bson.M{"_id": userObjID}).Decode(&user)
	if err != nil {
		return nil, err
	}

	if len(user.Following) == 0 {
		return []review.ReviewDocument{}, nil
	}

	// Query reviews that match both menu item reviews and followed users
	reviewsCursor, err := s.reviews.Find(ctx,
		bson.M{
			"_id":          bson.M{"$in": menuItem.Reviews},
			"reviewer._id": bson.M{"$in": user.Following},
		},
		options.Find().SetSort(bson.D{{Key: "timestamp", Value: -1}}),
	)
	if err != nil {
		return nil, err
	}
	defer reviewsCursor.Close(ctx)

	var reviews []review.ReviewDocument
	if err = reviewsCursor.All(ctx, &reviews); err != nil {
		return nil, err
	}

	return reviews, nil
}

func (s *Service) GetFriendReviews(userObjID primitive.ObjectID, page, limit int) ([]review.ReviewDocument, error) {
	ctx := context.Background()

	// Get the user's following list
	var user User
	err := s.users.FindOne(ctx, bson.M{"_id": userObjID}).Decode(&user)
	if err != nil {
		return nil, err
	}

	if len(user.Following) == 0 {
		return []review.ReviewDocument{}, nil
	}

	// Query reviews that are from user's following
	reviewsCursor, err := s.reviews.Find(ctx,
		bson.M{
			"reviewer._id": bson.M{"$in": user.Following}, // TODO: TBD ABOUT CHANGE FROM _ID TO ID
		},
		options.Find().SetSort(bson.D{{Key: "timestamp", Value: -1}}).SetSkip(int64((page-1)*limit)).SetLimit(int64(limit)),
	)
	if err != nil {
		return nil, err
	}
	defer reviewsCursor.Close(ctx)

	var reviews []review.ReviewDocument
	if err = reviewsCursor.All(ctx, &reviews); err != nil {
		return nil, err
	}

	return reviews, nil
}

// GetFriendReviewsForItem gets reviews for a specific menu item from friends (users that follow each other)
// AKA users in the current user's following and follower list
func (s *Service) GetFriendReviewsForItem(userObjID primitive.ObjectID, menuItemObjID primitive.ObjectID) ([]review.ReviewDocument, error) {

	ctx := context.Background()

	// Get the menu item to check its reviews
	var menuItem menu_items.MenuItemDocument
	err := s.menuItems.FindOne(ctx, bson.M{"_id": menuItemObjID}).Decode(&menuItem)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return []review.ReviewDocument{}, nil
		}
		return nil, err
	}

	// Get the user's following list
	var user User
	err = s.users.FindOne(ctx, bson.M{"_id": userObjID}).Decode(&user)
	if err != nil {
		return nil, err
	}

	if len(user.Following) == 0 || len(user.Followers) == 0 { // No friends :(
		return []review.ReviewDocument{}, nil
	}

	// Query reviews that match both menu item reviews and friends (follower and following)
	reviewsCursor, err := s.reviews.Find(ctx,
		bson.M{
			"$and": []bson.M{
				{
					"_id": bson.M{"$in": menuItem.Reviews}, // Match reviews related to the menu item
				},
				{
					"reviewer._id": bson.M{"$in": user.Following}, // Reviewer's ID must be in the Following list
				},
				{
					"reviewer._id": bson.M{"$in": user.Followers}, // Reviewer's ID must be in the Followers list
				},
			},
		},
		options.Find().SetSort(bson.D{{Key: "timestamp", Value: -1}}),
	)
	if err != nil {
		return nil, err
	}
	defer reviewsCursor.Close(ctx)
	var reviews []review.ReviewDocument
	if err = reviewsCursor.All(ctx, &reviews); err != nil {
		return nil, err
	}
	return reviews, nil

}

func (s *Service) GetDietaryPreferences(userId string) ([]string, error) {
	ctx := context.Background()
	userObjID, err := primitive.ObjectIDFromHex(userId)
	if err != nil {
		badReq := xerr.BadRequest(err)
		return nil, &badReq
	}

	// Find the user and get their followers
	var user User
	err = s.users.FindOne(ctx, bson.M{"_id": userObjID}).Decode(&user)
	if err != nil {
		return nil, err
	}

	dietaryRestrictions := user.Preferences

	return dietaryRestrictions, nil
}

func (s *Service) PostDietaryPreferences(userId string, preference string) error {
	ctx := context.Background()
	userObjID, err := primitive.ObjectIDFromHex(userId)
	if err != nil {
		badReq := xerr.BadRequest(err)
		return &badReq
	}

	update := bson.M{
		"$push": bson.M{"preferences": preference},
	}

	// Update the user's dietary preferences in the database
	_, err = s.users.UpdateOne(ctx, bson.M{"_id": userObjID}, update)
	if err != nil {
		return err
	}

	return nil
}

func (s *Service) DeleteDietaryPreferences(userId string, preference string) error {
	ctx := context.Background()
	userObjID, err := primitive.ObjectIDFromHex(userId)
	if err != nil {
		badReq := xerr.BadRequest(err)
		return &badReq
	}

	delete := bson.M{
		"$pull": bson.M{"preferences": preference},
	}

	// Update the user's dietary preferences in the database
	_, err = s.users.UpdateOne(ctx, bson.M{"_id": userObjID}, delete)
	if err != nil {
		return err
	}

	return nil
}
