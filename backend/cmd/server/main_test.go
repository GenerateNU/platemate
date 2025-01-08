package main

import (
	"context"
	"io"
	"net/http"
	"path/filepath"
	"testing"

	"github.com/GenerateNU/platemate/internal/config"
	"github.com/GenerateNU/platemate/internal/server"
	"github.com/GenerateNU/platemate/internal/storage/mongo"
	"github.com/gofiber/fiber/v2"
	"github.com/joho/godotenv"
	"github.com/stretchr/testify/assert"
)

func TestIndexRoute(t *testing.T) {
	t.Parallel()
	tests := []struct {
		name          string
		desc          string
		route         string
		expectedError bool
		expectedCode  int
		expectedBody  string
	}{
		{
			name:          "index",
			desc:          "test index route",
			route:         "/",
			expectedError: false,
			expectedCode:  200,
			expectedBody:  "Welcome to PlateMate!",
		},
	}

	app := setup(t)

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			t.Parallel()
			req, err := http.NewRequest(
				http.MethodGet,
				tt.route,
				nil,
			)
			assert.NoErrorf(t, err, tt.desc)

			// Perform the request plain with the app. The -1 disables request latency.
			res, err := app.Test(req, -1)
			if !tt.expectedError {
				assert.NoErrorf(t, err, tt.desc)
			}

			// As expected errors lead to broken responses, the next test case needs to be processed.
			if tt.expectedError {
				return
			}

			assert.Equalf(t, tt.expectedCode, res.StatusCode, tt.desc)

			body, err := io.ReadAll(res.Body)
			assert.NoErrorf(t, err, tt.desc)
			assert.Equalf(t, tt.expectedBody, string(body), tt.desc)
		})
	}

	t.Cleanup(func() {
		if err := app.Shutdown(); err != nil {
			t.Fatalf("Failed to shutdown server: %v", err)
		}
	})
}

func setup(t *testing.T) *fiber.App {
	t.Helper()
	if err := godotenv.Load(filepath.Join("..", "..", ".env")); err != nil {
		t.Fatal("Failed to load .env")
	}
	cfg := config.Atlas{
		User:        "test",
		Pass:        "platemate-test-pw",
		Cluster:     "Development",
		Environment: "Test",
	}
	db, err := mongo.New(context.Background(), cfg)
	if err != nil {
		t.Fatalf("Failed to connect to MongoDB: %v", err)
	}
	return server.New(db.Collections)
}
