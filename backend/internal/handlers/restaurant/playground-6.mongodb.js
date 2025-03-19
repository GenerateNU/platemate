// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

// The current database to use.
use('dev-pop-with-friends');

// Create a new document in the collection.
db.getCollection('reviews').insertOne({
    {
        "_id": {
          "$oid": "000000000000000000000008"
        },
        "rating": {
          "portion": 5,
          "taste": 5,
          "value": 4,
          "overall": 5,
          "return": true
        },
        "picture": "",
        "content": "Best cheeseburger ever!",
        "reviewer": {
          "id": "000000000000000000000002",
          "pfp": "",
          "username": "Bob"
        },
        "timestamp": {
          "$date": "2025-03-15T17:50:02.899Z"
        },
        "comments": [],
        "menuItem": "000000000000000000000004",
        "restaurantId": {
          "$oid": "000000000000000000000007"
        }
    }
});
