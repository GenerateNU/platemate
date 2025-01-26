package forgot_pass

import (
	"errors"
	"strconv"

	"github.com/GenerateNU/platemate/internal/xerr"
	go_json "github.com/goccy/go-json"
	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

var (
	ErrUnauthorized = errors.New("unauthorized")
	ErrNoResetDoc   = errors.New("no reset document found")
)

// PasswordResetDocument maps to the pw-resets collection.
type PasswordResetDocument struct {
	ID       primitive.ObjectID `bson:"_id,omitempty" json:"_id,omitempty"`
	Email    string             `bson:"email"         json:"email"`
	OTP      int                `bson:"otp"           json:"otp"`
	Verified bool               `bson:"verified"      json:"verified"`
	// we might want to add: CreatedAt time.Time `bson:"createdAt" json:"createdAt"`
}

/*
Handler to execute business logic for Password Reset Endpoint
*/
type Handler struct {
	service *Service
}

// VerifyOTP handles the GET /api/v1/user/verify-otp endpoint.
func (h *Handler) VerifyOTP(c *fiber.Ctx) error {
	// Extract the OTP from query parameters
	otpStr := c.Query("otp")
	if otpStr == "" {
		return c.Status(fiber.StatusBadRequest).
			JSON(xerr.BadRequest(errors.New("OTP is required")))
	}

	otp, err := strconv.Atoi(otpStr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).
			JSON(xerr.BadRequest(errors.New("OTP must be a number")))
	}

	// Service call
	if err := h.service.VerifyOTP(otp); err != nil {
		if errors.Is(err, ErrUnauthorized) {
			// Return 401 if OTP not found or invalid
			return c.Status(fiber.StatusUnauthorized).
				JSON(xerr.Unauthorized("Invalid or expired OTP"))
		}
		// Some other internal error
		return err
	}

	// If success, return 200
	return c.SendStatus(fiber.StatusOK)
}

// ChangePassword handles the POST /api/v1/user/change-password endpoint.
func (h *Handler) ChangePassword(c *fiber.Ctx) error {
	var reqBody struct {
		Email   string `json:"email"`
		NewPass string `json:"newPass"`
	}

	// Parse JSON body
	if err := go_json.Unmarshal(c.Body(), &reqBody); err != nil {
		return c.Status(fiber.StatusBadRequest).
			JSON(xerr.BadRequest(err))
	}
	if reqBody.Email == "" || reqBody.NewPass == "" {
		return c.Status(fiber.StatusBadRequest).
			JSON(xerr.BadRequest(errors.New("missing required fields")))
	}

	// Service call
	if err := h.service.ChangePassword(reqBody.Email, reqBody.NewPass); err != nil {
		if errors.Is(err, ErrUnauthorized) {
			return c.Status(fiber.StatusUnauthorized).
				JSON(xerr.Unauthorized("OTP not verified or does not exist"))
		} else if errors.Is(err, ErrNoResetDoc) {
			// Could not find corresponding doc in pw-resets
			return c.Status(fiber.StatusInternalServerError).
				JSON(xerr.InternalServerError())
		}
		// Some other internal error
		return err
	}

	// If success, return 200
	return c.SendStatus(fiber.StatusOK)
}
