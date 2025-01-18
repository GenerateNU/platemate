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

// TODO: 
// type SortBy string
// const (
//     SortByAlphabetical SortBy = "name"
//     SortByRatingOverall SortBy = "avgRating.overall"
//     SortByRatingTaste SortBy = "avgRating.taste"
//     SortByRatingValue SortBy = "avgRating.value"
//     SortByRatingPortion SortBy = "avgRating.portion"
// )

// NOTE: for primitive types default tag will always be applied, even if someone intientally
// sets a field to the default/zero value set by Golang--in such cases, use *int, *bool, etc.
type MenuItemsQuery struct {
    MinRatingPortion *int `query:"minRatingPortion"`
    MaxRatingPortion *int `query:"maxRatingPortion"`
    MinRatingTaste *int `query:"minRatingTaste"`
    MaxRatingTaste *int `query:"maxRatingTaste"`
    MinRatingValue *int `query:"minRatingValue"`
    MaxRatingValue *int `query:"maxRatingValue"`
    MinRatingOverall *int `query:"minRatingOverall"`
    MaxRatingOverall *int `query:"maxRatingOverall"`
    // Radius *int `query:"radius"`
    // Latitude *float64 `query:"latitude"`
    // Longitude *float64 `query:"longitude"`
    Tags []string `query:"tags"`
    DietaryRestrictions []string `query:"dietaryRestrictions"`
    // Keywords []string `query:"keywords"`
    Limit int `query:"limit,default:10"`
    Skip int `query:"skip"`
	// SortBy SortBy `query:"sortBy,default:name"`
	// Desc bool `query:"desc"`
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
		if err := ValidateLocation(menuItem.Location); err != nil {
			return err
		}
		if err := ValidateAvgRatingRequest(menuItem.AvgRating); err != nil {
			return err
		}
		return nil
}

func ValidateLocation(location []float64) error {
	if len(location) != 2 {
		return errors.New("location must contain exactly 2 values (latitude, longitude)")
	}
	latitude, longitude := location[0], location[1]
	if latitude < -90.0 || latitude > 90.0 {
		return errors.New("latitude must be between -90 and 90")
	}
	if longitude < -180.0 || longitude > 180.0 {
		return errors.New("longitude must be between -180 and 180")
	}
	return nil
}

func ValidateAvgRatingRequest(avgRating AvgRatingRequest) error {
	// Ensure all ratings are [1,5], if provided
	ratings := []*float64{avgRating.Portion, avgRating.Taste, avgRating.Value, avgRating.Overall}

	// Loop through each rating field
	for _, rating := range ratings {
		if rating != nil {
			if err := ValidateRating(*rating); err != nil {
				return err
			}
		}
	}
	return nil
}

func ValidateRating(rating float64) error {
	if rating < 1 || rating > 5 {
		return errors.New("rating must be between 1 and 5")
	}
	return nil
}

//TODO: query param validation
/*
- 1<= min <= max <= 5
- 0 <= latitude <= 90
- 0 <= longitude <= 180
- radius > 0
- skip >= 0
- limit > 0
- figure out if queryparser splits for arrays
*/
func (h *Handler) GetMenuItems(c *fiber.Ctx) error {
	/*
	Min rating, max rating for all fields - figure out how to avoid nulls in db
		return true/false
	radius, longitude and latitude
	limit
	pageination
	tags that should be present - and vs or?
	key words - check if present in name, description ? - and vs or?
	sort by:
		- rating
		- distance
		- alphabetically
		- number of reviews
	*/
	//TODO: some way to search by name... unsure

	// Parse query parameters
	var queryParams MenuItemsQuery
	if err := c.QueryParser(&queryParams); err != nil {
		return c.Status(fiber.StatusBadRequest).SendString("Invalid query parameters")
	}
	menuItems, err := h.service.GetMenuItems(queryParams)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).SendString("Internal server error")
	}
	return c.Status(fiber.StatusOK).JSON(menuItems)

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

func (h *Handler) DeleteMenuItem(c *fiber.Ctx) error {
	id := c.Params("id")

	objID, errID := primitive.ObjectIDFromHex(id)
	if errID != nil {
        // Invalid ID format
        return c.Status(fiber.StatusBadRequest).SendString("Invalid ID format")
    }

	menuItemDeleted, err := h.service.DeleteMenuItem(objID)
	if err != nil {
		if err == mongo.ErrNoDocuments {
            return c.Status(fiber.StatusNotFound).SendString("Menu item not found")
        }
		return err
	}
	return c.Status(fiber.StatusOK).JSON(menuItemDeleted)
}
