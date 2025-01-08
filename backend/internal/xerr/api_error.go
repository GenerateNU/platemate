package xerr

import (
	"errors"
	"fmt"
	"log/slog"
	"net/http"

	"github.com/GenerateNU/platemate/internal/xslog"
	"github.com/gofiber/fiber/v2"
)

func ErrorHandler(c *fiber.Ctx, err error) error {
	var apiErr APIError
	if castedErr, ok := err.(APIError); ok {
		apiErr = castedErr
	} else {
		apiErr = InternalServerError()
	}

	slog.LogAttrs(
		c.Context(),
		slog.LevelError,
		"Error handling request",
		xslog.Error(err),
	)

	return c.Status(apiErr.StatusCode).JSON(apiErr)
}

type APIError struct {
	StatusCode int `json:"statusCode"`
	Message    any `json:"msg"`
}

func (e APIError) Error() string {
	return fmt.Sprintf("api error: %d %v", e.StatusCode, e.Message)
}

func NewAPIError(statusCode int, err error) APIError {
	return APIError{
		StatusCode: statusCode,
		Message:    err.Error(),
	}
}

func BadRequest(err error) APIError {
	return NewAPIError(http.StatusBadRequest, err)
}

func InvalidJSON() APIError {
	return NewAPIError(http.StatusBadRequest, errors.New("invalid JSON request data"))
}

func NotFound(title string, withKey string, withValue any) APIError {
	return NewAPIError(http.StatusNotFound, fmt.Errorf("%s with %s='%s' not found", title, withKey, withValue))
}

func Timeout(reason string) APIError {
	return NewAPIError(http.StatusRequestTimeout, fmt.Errorf("timeout: %s", reason))
}

func Conflict(title string, withKey string, withValue any) APIError {
	return NewAPIError(http.StatusConflict, fmt.Errorf("conflict: %s with %s='%s' already exists", title, withKey, withValue))
}

func InvalidRequestData(errors map[string]string) APIError {
	return APIError{
		StatusCode: http.StatusUnprocessableEntity,
		Message:    errors,
	}
}

func InternalServerError() APIError {
	return NewAPIError(http.StatusInternalServerError, errors.New("internal server error"))
}
