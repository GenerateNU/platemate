package review

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type CreateReviewParams struct {
	Rating   Rating   `json:"rating"`
	Picture  string   `json:"picture,omitempty"`
	Content  string   `json:"content"`
	Reviewer Reviewer `json:"reviewer"`
	MenuItem string   `json:"menuItem"`
}

type ReviewDocument struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"_id,omitempty"`
	Rating    Rating             `bson:"rating" json:"rating"`
	Picture   string             `bson:"picture" json:"picture"`
	Content   string             `bson:"content" json:"content"`
	Reviewer  Reviewer           `bson:"reviewer" json:"reviewer"`
	Timestamp time.Time          `bson:"timestamp" json:"timestamp"`
	Comments  []CommentDocument  `bson:"comments" json:"comments"`
	MenuItem  string             `bson:"menuItem" json:"menuItem"`
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
	ID       string `bson:"id"       json:"id"`
	PFP      string `bson:"pfp"      json:"pfp"`
	Username string `bson:"username" json:"username"`
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
	reviews *mongo.Collection
}
