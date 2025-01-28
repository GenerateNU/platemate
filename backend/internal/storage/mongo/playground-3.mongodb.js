// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

// The current database to use.
use('Dev');

// Create a new document in the collection.
db.getCollection('reviews').insertOne({
	_id: new ObjectId('64b4b65727a4f2580f7f11b5'),
	rating: {
		portion: 5,
		taste: 4,
		value: 4,
		overall: 5,
	},
	picture: 'https://example.com/images/review-pic.jpg',
	content: 'The dish was exceptional with a balanced flavor and good value for the price.',
	reviewer: {
		pfp: 'https://example.com/images/user-pfp.jpg',
		username: 'foodie_guru',
		_id: new ObjectId('64b4b65727a4f2580f7f11b5'),
	},
	timestamp: {
		$date: '2025-01-17T15:30:00Z',
	},
	comments: [],
	menuItem: 'Grilled Salmon',
});
