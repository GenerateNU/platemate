package main

import (
	"context"
	"github.com/GenerateNU/platemate/internal/database"
	"github.com/GenerateNU/platemate/internal/server"
	"github.com/GenerateNU/platemate/internal/xutils"
	"github.com/joho/godotenv"
	"github.com/stretchr/testify/assert"
	"io"
	"log"
	"net/http"
	"testing"
)

func TestIndexRoute(t *testing.T) {

	tests := []struct {
		desc          string
		route         string
		expectedError bool
		expectedCode  int
		expectedBody  string
	}{
		{
			desc:          "test index route",
			route:         "/",
			expectedError: false,
			expectedCode:  200,
			expectedBody:  "Welcome to PlateMate!",
		},
	}

	err := godotenv.Load()
	if err != nil {
		log.Fatal("Could not load .env")
	}

	user, pass, cluster, environment := "test", "platemate-test-pw", "Development", "Test"
	uri := xutils.GenerateAtlasURI(user, pass, cluster)

	_, _, collections, err := database.Connect(context.Background(), uri, environment)

	if err != nil {
		log.Fatalf("Failed to connect to MongoDB")
	}

	// Set up another instance of the backend.
	app := server.New(collections)

	for _, test := range tests {
		req, _ := http.NewRequest(
			"GET",
			test.route,
			nil,
		)

		// Perform the request plain with the app. The -1 disables request latency.
		res, err := app.Test(req, -1)
		assert.Equalf(t, test.expectedError, err != nil, test.desc)

		// As expected errors lead to broken responses, the next test case needs to be processed.
		if test.expectedError {
			continue
		}

		assert.Equalf(t, test.expectedCode, res.StatusCode, test.desc)

		body, _ := io.ReadAll(res.Body)
		assert.Equalf(t, test.expectedBody, string(body), test.desc)
	}

	// forcibly close the server
	shutdownErr := app.Shutdown()
	if shutdownErr != nil {
		return
	}
}
