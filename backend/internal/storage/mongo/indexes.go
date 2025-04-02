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

type VectorIndex struct {
	Collection string
	Model      mongo.SearchIndexModel
}

// Defines the structs used for the index definition
type vectorDefinitionField struct {
	Type          string `bson:"type"`
	Path          string `bson:"path"`
	NumDimensions int    `bson:"numDimensions"`
	Similarity    string `bson:"similarity"`
	Quantization  string `bson:"quantization"`
}
type vectorDefinition struct {
	Fields []vectorDefinitionField `bson:"fields"`
}

var VectorIndexes = []VectorIndex{
	{
		Collection: "menuItems",
		// create a vector index on the taste_profile field
		Model: mongo.SearchIndexModel{
			Definition: bson.D{
				{Key: "fields", Value: bson.A{
					bson.D{
						{Key: "type", Value: "vector"},
						{Key: "path", Value: "taste_profile"},
						{Key: "numDimensions", Value: 1536},
						{Key: "similarity", Value: "dotProduct"},
						{Key: "quantization", Value: "scalar"},
					},
					bson.D{
						{Key: "type", Value: "filter"},
						{Key: "path", Value: "restaurantid"},
					},
				}},
			},
			Options: options.SearchIndexes().SetName("taste_profile_item").SetType("vectorSearch"),
		},
	},
	{
		Collection: "users",
		// create a vector index on the taste_profile field
		Model: mongo.SearchIndexModel{
			Definition: vectorDefinition{
				Fields: []vectorDefinitionField{{
					Type:          "vector",
					Path:          "taste_profile",
					NumDimensions: 1536,
					Similarity:    "dotProduct",
					Quantization:  "scalar"}},
			},
			Options: options.SearchIndexes().SetName("taste_profile").SetType("vectorSearch"),
		},
	},
}

/*
Indexes to be applied to the database.
*/
var Indexes = []Index{
	{
		Collection: "users",
		// create a vector index on the taste_profile field
		Model: mongo.IndexModel{
			Keys:    bson.M{"email": 1},
			Options: options.Index().SetUnique(true)},
	},
	{
		Collection: "passwordResets",
		Model:      mongo.IndexModel{Keys: bson.M{"expiresAt": 1}, Options: options.Index().SetExpireAfterSeconds(0)},
	},
	{
		Collection: "menuItems",
		Model: mongo.IndexModel{
			Keys: bson.D{
				{Key: "name", Value: "text"},
				{Key: "description", Value: "text"},
				{Key: "tags", Value: "text"},
				{Key: "dietaryRestrictions", Value: "text"},
			},
			Options: options.Index().SetName("menu_item_text_index"),
		},
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
