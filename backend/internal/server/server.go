package server

import (
	"log"

	_ "github.com/GenerateNU/platemate/cmd/server/docs"
	"github.com/GenerateNU/platemate/internal/config"
	"github.com/GenerateNU/platemate/internal/handlers/auth"
	"github.com/GenerateNU/platemate/internal/handlers/auth/forgot_pass"
	"github.com/GenerateNU/platemate/internal/handlers/health"
	"github.com/GenerateNU/platemate/internal/handlers/menu_items"
	"github.com/GenerateNU/platemate/internal/handlers/restaurant"
	"github.com/GenerateNU/platemate/internal/handlers/review"
	"github.com/GenerateNU/platemate/internal/handlers/s3bucket"
	"github.com/GenerateNU/platemate/internal/handlers/users"
	"github.com/GenerateNU/platemate/internal/xerr"
	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	gojson "github.com/goccy/go-json"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/compress"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/favicon"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"github.com/gofiber/fiber/v2/middleware/requestid"
	"github.com/gofiber/swagger" // swagger handler

	// docs are generated by Swag CLI, you have to import them.
	// replace with your own docs folder, usually "github.com/username/reponame/docs"
	_ "github.com/GenerateNU/platemate/cmd/server/docs"
	"go.mongodb.org/mongo-driver/mongo"
)

func New(collections map[string]*mongo.Collection) *fiber.App {
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("Failed to load configuration: %v", err)
	}

	app := setupApp()

	health.Routes(app, collections)
	auth.Routes(app, collections)

	awsConfig := aws.Config{
		Region: cfg.AWS.Region,
		Credentials: credentials.NewStaticCredentialsProvider(
			cfg.AWS.AccessKeyID,
			cfg.AWS.SecretAccessKey,
			"",
		),
	}
	if err != nil {
		log.Fatalf("Failed to load AWS config: %v", err)
	}

	// create a S3 presign client
	s3Client := s3.NewFromConfig(awsConfig)
	presigner := s3.NewPresignClient(s3Client)

	health.Routes(app, collections)
	review.Routes(app, collections)
	s3bucket.Routes(app, presigner)

	forgot_pass.Routes(app, collections)
	menu_items.Routes(app, collections)
	restaurant.Routes(app, collections)

	users.Routes(app, collections)
	return app
}

// @title Fiber Example API
// @version 1.0
// @description This is a sample swagger for Fiber
// @termsOfService http://swagger.io/terms/
// @contact.name API Support
// @contact.email fiber@swagger.io
// @license.name Apache 2.0
// @license.url http://www.apache.org/licenses/LICENSE-2.0.html
// @host localhost:8080
// @BasePath /
func setupApp() *fiber.App {
	app := fiber.New(fiber.Config{
		JSONEncoder:  gojson.Marshal,
		JSONDecoder:  gojson.Unmarshal,
		ErrorHandler: xerr.ErrorHandler,
	})
	app.Get("/swagger/*", swagger.HandlerDefault) // default
	app.Use(recover.New())
	app.Use(requestid.New())
	app.Use(favicon.New())
	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowMethods: "GET,POST,PUT,PATCH,DELETE",
	}))
	app.Use(logger.New(logger.Config{
		Format: "[${time}] ${ip}:${port} ${pid} ${locals:requestid} ${status} - ${latency} ${method} ${path}\n",
	}))
	app.Use(compress.New(compress.Config{
		Level: compress.LevelBestSpeed,
	}))
	app.Get("/", func(c *fiber.Ctx) error {
		return c.Status(fiber.StatusOK).SendString("Welcome to PlateMate!")
	})
	return app
}
