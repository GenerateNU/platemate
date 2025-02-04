package xvalidator

import (
	"fmt"
	"reflect"

	"github.com/go-playground/validator/v10"
)

type ErrorResponse struct {
	Error       bool
	FailedField string
	Tag         string
	Value       interface{}
}

type XValidator struct {
	Validator *validator.Validate
}

type GlobalErrorHandlerResp struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
}

var Validate = validator.New()

func (v XValidator) Validate(data interface{}) []ErrorResponse {
	var validationErrors []ErrorResponse

	errs := Validate.Struct(data)
	if errs != nil {
		for _, err := range errs.(validator.ValidationErrors) {
			// In this case data object is actually holding the User struct
			var elem ErrorResponse

			elem.FailedField = err.Field() // Export struct field name
			elem.Tag = err.Tag()           // Export struct tag
			elem.Value = err.Value()       // Export field value
			elem.Error = true

			validationErrors = append(validationErrors, elem)
		}
	}

	return validationErrors
}

func isLteField(fl validator.FieldLevel) bool {
	// Get the field being validated (e.g., MinRatingPortion)
	field := fl.Field()

	// Extract the field name to compare against (e.g., MaxRatingPortion)
	fieldName := fl.Param() // This is the field specified in the validation tag (MaxRatingPortion)
	if fieldName == "" {
		return true // If no field name is provided in the tag, return true (no validation)
	}

	parentStruct := fl.Parent()
	otherField := parentStruct.FieldByName(fieldName) // Get the field by name - this is a pointer

	if otherField.IsValid() && field.IsValid() {
		if otherField.Kind() == reflect.Ptr {
			// Dereference pointer to get the actual value
			otherField = otherField.Elem()
		}
		if field.Kind() == reflect.Float64 && otherField.Kind() == reflect.Float64 {
			currentValue := field.Interface().(float64)
			otherValue := otherField.Interface().(float64)

			// Compare the values of the fields (both are now float64)
			return currentValue <= otherValue
		}
	}
	return true // comparison is not possible, return true
}

func locationValidation(fl validator.FieldLevel) bool {
	field := fl.Field()
	fmt.Println("HI", field)

	// Check if the slice contains exactly two values
	location := field.Interface().([]float64)

	if len(location) != 2 {
		return false
	}

	latitude, longitude := location[0], location[1]

	// Validate latitude and longitude range
	if latitude < -90.0 || latitude > 90.0 {
		return false
	}
	if longitude < -180.0 || longitude > 180.0 {
		return false
	}
	return true
}

// RegisterCustomValidators registers custom validations
func (v *XValidator) RegisterCustomValidators() {
	v.Validator.RegisterValidation("location", locationValidation)

	v.Validator.RegisterValidation("ltefieldIfExists", isLteField)
}

var Validator = &XValidator{
	Validator: Validate,
}

func init() {
	Validator := &XValidator{Validator: Validate}
	Validator.RegisterCustomValidators() // Registers custom validations when package is imported
}
