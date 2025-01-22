package s3bucket

import (
	"fmt"
	"github.com/gofiber/fiber/v2"
	"encoding/json"
	"github.com/GenerateNU/platemate/internal/config"
)

type GetParams struct {
	Bucket    string
	Key string
}

type PostParams struct {
	Bucket    string
	Filetype string
}

type Handler struct {
	service *Service
	config config.Config
} 

func (h *Handler) GetPresignedUrlHandler(c *fiber.Ctx) error {
	key := c.Params("key")

	// get the name of the bucket
	bucketName := h.config.AWS.BucketName
	if bucketName == "" {
		return fmt.Errorf("S3_BUCKET environment variable is not set")
	}

	object := &GetParams{
		Bucket:    bucketName,
		Key: key,
	}
	url, err := h.service.GetPresignedUrl(object)
	if err != nil {
		return err
	}
	jsonData, err := json.MarshalIndent(url, "", " ")
	if err != nil {
		return err
	}
	c.Set("Content-Type", "application/json")
	return c.Send(jsonData)
}

func (h *Handler) PostPresignedUrlHandler(c *fiber.Ctx) error {
	fileType := c.Query("fileType")
	if fileType == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "fileType query parameter is required",
		})
	}
	
	bucketName := h.config.AWS.BucketName
	if bucketName == "" {
		return fmt.Errorf("S3_BUCKET environment variable is not set")
	}

	object := &PostParams{
		Bucket:    bucketName,
		Filetype: fileType,
	}

	urlAndKey, err := h.service.CreateUrlAndKey(object)
	if err != nil {
		return err
	}
	jsonData, err := json.MarshalIndent(urlAndKey, "", " ")
	if err != nil {
		return err
	}
	c.Set("Content-Type", "application/json")
	return c.Send(jsonData)
}