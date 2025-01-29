package user_connections

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
}

type UserResponse struct {
	ID             string   `json:"id"`
	Username       string   `json:"username"`
	ProfilePicture string   `json:"profile_picture,omitempty"`
	FollowersCount int      `json:"followersCount"`
	FollowingCount int      `json:"followingCount"`
	Reviews        []string `json:"reviews,omitempty"`
}
