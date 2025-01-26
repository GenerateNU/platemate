from pymongo import MongoClient
client = MongoClient("mongodb+srv://dev:r1wAXK6GvHSODuLs@development.t8bgq.mongodb.net/?retryWrites=true&w=majority")
db = client['dev-restaurants-api']
collection = db['restaurants']

restaurants = [
      {
         "address": {
            "street": "123 Main St",
            "city": "Boston",
            "zipcode": "02108",
            "state": "MA",
            "location": [-71.0596, 42.3601],
        },
        "menuItems": [],
        "ratingAvg": {
            "overall": 4.5,
            "return": True,
        },
        "name": "Gourmet Kitchen",
        "style": ["Italian", "Casual Dining"],
        "picture": "https://example.com/images/gourmet-kitchen.jpg",
        "description": "A cozy spot offering authentic Italian cuisine with a modern twist.",
        "tags": ["pasta", "wine", "romantic", "family-friendly"],
    },
    {
        "address": {
            "street": "456 Elm St",
            "city": "Cambridge",
            "zipcode": "02139",
            "state": "MA",
            "location": [-71.1056, 42.3736],
        },
        "menuItems": [],
        "ratingAvg": {
            "overall": -1,
            "return": False,
        },
        "name": "Cafe Delight",
        "style": ["Cafe", "Quick Bites"],
        "picture": "https://example.com/images/cafe-delight.jpg",
        "description": "A delightful cafe serving freshly brewed coffee and quick bites.",
        "tags": ["coffee", "breakfast", "pastries"],
    },
]
def insert_db(restaurants):
    for place in restaurants:
            collection.insert_one(place)

insert_db(restaurants)
