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
		"reviews":    bson.M{"$jsonSchema": reviewsValidator},
	}

	defaultValidator = bson.M{
		"bsonType":             "object",
		"required":             []string{"_id"},
		"additionalProperties": true, // generally bad,
		"properties": bson.M{
			"_id": bson.M{
				"bsonType":    "objectId",
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
					"bsonType": "objectId",
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
	reviewsValidator = bson.M{
		"bsonType":             "object",
		"title":                "Review Validation",
		"required":             []string{"_id","picture","content","reviewer","timestamp","menuItem", "comments"},
		"additionalProperties": true, // generally bad,
		"properties": bson.M{
			"_id": bson.M{
				"bsonType":    "objectId",
				"description": "must be an ObjectID string and is required",
			},
			"rating": bson.M{
				"bsonType":    "object",
				"description": "Rating for portion size",
				"properties": bson.M{
					"portion": bson.M{
						// interger between 1 and 5 inclusive
						"bsonType":    "int",
						"minimum":     1,
						"maximum":     5,
						"description": "Rating for portion size between 1 and 5",
					},
					"taste": bson.M{
						// interger between 1 and 5 inclusive
						"bsonType":    "int",
						"minimum":     1,						
						"maximum":     5,		
						"description": "Rating for taste",
					},	
					"value": bson.M{
						// interger between 1 and 5 inclusive
						"bsonType":    "int",
						"minimum":     1,
						"maximum":     5,			
						"description": "Rating for value",
					},
					"overall": bson.M{
						// interger between 1 and 5 inclusive
						"bsonType":    "int",
						"minimum":     1,
						"maximum":     5,				
						"description": "Overall rating",
					},
				},
			},
			"picture": bson.M{
				// url
				"bsonType": "string",
				"description": "URL of the picture",
			},
			"content": bson.M{
				// url
				"bsonType": "string",
				"description": "Content of the review",
			},
			"reviewer": bson.M{
				"bsonType": "object",
				"properties": bson.M{
					"_id": bson.M{
						"bsonType": "objectId",
						"description": "must be an ObjectID string and is required",
					},
					"pfp": bson.M{
						"bsonType": "string",
						"description": "URL of the PFP of the reviewer",
					},
					"username": bson.M{
						"bsonType": "string",
						"description": "Username of the reviewer",
					},
				},
			},
			"timestamp": bson.M{
				// "date-time"
				"bsonType": "date",
				"description": "Timestamp of the review",
			},
			"comments": bson.M{
				"bsonType": "array",
				"items": bson.M{
					"bsonType": "object",
					"properties": bson.M{
						"_id": bson.M{
							"bsonType": "objectId",
							"description": "ID of the comment",
						},
						"content": bson.M{
							"bsonType": "string",
							"description": "Content of the comment",
						},
						"timestamp": bson.M{
							"bsonType": "date",
							"description": "Timestamp of the comment",
						},
						"review": bson.M{
							"bsonType": "objectId",
							"description": "ID of the review",
						},
						"user": bson.M{
							"bsonType": "object",
							"properties": bson.M{
								"_id": bson.M{
									"bsonType": "objectId",
									"description": "ID of the user leavin the comment",
								},
								"pfp": bson.M{
									"bsonType": "string",
									"description": "URL of the PFP of the user leaving the comment",
								},
								"username": bson.M{
									"bsonType": "string",
									"description": "Username of the user leaving the comment",
								},
							},							
						},

						
					},	 	
				},		  		   			    				     					  	
			},
			"menuItem": bson.M{
				//string
				"bsonType": "string",
				"description": "Name of the menu item",
			},
	}}
	
)
