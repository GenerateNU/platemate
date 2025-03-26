package restaurant

import (
	"errors"
	"github.com/GenerateNU/platemate/internal/xerr"
	go_json "github.com/goccy/go-json"
	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

/*
Handler to execute business logic for Restaurant Endpoint
*/
type Handler struct {
	service *Service
}

// SearchRestaurants handles text-based queries
func (h *Handler) SearchRestaurants(c *fiber.Ctx) error {
	searchParam := c.Query("search", "")

	results, err := h.service.SearchRestaurants(searchParam)
	if err != nil {
		// Central error handling
		return xerr.ErrorHandler(c, err)
	}
	return c.JSON(results)
}

// GetRestaurant by ID
func (h *Handler) GetRestaurant(c *fiber.Ctx) error {
	idParam := c.Params("id")
	objID, err := primitive.ObjectIDFromHex(idParam)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(xerr.BadRequest(err))
	}

	restaurant, err := h.service.GetRestaurantByID(objID)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return c.Status(fiber.StatusNotFound).
				JSON(xerr.NotFound("Restaurant", "id", idParam))
		}
		return xerr.ErrorHandler(c, err)
	}

	return c.JSON(restaurant)
}

// UpdateRestaurant by ID (PUT)
func (h *Handler) UpdateRestaurant(c *fiber.Ctx) error {
	idParam := c.Params("id")
	objID, err := primitive.ObjectIDFromHex(idParam)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(xerr.BadRequest(err))
	}

	var updateDoc RestaurantDocument
	if err := go_json.Unmarshal(c.Body(), &updateDoc); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(xerr.InvalidJSON())
	}

	err = h.service.UpdateRestaurant(objID, updateDoc)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return c.Status(fiber.StatusNotFound).
				JSON(xerr.NotFound("Restaurant", "id", idParam))
		}
		return xerr.ErrorHandler(c, err)
	}

	return c.SendStatus(fiber.StatusOK)
}

// UpdatePartialRestaurant by ID (PATCH)
func (h *Handler) UpdatePartialRestaurant(c *fiber.Ctx) error {
	idParam := c.Params("id")
	objID, err := primitive.ObjectIDFromHex(idParam)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(xerr.BadRequest(err))
	}

	var updateDoc RestaurantDocument
	if err := go_json.Unmarshal(c.Body(), &updateDoc); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(xerr.InvalidJSON())
	}

	err = h.service.UpdatePartialRestaurant(objID, updateDoc)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return c.Status(fiber.StatusNotFound).
				JSON(xerr.NotFound("Restaurant", "id", idParam))
		}
		return xerr.ErrorHandler(c, err)
	}

	return c.SendStatus(fiber.StatusOK)
}

// DeleteRestaurant by ID
func (h *Handler) DeleteRestaurant(c *fiber.Ctx) error {
	idParam := c.Params("id")
	objID, err := primitive.ObjectIDFromHex(idParam)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(xerr.BadRequest(err))
	}

	err = h.service.DeleteRestaurant(objID)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return c.Status(fiber.StatusNotFound).
				JSON(xerr.NotFound("Restaurant", "id", idParam))
		}
		return xerr.ErrorHandler(c, err)
	}
	return c.SendStatus(fiber.StatusNoContent)
}

// GetRestaurantFriendsFav by ID
func (h *Handler) GetRestaurantFriendsFav(c *fiber.Ctx) error {
	restaurantIdParam := c.Params("rid")
	userIdParam := c.Params("uid")

	restaurantObjID, err := primitive.ObjectIDFromHex(restaurantIdParam)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(xerr.BadRequest(err))
	}

	userObjID, err := primitive.ObjectIDFromHex(userIdParam)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(xerr.BadRequest(err))
	}

	friendsFav, err := h.service.GetRestaurantFriendsFav(userObjID, restaurantObjID)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return c.Status(fiber.StatusNotFound).
				JSON(xerr.NotFound("Restaurant", "id", restaurantIdParam))
		}
		return xerr.ErrorHandler(c, err)
	}

	return c.JSON(friendsFav)
}

// get SuperStars by restaurant ID
func (h *Handler) GetSuperStars(c *fiber.Ctx) error {
	restaurantIdParam := c.Params("rid")

	restaurantObjID, err := primitive.ObjectIDFromHex(restaurantIdParam)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(xerr.BadRequest(err))
	}

	superStars, err := h.service.GetSuperStars(restaurantObjID)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return c.Status(fiber.StatusNotFound).
				JSON(xerr.NotFound("Restaurant", "id", restaurantIdParam))
		}
		return xerr.ErrorHandler(c, err)
	}

	return c.JSON(superStars)
}
