package review

import (
	"errors"
	"math"
	"strconv"
	"time"

	"github.com/GenerateNU/platemate/internal/xerr"
	"github.com/GenerateNU/platemate/internal/xvalidator"
	gojson "github.com/goccy/go-json"
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
	var params CreateReviewParams

	if err := gojson.Unmarshal(c.Body(), &params); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(xerr.ErrorHandler(c, err))
	}

	// do some validations on the inputs

	// Convert the string restaurantId to ObjectID
	restaurantOID, err := primitive.ObjectIDFromHex(params.RestaurantID)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(xerr.BadRequest(err))
	}

	review = ReviewDocument{
		Rating:       params.Rating,
		Picture:      params.Picture,
		Content:      params.Content,
		Reviewer:     params.Reviewer,
		Timestamp:    time.Now(),
		MenuItem:     params.MenuItem,
		ID:           primitive.NewObjectID(),
		Comments:     []CommentDocument{},
		RestaurantID: restaurantOID,
	}

	result, err := h.service.InsertReview(review)

	if err != nil {
		sErr := err.(mongo.WriteException) // Convert to Command Error
		if sErr.HasErrorCode(121) {        // Indicates that the document failed validation
			return xerr.WriteException(c, sErr) // Handle the error by returning a 121 and the error message
		}
		return err // Any other error
	}

	return c.JSON(result)
}

// Get all reviews
func (h *Handler) GetReviews(c *fiber.Ctx) error {

	page := 1
	limit := 10

	if c.Query("page") != "" {
		pageParam, err := strconv.Atoi(c.Query("page"))
		if err == nil && pageParam > 0 {
			page = pageParam
		}
	}

	if c.Query("limit") != "" {
		limitParam, err := strconv.Atoi(c.Query("limit"))
		if err == nil && limitParam > 0 {

			if limitParam > 100 {
				limitParam = 100
			}
			limit = limitParam
		}
	}

	reviews, totalCount, err := h.service.GetReviews(page, limit)
	if err != nil {
		return err
	}

	response := fiber.Map{
		"data": reviews,
		"meta": fiber.Map{
			"page":       page,
			"limit":      limit,
			"total":      totalCount,
			"totalPages": int(math.Ceil(float64(totalCount) / float64(limit))),
		},
	}

	return c.JSON(response)
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
	if err := gojson.Unmarshal(c.Body(), &review); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(xerr.InvalidJSON())
	}

	err = h.service.UpdateReview(id, review)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(xerr.ErrorHandler(c, err))
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
	if err := gojson.Unmarshal(c.Body(), &partialUpdate); err != nil {
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

func (h *Handler) CreateComment(c *fiber.Ctx) error {
	var comment CommentDocument

	reqInputs := CreateCommentParams{}
	err := c.BodyParser(&reqInputs)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(xerr.InvalidJSON())
	}

	errs := xvalidator.Validator.Validate(reqInputs)
	if len(errs) > 0 {
		return c.Status(fiber.StatusBadRequest).JSON(errs)
	}

	id, err := primitive.ObjectIDFromHex(reqInputs.Review)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(xerr.BadRequest(err))
	}
	comment = CommentDocument{
		Content: reqInputs.Content,
		User: Commenter{
			ID:       reqInputs.User.ID,
			PFP:      reqInputs.User.PFP,
			Username: reqInputs.User.Username,
		},
		Mention:   reqInputs.Mentions,
		Timestamp: time.Now(),
		Review:    id,
		ID:        primitive.NewObjectID(),
	}

	err = h.service.CreateComment(comment) // Insert operation

	if err != nil {
		sErr := err.(mongo.CommandError) // Convert to Command Error
		if sErr.HasErrorCode(121) {      // Indicates that the document failed validation
			return xerr.FailedValidation(c, sErr) // Handle the error by returning a 121 and the error message
		}
	}

	return c.SendStatus(fiber.StatusOK)
}

func (h *Handler) GetComments(c *fiber.Ctx) error {
	id, err := primitive.ObjectIDFromHex(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(xerr.BadRequest(err))
	}

	comments, err := h.service.GetComments(id)
	if err != nil {
		// Central error handler take 500
		return err
	}
	return c.JSON(comments)
}

// GetReviewsByUser returns all review documents for a specific user
func (h *Handler) GetReviewsByUser(c *fiber.Ctx) error {
	userID := c.Params("userId")

	reviews, err := h.service.GetReviewsByUser(userID)
	if err != nil {
		return err
	}

	return c.JSON(reviews)
}

// SearchUserReviews handles GET /api/v1/review/user/:userId/search?query=...
func (h *Handler) SearchUserReviews(c *fiber.Ctx) error {
	userID := c.Params("userId")
	queryParam := c.Query("query", "") // If query param provided, defaults to empty string

	results, err := h.service.SearchUserReviews(userID, queryParam)
	if err != nil {
		return err
	}

	return c.JSON(results)
}
