package controllers

import (
	"time"

	"goravel/app/models"

	"github.com/goravel/framework/contracts/http"
	"github.com/goravel/framework/facades"
	"golang.org/x/crypto/bcrypt"
)

type AuthController struct{}

func NewAuthController() *AuthController {
	return &AuthController{}
}

// Register handles user registration
func (c *AuthController) Register(ctx http.Context) http.Response {
	var request struct {
		Name     string `json:"name" validate:"required,min:3,max:255"`
		Email    string `json:"email" validate:"required,email"`
		Password string `json:"password" validate:"required,min:8"`
		Role     string `json:"role" validate:"required,oneof=customer vendor"`
		Phone    string `json:"phone"`
	}

	if err := ctx.Request().Bind(&request); err != nil {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Invalid request data",
			"errors":  err.Error(),
		})
	}

	// Check if email already exists
	var existingUser models.User
	if err := facades.Orm().Query().Where("email", request.Email).First(&existingUser); err == nil {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Email already registered",
		})
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(request.Password), bcrypt.DefaultCost)
	if err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to process password",
		})
	}

	// Create user
	now := time.Now()
	user := models.User{
		Name:            request.Name,
		Email:           request.Email,
		Password:        string(hashedPassword),
		Role:            request.Role,
		Phone:           request.Phone,
		IsActive:        true,
		EmailVerifiedAt: &now,
	}

	if err := facades.Orm().Query().Create(&user); err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to create user",
		})
	}

	// If vendor, create vendor profile
	if request.Role == "vendor" {
		vendorProfile := models.VendorProfile{
			UserID:       user.ID,
			BusinessName: request.Name + " Business",
			BusinessType: "personal",
			IsActive:     true,
		}
		if err := facades.Orm().Query().Create(&vendorProfile); err != nil {
			// Log error but don't fail registration
			facades.Log().Error("Failed to create vendor profile: " + err.Error())
		}
	}

	return ctx.Response().Status(201).Json(http.Json{
		"success": true,
		"message": "User registered successfully",
		"data": http.Json{
			"user": http.Json{
				"id":    user.ID,
				"name":  user.Name,
				"email": user.Email,
				"role":  user.Role,
			},
		},
	})
}

// Login handles user login
func (c *AuthController) Login(ctx http.Context) http.Response {
	var request struct {
		Email    string `json:"email" validate:"required,email"`
		Password string `json:"password" validate:"required"`
	}

	if err := ctx.Request().Bind(&request); err != nil {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Invalid request data",
			"errors":  err.Error(),
		})
	}

	// Find user
	var user models.User
	if err := facades.Orm().Query().Where("email", request.Email).First(&user); err != nil {
		return ctx.Response().Status(401).Json(http.Json{
			"success": false,
			"message": "Invalid credentials",
		})
	}

	// Check password
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(request.Password)); err != nil {
		return ctx.Response().Status(401).Json(http.Json{
			"success": false,
			"message": "Invalid credentials",
		})
	}

	// Check if user is active
	if !user.IsActive {
		return ctx.Response().Status(401).Json(http.Json{
			"success": false,
			"message": "Account is deactivated",
		})
	}

	// Update last login
	now := time.Now()
	user.LastLoginAt = &now
	facades.Orm().Query().Save(&user)

	// Generate JWT token
	token, err := facades.Auth().LoginUsingID(user.ID)
	if err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to generate token",
		})
	}

	return ctx.Response().Status(200).Json(http.Json{
		"success": true,
		"message": "Login successful",
		"data": http.Json{
			"token": token,
			"user": http.Json{
				"id":    user.ID,
				"name":  user.Name,
				"email": user.Email,
				"role":  user.Role,
			},
		},
	})
}

// Logout handles user logout
func (c *AuthController) Logout(ctx http.Context) http.Response {
	if err := facades.Auth().Logout(); err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to logout",
		})
	}

	return ctx.Response().Status(200).Json(http.Json{
		"success": true,
		"message": "Logout successful",
	})
}

// Me returns current user information
func (c *AuthController) Me(ctx http.Context) http.Response {
	user := ctx.Value("user").(models.User)

	// Load vendor profile if user is vendor
	if user.Role == "vendor" {
		var vendorProfile models.VendorProfile
		if err := facades.Orm().Query().Where("user_id", user.ID).First(&vendorProfile); err == nil {
			user.VendorProfile = &vendorProfile
		}
	}

	return ctx.Response().Status(200).Json(http.Json{
		"success": true,
		"data": http.Json{
			"user": user,
		},
	})
}

// RefreshToken refreshes JWT token
func (c *AuthController) RefreshToken(ctx http.Context) http.Response {
	token, err := facades.Auth().Refresh()
	if err != nil {
		return ctx.Response().Status(401).Json(http.Json{
			"success": false,
			"message": "Failed to refresh token",
		})
	}

	return ctx.Response().Status(200).Json(http.Json{
		"success": true,
		"data": http.Json{
			"token": token,
		},
	})
}
