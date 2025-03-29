package users

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type User struct {
	ID             primitive.ObjectID   `bson:"_id,omitempty"`
	Email          string               `bson:"email"`
	Username       string               `bson:"username"`
	Reviews        []primitive.ObjectID `bson:"reviews"`
	Following      []primitive.ObjectID `bson:"following,omitempty"`
	Followers      []primitive.ObjectID `bson:"followers,omitempty"`
	FollowingCount int                  `bson:"followingCount"`
	FollowersCount int                  `bson:"followersCount"`
	ProfilePicture string               `bson:"profile_picture,omitempty"`
	Name           string               `bson:"name,omitempty"`
	Preferences    []string             `bson:"preferences,omitempty"`
}

type UserResponse struct {
	ID             string   `json:"id"`
	Username       string   `json:"username"`
	Email          string   `json:"email"`
	ProfilePicture string   `json:"profile_picture,omitempty"`
	FollowersCount int      `json:"followersCount"`
	FollowingCount int      `json:"followingCount"`
	Reviews        []string `json:"reviews,omitempty"`
	Name           string   `json:"name,omitempty"`
	Preferences    []string `json:"preferences,omitempty"`
}

type FollowRequest struct {
	FollowerId string `json:"followerId"`
	FolloweeId string `json:"followeeId"`
}

type GetUserByIdParam struct {
	UserID string `params:"id" validate:"required"`
}

type PaginationQuery struct {
	Page  int `query:"page" validate:"min=1" default:"1"`
	Limit int `query:"limit" validate:"min=1,max=100" default:"20"`
}

type GetFollowersQuery struct {
	PaginationQuery
	UserId string `query:"userId" validate:"required"`
}

type GetFollowingQuery struct {
	PaginationQuery
	UserId string `query:"userId" validate:"required"`
}

type ReviewQuery struct {
	UserId string `query:"userId" validate:"required"`
	ItemId string `params:"id" validate:"required"`
}

type PostDietaryPreferencesQuery struct {
	Preference string `json:"preference"`
}
