package mongo

import (
	"context"
	"encoding/base64"
	"fmt"
	"os"
	"slices"

	"github.com/GenerateNU/platemate/internal/config"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type DB struct {
	Client      *mongo.Client
	DB          *mongo.Database
	Collections map[string]*mongo.Collection
	ClientEncryption *mongo.ClientEncryption
	Key []byte
}

func New(ctx context.Context, cfg config.Atlas) (*DB, error) {
	key, err := os.ReadFile("./internal/storage/mongo/customer-master-key.txt")

	if err != nil {
		return nil, fmt.Errorf("failed to fetch customer key: %w", err)
	} 

	client, clientEncryption, err := connectClient(ctx, cfg.URI(), key)
	if err != nil {
		return nil, fmt.Errorf("failed to setup client: %w", err)
	}
	if err := validateEnvironment(ctx, client, cfg.Environment); err != nil {
		return nil, err
	}
	db := client.Database(cfg.Environment)
	collections, err := setupCollections(ctx, db)
	if err != nil {
		return nil, err
	}
	return &DB{
		Client:      client,
		DB:          db,
		Collections: collections,
		ClientEncryption: clientEncryption,
		Key: key,
	}, nil
}

func connectClient(ctx context.Context, uri string, key []byte) (*mongo.Client, *mongo.ClientEncryption, error) {
	keyVaultDatabaseName := "encryption"
	keyVaultCollectionName := "__keyVault"
	keyVaultNamespace := keyVaultDatabaseName + "." + keyVaultCollectionName
  decodedKey, err := base64.StdEncoding.DecodeString(string(key))

	kmsProviderCredentials := map[string]map[string]interface{}{
		"local": {"key": decodedKey},
	}
	cryptSharedLibraryPath := map[string]interface{}{
		"cryptSharedLibPath": "internal/storage/mongo/crypt_mac/mongo_crypt_v1.dylib", // Path to your Automatic Encryption Shared Library
	}

	autoEncryptionOptions := options.AutoEncryption().
		SetKeyVaultNamespace(keyVaultNamespace).
		SetKmsProviders(kmsProviderCredentials).
		SetExtraOptions(cryptSharedLibraryPath)

	encOpts := options.ClientEncryption().
		SetKeyVaultNamespace(keyVaultNamespace).
		SetKmsProviders(kmsProviderCredentials)

	serverAPI := options.ServerAPI(options.ServerAPIVersion1)
	opts := options.Client().ApplyURI(uri).SetServerAPIOptions(serverAPI).SetAutoEncryptionOptions(autoEncryptionOptions)
	
	client, err := mongo.Connect(ctx, opts)

	if err != nil {
		return nil, nil, fmt.Errorf("failed to connect to database: %w", err)
	}

	clientEncryption, err := mongo.NewClientEncryption(client, encOpts)

	if err != nil {
		return nil, nil, fmt.Errorf("failed to connect to database: %w", err)
	}
	if err := client.Ping(ctx, nil); err != nil {
		return nil, nil, fmt.Errorf("failed to ping database: %w", err)
	}
	return client, clientEncryption, nil
}

func validateEnvironment(ctx context.Context, client *mongo.Client, environment string) error {
	envList, err := client.ListDatabaseNames(ctx, bson.D{})
	if err != nil {
		return fmt.Errorf("failed to list databases: %w", err)
	}
	if !slices.Contains(envList, environment) {
		return fmt.Errorf("invalid database environment passed. choose from the following: %v", envList)
	}
	return nil
}

func setupCollections(ctx context.Context, db *mongo.Database) (map[string]*mongo.Collection, error) {
	collectionNames, err := db.ListCollectionNames(ctx, bson.D{})
	if err != nil {
		return nil, fmt.Errorf("failed to list collections: %w", err)
	}
	collections := make(map[string]*mongo.Collection)
	for _, name := range collectionNames {
		collections[name] = db.Collection(name)
	}
	return collections, nil
}
