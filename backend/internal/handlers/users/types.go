package users

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type User struct {
	ID             primitive.ObjectID   `bson:"_id,omitempty"`
	Email          string               `bson:"email"`
	Username       string               `bson:"username"`
	Name           string               `bson:"name,omitempty"`
	Password       string               `bson:"password"`
	Reviews        []primitive.ObjectID `bson:"reviews"`
	Count          int                  `bson:"count"`
	Following      []primitive.ObjectID `bson:"following,omitempty"`
	Followers      []primitive.ObjectID `bson:"followers,omitempty"`
	FollowingCount int                  `bson:"followingCount"`
	FollowersCount int                  `bson:"followerCount"`
	ProfilePicture string               `bson:"profile_picture,omitempty"`
	RefreshToken   string               `bson:"refresh_token"`
	TokenUsed      bool                 `bson:"token_used"`
	Preferences    []string             `bson:"preferences,omitempty"`
	Restrictions   []string             `bson:"restrictions,omitempty"`
	TasteProfile   []float64            `bson:"taste_profile,omitempty"`
}

type UserResponse struct {
	ID             string    `json:"id"`
	Username       string    `json:"username"`
	Email          string    `json:"email"`
	Name           string    `json:"name,omitempty"`
	ProfilePicture string    `json:"profile_picture,omitempty"`
	FollowersCount int       `json:"followerCount"`
	FollowingCount int       `json:"followingCount"`
	Reviews        []string  `json:"reviews,omitempty"`
	Count          int       `json:"count"`
	Preferences    []string  `json:"preferences,omitempty"`
	Restrictions   []string  `json:"restrictions,omitempty"`
	TasteProfile   []float64 `json:"taste_profile,omitempty"`
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

type ReviewQuery struct {
	UserId string `query:"userId" validate:"required"`
	ItemId string `params:"id" validate:"required"`
}
