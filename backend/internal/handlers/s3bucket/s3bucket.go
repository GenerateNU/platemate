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
	Bucket    string
	Key string
}

type PostParams struct {
	Bucket    string
	Filetype string
	Region string
}

func (h *Handler) GetPresignedUrlHandler(c *fiber.Ctx) error {
	fileType := c.Param("key")

	// get the name of the bucket
	// region, environment vars
	bucketName := os.Getenv("AWS_BUCKET_NAME")
	if bucketName == "" {
		return nil, fmt.Errorf("S3_BUCKET environment variable is not set")
	}

	object := &GetParams{
		Bucket:    bucketName,
		key: key,
	}
	err := h.service.GetPresignedUrl(object)
	if err != nil {
		return err
	}
	return c.SendStatus(fiber.StatusOK)
}

func (h *Handler) PostPresignedUrlHandler(c *fiber.Ctx) error {
	fileType := c.Query("fileType")
	if fileType == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "fileType query parameter is required",
		})
	}

	// get the name of the bucket
	// region, environment vars
	bucketName := os.Getenv("AWS_BUCKET_NAME")
	region := os.Getenv("AWS_REGION")
	if bucketName == "" {
		return nil, fmt.Errorf("S3_BUCKET environment variable is not set")
	}

	object := &PostParams{
		Bucket:    bucketName,
		FileType: fileType,
		Region: region
	}

	err := h.service.CreateUrlAndKey(object)
	if err != nil {
		return err
	}
	return c.SendStatus(fiber.StatusOK)
}