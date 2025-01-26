package forgot_pass

import (
	"context"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

/*
Password Reset Service to be used by Password Reset Handler to interact with the
Database layer of the application
*/
type Service struct {
	pwResets *mongo.Collection
	users    *mongo.Collection
}

// newService picks out the collections from the map.
func newService(collections map[string]*mongo.Collection) *Service {
	return &Service{
		pwResets: collections["pw-resets"],
		users:    collections["users"],
	}
}

// VerifyOTP updates the 'verified' flag in the pw-resets collection.
func (s *Service) VerifyOTP(otp int) error {
	ctx := context.Background()

	filter := bson.M{"otp": otp}
	update := bson.M{"$set": bson.M{"verified": true}}

	result, err := s.pwResets.UpdateOne(ctx, filter, update)
	if err != nil {
		return err
	}
	if result.MatchedCount == 0 {
		// No documents matched => invalid or expired OTP
		return ErrUnauthorized
	}
	return nil
}

// ChangePassword checks the pw-resets collection for a verified OTP doc by email,
// updates the user's password, and removes that pw-reset doc.
func (s *Service) ChangePassword(email, newPass string) error {
	ctx := context.Background()

	filter := bson.M{"email": email}
	var resetDoc PasswordResetDocument

	err := s.pwResets.FindOne(ctx, filter).Decode(&resetDoc)
	if err == mongo.ErrNoDocuments {
		return ErrNoResetDoc
	} else if err != nil {
		return err
	}

	if !resetDoc.Verified {
		return ErrUnauthorized
	}

	// Update user’s password in the users collection
	userFilter := bson.M{"email": email}
	userUpdate := bson.M{"$set": bson.M{"password": newPass}} // should hash this

	_, err = s.users.UpdateOne(ctx, userFilter, userUpdate, options.Update().SetUpsert(false))
	if err != nil {
		return err
	}

	// Delete the reset document
	_, err = s.pwResets.DeleteOne(ctx, filter)
	if err != nil {
		return err
	}

	return nil
}
