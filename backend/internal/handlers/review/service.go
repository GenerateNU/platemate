package review

import (
	"context"

	"math"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

// newService receives the map of collections and picks out reviews
func newService(collections map[string]*mongo.Collection) *Service {
	return &Service{
		reviews:     collections["reviews"],
		restaurants: collections["restaurants"],
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

	// Update restaurant's average review
	if err := s.updateRestaurantAverageRating(r.RestaurantID); err != nil {
		return &r, err
	}

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

// CreateComment adds a new comment to a review
func (s *Service) CreateComment(comment CommentDocument) error {
	ctx := context.Background()
	filter := bson.M{"_id": comment.Review}
	update := bson.M{"$push": bson.M{"comments": comment}}
	res := s.reviews.FindOneAndUpdate(ctx, filter, update)

	return res.Err()
}

/***
*
* GetComments returns all comments for a review
* Sorted by the most recent timestamp
*
 */

func (s *Service) GetComments(reviewID primitive.ObjectID) ([]CommentDocument, error) {
	ctx := context.Background()
	filter := bson.M{"_id": reviewID}
	pipeline := []bson.M{
		{"$match": filter},
		{"$project": bson.M{"comments": 1, "_id": 0}},
		{"$unwind": "$comments"},
		{"$sort": bson.M{"comments.timestamp": -1}},
	}

	cursor, err := s.reviews.Aggregate(ctx, pipeline)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)
	var res []CommentPipelineEntry
	if err := cursor.All(ctx, &res); err != nil {
		return nil, err
	}

	var comments = make([]CommentDocument, 0, len(res))
	for _, entry := range res {
		comments = append(comments, entry.Comments)
	}

	return comments, err
}

// updateRestaurantAverageRating recalculates and updates the average rating for the restaurant
func (s *Service) updateRestaurantAverageRating(restaurantID primitive.ObjectID) error {
	ctx := context.Background()

	// Find all reviews for this restaurant
	filter := bson.M{"restaurantId": restaurantID}
	cursor, err := s.reviews.Find(ctx, filter)
	if err != nil {
		return err
	}
	defer cursor.Close(ctx)

	var reviews []ReviewDocument
	if err := cursor.All(ctx, &reviews); err != nil {
		return err
	}

	if len(reviews) == 0 {
		// No reviews for this restaurant, so average is 0 (could just skip)
		return nil
	}

	// Compute new averages
	var totalOverall float64 // simple average
	var totalReturn float64  // % or count

	for _, review := range reviews {
		totalOverall += float64(review.Rating.Overall)
		if review.Rating.Return {
			totalReturn += 1
		}
	}

	// Cast to int after math for storage
	count := float64(len(reviews))
	 // to 2 decimal places
	avgOverall := int(math.Round(totalOverall / count * 100.0)) / 100.0
	avgReturnPercent := int(math.Round((totalReturn / count) * 100.0)) // 0..100%

	// Update the restaurant's document
	update := bson.M{
		"$set": bson.M{
			"ratingAvg.overall": float64(avgOverall),
			"ratingAvg.return":  avgReturnPercent,
		},
	}

	// Update the restaurant document with the new average
	_, err = s.restaurants.UpdateOne(ctx, bson.M{"_id": restaurantID}, update)
	return err
}

// GetReviewsByUser retrieves all reviews where reviewer.id matches the provided userID
func (s *Service) GetReviewsByUser(userID string) ([]ReviewDocument, error) {
	ctx := context.Background()
	filter := bson.M{"reviewer.id": userID}

	cursor, err := s.reviews.Find(ctx, filter)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var results []ReviewDocument
	if err := cursor.All(ctx, &results); err != nil {
		return nil, err
	}

	// Return empty slice instead of nil if no reviews are found
	if len(results) == 0 {
		return []ReviewDocument{}, nil
	}

	return results, nil
}

// SearchUserReviews fetches reviews from a user, matching the given query in content
func (s *Service) SearchUserReviews(userID, query string) ([]ReviewDocument, error) {
	ctx := context.Background()

	// Build a filter for:
	// - THIS user’s reviews
	// - "content" that (case-insensitive) matches "query"
	// - menuitem
	// - comments.content to search replies or discussions under a review
	// - restaurantId to search with a specific restaurant ID
	filter := bson.M{
		"reviewer.id": userID,
		"$or": []bson.M{
			{"content": bson.M{"$regex": primitive.Regex{Pattern: query, Options: "i"}}},
			{"menuItem": bson.M{"$regex": primitive.Regex{Pattern: query, Options: "i"}}},
			{"restaurantId": bson.M{"$regex": primitive.Regex{Pattern: query, Options: "i"}}},
			{"comments.content": bson.M{"$regex": primitive.Regex{Pattern: query, Options: "i"}}},
		},
	}

	cursor, err := s.reviews.Find(ctx, filter)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var results []ReviewDocument
	if err := cursor.All(ctx, &results); err != nil {
		return nil, err
	}

	// Return an empty slice instead of nil if nothing found
	if len(results) == 0 {
		return []ReviewDocument{}, nil
	}

	return results, nil
}
