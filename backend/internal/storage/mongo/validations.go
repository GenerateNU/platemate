package mongo

import "go.mongodb.org/mongo-driver/bson"

/*
Enforcing base validations against doucments added to database
*/
var (
	validations = map[string]bson.M{
		"health":     healthValidator,
		"users":      usersValidator,
		"menu-items": menuItemsValidator,
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
	menuItemsValidator = bson.M{
		"bsonType": "object",
		"required": []string{
			"_id",
			"name",
			"avgRating",
			"picture",
			"reviews",
			"description",
			"location",
			"tags",
			"dietaryRestrictions",
		},
		"properties": bson.M{
			"_id": bson.M{
				"bsonType": "objectId",
			},
			"name": bson.M{
				"bsonType": "string",
			},
			"picture": bson.M{
				"bsonType": "string",
			},
			"avgRating": bson.M{
				"bsonType": "object",
				"properties": bson.M{
					"portion": bson.M{
						"bsonType":    bson.M{"$in": []string{"double", "null"}},
						"description": "Rating for portion size",
					},
					"taste": bson.M{
						"bsonType":    bson.M{"$in": []string{"double", "null"}},
						"description": "Rating for taste",
					},
					"value": bson.M{
						"bsonType":    bson.M{"$in": []string{"double", "null"}},
						"description": "Rating for value",
					},
					"overall": bson.M{
						"bsonType":    bson.M{"$in": []string{"double", "null"}},
						"description": "Overall rating",
					},
					"return": bson.M{
						"bsonType":    bson.M{"$in": []string{"bool", "null"}},
						"description": "Would you return?",
					},
				},
			},
			"reviews": bson.M{
				"bsonType": "array",
				"items": bson.M{
					"bsonType": "string",
				},
			},
			"description": bson.M{
				"bsonType": "string",
			},
			"location": bson.M{
				"bsonType": "array",
				"items": bson.M{
					"bsonType": "double",
				},
				"minItems": 2,
				"maxItems": 2,
			},
			"tags": bson.M{
				"bsonType": "array",
				"items": bson.M{
					"bsonType": "string",
				},
			},
			"dietaryRestrictions": bson.M{
				"bsonType": "array",
				"items": bson.M{
					"bsonType": "string",
				},
			},
		},
	}
)
