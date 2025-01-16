package review

import (
	"github.com/gofiber/fiber/v2"
)

/*
Handler to execute business logic for Review Endpoint
*/
type Handler struct {
	service *Service
}

// Create a review
func (h *Handler) CreateReview(c *fiber.Ctx) error {
	review, err := h.service.InsertReview(c.Body())

	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}
	return c.JSON(review)
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
	review, err := h.service.GetReviewByID(c.Params("id"))

	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}
	return c.JSON(review)
}

// Update a review
func (h *Handler) UpdateReview(c *fiber.Ctx) error {
	review, err := h.service.UpdateReview(c.Params("id"), c.Body())

	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}
	return c.JSON(review)
}

// Delete a review
func (h *Handler) DeleteReview(c *fiber.Ctx) error {
	err := h.service.DeleteReview(c.Params("id"))

	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}
	return c.SendStatus(fiber.StatusNoContent)
}
