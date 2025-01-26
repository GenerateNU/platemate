package xerr

import (
	"errors"
	"fmt"
	"log/slog"
	"net/http"

	go_json "github.com/goccy/go-json"

	"github.com/GenerateNU/platemate/internal/xslog"
	"github.com/gofiber/fiber/v2"
)

func ErrorHandler(c *fiber.Ctx, err error) error {
	var e *fiber.Error
	if errors.As(err, &e) {
		e = err.(*fiber.Error)
	} else {
		ise := InternalServerError()
		e = &ise
	}

	slog.LogAttrs(
		c.Context(),
		slog.LevelError,
		"Error handling request",
		xslog.Error(err),
	)

	return c.Status(e.Code).JSON(e)
}

func BadRequest(err error) fiber.Error {
	return fiber.Error{
		Code:    http.StatusBadRequest,
		Message: err.Error(),
	}
}

func InvalidJSON() fiber.Error {
	return fiber.Error{
		Code:    http.StatusBadRequest,
		Message: "invalid JSON request data",
	}
}

func NotFound(title string, withKey string, withValue any) fiber.Error {
	return fiber.Error{
		Code:    http.StatusNotFound,
		Message: fmt.Sprintf("%s with %s='%s' not found", title, withKey, withValue),
	}
}

func Timeout(reason string) fiber.Error {
	return fiber.Error{
		Code:    http.StatusRequestTimeout,
		Message: fmt.Sprintf("timeout: %s", reason),
	}
}

func Conflict(title string, withKey string, withValue any) fiber.Error {
	return fiber.Error{
		Code:    http.StatusConflict,
		Message: fmt.Sprintf("conflict: %s with %s='%s' already exists", title, withKey, withValue),
	}
}

func InvalidRequestData(errors map[string]string) fiber.Error {
	errorJSON, err := go_json.Marshal(errors)
	if err != nil {
		return fiber.Error{
			Code:    http.StatusUnprocessableEntity,
			Message: "invalid request data",
		}
	}
	return fiber.Error{
		Code:    http.StatusUnprocessableEntity,
		Message: string(errorJSON),
	}
}

func InternalServerError() fiber.Error {
	return fiber.Error{
		Code:    http.StatusInternalServerError,
		Message: "internal server error",
	}
}

func Unauthorized(reason string) fiber.Error {
	return fiber.Error{
		Code:    http.StatusUnauthorized,
		Message: reason,
	}
}
