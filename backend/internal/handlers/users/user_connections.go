package users

import (
	"errors"

	"math"

	"github.com/GenerateNU/platemate/internal/xerr"
	"github.com/GenerateNU/platemate/internal/xvalidator"
	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type Handler struct {
	service *Service
}

func (h *Handler) GetUserById(c *fiber.Ctx) error {

	var query GetUserByIdParam

	if err := c.ParamsParser(&query); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(xerr.BadRequest(err))
	}

	errs := xvalidator.Validator.Validate(query)
	if len(errs) > 0 {
		return c.Status(fiber.StatusBadRequest).JSON(errs)
	}

	user, err := h.service.GetUserById(query.UserID)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return c.Status(fiber.StatusNotFound).JSON(xerr.NotFound("User", "id", query.UserID))
		}
		return err
	}

	return c.JSON(user)
}

func (h *Handler) GetUsers(c *fiber.Ctx) error {
	users, err := h.service.GetUsers()
	if err != nil {
		return err
	}
	return c.JSON(users)
}

// GetFollowers returns a paginated list of followers for a user
func (h *Handler) GetFollowers(c *fiber.Ctx) error {
	var query GetFollowersQuery
	if err := c.QueryParser(&query); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(xerr.BadRequest(err))
	}

	errs := xvalidator.Validator.Validate(query)
	if len(errs) > 0 {
		return c.Status(fiber.StatusBadRequest).JSON(errs)
	}

	// Set defaults if not provided
	if query.Page < 1 {
		query.Page = 1
	}
	if query.Limit < 1 {
		query.Limit = 20
	}

	followers, err := h.service.GetUserFollowers(query.UserId, query.Page, query.Limit)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return c.Status(fiber.StatusNotFound).JSON(xerr.NotFound("User", "id", query.UserId))
		}
		return err
	}

	return c.JSON(followers)
}

// GetFollowing returns a paginated list of who the user is following
func (h *Handler) GetFollowing(c *fiber.Ctx) error {
	var query GetFollowingQuery
	userId := c.Params("id")

	// Set defaults if not provided
	if query.Page < 1 {
		query.Page = 1
	}
	if query.Limit < 1 {
		query.Limit = 20
	}

	followers, err := h.service.GetUserFollowing(userId, query.Page, query.Limit)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return c.Status(fiber.StatusNotFound).JSON(xerr.NotFound("User", "id", query.UserId))
		}
		return err
	}

	return c.JSON(followers)
}

// GetFriendReviews gets reviews from users that the current user follows
func (h *Handler) GetFriendReviews(c *fiber.Ctx) error {
	var query GetFriendReviewsQuery

	if err := c.QueryParser(&query); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(xerr.BadRequest(err))
	}

	query.UserId = c.Params("id")
	// Set defaults if not provided
	if query.Page < 1 {
		query.Page = 1
	}
	if query.Limit < 1 {
		query.Limit = 20
	}

	// Added structured validation
	errs := xvalidator.Validator.Validate(query)
	if len(errs) > 0 {
		return c.Status(fiber.StatusBadRequest).JSON(errs)
	}

	userIdObj, err := primitive.ObjectIDFromHex(query.UserId)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(xerr.BadRequest(err))
	}

	reviews, totalCount, err := h.service.GetFriendReviews(userIdObj, query.Page, query.Limit)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return c.Status(fiber.StatusNotFound).JSON(xerr.NotFound("User", "id", query.UserId))
		}
		return err
	}

	response := fiber.Map{
		"data": reviews,
		"meta": fiber.Map{
			"page":       query.Page,
			"limit":      query.Limit,
			"total":      totalCount,
			"totalPages": int(math.Ceil(float64(totalCount) / float64(query.Limit))),
		},
	}

	return c.JSON(response)

}

// GetFollowingReviewsForItem gets reviews for a menu item from users that the current user follows
func (h *Handler) GetFollowingReviewsForItem(c *fiber.Ctx) error {

	var query ReviewQuery
	if err := c.QueryParser(&query); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(xerr.BadRequest(err))
	}

	query.ItemId = c.Params("id")

	// Added structured validation
	errs := xvalidator.Validator.Validate(query)
	if len(errs) > 0 {
		return c.Status(fiber.StatusBadRequest).JSON(errs)
	}

	reviews, err := h.service.GetFollowingReviewsForItem(query.UserId, query.ItemId)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return c.Status(fiber.StatusNotFound).JSON(xerr.NotFound("User", "id", query.UserId))
		}
		return err
	}

	return c.JSON(reviews)
}

// GetFriendReviewsForItem gets reviews for a menu item from friends of current user (users in following and followers)
func (h *Handler) GetFriendReviewsForItem(c *fiber.Ctx) error {
	var query ReviewQuery
	if err := c.QueryParser(&query); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(xerr.BadRequest(err))
	}

	query.ItemId = c.Params("id")

	errs := xvalidator.Validator.Validate(query)
	if len(errs) > 0 {
		return c.Status(fiber.StatusBadRequest).JSON(errs)
	}

	userIdObj, err := primitive.ObjectIDFromHex(query.UserId)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(xerr.BadRequest(err))
	}
	itemIdObj, err := primitive.ObjectIDFromHex(query.ItemId)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(xerr.BadRequest(err))
	}

	reviews, err := h.service.GetFriendReviewsForItem(userIdObj, itemIdObj)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return c.Status(fiber.StatusNotFound).JSON(xerr.NotFound("User", "id", query.UserId))
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

	errs := xvalidator.Validator.Validate(req)
	if len(errs) > 0 {
		return c.Status(fiber.StatusBadRequest).JSON(errs)
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

	errs := xvalidator.Validator.Validate(req)
	if len(errs) > 0 {
		return c.Status(fiber.StatusBadRequest).JSON(errs)
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

// GetDietaryPreferences retrieves the dietary preferences of a user
func (h *Handler) GetDietaryPreferences(c *fiber.Ctx) error {
	userId := c.Params("id")

	preferences, err := h.service.GetDietaryPreferences(userId)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return c.Status(fiber.StatusNotFound).JSON(xerr.NotFound("User", "id", userId))
		}
		return err
	}

	return c.JSON(preferences)
}

func (h *Handler) PostDietaryPreferences(c *fiber.Ctx) error {
	userId := c.Params("id")
	preference := c.Query("preference")

	err := h.service.PostDietaryPreferences(userId, preference)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return c.Status(fiber.StatusNotFound).JSON(xerr.NotFound("User", "id", "specified"))
		}
		return err
	}

	return c.SendStatus(fiber.StatusCreated)
}

func (h *Handler) DeleteDietaryPreferences(c *fiber.Ctx) error {
	userId := c.Params("id")
	preference := c.Query("preference")

	err := h.service.DeleteDietaryPreferences(userId, preference)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return c.Status(fiber.StatusNotFound).JSON(xerr.NotFound("User", "id", "specified"))
		}
		return err
	}

	return c.SendStatus(fiber.StatusCreated)
}

func (h *Handler) IsFollowing(c *fiber.Ctx) error {
	var query IsFollowingQuery
	if err := c.QueryParser(&query); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(xerr.BadRequest(err))
	}

	errs := xvalidator.Validator.Validate(query)
	if len(errs) > 0 {
		return c.Status(fiber.StatusBadRequest).JSON(errs)
	}

	isFollowing, err := h.service.IsFollowing(query.FollowerId, query.FolloweeId)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return c.Status(fiber.StatusNotFound).JSON(xerr.NotFound("Connection", "users", "specified"))
		}
		return err
	}

	return c.JSON(fiber.Map{
		"isFollowing": isFollowing,
	})
}
