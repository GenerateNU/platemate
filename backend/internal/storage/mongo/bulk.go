package mongo

import (
	"context"
	"fmt"

	"go.mongodb.org/mongo-driver/bson"
)

/*
Perform a collection operation across all environments
  - Do not preform unless given approval from a Tech Lead
*/
func (db *DB) BulkOperation(ctx context.Context, operation CollectionOperation, arg string) error {
	databaseNames, err := db.Client.ListDatabaseNames(ctx, bson.D{})
	if err != nil {
		return fmt.Errorf("failed to list databases: %w", err)
	}
	for _, name := range databaseNames {
		if name == "admin" || name == "local" {
			return fmt.Errorf("cannot perform operation on system databases")
		}
		if err := operation(db.Client.Database(name), arg); err != nil {
			return fmt.Errorf("failed to perform operation on %s: %w", name, err)
		}
	}
	return nil
}
