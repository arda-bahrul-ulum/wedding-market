package controllers

import (
	"fmt"

	"goravel/app/contracts/services"
	"goravel/app/models"

	"github.com/goravel/framework/contracts/http"
)

type UserController struct {
	userService services.UserServiceInterface
}

func NewUserController(userService services.UserServiceInterface) *UserController {
	return &UserController{
		userService: userService,
	}
}

// UpdateProfile handles profile updates for both customer and vendor
func (c *UserController) UpdateProfile(ctx http.Context) http.Response {
	var request services.UpdateUserProfileRequest
	if err := ctx.Request().Bind(&request); err != nil {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Invalid request data",
			"errors":  err.Error(),
		})
	}

	// Get user from context
	userInterface := ctx.Value("user")
	if userInterface == nil {
		return ctx.Response().Status(401).Json(http.Json{
			"success": false,
			"message": "Unauthorized - user not found in context",
		})
	}

	user, ok := userInterface.(models.User)
	if !ok {
		return ctx.Response().Status(401).Json(http.Json{
			"success": false,
			"message": "Unauthorized - invalid user data",
		})
	}

	// Convert UpdateUserProfileRequest to UpdateProfileRequest
	profileRequest := services.UpdateProfileRequest{
		Name:   request.Name,
		Phone:  request.Phone,
		Avatar: request.Avatar,
	}
	
	response, err := c.userService.UpdateProfile(user.ID, &profileRequest)
	if err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to update profile",
		})
	}

	statusCode := 200
	if !response.Success {
		if response.Message == "Profile type must be customer or vendor" ||
			response.Message == "Profile type does not match user role" {
			statusCode = 400
		} else if response.Message == "Customer profile not found" ||
			response.Message == "Vendor profile not found" {
			statusCode = 404
		} else {
			statusCode = 500
		}
	}

	return ctx.Response().Status(statusCode).Json(response)
}

// Show returns user information by ID
func (c *UserController) Show(ctx http.Context) http.Response {
	userID := ctx.Request().Input("id")
	if userID == "" {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "User ID is required",
		})
	}

	// Convert userID to uint
	var userIDUint uint
	if _, err := fmt.Sscanf(userID, "%d", &userIDUint); err != nil {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Invalid user ID format",
		})
	}

	response, err := c.userService.GetUser(userIDUint)
	if err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to get user",
		})
	}

	statusCode := 200
	if !response.Success {
		if response.Message == "User not found" {
			statusCode = 404
		} else {
			statusCode = 500
		}
	}

	return ctx.Response().Status(statusCode).Json(response)
}

// GetProfile returns current user profile
func (c *UserController) GetProfile(ctx http.Context) http.Response {
	// Get user from context
	userInterface := ctx.Value("user")
	if userInterface == nil {
		return ctx.Response().Status(401).Json(http.Json{
			"success": false,
			"message": "Unauthorized - user not found in context",
		})
	}

	user, ok := userInterface.(models.User)
	if !ok {
		return ctx.Response().Status(401).Json(http.Json{
			"success": false,
			"message": "Unauthorized - invalid user data",
		})
	}

	response, err := c.userService.GetUser(user.ID)
	if err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to get user profile",
		})
	}

	statusCode := 200
	if !response.Success {
		statusCode = 500
	}

	return ctx.Response().Status(statusCode).Json(response)
}