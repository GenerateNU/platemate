/* global use, db */
// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

// The current database to use.
use('Featurethon');

// Search for documents in the current collection.
db.getCollection('menuItems')
	.find(
		{
			_id: ObjectId('67e33703f958ba76a112cdbd'),
			/*
			 * Filter
			 * fieldA: value or expression
			 */
		},
		{
			/*
			 * Projection
			 * _id: 0, // exclude _id
			 * fieldA: 1 // include field
			 */
		},
	)
	.sort({
		/*
		 * fieldA: 1 // ascending
		 * fieldB: -1 // descending
		 */
	});
