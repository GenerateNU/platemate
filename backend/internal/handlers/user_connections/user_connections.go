package user_connections

import (
	"github.com/gofiber/fiber/v2"
)

type Handler struct {
	service *Service
}

type FollowRequest struct {
	FollowerId string `json:"followerId"`
	FolloweeId string `json:"followeeId"`
}

type PaginationQuery struct {
	Page  int `query:"page"`
	Limit int `query:"limit"`
}

func (h *Handler) GetFollowers(c *fiber.Ctx) error {
	var query PaginationQuery
	if err := c.QueryParser(&query); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid pagination parameters")
	}

	// TODO: Implement getting paginated followers
	return nil
}

func (h *Handler) GetFollowReviews(c *fiber.Ctx) error {
	itemId := c.Params("id")
	if itemId == "" {
		return fiber.NewError(fiber.StatusBadRequest, "Item ID is required")
	}
	// TODO: Implement getting reviews from followed users
	return nil
}

func (h *Handler) FollowUser(c *fiber.Ctx) error {
	var req FollowRequest
	if err := c.BodyParser(&req); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid request body")
	}
	// TODO: Implement following a user
	return nil
}

func (h *Handler) UnfollowUser(c *fiber.Ctx) error {
	var req FollowRequest
	if err := c.BodyParser(&req); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid request body")
	}
	// TODO: Implement unfollowing a user
	return nil
}
