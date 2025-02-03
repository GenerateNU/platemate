package auth

import (
	"context"
	"time"

	"errors"
	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

/*
Health Service to be used by Health Handler to interact with the
Database layer of the application
*/

func (s *Service) GenerateToken(id string, exp int64, count float64) (string, error) {
	t := jwt.NewWithClaims(jwt.SigningMethodHS256,
		jwt.MapClaims{
			"iss":     "dev-server",
			"sub":     "",
			"user_id": id,
			"role":    "user",
			"iat":     time.Now().Unix(),
			"exp":     exp,
			"count":   count,
		})
	// configure to use config in /internal/config/config.go
	return t.SignedString([]byte(s.config.Auth.Secret))
}

func (s *Service) GenerateAccessToken(id string, count float64) (string, error) {
	return s.GenerateToken(id, time.Now().Add(time.Hour*1).Unix(), count)
}

func (s *Service) GetUserCount(id string) (float64, error) {
	var user User
	err := s.users.FindOne(context.Background(), bson.M{"_id": id}).Decode(&user)
	if err != nil {
		return 0, err
	}
	return user.Count, nil
}

func (s *Service) ValidateToken(token string) (string, float64, error) {
	t, err := jwt.Parse(token, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fiber.NewError(400, "Not Authorized")
		}
		return []byte(s.config.Auth.Secret), nil
	})

	if err != nil {
		return "", 0, err
	}
	claims, ok := t.Claims.(jwt.MapClaims)
	// count matches the count in the database
	db_count, err := s.GetUserCount(claims["user_id"].(string))
	if err != nil {
		return "", 0, err
	}
	if claims["count"].(float64) != db_count {
		return "", 0, fiber.NewError(400, "Not Authorized, Revoked Token")
	}

	if !ok || !t.Valid {
		return claims["user_id"].(string), 0, fiber.NewError(400, "Not Authorized, Invalid Token")
	}
	return claims["user_id"].(string), claims["count"].(float64), nil
}

func (s *Service) LoginFromCredentials(email string, password string) (string, float64, error) {

	var user User
	err := s.users.FindOne(context.Background(), bson.M{"email": email}).Decode(&user)
	if errors.Is(err, mongo.ErrNoDocuments) {
		return "", 0, fiber.NewError(404, "Account does not exist")
	}
	if err != nil {
		return "", 0, err
	}
	if user.Password != password {
		return "", 0, fiber.NewError(400, "Not Authorized, Invalid Credentials")
	}
	return user.ID, user.Count, nil
}

func (s *Service) InvalidateTokens(user_id string) error {
	// increase the count by one
	_, err := s.users.UpdateOne(context.Background(), bson.M{"_id": user_id}, bson.M{"$inc": bson.M{"count": 1}})
	return err
}

func (s *Service) GenerateRefreshToken(id string, count float64) (string, error) {
	const toMonth = 24 * 7 * 30
	return s.GenerateToken(id, time.Now().Add(time.Hour*toMonth).Unix(), count)
}

func (s *Service) UseToken(user_id string) error {
	_, err := s.users.UpdateOne(context.Background(), bson.M{"_id": user_id}, bson.M{"$set": bson.M{"token_used": true}})
	return err
}

func (s *Service) CheckIfTokenUsed(user_id string) (bool, error) {
	var user User
	err := s.users.FindOne(context.Background(), bson.M{"_id": user_id}).Decode(&user)
	if err != nil {
		return false, err
	}
	return user.TokenUsed, nil
}

func (s *Service) GenerateTokens(id string, count float64) (string, string, error) {
	access, err := s.GenerateAccessToken(id, count)
	if err != nil {
		return "", "", err
	}
	refresh, err := s.GenerateRefreshToken(id, count)
	if err != nil {
		return "", "", err
	}
	return access, refresh, err
}

/*
	Create a new user in the database
*/

func (s *Service) CreateUser(user User) error {
	_, err := s.users.InsertOne(context.Background(), user)
	return err
}
