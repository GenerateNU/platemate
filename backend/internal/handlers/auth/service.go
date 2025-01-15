package auth

import (
	"context"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

/*
Health Service to be used by Health Handler to interact with the
Database layer of the application
*/

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

func (s *Service) GenerateTokens(id string) (string, string, error) {
	access, nil := s.GenerateAccessToken(id)
	refresh, nil := s.GenerateRefreshToken(id)
	return access, refresh, nil
}

/*
		Check if a user exists in the database by email
*/
func (s *Service) UserExists(email string) (bool,error) {
	if err := s.users.FindOne(context.Background(), bson.M{"email": email}).Err() ; err != nil {
		if err == mongo.ErrNoDocuments {
			return false, nil // user doesn't exist and there is no error
		} 
		return false, err // there is an error
	}
	return true, nil // user exists and no error
}