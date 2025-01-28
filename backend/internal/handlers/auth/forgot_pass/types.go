package forgot_pass

import "go.mongodb.org/mongo-driver/bson/primitive"

type ForgotPasswordRequestBody struct {
	Email string `json:"email"`
}

type ChangePasswordRequestBody struct {
	Email   string `json:"email"`
	NewPass string `json:"newPass"`
}

// *** MONGO DOCUMENTS BELOW *** //

type PasswordResetDocument struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"_id,omitempty"`
	Email     string             `bson:"email"         json:"email"`
	OTP       string             `bson:"otp"           json:"otp"`
	Verified  bool               `bson:"verified"      json:"verified"`
	CreatedAt primitive.DateTime `bson:"createdAt"    json:"createdAt"`
	ExpiresAt primitive.DateTime `bson:"expiresAt"`
}
