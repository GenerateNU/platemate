package s3bucket

import (
	"github.com/GenerateNU/platemate/internal/xerr"
	"github.com/GenerateNU/platemate/internal/xvalidator"
	"github.com/gofiber/fiber/v2"
)

func (h *Handler) GetPresignedUrlHandler(c *fiber.Ctx) error {

	var queryParams PresignedDownloadURLQueryParams

	if err := c.ParamsParser(&queryParams); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(xerr.BadRequest(err))
	}

	errs := xvalidator.Validator.Validate(queryParams)
	if len(errs) > 0 {
		return c.Status(fiber.StatusBadRequest).JSON(errs)
	}

	url, err := h.service.GetPresignedUrl(&GetParams{
		Bucket: h.config.BucketName,
		Key:    queryParams.Key,
	})

	if err != nil {
		return err
	}

	c.Set("Content-Type", "application/json")
	return c.Status(200).JSON(PresignedDownloadURLResponse{DownloadURL: url.URL})
}

func (h *Handler) PostPresignedUrlHandler(c *fiber.Ctx) error {

	var queryParams PresignedUploadURLQueryParams

	if err := c.QueryParser(&queryParams); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(xerr.BadRequest(err))
	}

	errs := xvalidator.Validator.Validate(queryParams)
	if len(errs) > 0 {
		return c.Status(fiber.StatusBadRequest).JSON(errs)
	}

	urlAndKey, err := h.service.CreateUrlAndKey(&PostParams{
		Bucket:   h.config.BucketName,
		Filetype: queryParams.FileType,
	})

	if err != nil {
		return err
	}

	c.Set("Content-Type", "application/json")
	return c.Status(200).JSON(PresignedUploadURLResponse{UploadURL: urlAndKey.URL, Key: urlAndKey.Key})
}
