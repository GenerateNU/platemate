package mongo

import "go.mongodb.org/mongo-driver/bson"

/*
Enforcing base validations against doucments added to database
*/
var (
	validations = map[string]bson.M{
		"health": healthValidator,
		"users":  usersValidator,
	}
	defaultValidator = bson.M{
		"bsonType":             "object",
		"required":             []string{"_id"},
		"additionalProperties": true, // generally bad,
		"properties": bson.M{
			"_id": bson.M{
				"bsonType":    "ObjectId",
				"description": "must be an ObjectID string and is required",
			},
		},
	}

	encryptedFieldsMap = bson.M{
		"fields": []bson.M{
			bson.M{
				"keyId":    nil,
				"path":     "patientRecord.ssn",
				"bsonType": "string",
				"queries": []bson.M{
					{
						"queryType": "equality",
					},
				},
			},
		},
	}

	healthValidator = defaultValidator

	usersValidator = bson.M{
		"bsonType":             "object",
		"required":             []string{"_id", "name"},
		"additionalProperties": true, // generally bad,
		"properties": bson.M{
			"_id": bson.M{
				"bsonType":    "ObjectId",
				"description": "must be an ObjectID string and is required",
			},
			"name": bson.M{
				"bson.type":   "string",
				"description": "must be a string and is required",
			},
		},
	}
)
