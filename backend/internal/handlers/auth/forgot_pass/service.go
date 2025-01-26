package forgot_pass

import (
	"context"
	"errors"
	"fmt"
	"github.com/GenerateNU/platemate/xutils"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"os"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"

	"github.com/sendgrid/sendgrid-go"
	"github.com/sendgrid/sendgrid-go/helpers/mail"
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

	indexModel := mongo.IndexModel{
		Keys:    bson.M{"expiresAt": 1},
		Options: options.Index().SetExpireAfterSeconds(0),
	}
	_, err := collections["passwordResets"].Indexes().CreateOne(context.Background(), indexModel)
	if err != nil {
		panic(err)
	}

	return &Service{
		pwResets: collections["passwordResets"],
		users:    collections["users"],
	}
}

func (s *Service) CreateOTP(email string, expiryInMinutes int8) error {

	ctx := context.Background()

	// first we check if the provided email is associated with an account
	// if it is, proceed, else do nothing; we do not want to inform a potential
	// attacker that the email is not associated with an account

	err := s.users.FindOne(ctx, bson.M{"email": email}).Err()

	if err != nil {
		// if no documents found, do nothing
		if errors.Is(err, mongo.ErrNoDocuments) {
			return nil
		}
		return fmt.Errorf("failed to check if email is associated with an account: %w", err)
	}

	// now we generate an OTP and upsert it into the pw-resets collection
	// TODO: these are not unique, need an optimized method to generate unique OTPs
	otp, err := xutils.GenerateOTP(6)

	if err != nil {
		return err
	}

	// apply a filter and upsert the document
	// in broader terms, if a user is already in the process of resetting their password
	// (i.e. a document already exists for their email in passwordResets), just update the existing document.
	// if not, create it
	filter := bson.M{"email": email}

	update := bson.M{
		"$set": bson.M{
			"otp":       otp,
			"expiresAt": primitive.NewDateTimeFromTime(time.Now().Add(time.Minute * time.Duration(expiryInMinutes))),
		},
		"$setOnInsert": bson.M{
			"email": email,
		},
	}

	opts := options.FindOneAndUpdate().SetUpsert(true).SetReturnDocument(options.After)
	err = s.pwResets.FindOneAndUpdate(ctx, filter, update, opts).Decode(&PasswordResetDocument{})

	if err != nil && !errors.Is(err, mongo.ErrNoDocuments) {
		return fmt.Errorf("failed to upsert password reset document: %w", err)
	}

	// interact with SendGrid to send the email with the OTP
	m := mail.NewV3Mail()
	e := mail.NewEmail("PlateMate Team", "platemate@benpetrillo.dev")

	m.SetFrom(e)
	m.SetTemplateID("d-ab63353a33c94662a16c01d496072306")

	p := mail.NewPersonalization()

	tos := []*mail.Email{
		// TODO: replace with associated account name
		mail.NewEmail("Example User", email),
	}

	p.AddTos(tos...)
	p.SetDynamicTemplateData("otp", otp)

	m.AddPersonalizations(p)

	req := sendgrid.GetRequest(os.Getenv("SENDGRID_API_KEY"), "/v3/mail/send", "https://api.sendgrid.com")
	req.Method = "POST"
	var Body = mail.GetRequestBody(m)
	req.Body = Body
	_, err = sendgrid.API(req)
	if err != nil {
		return fmt.Errorf("failed to send email: %w", err)
	}

	fmt.Printf("Upserted document and email sent.")
	return nil

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
	if errors.Is(err, mongo.ErrNoDocuments) {
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
