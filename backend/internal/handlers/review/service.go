package review

import (
	"context"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type ReviewDocument struct {
	ID        primitive.ObjectID       `bson:"_id,omitempty" json:"_id,omitempty"`
	Rating    Rating                   `bson:"rating" json:"rating"`
	Picture   string                   `bson:"picture" json:"picture"`
	Content   string                   `bson:"content" json:"content"`
	Reviewer  Reviewer                 `bson:"reviewer" json:"reviewer"`
	Timestamp time.Time                `bson:"timestamp" json:"timestamp"`
	Comments  []map[string]interface{} `bson:"comments,omitempty" json:"comments,omitempty"`
	MenuItem  string                   `bson:"menuItem" json:"menuItem"`
}

// Rating is a nested struct in ReviewDocument.
type Rating struct {
	Portion int  `bson:"portion" json:"portion"`
	Taste   int  `bson:"taste" json:"taste"`
	Value   int  `bson:"value" json:"value"`
	Overall int  `bson:"overall" json:"overall"`
	Return  bool `bson:"return,omitempty" json:"return,omitempty"`
}

// Reviewer is a nested struct in ReviewDocument.
type Reviewer struct {
	ID       string `bson:"id"       json:"id"`
	PFP      string `bson:"pfp"      json:"pfp"`
	Username string `bson:"username" json:"username"`
}

/*
Review Service to be used by Review Handler to interact with the
Database layer of the application
*/
type Service struct {
	reviews *mongo.Collection
}

// newService receives the map of collections and picks out reviews
func newService(collections map[string]*mongo.Collection) *Service {
	return &Service{
		reviews: collections["reviews"],
	}
}

// GetAllReviews fetches all review documents from MongoDB
func (s *Service) GetAllReviews() ([]ReviewDocument, error) {
	ctx := context.Background()
	cursor, err := s.reviews.Find(ctx, bson.M{})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var results []ReviewDocument
	if err := cursor.All(ctx, &results); err != nil {
		return nil, err
	}
	return results, nil
}

// GetReviewByID returns a single review document by its ObjectID
func (s *Service) GetReviewByID(id primitive.ObjectID) (*ReviewDocument, error) {
	ctx := context.Background()
	filter := bson.M{"_id": id}

	var review ReviewDocument
	err := s.reviews.FindOne(ctx, filter).Decode(&review)
	if err == mongo.ErrNoDocuments {
		// No matching review found
		return nil, mongo.ErrNoDocuments
	} else if err != nil {
		// Different error occurred
		return nil, err
	}

	return &review, nil
}

// InsertReview adds a new review document
func (s *Service) InsertReview(r ReviewDocument) (*ReviewDocument, error) {
	ctx := context.Background()

	// Insert the document into the collection
	result, err := s.reviews.InsertOne(ctx, r)
	if err != nil {
		return nil, err
	}

	// Cast the inserted ID to ObjectID
	r.ID = result.InsertedID.(primitive.ObjectID)
	return &r, nil
}

// UpdateReview updates an existing review document by ObjectID.
func (s *Service) UpdateReview(id primitive.ObjectID, updated ReviewDocument) error {
	ctx := context.Background()
	filter := bson.M{"_id": id}

	// Keep original timestamp if not updating
	if updated.Timestamp.IsZero() {
		original, err := s.GetReviewByID(id)
		if err != nil {
			return err
		}
		updated.Timestamp = original.Timestamp
	}

	updateFields := bson.M{
		"rating":    updated.Rating,
		"picture":   updated.Picture,
		"content":   updated.Content,
		"reviewer":  updated.Reviewer,
		"comments":  updated.Comments,
		"menuItem":  updated.MenuItem,
		"timestamp": updated.Timestamp,
	}

	update := bson.M{"$set": updateFields}

	_, err := s.reviews.UpdateOne(ctx, filter, update)
	return err
}

// UpdatePartialReview updates only specified fields of a review document by ObjectID.
func (s *Service) UpdatePartialReview(id primitive.ObjectID, updated ReviewDocument) error {
	ctx := context.Background()
	filter := bson.M{"_id": id}

	updateFields := bson.M{}

	// Add fields to the update document only if they are not empty or zero-valued
	if updated.Rating != (Rating{}) {
		updateFields["rating"] = updated.Rating
	}
	if updated.Picture != "" {
		updateFields["picture"] = updated.Picture
	}
	if updated.Content != "" {
		updateFields["content"] = updated.Content
	}
	if updated.Reviewer != (Reviewer{}) {
		updateFields["reviewer"] = updated.Reviewer
	}
	if len(updated.Comments) > 0 {
		updateFields["comments"] = updated.Comments
	}
	if updated.MenuItem != "" {
		updateFields["menuItem"] = updated.MenuItem
	}
	if !updated.Timestamp.IsZero() {
		updateFields["timestamp"] = updated.Timestamp
	}

	// Check if there is anything to update
	if len(updateFields) == 0 {
		return nil
	}

	update := bson.M{"$set": updateFields}

	_, err := s.reviews.UpdateOne(ctx, filter, update)
	return err
}

// DeleteReview removes a review document by ObjectID.
func (s *Service) DeleteReview(id primitive.ObjectID) error {
	ctx := context.Background()
	filter := bson.M{"_id": id}

	_, err := s.reviews.DeleteOne(ctx, filter)
	return err
}
