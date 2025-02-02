package auth

import (
	"go.mongodb.org/mongo-driver/mongo"
)

type Service struct {
	users *mongo.Collection
}

func newService(collections map[string]*mongo.Collection) *Service {
	return &Service{collections["users"]}
}

type Handler struct {
	service *Service
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
	Email    string `json:"email"`
	Password string `json:"password"`
}

type RegisterRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}
