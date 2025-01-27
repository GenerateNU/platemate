package user_connections

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type Service struct {
	connections *mongo.Collection
	users       *mongo.Collection
	reviews     *mongo.Collection
}

type Connection struct {
	ID         primitive.ObjectID `bson:"_id,omitempty"`
	FollowerId primitive.ObjectID `bson:"followerId"`
	FolloweeId primitive.ObjectID `bson:"followeeId"`
	CreatedAt  time.Time          `bson:"createdAt"`
	UpdatedAt  time.Time          `bson:"updatedAt"`
}

func newService(collections map[string]*mongo.Collection) *Service {
	return &Service{
		connections: collections["connections"],
		users:       collections["users"],
		reviews:     collections["reviews"],
	}
}
