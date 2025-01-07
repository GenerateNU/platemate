package utils

import (
	"go.mongodb.org/mongo-driver/bson"
)

/*
	Enforcing base validations against doucments added to database
*/

func get_validations() map[string]bson.M {
	defaultValidator := bson.M{
		"bsonType": "object",
		"required": []string{"_id"},
		"additionalProperties": true, // generally bad, 
		"properties": bson.M{
			"_id": bson.M{
					"bsonType":    "ObjectId",
					"description": "must be an ObjectID string and is required",
			},
		},
	}

	healthValidator := defaultValidator
	usersValidator := bson.M{
		"bsonType": "object",
		"required": []string{"_id", "name"},
		"additionalProperties": true, // generally bad, 
		"properties": bson.M{
			"_id": bson.M{
					"bsonType":    "ObjectId",
					"description": "must be an ObjectID string and is required",
			},
			"name": bson.M{
				"bson.type": "string",
				"description": "must be a name and is required",
			},
		},
	}

	validations := map[string]bson.M{
		"health": healthValidator,
		"users": usersValidator,
	}

	return validations
}
