package auth

import (
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"go.mongodb.org/mongo-driver/mongo"
)

/*
Health Service to be used by Health Handler to interact with the
Database layer of the application
*/
type Service struct {
	users *mongo.Collection
}

func newService(collections map[string]*mongo.Collection) *Service {
	return &Service{collections["users"]}
}

func (s *Service) GenerateAccessToken(id string) (string, error){
	t :=	jwt.NewWithClaims(jwt.SigningMethodHS256, 
	jwt.MapClaims{
		"iss": "dev-server",
		"sub": "", // some username
		"user_id": id, // some user id
		"role": "user",
		"iat": time.Now().Unix(),
		"exp": time.Now().Add(time.Hour * 1).Unix(),  // valid for one hour
	})
	return t.SignedString([]byte(os.Getenv("AUTH_SECRET"))) // TODO: change to use config
}

func (s *Service) GenerateRefreshToken(id string) (string, error){
	const toMonth = 24 * 7 * 30
	t :=	jwt.NewWithClaims(jwt.SigningMethodHS256, 
	jwt.MapClaims{
		"iss": "dev-server",
		"sub": "", // some username
		"user_id": id, // some user id
		"role": "user",
		"iat": time.Now().Unix(),
		"exp": time.Now().Add(time.Hour * toMonth).Unix(),  // valid for one month
	})
	return t.SignedString([]byte(os.Getenv("AUTH_SECRET"))) // TODO: change to use config
}