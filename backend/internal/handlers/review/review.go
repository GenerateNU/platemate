package review

import (
	"encoding/json"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson/primitive"
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
	if err := json.Unmarshal(c.Body(), &review); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid review data")
	}

	result, err := h.service.InsertReview(review)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}
	return c.JSON(result)
}

// Get all reviews
func (h *Handler) GetReviews(c *fiber.Ctx) error {
	reviews, err := h.service.GetAllReviews()

	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}
	return c.JSON(reviews)
}

// Get a single review
func (h *Handler) GetReview(c *fiber.Ctx) error {
	id, err := primitive.ObjectIDFromHex(c.Params("id"))

	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid review ID")
	}

	review, err := h.service.GetReviewByID(id)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}
	return c.JSON(review)
}

// Update a review
func (h *Handler) UpdateReview(c *fiber.Ctx) error {
	id, err := primitive.ObjectIDFromHex(c.Params("id"))
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid review ID")
	}

	var review ReviewDocument
	if err := json.Unmarshal(c.Body(), &review); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid review data")
	}

	err = h.service.UpdateReview(id, review)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}
	return c.SendStatus(fiber.StatusOK)
}

// Delete a review
func (h *Handler) DeleteReview(c *fiber.Ctx) error {
	id, err := primitive.ObjectIDFromHex(c.Params("id"))
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid review ID")
	}

	if err := h.service.DeleteReview(id); err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}
	return c.SendStatus(fiber.StatusNoContent)
}
