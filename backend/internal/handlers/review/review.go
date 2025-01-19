package review

import (
	"errors"

	"github.com/GenerateNU/platemate/internal/xerr"
	go_json "github.com/goccy/go-json"
	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

/*
Handler to execute business logic for Review Endpoint
*/
type Handler struct {
	service *Service
}

// Create a review
func (h *Handler) CreateReview(c *fiber.Ctx) error {
	var review ReviewDocument
	if err := go_json.Unmarshal(c.Body(), &review); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(xerr.BadRequest(err))
	}

	result, err := h.service.InsertReview(review)
	if err != nil {
		// Central error handler take 500
		return err
	}
	return c.JSON(result)
}

// Get all reviews
func (h *Handler) GetReviews(c *fiber.Ctx) error {
	reviews, err := h.service.GetAllReviews()

	if err != nil {
		// Central error handler take 500
		return err
	}
	return c.JSON(reviews)
}

// Get a single review
func (h *Handler) GetReview(c *fiber.Ctx) error {
	id, err := primitive.ObjectIDFromHex(c.Params("id"))

	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(xerr.BadRequest(err))
	}

	review, err := h.service.GetReviewByID(id)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return c.Status(fiber.StatusNotFound).JSON(xerr.NotFound("Review", "id", id.Hex()))
		}
		// Central error handler take 500
		return err
	}
	return c.JSON(review)
}

// Update a review (PUT)
func (h *Handler) UpdateReview(c *fiber.Ctx) error {
	id, err := primitive.ObjectIDFromHex(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(xerr.BadRequest(err))
	}

	var review ReviewDocument
	if err := go_json.Unmarshal(c.Body(), &review); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(xerr.InvalidJSON())
	}

	err = h.service.UpdateReview(id, review)
	if err != nil {
		// Central error handler take 500
		return err
	}
	return c.SendStatus(fiber.StatusOK)
}

// Update specific fields of a review (PATCH)
func (h *Handler) UpdatePartialReview(c *fiber.Ctx) error {
	id, err := primitive.ObjectIDFromHex(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(xerr.BadRequest(err))
	}

	var partialUpdate ReviewDocument
	if err := go_json.Unmarshal(c.Body(), &partialUpdate); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(xerr.InvalidJSON())
	}

	err = h.service.UpdatePartialReview(id, partialUpdate)
	if err != nil {
		// Central error handler take 500
		return err
	}
	return c.SendStatus(fiber.StatusOK)
}

// Delete a review
func (h *Handler) DeleteReview(c *fiber.Ctx) error {
	id, err := primitive.ObjectIDFromHex(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(xerr.BadRequest(err))
	}

	if err := h.service.DeleteReview(id); err != nil {
		// Central error handler take 500
		return err
	}
	return c.SendStatus(fiber.StatusNoContent)
}
