package auth

import (
	"strings"

	"github.com/GenerateNU/platemate/internal/xerr"
	"github.com/GenerateNU/platemate/internal/xvalidator"
	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

/*
	Handler to execute business logic for Health Endpoint
*/

/*
	Given an email/username and password, check if the credentials are valid and return
	both an access token and a refresh token.
*/

// Login handles user authentication
// @Summary      Authenticate user
// @Description  Logs in a user and returns JWT tokens
// @Tags         auth
// @Accept       json
// @Produce      json
// @Param        request  body  LoginRequest  true  "User credentials"
// @Success      200      {object}  map[string]string  "Tokens in response headers"
// @Failure      400      {object}  map[string]string  "Invalid request"
// @Failure      401      {object}  map[string]string  "Unauthorized"
// @Failure      500      {object}  map[string]string  "Internal server error"
// @Router       /login [post]
func (h *Handler) Login(c *fiber.Ctx) error {
	var req LoginRequest
	err := c.BodyParser(&req)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(xerr.InvalidJSON())
	}

	errs := xvalidator.Validator.Validate(req)
	if len(errs) > 0 {
		return c.Status(fiber.StatusBadRequest).JSON(errs)
	}

	// database call to find the user and verify credentials and get count
	id, err := h.service.LoginFromCredentials(req.Email, req.Password)
	if err != nil {
		return err
	}

	access, refresh, err := h.service.GenerateTokens(id)

	if err != nil {
		return err
	}

	c.Response().Header.Add("access_token", access)
	c.Response().Header.Add("refresh_token", refresh)

	return c.Status(fiber.StatusOK).JSON(TokenResponse{
		AccessToken:  access,
		RefreshToken: refresh,
		User:         id,
	})
}

func (h *Handler) Register(c *fiber.Ctx) error {
	var req RegisterRequest
	if err := c.BodyParser(&req); err != nil {
		return err
	}

	if err := req.Validate(); err != nil {
		return err
	}

	id := primitive.NewObjectID().Hex()
	oidHex, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(xerr.BadRequest(err))
	}

	access, refresh, err := h.service.GenerateTokens(id)

	if err != nil {
		return err
	}

	// Convert string array to ObjectID array for followers and following
	var followingOIDs []primitive.ObjectID = make([]primitive.ObjectID, 0)
	var followersOIDs []primitive.ObjectID = make([]primitive.ObjectID, 0)
	var reviewsOIDs []primitive.ObjectID = make([]primitive.ObjectID, 0)

	// Initialize empty arrays for preferences and restrictions if they're nil
	if req.Preferences == nil {
		req.Preferences = make([]string, 0)
	}
	if req.Restrictions == nil {
		req.Restrictions = make([]string, 0)
	}
	if req.TasteProfile == nil {
		req.TasteProfile = make([]float64, 1536)
	}

	user := User{
		ID:                oidHex,
		Name:              req.Name,
		Email:             req.Email,
		Password:          req.Password,
		Username:          req.Username,
		FollowingCount:    req.FollowingCount,
		FollowersCount:    req.FollowersCount,
		ProfilePictureURL: req.ProfilePicture,
		Count:             req.Count,
		RefreshToken:      req.RefreshToken,
		TokenUsed:         req.TokenUsed,
		Preferences:       req.Preferences,
		Restrictions:      req.Restrictions,
		Following:         followingOIDs,
		Followers:         followersOIDs,
		Reviews:           reviewsOIDs,
		TasteProfile:      req.TasteProfile,
	}

	if err = user.Validate(); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(xerr.BadRequest(err))
	}

	err = h.service.CreateUser(user)

	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(xerr.BadRequest(err))
	}

	c.Response().Header.Add("access_token", access)
	c.Response().Header.Add("refresh_token", refresh)

	return c.Status(fiber.StatusOK).JSON(TokenResponse{
		AccessToken:  access,
		RefreshToken: refresh,
		User:         id,
	})
}

func (h *Handler) Test(c *fiber.Ctx) error {
	return c.SendString("Authorized!")
}

func (h *Handler) Refresh(c *fiber.Ctx) error {

	var body RefreshRequestBody

	if err := c.BodyParser(&body); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(xerr.InvalidJSON())
	}

	// validate the refresh token
	userId, err := h.service.ValidateToken(body.RefreshToken)

	if err != nil {
		return fiber.NewError(400, "Not Authorized: Access and Refresh Tokens are Expired "+err.Error())
	}

	// generate new refresh token
	access, refresh, err := h.service.GenerateTokens(userId)

	if err != nil {
		return fiber.NewError(400, "Not Authorized, Error Generating Tokens")
	}

	// return new tokens
	c.Response().Header.Add("access_token", access)
	c.Response().Header.Add("refresh_token", refresh)

	return c.Status(fiber.StatusOK).JSON(TokenResponse{
		AccessToken:  access,
		RefreshToken: refresh,
		User:         userId,
	})
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

func (h *Handler) ValidateRefreshToken(c *fiber.Ctx, refreshToken string) error {
	// Okay, so the access token is invalid now we check if the refresh token is valid
	_, err := h.service.ValidateToken(refreshToken)
	if err != nil {
		return fiber.NewError(400, "Not Authorized: Access and Refresh Tokens are Expired "+err.Error())
	}
	return nil
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
	userId, err := h.service.ValidateToken(accessToken)
	if err != nil {
		err = h.ValidateRefreshToken(c, refreshToken)
		if err != nil {
			return "", "", err
		}
	}
	// use the same count as the existing token
	// Our refresh token is valid and unused, so we can use it to generate a new set of tokens
	access, refresh, err := h.service.GenerateTokens(userId)
	if err != nil {
		return "", "", fiber.NewError(400, "Not Authorized, Error Generating Tokens")
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
	user_id, err := h.service.ValidateToken(accessToken)
	if err != nil {
		return err
	}
	err = h.service.InvalidateTokens(user_id)
	if err != nil {
		return err
	}
	return c.SendString("Logout Successful")
}

// CheckEmailExists checks if an email already exists in the database
func (h *Handler) CheckEmailExists(c *fiber.Ctx) error {
	email := c.Query("email")
	if email == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Email parameter is required",
			"exists":  false,
		})
	}

	exists, err := h.service.CheckEmailExists(email)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Failed to check email",
			"exists":  false,
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"exists": exists,
	})
}

// CheckUsernameExists checks if a username already exists in the database
func (h *Handler) CheckUsernameExists(c *fiber.Ctx) error {
	username := c.Query("username")
	if username == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Username parameter is required",
			"exists":  false,
		})
	}

	exists, err := h.service.CheckUsernameExists(username)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Failed to check username",
			"exists":  false,
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"exists": exists,
	})
}
