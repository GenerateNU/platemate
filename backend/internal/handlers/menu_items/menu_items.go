package menu_items

import (
	"github.com/gofiber/fiber/v2"
	// "log/slog"
	"errors"    
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/bson/primitive"

)

/*
Handler to execute business logic for Menu Items Endpoint
*/
type Handler struct {
	service *Service
}

type AvgRatingRequest struct {
	Portion *float64 `json:"portion"`
	Taste *float64 `json:"taste"`
	Value *float64 `json:"value"`
	Overall *float64 `json:"overall"`
	Return *bool `json:"return"`
}

type MenuItemRequest struct {	
	Name string `json:"name"`
	Picture string `json:"picture"`
	AvgRating AvgRatingRequest `json:"avgRating"`
	Reviews []string `json:"reviews"`
	Description string `json:"description"`
	Location []float64 `json:"location"`
	Tags []string `json:"tags"`
	DietaryRestrictions []string `json:"dietaryRestrictions"`
}

type MenuItemResponse struct {	
	ID string `json:"id"`
	MenuItemRequest
}

func PreprocessMenuItemRequest(menuItem MenuItemRequest) (MenuItemRequest) {
	// Default nil arrays to empty 
	if menuItem.Reviews == nil {
		menuItem.Reviews = []string{}
	}
	if menuItem.Tags == nil {
		menuItem.Tags = []string{}
	}
	if menuItem.DietaryRestrictions == nil {
		menuItem.DietaryRestrictions = []string{}
	}
	return menuItem
}
func ValidateMenuItemRequest(menuItem MenuItemRequest) error {
		// Ensure name is not empty
		if menuItem.Name == "" {
			return errors.New("name cannot be empty")
		}
		// Ensure "Location" contains exactly two elements (latitude and longitude)
		if len(menuItem.Location) != 2 {
			return errors.New("location must contain exactly 2 values (latitude, longitude)")
		}

		latitude, longitude := menuItem.Location[0], menuItem.Location[1]
		if latitude < -90.0 || latitude > 90.0 {
			return errors.New("latitude must be between -90 and 90")
		}
		if longitude < -180.0 || longitude > 180.0 {
			return errors.New("longitude must be between -180 and 180")
		}

		if err := ValidateAvgRatingRequest(menuItem.AvgRating); err != nil {
			return err
		}
		return nil
}

func ValidateAvgRatingRequest(avgRating AvgRatingRequest) error {
	// Ensure all ratings are [1,5], if provided
	if avgRating.Portion != nil {
		if *avgRating.Portion < 1 || *avgRating.Portion > 5 {
			return errors.New("portion rating must be between 1 and 5")
		}
	}
	if avgRating.Taste != nil {
		if *avgRating.Taste < 1 || *avgRating.Taste > 5 {
			return errors.New("taste rating must be between 1 and 5")
		}
	}
	if avgRating.Value != nil {
		if *avgRating.Value < 1 || *avgRating.Value > 5 {
			return errors.New("value rating must be between 1 and 5")
		}
	}
	if avgRating.Overall != nil {
		if *avgRating.Overall < 1 || *avgRating.Overall > 5 {
			return errors.New("overall rating must be between 1 and 5")
		}
	}
	return nil
}
func (h *Handler) GetMenuItems(c *fiber.Ctx) error {
	/*
	Min rating, max rating for all fields - figure out how to avoid nulls in db
		return true/false
	radius, longitude and latitude
	limit
	pageination
	tags that should be present - and vs or?
	key words - check if present in name, description ? - and vs or?

	*/
	// err := h.service.GetMenuItem()
	// if err != nil {
	// 	return err
	// }
	return c.SendStatus(fiber.StatusOK)
}

func (h *Handler) GetMenuItemById(c *fiber.Ctx) error {
	id := c.Params("id")
	objID, errID := primitive.ObjectIDFromHex(id)
	if errID != nil {
        // Invalid ID format
        return c.Status(fiber.StatusBadRequest).SendString("Invalid ID format")
    }
	menuItem, err := h.service.GetMenuItemById(objID)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return c.Status(fiber.StatusNotFound).SendString("Menu item not found")
		}
		return err
	}
	return c.Status(fiber.StatusOK).JSON(menuItem)
}

func (h *Handler) CreateMenuItem(c *fiber.Ctx) error {
	var menuItem MenuItemRequest
	if err := c.BodyParser(&menuItem); err != nil {
		return c.Status(fiber.StatusBadRequest).SendString("Invalid request body")
	}
	if err := ValidateMenuItemRequest(menuItem); err != nil {
		return c.Status(fiber.StatusBadRequest).SendString(err.Error())
	}
	menuItem = PreprocessMenuItemRequest(menuItem)

	createdMenuItem, err := h.service.CreateMenuItem(menuItem)
	if err != nil {
		return err
	}
	return c.Status(fiber.StatusOK).JSON(createdMenuItem)
}

/* Updates the menu item with the corresponding ID. Full updates. */
func (h *Handler) UpdateMenuItem(c *fiber.Ctx) error {
	var menuItem MenuItemRequest
	id := c.Params("id")

	objID, errID := primitive.ObjectIDFromHex(id)
	if errID != nil {
        // Invalid ID format
        return c.Status(fiber.StatusBadRequest).SendString("Invalid ID format")
    }

	if err := c.BodyParser(&menuItem); err != nil {
		return c.Status(fiber.StatusBadRequest).SendString("Invalid request body")
	}
	if err := ValidateMenuItemRequest(menuItem); err != nil {
		return c.Status(fiber.StatusBadRequest).SendString(err.Error())
	} 
	menuItem = PreprocessMenuItemRequest(menuItem)
	updatedMenuItem, err := h.service.UpdateMenuItem(objID, menuItem)
	if err != nil {
		if err == mongo.ErrNoDocuments {
            return c.Status(fiber.StatusNotFound).SendString("Menu item not found")
        }
		return err
	}
	return c.Status(fiber.StatusOK).JSON(updatedMenuItem)
}

// func (h *Handler) DeleteMenuItem(c *fiber.Ctx) error {
// 	err := h.service.DeleteMenuItem()
// 	if err != nil {
// 		return err
// 	}
// 	return c.SendStatus(fiber.StatusOK)
// }
