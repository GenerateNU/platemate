package users

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type User struct {
	ID             primitive.ObjectID   `bson:"_id,omitempty"`
	Username       string               `bson:"username"`
	Reviews        []primitive.ObjectID `bson:"reviews"`
	Following      []primitive.ObjectID `bson:"following,omitempty"`
	Followers      []primitive.ObjectID `bson:"followers,omitempty"`
	FollowingCount int                  `bson:"followingCount"`
	FollowersCount int                  `bson:"followersCount"`
	ProfilePicture string               `bson:"profile_picture,omitempty"`
	FirstName      string               `bson:"firstName,omitempty"`
	Surname        string               `bson:"surname,omitempty"`
}

type UserResponse struct {
	ID             string   `json:"id"`
	Username       string   `json:"username"`
	ProfilePicture string   `json:"profile_picture,omitempty"`
	FollowersCount int      `json:"followersCount"`
	FollowingCount int      `json:"followingCount"`
	Reviews        []string `json:"reviews,omitempty"`
	FirstName      string   `json:"first_name,omitempty"`
	Surname        string   `json:"surname,omitempty"`
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
