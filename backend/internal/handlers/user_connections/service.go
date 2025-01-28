package user_connections

import (
	"context"
	"errors"
	"time"

	"github.com/GenerateNU/platemate/internal/handlers/review"
	"github.com/GenerateNU/platemate/internal/xerr"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var (
	ErrAlreadyFollowing = errors.New("already following this user")
)

type Service struct {
	connections *mongo.Collection
	users       *mongo.Collection
	reviews     *mongo.Collection
}

type User struct {
	ID             primitive.ObjectID   `bson:"_id,omitempty"`
	Username       string               `bson:"username"`
	Reviews        []primitive.ObjectID `bson:"reviews"`
	FollowingCount int                  `bson:"followingCount"`
	FollowersCount int                  `bson:"followersCount"`
	ProfilePicture string               `bson:"profile_picture"`
}

type Connection struct {
	ID         primitive.ObjectID `bson:"_id,omitempty"`
	FollowerId primitive.ObjectID `bson:"followerId"`
	FolloweeId primitive.ObjectID `bson:"followeeId"`
	CreatedAt  time.Time          `bson:"createdAt"`
	UpdatedAt  time.Time          `bson:"updatedAt"`
}

type UserResponse struct {
	ID             string   `json:"id"`
	Username       string   `json:"username"`
	ProfilePicture string   `json:"profile_picture"`
	FollowersCount int      `json:"followersCount"`
	FollowingCount int      `json:"followingCount"`
	Reviews        []string `json:"reviews,omitempty"`
}

func newService(collections map[string]*mongo.Collection) *Service {
	return &Service{
		connections: collections["connections"],
		users:       collections["users"],
		reviews:     collections["reviews"],
	}
}

// GetUserFollowers retrieves a paginated list of users who follow the specified user
func (s *Service) GetUserFollowers(userId string, page, limit int) ([]UserResponse, error) {
	ctx := context.Background()
	userObjID, err := primitive.ObjectIDFromHex(userId)
	if err != nil {
		badReq := xerr.BadRequest(err)
		return nil, &badReq
	}

	// Check if user exists
	var user User
	err = s.users.FindOne(ctx, bson.M{"_id": userObjID}).Decode(&user)
	if err != nil {
		return nil, err
	}

	skip := (page - 1) * limit
	opts := options.Find().
		SetLimit(int64(limit)).
		SetSkip(int64(skip)).
		SetSort(bson.D{{Key: "createdAt", Value: -1}})

	cursor, err := s.connections.Find(ctx,
		bson.M{"followeeId": userObjID},
		opts,
	)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var connections []Connection
	if err = cursor.All(ctx, &connections); err != nil {
		return nil, err
	}

	followerIds := make([]primitive.ObjectID, len(connections))
	for i, conn := range connections {
		followerIds[i] = conn.FollowerId
	}

	if len(followerIds) == 0 {
		return []UserResponse{}, nil
	}

	usersCursor, err := s.users.Find(ctx,
		bson.M{"_id": bson.M{"$in": followerIds}},
	)
	if err != nil {
		return nil, err
	}
	defer usersCursor.Close(ctx)

	var users []User
	if err = usersCursor.All(ctx, &users); err != nil {
		return nil, err
	}

	response := make([]UserResponse, len(users))
	for i, user := range users {
		reviews := make([]string, len(user.Reviews))
		for j, reviewID := range user.Reviews {
			reviews[j] = reviewID.Hex()
		}

		response[i] = UserResponse{
			ID:             user.ID.Hex(),
			Username:       user.Username,
			ProfilePicture: user.ProfilePicture,
			FollowersCount: user.FollowersCount,
			FollowingCount: user.FollowingCount,
			Reviews:        reviews,
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

	// Check if users exist
	var user User
	err = s.users.FindOne(ctx, bson.M{"_id": followeeObjID}).Decode(&user)
	if err != nil {
		return err
	}

	err = s.users.FindOne(ctx, bson.M{"_id": followerObjID}).Decode(&user)
	if err != nil {
		return err
	}

	// Check if already following
	count, err := s.connections.CountDocuments(ctx,
		bson.M{
			"followerId": followerObjID,
			"followeeId": followeeObjID,
		},
	)
	if err != nil {
		return err
	}
	if count > 0 {
		return ErrAlreadyFollowing
	}

	// Start a session for the transaction
	session, err := s.connections.Database().Client().StartSession()
	if err != nil {
		return err
	}
	defer session.EndSession(ctx)

	// Perform operations in a transaction
	_, err = session.WithTransaction(ctx, func(sessCtx mongo.SessionContext) (interface{}, error) {
		// Create new connection
		now := time.Now()
		connection := Connection{
			FollowerId: followerObjID,
			FolloweeId: followeeObjID,
			CreatedAt:  now,
			UpdatedAt:  now,
		}

		if _, err := s.connections.InsertOne(sessCtx, connection); err != nil {
			return nil, err
		}

		// Update follower's following count
		if _, err := s.users.UpdateOne(sessCtx,
			bson.M{"_id": followerObjID},
			bson.M{"$inc": bson.M{"followingCount": 1}},
		); err != nil {
			return nil, err
		}

		// Update followee's followers count
		if _, err := s.users.UpdateOne(sessCtx,
			bson.M{"_id": followeeObjID},
			bson.M{"$inc": bson.M{"followersCount": 1}},
		); err != nil {
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
	session, err := s.connections.Database().Client().StartSession()
	if err != nil {
		return err
	}
	defer session.EndSession(ctx)

	// Perform operations in a transaction
	_, err = session.WithTransaction(ctx, func(sessCtx mongo.SessionContext) (interface{}, error) {
		// Delete the connection
		result, err := s.connections.DeleteOne(sessCtx,
			bson.M{
				"followerId": followerObjID,
				"followeeId": followeeObjID,
			},
		)
		if err != nil {
			return nil, err
		}
		if result.DeletedCount == 0 {
			return nil, mongo.ErrNoDocuments
		}

		// Update follower's following count
		if _, err := s.users.UpdateOne(sessCtx,
			bson.M{"_id": followerObjID},
			bson.M{"$inc": bson.M{"followingCount": -1}},
		); err != nil {
			return nil, err
		}

		// Update followee's followers count
		if _, err := s.users.UpdateOne(sessCtx,
			bson.M{"_id": followeeObjID},
			bson.M{"$inc": bson.M{"followersCount": -1}},
		); err != nil {
			return nil, err
		}

		return nil, nil
	})

	return err
}

// GetFollowingReviewsForItem gets reviews for a specific menu item from users that the current user follows
func (s *Service) GetFollowingReviewsForItem(userId string, itemId string) ([]review.ReviewDocument, error) {
	ctx := context.Background()
	userObjID, err := primitive.ObjectIDFromHex(userId)
	if err != nil {
		badReq := xerr.BadRequest(err)
		return nil, &badReq
	}

	itemObjID, err := primitive.ObjectIDFromHex(itemId)
	if err != nil {
		badReq := xerr.BadRequest(err)
		return nil, &badReq
	}

	// Check if user exists
	var user User
	err = s.users.FindOne(ctx, bson.M{"_id": userObjID}).Decode(&user)
	if err != nil {
		return nil, err
	}

	// Get the user's following list
	cursor, err := s.connections.Find(ctx, bson.M{"followerId": userObjID})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var connections []Connection
	if err = cursor.All(ctx, &connections); err != nil {
		return nil, err
	}

	if len(connections) == 0 {
		return []review.ReviewDocument{}, nil
	}

	// Extract followee IDs
	followeeIds := make([]string, len(connections))
	for i, conn := range connections {
		followeeIds[i] = conn.FolloweeId.Hex()
	}

	// Get reviews for the specific item from followed users
	reviewsCursor, err := s.reviews.Find(ctx,
		bson.M{
			"reviewer.id": bson.M{"$in": followeeIds},
			"menuItem":    itemObjID,
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

	// Convert to response format
	response := make([]review.ReviewDocument, len(reviews))
	copy(response, reviews)

	return response, nil
}
