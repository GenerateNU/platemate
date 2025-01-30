package forgot_pass

import (
	"errors"
	"github.com/GenerateNU/platemate/internal/xerr"
	"github.com/GenerateNU/platemate/internal/xvalidator"
	"github.com/gofiber/fiber/v2"
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

	reqBody := ForgotPasswordRequestBody{}
	err := c.BodyParser(&reqBody)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(xerr.InvalidJSON())
	}

	errs := xvalidator.Validator.Validate(reqBody)
	if len(errs) > 0 {
		return c.Status(fiber.StatusBadRequest).JSON(errs)
	}

	err = h.service.CreateOTP(reqBody.Email, 15)

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

	reqInputs := VerifyOTPRequestParams{
		OTP:   c.Query("otp"),
		Email: c.Query("email"),
	}

	errs := xvalidator.Validator.Validate(reqInputs)
	if len(errs) > 0 {
		return c.Status(fiber.StatusBadRequest).JSON(errs)
	}

	// Service call
	if err := h.service.VerifyOTP(reqInputs.OTP); err != nil {
		if errors.Is(err, ErrUnauthorized) {
			// Return 401 if OTP not found or invalid
			return c.Status(fiber.StatusUnauthorized).
				JSON(xerr.Unauthorized("Invalid or expired OTP"))
		}
		return err
	}

	return c.SendStatus(fiber.StatusOK)
}

// ChangePassword handles the POST /api/v1/user/change-password endpoint.
func (h *Handler) ChangePassword(c *fiber.Ctx) error {

	var reqBody ChangePasswordRequestBody

	err := c.BodyParser(&reqBody)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(xerr.InvalidJSON())
	}

	errs := xvalidator.Validator.Validate(reqBody)
	if len(errs) > 0 {
		return c.Status(fiber.StatusBadRequest).JSON(errs)
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
		return err
	}

	return c.SendStatus(fiber.StatusOK)
}
