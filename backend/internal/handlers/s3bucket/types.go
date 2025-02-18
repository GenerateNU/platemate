package s3bucket

import (
	"github.com/GenerateNU/platemate/internal/config"
)

type GetParams struct {
	Bucket string
	Key    string
}

type PostParams struct {
	Bucket   string
	Filetype string
}

type Handler struct {
	service *Service
	config  config.Config
}

type DownloadUrl struct {
	URL string `json:"download_url"`
}

type UploadUrl struct {
	URL string `json:"upload_url"`
	Key string `json:"key"`
}

type PresignedUploadURLResponse struct {
	UploadURL string `json:"upload_url"`
	Key       string `json:"key"`
}

// PresignedUploadURLQueryParams TODO: validate filetypes
type PresignedUploadURLQueryParams struct {
	FileType string `validate:"required" json:"fileType"`
}

type PresignedDownloadURLQueryParams struct {
	Key string `validate:"required" json:"key"`
}
