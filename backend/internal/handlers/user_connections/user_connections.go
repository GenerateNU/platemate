package user_connections

import (
	"errors"

	"github.com/GenerateNU/platemate/internal/xerr"
	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/mongo"
)

type Handler struct {
	service *Service
}

type FollowRequest struct {
	FollowerId string `json:"followerId"`
	FolloweeId string `json:"followeeId"`
}

type PaginationQuery struct {
	Page  int `query:"page" default:"1"`
	Limit int `query:"limit" default:"20"`
}

// GetFollowers returns a paginated list of followers for a user
func (h *Handler) GetFollowers(c *fiber.Ctx) error {
	var query PaginationQuery
	if err := c.QueryParser(&query); err != nil {
		badReq := xerr.BadRequest(err)
		return c.Status(fiber.StatusBadRequest).JSON(&badReq)
	}

	userId := c.Query("userId")
	if userId == "" {
		badReq := xerr.BadRequest(errors.New("userId query parameter is required"))
		return c.Status(fiber.StatusBadRequest).JSON(&badReq)
	}

	// Set defaults if not provided
	if query.Page < 1 {
		query.Page = 1
	}
	if query.Limit < 1 {
		query.Limit = 20
	}

	followers, err := h.service.GetUserFollowers(userId, query.Page, query.Limit)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return c.Status(fiber.StatusNotFound).JSON(xerr.NotFound("User", "id", userId))
		}
		return err
	}

	return c.JSON(followers)
}

// GetFollowingReviewsForItem gets reviews for a menu item from users that the current user follows
func (h *Handler) GetFollowingReviewsForItem(c *fiber.Ctx) error {
	userId := c.Query("userId")
	if userId == "" {
		return c.Status(fiber.StatusBadRequest).JSON(xerr.BadRequest(
			errors.New("userId query parameter is required"),
		))
	}

	itemId := c.Params("id")
	if itemId == "" {
		badReq := xerr.BadRequest(errors.New("item id parameter is required"))
		return c.Status(fiber.StatusBadRequest).JSON(&badReq)
	}

	reviews, err := h.service.GetFollowingReviewsForItem(userId, itemId)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return c.Status(fiber.StatusNotFound).JSON(xerr.NotFound("User", "id", userId))
		}
		return err
	}

	return c.JSON(reviews)
}

// FollowUser creates a new follow relationship between users
func (h *Handler) FollowUser(c *fiber.Ctx) error {
	var req FollowRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(xerr.BadRequest(err))
	}

	if req.FollowerId == "" || req.FolloweeId == "" {
		return c.Status(fiber.StatusBadRequest).JSON(xerr.BadRequest(
			errors.New("followerId and followeeId are required"),
		))
	}

	if req.FollowerId == req.FolloweeId {
		return c.Status(fiber.StatusBadRequest).JSON(xerr.BadRequest(
			errors.New("users cannot follow themselves"),
		))
	}

	err := h.service.CreateConnection(req.FollowerId, req.FolloweeId)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return c.Status(fiber.StatusNotFound).JSON(xerr.NotFound("User", "id", "specified"))
		}
		return err
	}

	return c.SendStatus(fiber.StatusCreated)
}

// UnfollowUser removes a follow relationship between users
func (h *Handler) UnfollowUser(c *fiber.Ctx) error {
	var req FollowRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(xerr.BadRequest(err))
	}

	if req.FollowerId == "" || req.FolloweeId == "" {
		return c.Status(fiber.StatusBadRequest).JSON(xerr.BadRequest(
			errors.New("followerId and followeeId are required"),
		))
	}

	err := h.service.DeleteConnection(req.FollowerId, req.FolloweeId)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return c.Status(fiber.StatusNotFound).JSON(xerr.NotFound("Connection", "users", "specified"))
		}
		return err
	}

	return c.SendStatus(fiber.StatusNoContent)
}
