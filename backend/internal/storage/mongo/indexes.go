package mongo

import (
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

/*
Indexes struct
*/
type Index struct {
	Collection string
	Model      mongo.IndexModel
}

/*
Indexes to be applied to the database.
*/
var Indexes = []Index{
	{
		Collection: "users",
		Model:      mongo.IndexModel{Keys: bson.M{"email": 1}, Options: options.Index().SetUnique(true)},
	},
	{
		Collection: "passwordResets",
		Model:      mongo.IndexModel{Keys: bson.M{"expiresAt": 1}, Options: options.Index().SetExpireAfterSeconds(0)},
	},
	{
		Collection: "restaurants",
		Model: mongo.IndexModel{
			Keys: bson.D{
				{Key: "name", Value: "text"},
				{Key: "description", Value: "text"},
				{Key: "style", Value: "text"},
				{Key: "tags", Value: "text"},
			},
			Options: options.Index().SetName("restaurant_text_index"),
		},
	},
}
