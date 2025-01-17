package menu_items

import (
	"github.com/gofiber/fiber/v2"
	"log/slog"
	"errors"    
	"go.mongodb.org/mongo-driver/mongo"

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
	Value *float64 `json:"value"` // implement the validation for ranges
	Overall *float64 `json:"overall"`
	Return *bool `json:"return"` // @TODO: figure out if boolean or number
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


func ValidateMenuItemRequest(menuItem MenuItemRequest) error {
		// Ensure name is not empty
		if menuItem.Name == "" {
			return errors.New("name cannot be empty")
		}
		// Ensure "Location" contains exactly two elements (latitude and longitude)
		if len(menuItem.Location) != 2 {
			return errors.New("location must contain exactly 2 values (latitude, longitude)")
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
// func (h *Handler) GetMenuItem(c *fiber.Ctx) error {
// 	/*
// 	Min rating, max rating
// 	radius, longitude and latitude
// 	limit
// 	pageination
// 	tags that should be present
// 	name should match completely?
// 	how to filter by words in description/name
// 	*/
// 	err := h.service.GetMenuItem()
// 	if err != nil {
// 		return err
// 	}
// 	return c.SendStatus(fiber.StatusOK)
// }

func (h *Handler) CreateMenuItem(c *fiber.Ctx) error {
	var menuItem MenuItemRequest
	if err := c.BodyParser(&menuItem); err != nil {
		return c.Status(fiber.StatusBadRequest).SendString("Invalid request body")
	}
	if err := ValidateMenuItemRequest(menuItem); err != nil {
		return c.Status(fiber.StatusBadRequest).SendString(err.Error())
	}
	slog.Info("Received MenuItemRequest", "menuItem", menuItem)

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
	if err := c.BodyParser(&menuItem); err != nil {
		return c.Status(fiber.StatusBadRequest).SendString("Invalid request body")
	}
	if err := ValidateMenuItemRequest(menuItem); err != nil {
		return c.Status(fiber.StatusBadRequest).SendString(err.Error())
	} 
	updatedMenuItem, err := h.service.UpdateMenuItem(id, menuItem)
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
