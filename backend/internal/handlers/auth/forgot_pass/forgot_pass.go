package forgot_pass

import (
	"errors"
	"fmt"
	"github.com/GenerateNU/platemate/internal/xerr"
	gojson "github.com/goccy/go-json"
	"github.com/gofiber/fiber/v2"
	"net/mail"
	"regexp"
)

var (
	ErrUnauthorized = errors.New("unauthorized")
	ErrNoResetDoc   = errors.New("no reset document found")
)

/*
Handler to execute business logic for Password Reset Endpoint
*/
type Handler struct {
	service *Service
}

func (h *Handler) ForgotPassword(c *fiber.Ctx) error {

	body := ForgotPasswordRequestBody{}

	if err := c.BodyParser(&body); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	_, err := mail.ParseAddress(body.Email)

	if err != nil {
		fmt.Println(err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid email address",
		})
	}

	err = h.service.CreateOTP(body.Email, 15)

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Internal server error",
		})
	}

	return c.Status(200).JSON(fiber.Map{
		"message": "Email sent to reset password",
	})

}

// VerifyOTP handles the GET /api/v1/user/verify-otp endpoint.
func (h *Handler) VerifyOTP(c *fiber.Ctx) error {
	// Extract the OTP from query parameters
	otpStr := c.Query("otp")
	if otpStr == "" {
		return c.Status(fiber.StatusBadRequest).
			JSON(xerr.BadRequest(errors.New("OTP is required")))
	}

	// use regex to ensure a length of 6 with only numbers & capital
	// letters in the result

	pattern := `^[A-Z0-9]{6}$`

	regex := regexp.MustCompile(pattern)

	if !regex.MatchString(otpStr) {
		return c.Status(fiber.StatusBadRequest).
			JSON(xerr.BadRequest(errors.New("invalid OTP")))
	}

	// Service call
	if err := h.service.VerifyOTP(otpStr); err != nil {
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

	var reqBody ChangePasswordRequestBody

	// Parse JSON body
	if err := gojson.Unmarshal(c.Body(), &reqBody); err != nil {
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
