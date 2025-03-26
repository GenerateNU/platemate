package menu_items

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type AvgRatingRequest struct {
	Portion *float64 `json:"portion"`
	Taste   *float64 `json:"taste"`
	Value   *float64 `json:"value"`
	Overall *float64 `json:"overall"`
	Return  *bool    `json:"return"`
}

type MenuItemRequest struct {
	Name                string           `json:"name"`
	Picture             string           `json:"picture"`
	AvgRating           AvgRatingRequest `json:"avgRating"`
	Reviews             []string         `json:"reviews"`
	Description         string           `json:"description"`
	Location            []float64        `json:"location"`
	Tags                []string         `json:"tags"`
	DietaryRestrictions []string         `json:"dietaryRestrictions"`
}

type MenuItemResponse struct {
	ID string `json:"id"`
	MenuItemRequest
}

type MenuItemsQuery struct {
	MinRatingPortion    *float64 `query:"minRatingPortion"`
	MaxRatingPortion    *float64 `query:"maxRatingPortion"`
	MinRatingTaste      *float64 `query:"minRatingTaste"`
	MaxRatingTaste      *float64 `query:"maxRatingTaste"`
	MinRatingValue      *float64 `query:"minRatingValue"`
	MaxRatingValue      *float64 `query:"maxRatingValue"`
	MinRatingOverall    *float64 `query:"minRatingOverall"`
	MaxRatingOverall    *float64 `query:"maxRatingOverall"`
	Tags                []string `query:"tags"`
	DietaryRestrictions []string `query:"filter"`
	Limit               *int     `query:"limit"`
	Skip                int      `query:"skip"`
	SortBy              string   `query:"sortBy"`    // Could also be an enum if needed
	SortOrder           string   `query:"sortOrder"` // “asc” or “desc"
	Name                string   `query:"name"`
	Longitude           *float64 `query:"longitude"`
	Latitude            *float64 `query:"latitude"`
}

type MenuItemReviewQuery struct {
	UserID *string `query:"userID"`
}

/*
Menu Items Service to be used by Menu Items Handler to interact with the
Database layer of the application
*/
type Service struct {
	menuItems *mongo.Collection
	reviews   *mongo.Collection
	users     *mongo.Collection
}

type PopularWithFriendsQuery struct {
	UserId string `query:"userId" validate:"required"`
	Limit  int    `query:"limit"`
}

type MenuItemDocument struct {
	ID                  primitive.ObjectID   `bson:"_id,omitempty"`
	Name                string               `bson:"name"`
	Picture             string               `bson:"picture"`
	AvgRating           AvgRatingDocument    `bson:"avgRating,omitempty"`
	Reviews             []primitive.ObjectID `bson:"reviews"`
	Description         string               `bson:"description"`
	Location            []float64            `bson:"location"`
	Tags                []string             `bson:"tags"`
	DietaryRestrictions []string             `bson:"dietaryRestrictions"`
}

type AvgRatingDocument struct {
	Portion *float64 `bson:"portion"`
	Taste   *float64 `bson:"taste"`
	Value   *float64 `bson:"value"`
	Overall *float64 `bson:"overall"`
	Return  *bool    `bson:"return"` // @TODO: figure out if boolean or number
}
