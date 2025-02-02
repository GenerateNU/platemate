package auth

import (
	"github.com/GenerateNU/platemate/internal/xerr"
	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"strings"
)

/*
	Handler to execute business logic for Health Endpoint
*/

/*
	Given an email/username and password, check if the credentials are valid and return
	both an access token and a refresh token.
*/

func (h *Handler) Login(c *fiber.Ctx) error {
	var req LoginRequest

	if err := c.BodyParser(&req); err != nil {
		return err
	}

	if err := req.Validate(); err != nil {
		return err
	}
	// database call to find the user and verify credentials and get count
	id, count, err := h.service.LoginFromCredentials(req.Email, req.Password)
	if err != nil {
		return err
	}

	access, refresh, err := h.service.GenerateTokens(id, count)
	c.Response().Header.Add("access_token", access)
	c.Response().Header.Add("refresh_token", refresh)
	return err
}

func (h *Handler) Register(c *fiber.Ctx) error {
	var req RegisterRequest
	if err := c.BodyParser(&req); err != nil {
		return err
	}

	if err := req.Validate(); err != nil {
		return err
	}

	if exists, err := h.service.UserExists(req.Email); err != nil {
		return err
	} else if exists {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "User already exists",
		})
	}

	id := primitive.NewObjectID().Hex()

	access, refresh, err := h.service.GenerateTokens(id, 0) // new users use count = 0

	if err != nil {
		return err
	}

	c.Response().Header.Add("access_token", access)
	c.Response().Header.Add("refresh_token", refresh)

	user := User{
		Email:        req.Email,
		Password:     req.Password,
		ID:           id,
		RefreshToken: refresh,
		TokenUsed:    false,
		Count:        0,
	}

	if err = user.Validate(); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(xerr.BadRequest(err))
	}

	err = h.service.CreateUser(user)
	return err
}

func (h *Handler) Test(c *fiber.Ctx) error {
	return c.SendString("Authorized!")
}

func (h *Handler) AuthenticateMiddleware(c *fiber.Ctx) error {
	header := c.Get("Authorization")
	refreshToken := c.Get("refresh_token")

	if len(header) == 0 {
		return fiber.NewError(400, "Not Authorized, Tokens not passed")
	}

	split := strings.Split(header, " ")

	if len(split) != 2 {
		return fiber.NewError(400, "Not Authorized, Invalid Token Format")
	}
	tokenType, accessToken := split[0], split[1]

	if tokenType != "Bearer" {
		return fiber.NewError(400, "Not Authorized, Invalid Token Type")
	}

	access, refresh, err := h.ValidateAndGenerateTokens(c, accessToken, refreshToken)
	if err != nil {
		return err
	}

	c.Response().Header.Add("access_token", access)
	c.Response().Header.Add("refresh_token", refresh)

	return c.Next()
}

func (h *Handler) ValidateRefreshToken(c *fiber.Ctx, refreshToken string) (float64, error) {
	// Okay, so the access token is invalid now we check if the refresh token is valid
	user_id, count, err := h.service.ValidateToken(refreshToken)
	if err != nil {
		return 0, fiber.NewError(400, "Not Authorized: Access and Refresh Tokens are Expired "+err.Error())
	}
	// Check if the refresh token is unused
	used, err := h.service.CheckIfTokenUsed(user_id)
	if err != nil {
		return 0, fiber.NewError(400, "Not Authorized, Error Validating Token Reusage "+err.Error())
	} else if used {
		return 0, fiber.NewError(400, "Not Authorized, Token Reuse Detected")
	}
	return count, nil
}

/*
	Given an access and refresh token, check if they are valid
	and return a new pair of tokens if refresh token is valid.
*/

func (h *Handler) ValidateAndGenerateTokens(c *fiber.Ctx, accessToken string, refreshToken string) (string, string, error) {
	/*
		Check our tokens are valid by first checking if the access token is valid
		and then checking if the refresh token is valid if the access token is invalid
	*/
	user_id, count, err := h.service.ValidateToken(accessToken)
	if err != nil {
		count, err = h.ValidateRefreshToken(c, refreshToken)
		if err != nil {
			return "", "", err
		}
	}
	// use the same count as the existing token
	// Our refresh token is valid and unused, so we can use it to generate a new set of tokens
	access, refresh, err := h.service.GenerateTokens(user_id, count)
	if err != nil {
		return "", "", fiber.NewError(400, "Not Authorized, Error Generating Tokens")
	}

	if err := h.service.UseToken(user_id); err != nil {
		return "", "", fiber.NewError(400, "Not Authorized, Error Updating Token Usage")
	}

	return access, refresh, nil
}

/*
	Given an access token, invalidate the access token and refresh token.
	Invalidate the token by increasing the "count" field by one.
*/

func (h *Handler) Logout(c *fiber.Ctx) error {
	header := c.Get("Authorization")

	if len(header) == 0 {
		return fiber.NewError(400, "Not Authorized, Tokens not passed")
	}

	split := strings.Split(header, " ")

	if len(split) != 2 {
		return fiber.NewError(400, "Not Authorized, Invalid Token Format")
	}
	tokenType, accessToken := split[0], split[1]

	if tokenType != "Bearer" {
		return fiber.NewError(400, "Not Authorized, Invalid Token Type")
	}
	// increase the count by one
	user_id, _, err := h.service.ValidateToken(accessToken)
	if err != nil {
		return err
	}
	err = h.service.InvalidateTokens(user_id)
	if err != nil {
		return err
	}
	return c.SendString("Logout Successful")
}
