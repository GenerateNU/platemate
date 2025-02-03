package auth

import (
	"github.com/GenerateNU/platemate/internal/config"
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
	Email        string  `bson:"email"`
	Password     string  `bson:"password"`
	ID           string  `bson:"_id"`
	RefreshToken string  `bson:"refresh_token"`
	TokenUsed    bool    `bson:"token_used"`
	Count        float64 `bson:"count"`
}
type LoginRequest struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required,min=8"`
}

type RegisterRequest struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required,min=8"`
}
