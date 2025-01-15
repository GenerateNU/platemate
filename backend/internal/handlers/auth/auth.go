package auth

import "github.com/gofiber/fiber/v2"

/*
Handler to execute business logic for Health Endpoint
*/
type Handler struct {
	service *Service
}

type TokenResponse struct {
	AccessToken string `json:"access_token"`
	RefreshToken   string `json:"refresh_token"`
	User        string `json:"user"`
}

var errorToken = TokenResponse{
	AccessToken: "",
	RefreshToken:   "",
	User:        "",
}

/*
	Given an email/username and password, check if the credentials are valid and return 
	both an access token and a refresh token. 
*/

func (h *Handler) Login(c *fiber.Ctx) (error) { 
	access, err := h.service.GenerateAccessToken("bob") 
	refresh, err := h.service.GenerateRefreshToken("bob") 
	c.Response().Header.Add("access_token", access)
	c.Response().Header.Add("access_token", refresh)
	return err
}

/*
	Given an access and refresh token, check if they are valid 
	and return a new pair of tokens if refresh token is valid.
*/	

func (h *Handler) Authenticate(c *fiber.Ctx) error {
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