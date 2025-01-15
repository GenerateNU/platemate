package auth

import (
	"strings"

	"github.com/gofiber/fiber/v2"
)

/*
	Handler to execute business logic for Health Endpoint
*/

/*
	Given an email/username and password, check if the credentials are valid and return
	both an access token and a refresh token.
*/

func (h *Handler) Login(c *fiber.Ctx) (error) { 
	var req LoginRequest
	if err := c.BodyParser(&req); err != nil {
		return err
	}

	h.service.UserExists(req.Email)


	access, refresh, err := h.service.GenerateTokens("bob")
	c.Response().Header.Add("access_token", access)
	c.Response().Header.Add("access_token", refresh)
	return err
}

/*
	Given an access and refresh token, check if they are valid 
	and return a new pair of tokens if refresh token is valid.
*/	

func (h *Handler) Authenticate(c *fiber.Ctx) error {
	header :=c.Get("Authorization")
	refreshToken :=c.Get("refresh_token")

	if len(header) == 0 {
		return fiber.NewError(400, "Not Authorized")
	}

	split := strings.Split(header, " ")
	tokenType, accessToken := split[0], split[1]

	if tokenType != "Bearer" {
		return fiber.NewError(400, "Not Authorized")
	}

	h.service.GenerateTokens(accessToken +refreshToken)


	return fiber.NewError(400, "Not Implemented")
}

/*
	Given an access token, invalidate the access token and refresh token.
	Invalidate the token by increasing the "count" field by one.
*/

func (h *Handler) Logout(c *fiber.Ctx) error { 
	return fiber.NewError(400,"Not Implemented")
}

/*

*/
func (h *Handler) ForgotPassword(c *fiber.Ctx) error { 
	return fiber.NewError(400,"Not Implemented")
}

func (h *Handler) ChangePassword(c *fiber.Ctx) error {	
	return fiber.NewError(400,"Not Implemented")	
}

func (h *Handler) Register(c *fiber.Ctx) (error) {
	return nil
}