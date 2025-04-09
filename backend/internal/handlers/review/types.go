package review

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type CreateReviewParams struct {
	Rating       Rating   `json:"rating"`
	Picture      string   `json:"picture,omitempty"`
	Content      string   `json:"content"`
	Reviewer     Reviewer `json:"reviewer"`
	MenuItem     string   `json:"menuItem"`
	RestaurantID string   `json:"restaurantId"`
}

type ReviewDocument struct {
	ID             primitive.ObjectID `bson:"_id,omitempty" json:"_id,omitempty"`
	Rating         Rating             `bson:"rating" json:"rating"`
	Picture        string             `bson:"picture" json:"picture"`
	Content        string             `bson:"content" json:"content"`
	Reviewer       Reviewer           `bson:"reviewer" json:"reviewer"`
	Timestamp      time.Time          `bson:"timestamp" json:"timestamp"`
	Comments       []CommentDocument  `bson:"comments" json:"comments"`
	MenuItem       primitive.ObjectID `bson:"menuItem" json:"menuItem"`
	RestaurantID   primitive.ObjectID `bson:"restaurantId" json:"restaurantId"`
	MenuItemName   string             `bson:"menuitemName" json:"menuItemName"`
	RestuarantName string             `bson:"restaurantName" json:"restaurantName"`
}

type TopReviewDocument struct {
	ID             primitive.ObjectID `bson:"_id,omitempty" json:"_id,omitempty"`
	Rating         Rating             `bson:"rating" json:"rating"`
	Picture        string             `bson:"picture" json:"picture"`
	Content        string             `bson:"content" json:"content"`
	Reviewer       Reviewer           `bson:"reviewer" json:"reviewer"`
	Timestamp      time.Time          `bson:"timestamp" json:"timestamp"`
	Comments       []CommentDocument  `bson:"comments" json:"comments"`
	MenuItem       primitive.ObjectID `bson:"menuItem" json:"menuItem"`
	RestaurantID   primitive.ObjectID `bson:"restaurantId" json:"restaurantId"`
	AverageRate    float64            `bson:"averageRate" json:"averageRate"`
	Items          []MenuItemDocument `bson:"items" json:"items"`
	MenuItemName   string             `bson:"menuitemName" json:"menuItemName"`
	RestuarantName string             `bson:"restaurantName" json:"restaurantName"`
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
	RestaurantID        primitive.ObjectID   `bson:"restaurantid"`
	RestuarantName      string               `bson:"restaurantName" json:"restaurantName"`
}

type AvgRatingDocument struct {
	Portion float64 `bson:"portion"`
	Taste   float64 `bson:"taste"`
	Value   float64 `bson:"value"`
	Overall float64 `bson:"overall"`
	Return  float64 `bson:"return"` // @TODO: figure out if boolean or number
}

type TopReview struct {
	ReviewDocument
	AverageRate float64 `bson:"averageRate" json:"averageRate"`
	Items       []any   `bson:"items" json:"items"`
}

// Rating is a nested struct in ReviewDocument.
type Rating struct {
	Portion int  `bson:"portion" json:"portion"`
	Taste   int  `bson:"taste" json:"taste"`
	Value   int  `bson:"value" json:"value"`
	Overall int  `bson:"overall" json:"overall"`
	Return  bool `bson:"return" json:"return"`
}

// Reviewer is a nested struct in ReviewDocument.
type Reviewer struct {
	ID       primitive.ObjectID `bson:"_id"       json:"_id"`
	PFP      string             `bson:"pfp"      json:"pfp"`
	Username string             `bson:"username" json:"username"`
	Name     string             `bson:"name" json:"name"`
}

type Commenter struct {
	ID       primitive.ObjectID `bson:"_id"       json:"_id"`
	PFP      string             `bson:"pfp"      json:"pfp"`
	Username string             `bson:"username" json:"username"`
}
type Mention struct {
	ID       string `bson:"_id"       json:"_id"`
	Username string `bson:"username" json:"username"`
}

type CommentDocument struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"_id,omitempty"`
	Content   string             `bson:"content" json:"content"`
	Timestamp time.Time          `bson:"timestamp" json:"timestamp"`
	Review    primitive.ObjectID `bson:"review" json:"review"`
	User      Commenter          `bson:"user" json:"user"`
	Mention   []Mention          `bson:"mentions,omitempty" json:"mentions,omitempty"`
}

type CreateCommentParams struct {
	Content  string    `validate:"required" json:"content"`
	Review   string    `validate:"required" json:"review"`
	User     Commenter `validate:"required" json:"user"`
	Mentions []Mention `json:"mentions,omitempty"`
}

type CommentPipelineEntry struct {
	Comments CommentDocument `bson:"comments" json:"comments"`
}
type CommentPipelineResult struct {
	Comments []CommentPipelineEntry `bson:"comments" json:"comments"`
}

/*
Review Service to be used by Review Handler to interact with the
Database layer of the application
*/
type Service struct {
	reviews     *mongo.Collection
	restaurants *mongo.Collection
	menuItems   *mongo.Collection
}
