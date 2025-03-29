package restaurant

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type RestaurantDocument struct {
	ID   primitive.ObjectID `bson:"_id,omitempty" json:"_id,omitempty"`
	Name string             `bson:"name"         json:"name"`

	Address struct {
		Street   string    `bson:"street"   json:"street"`
		Zipcode  string    `bson:"zipcode"  json:"zipcode"`
		State    string    `bson:"state"     json:"state"`
		Location []float64 `bson:"location,truncate" json:"location"`
	} `bson:"address" json:"address"`

	MenuItems []primitive.ObjectID `bson:"menuItems" json:"menuItems"`

	RatingAvg struct {
		Overall int `bson:"overall" json:"overall"` // Overall could be a numeric (should be 1-5)
		Return  int `bson:"return" json:"return"`
	} `bson:"ratingAvg" json:"ratingAvg"`

	Style       []string `bson:"style"        json:"style"`   // could be an array
	Picture     string   `bson:"picture"      json:"picture"` // could be an array
	Description string   `bson:"description"  json:"description"`
	Tags        []string `bson:"tags"         json:"tags"`
}

type FriendsFav struct {
	IsFriendsFav    bool `json:"friends_fav"`
	FriendsReviewed int  `json:"friends_reviewed"`
}
