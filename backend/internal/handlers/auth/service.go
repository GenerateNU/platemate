package auth

import (
	"context"
	"fmt"
	"os"
	"time"

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
	fmt.Println("Calling GenerateToken")
	t := jwt.NewWithClaims(jwt.SigningMethodHS256,
		jwt.MapClaims{
			"iss":     "dev-server",
			"sub":     "", // some username
			"user_id": id, // some user id
			"role":    "user",
			"iat":     time.Now().Unix(),
			"exp":     exp,
			"count":   count,
		})
	return t.SignedString([]byte(os.Getenv("AUTH_SECRET"))) // TODO: change to use config
}

func (s *Service) GenerateAccessToken(id string, count float64) (string, error) {
	return s.GenerateToken(id, time.Now().Add(time.Hour*1).Unix() , count)
}

func (s *Service) GetUserCount(id string) (float64, error) {
	fmt.Println("Calling GetUserCount")
	var user User
	err := s.users.FindOne(context.Background(), bson.M{"_id": id}).Decode(&user)
	if err != nil {
		return 0, err
	}
	return user.Count, nil
}

func (s *Service) ValidateToken(token string) (string, float64, error) {
	fmt.Println("Calling ValidateToken")
	t, err := jwt.Parse(token, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fiber.NewError(400, "Not Authorized")
		}
		return []byte(os.Getenv("AUTH_SECRET")), nil
	})

	if err != nil {
		return "", 0, err
	}
	claims, ok := t.Claims.(jwt.MapClaims)
	// count matches the count in the database
	db_count, err := s.GetUserCount(claims["user_id"].(string))
	if err != nil {
		fmt.Println("Error in GetUserCount " + claims["user_id"].(string))
		return "", 0, err
	}
	if claims["count"].(float64) != db_count {
		return "", 0, fiber.NewError(400, "Not Authorized, Revoked Token")
	}

	if !ok  || !t.Valid {
		return claims["user_id"].(string), 0, fiber.NewError(400, "Not Authorized, Invalid Token")
	}
	return claims["user_id"].(string), claims["count"].(float64), nil
}

func (s *Service) LoginFromCredentials(email string, password string) (string, float64, error) {
	
	var user User
	err := s.users.FindOne(context.Background(), bson.M{"email": email}).Decode(&user)
	if err != nil {
		return "", 0, err
	}
	fmt.Println(user.Password)
	fmt.Printf("%#v\n",user)
	if user.Password != password {
		fmt.Println("Invalid Credentials")
		return "", 0, fiber.NewError(400, "Not Authorized, Invalid Credentials")
	}
	return user.ID, user.Count, nil
}

func (s *Service) InvalidateTokens(user_id string) (error) {
	// increase the count by one
	_, err := s.users.UpdateOne(context.Background(), bson.M{"_id": user_id}, bson.M{"$inc": bson.M{"count": 1}})
	return err
}

func (s *Service) GenerateRefreshToken(id string, count float64) (string, error) {
	fmt.Println("Calling GenerateRefreshToken")
	const toMonth = 24 * 7 * 30
	return s.GenerateToken(id, time.Now().Add(time.Hour*toMonth).Unix(), count)
}

func (s *Service) UseToken(user_id string) (error) {
	fmt.Println("Calling UseToken")
	_, err := s.users.UpdateOne(context.Background(), bson.M{"_id": user_id}, bson.M{"$set": bson.M{"token_used": true}})
	return err
}

func (s *Service) CheckIfTokenUsed(user_id string) (bool, error) {
	fmt.Println("Calling CheckIfTokenUsed")
	var user User
	err := s.users.FindOne(context.Background(), bson.M{"_id": user_id}).Decode(&user)
	if err != nil {
		return false, err
	}
	return user.TokenUsed, nil
}

func (s *Service) GenerateTokens(id string, count float64) (string, string, error) {
	fmt.Println("Calling GenerateTokens")
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
Check if a user exists in the database by email
*/
func (s *Service) UserExists(email string) (bool, error) {
	if err := s.users.FindOne(context.Background(), bson.M{"email": email}).Err(); err != nil {
		if err == mongo.ErrNoDocuments {
			return false, nil // user doesn't exist and there is no error
		}
		return false, err // there is an error
	}
	return true, nil // user exists and no error
}

/*
	Create a new user in the database
*/

func (s *Service) CreateUser(user User) error {
	_, err := s.users.InsertOne(context.Background(), user)
	return err
}
