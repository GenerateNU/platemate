package s3bucket

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/aws/aws-sdk-go-v2/service/s3/types"
	"github.com/aws/aws-sdk-go-v2/service/s3/presign"
)

type GetParams struct {
	Presigner *s3.PresignClient
	Bucket    string
	key string
}

type PostParams struct {
	Presigner *s3.PresignClient
	Bucket    string
	Filetype string
	Region string
}

func (s *GetParams) GetPresignedUrlHandler(c *fiber.Ctx) {
	// generate a presigned URL
	// Load AWS configuration
	cfg, err := config.LoadDefaultConfig(context.TODO())
	if err != nil {
		return nil, fmt.Errorf("failed to load AWS config: %v", err)
	}

	// create a temporary S3 presign client
	s3Client := s3.NewFromConfig(cfg)
	presigner := s3.NewPresignClient(s3Client)
	
	fileType := c.Param("key")

	// get the name of the bucket
	// region, environment vars
	bucketName := os.Getenv("platemate-assets")
	if bucketName == "" {
		return nil, fmt.Errorf("S3_BUCKET environment variable is not set")
	}

	object := &GetParams{
		Presigner: presigner,
		Bucket:    bucketName,
		key: key,
	}
	return h.service.GetPresignedUrl(object)
}

func (s *PostParams) PostPresignedUrlHandler(c *fiber.Ctx) {
	// generate a presigned URL
	// Load AWS configuration
	cfg, err := config.LoadDefaultConfig(context.TODO())
	if err != nil {
		return nil, fmt.Errorf("failed to load AWS config: %v", err)
	}

	// create a temporary S3 presign client
	s3Client := s3.NewFromConfig(cfg)
	presigner := s3.NewPresignClient(s3Client)
	
	fileType := c.Query("fileType")
	if fileType == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "fileType query parameter is required",
		})
	}

	// get the name of the bucket
	// region, environment vars
	bucketName := os.Getenv("platemate-assets")
	region := os.Getenv("us-east-1")
	if bucketName == "" {
		return nil, fmt.Errorf("S3_BUCKET environment variable is not set")
	}

	object := &PostParams{
		Presigner: presigner,
		Bucket:    bucketName,
		FileType: fileType,
		Region: region
	}

	return h.service.CreateUrlAndKey(object)
}