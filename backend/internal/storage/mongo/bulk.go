package mongo

import (
	"context"
	"fmt"
	"slices"

	"go.mongodb.org/mongo-driver/bson"
)

/*
Perform a collection operation across all environments
  - Do not preform unless given approval from a Tech Lead
*/
func (db *DB) BulkOperation(ctx context.Context, operation CollectionOperation, arg string) error {
	databaseNames, err := db.Client.ListDatabaseNames(ctx, bson.D{})
	databaseNames = filterSystemDatabases(databaseNames)

	if err != nil {
		return fmt.Errorf("failed to list databases: %w", err)
	}
	for _, name := range databaseNames {
		fmt.Print(name)
		if err := operation(ctx, arg); err != nil {
			return fmt.Errorf("failed to perform operation on %s: %w", name, err)
		}
	}
	return nil
}

func filterSystemDatabases(databases []string) []string { 
	systemNames := []string{"local","admin"}
	ret := make([]string,0);
	for _, v := range databases {
		if !slices.Contains(systemNames,v){
			ret = append(ret, v)
		}
	}
	return ret
}