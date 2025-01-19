package server

import (
    "context"
    "fmt"
    "github.com/aws/aws-sdk-go-v2/aws"
    "github.com/aws/aws-sdk-go-v2/config"
    "github.com/aws/aws-sdk-go-v2/service/s3"
    "github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/mongo"
)

func New(collections map[string]*mongo.Collection) *fiber.App {
	app := setupApp()

	cfg, err := config.LoadDefaultConfig(context.TODO(),
    config.WithRegion("AWS_REGION"),
    config.WithCredentialsProvider(aws.NewStaticCredentialsProvider("AWS_ACCESS_KEY_ID", "AWS_SECRET_ACCESS_KEY", "")),)
	if err != nil {
		return nil, fmt.Errorf("failed to load AWS config: %v", err)
	}

	// create a temporary S3 presign client
	s3Client := s3.NewFromConfig(cfg)
	presigner := s3.NewPresignClient(s3Client)

	health.Routes(app, collections)
	s3bucket.Routes(app, presigner)

	return app
}

func setupApp() *fiber.App {
	app := fiber.New(fiber.Config{
		JSONEncoder:  gojson.Marshal,
		JSONDecoder:  gojson.Unmarshal,
		ErrorHandler: xerr.ErrorHandler,
	})
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
