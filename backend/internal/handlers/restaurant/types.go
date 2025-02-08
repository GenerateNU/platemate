package restaurant

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type RestaurantDocument struct {
	ID primitive.ObjectID `bson:"_id,omitempty" json:"_id,omitempty"`

	Address struct {
		Street   string `bson:"street"   json:"street"`
		Zipcode  string `bson:"zipcode"  json:"zipcode"`
		City     string `bson:"city"     json:"city"`
		Location struct {
			X float64 `bson:"x" json:"x"`
			Y float64 `bson:"y" json:"y"`
		} `bson:"location" json:"location"`
	} `bson:"address" json:"address"`

	MenuItems []primitive.ObjectID `bson:"menuItems" json:"menuItems"`

	RatingAverage struct {
		Overall int `bson:"overall" json:"overall"` // Overall could be a numeric (should be 1-5)
		Return  int `bson:"return" json:"return"`
	} `bson:"ratingAverage" json:"ratingAverage"`

	Name        string   `bson:"name"         json:"name"`
	Style       []string `bson:"style"        json:"style"`
	Picture     []string `bson:"picture"      json:"picture"`
	Description string   `bson:"description"  json:"description"`
	Tags        []string `bson:"tags"         json:"tags"`
}
