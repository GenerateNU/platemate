package auth

import (
	"github.com/GenerateNU/platemate/internal/config"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type Service struct {
	users  *mongo.Collection
	config config.Config
}

func newService(collections map[string]*mongo.Collection, config config.Config) *Service {
	return &Service{collections["users"], config}
}

type Handler struct {
	service *Service
	config  config.Config
}
type TokenResponse struct {
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
	User         string `json:"user"`
}

type User struct {
	ID                primitive.ObjectID   `bson:"_id"`
	Name              string               `bson:"name"`
	Email             string               `bson:"email"`
	Password          string               `bson:"password"`
	Username          string               `bson:"username"`
	FollowingCount    int                  `bson:"followingCount"`
	FollowersCount    int                  `bson:"followerCount"`
	ProfilePictureURL string               `bson:"profile_picture"`
	Reviews           []primitive.ObjectID `bson:"reviews"`
	Count             int                  `bson:"count"`
	RefreshToken      string               `bson:"refresh_token"`
	TokenUsed         bool                 `bson:"token_used"`
	Preferences       []string             `bson:"preferences"`
	Restrictions      []string             `bson:"restrictions"`
	Following         []primitive.ObjectID `bson:"following"`
	Followers         []primitive.ObjectID `bson:"followers"`
	TasteProfile      []float64            `bson:"taste_profile"`
}

type LoginRequest struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required,min=8"`
}

type RegisterRequest struct {
	Name           string    `json:"name" validate:"required"`
	Email          string    `json:"email" validate:"required,email"`
	Password       string    `json:"password" validate:"required,min=8"`
	Username       string    `json:"username" validate:"required"`
	FollowingCount int       `json:"followingCount"`
	FollowersCount int       `json:"followerCount"`
	ProfilePicture string    `json:"profile_picture"`
	Count          int       `json:"count"`
	RefreshToken   string    `json:"refresh_token"`
	TokenUsed      bool      `json:"token_used"`
	Preferences    []string  `json:"preferences"`
	Restrictions   []string  `json:"restrictions"`
	Following      []string  `json:"following"`
	Followers      []string  `json:"followers"`
	TasteProfile   []float64 `json:"taste_profile"`
}

type RefreshRequestBody struct {
	RefreshToken string `json:"refresh_token" validate:"required"`
}
