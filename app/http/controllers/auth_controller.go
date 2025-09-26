package controllers

import (
	"strings"

	"goravel/app/contracts/services"
	"goravel/app/models"

	"github.com/goravel/framework/contracts/http"
	"github.com/goravel/framework/facades"
)

type AuthController struct{
	authService services.AuthServiceInterface
}

func NewAuthController(authService services.AuthServiceInterface) *AuthController {
	return &AuthController{
		authService: authService,
	}
}


// Register handles user registration
func (c *AuthController) Register(ctx http.Context) http.Response {
	var request services.RegisterRequest

	if err := ctx.Request().Bind(&request); err != nil {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Invalid request data",
			"errors":  err.Error(),
		})
	}

	// Basic validation
	if strings.TrimSpace(request.Name) == "" {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Nama wajib diisi",
		})
	}

	if len(strings.TrimSpace(request.Name)) < 3 {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Nama minimal 3 karakter",
		})
	}

	if strings.TrimSpace(request.Email) == "" {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Email wajib diisi",
		})
	}

	if strings.TrimSpace(request.Password) == "" {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Password wajib diisi",
		})
	}

	if request.Password != request.ConfirmPassword {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Password dan konfirmasi password tidak sama",
		})
	}

	if request.Role != models.RoleCustomer && request.Role != models.RoleVendor {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Role harus customer atau vendor",
		})
	}

	if !request.AgreeTerms {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Anda harus menyetujui syarat dan ketentuan",
		})
	}

	// Call service
	response, err := c.authService.Register(&request)
	if err != nil {
		facades.Log().Error("Auth service error: " + err.Error())
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Terjadi kesalahan sistem",
		})
	}

	// Determine status code based on response
	statusCode := 201
	if !response.Success {
		statusCode = 400
	}

	return ctx.Response().Status(statusCode).Json(http.Json{
		"success": response.Success,
		"message": response.Message,
		"data":    response.Data,
		"errors":  response.Errors,
	})
}

// Login handles user login
func (c *AuthController) Login(ctx http.Context) http.Response {
	var request services.LoginRequest

	if err := ctx.Request().Bind(&request); err != nil {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Invalid request data",
			"errors":  err.Error(),
		})
	}

	// Basic validation
	if strings.TrimSpace(request.Email) == "" {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Email wajib diisi",
		})
	}

	if strings.TrimSpace(request.Password) == "" {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Password wajib diisi",
		})
	}

	if request.Role != models.RoleCustomer && request.Role != models.RoleVendor {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Role harus customer atau vendor",
		})
	}

	// Call service
	response, err := c.authService.Login(&request)
	if err != nil {
		facades.Log().Error("Auth service error: " + err.Error())
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Terjadi kesalahan sistem",
		})
	}

	// Determine status code based on response
	statusCode := 200
	if !response.Success {
		statusCode = 401
	}

	return ctx.Response().Status(statusCode).Json(http.Json{
		"success": response.Success,
		"message": response.Message,
		"data":    response.Data,
		"errors":  response.Errors,
	})
}

// Logout handles user logout
func (c *AuthController) Logout(ctx http.Context) http.Response {
	if err := facades.Auth(ctx).Logout(); err != nil {
		facades.Log().Error("Failed to logout: " + err.Error())
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Gagal logout",
		})
	}

	return ctx.Response().Status(200).Json(http.Json{
		"success": true,
		"message": "Logout berhasil",
	})
}

// Me returns current user information
func (c *AuthController) Me(ctx http.Context) http.Response {
	// Check if user exists in context (from auth middleware)
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

	// Load profile based on role
	switch user.Role {
	case models.RoleVendor:
		var vendorProfile models.VendorProfile
		if err := facades.Orm().Query().Where("user_id", user.ID).First(&vendorProfile); err == nil {
			user.VendorProfile = &vendorProfile
		}
	case models.RoleCustomer:
		var customerProfile models.CustomerProfile
		if err := facades.Orm().Query().Where("user_id", user.ID).First(&customerProfile); err == nil {
			user.CustomerProfile = &customerProfile
		}
	}

	return ctx.Response().Status(200).Json(http.Json{
		"success": true,
		"message": "Data user berhasil diambil",
		"data": http.Json{
			"user": user,
		},
	})
}

// CheckUserRole checks user role by email before login
func (c *AuthController) CheckUserRole(ctx http.Context) http.Response {
	var request struct {
		Email string `json:"email"`
	}

	if err := ctx.Request().Bind(&request); err != nil {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Invalid request data",
			"errors":  err.Error(),
		})
	}

	// Basic validation
	if strings.TrimSpace(request.Email) == "" {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Email wajib diisi",
		})
	}

	// Call service
	response, err := c.authService.CheckUserRole(request.Email)
	if err != nil {
		facades.Log().Error("Auth service error: " + err.Error())
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Terjadi kesalahan sistem",
		})
	}

	// Determine status code based on response
	statusCode := 200
	if !response.Success {
		if strings.Contains(response.Message, "tidak terdaftar") {
			statusCode = 404
		} else if strings.Contains(response.Message, "tidak aktif") {
			statusCode = 403
		} else {
			statusCode = 400
		}
	}

	return ctx.Response().Status(statusCode).Json(http.Json{
		"success": response.Success,
		"message": response.Message,
		"data":    response.Data,
		"errors":  response.Errors,
	})
}

// RefreshToken refreshes JWT token
func (c *AuthController) RefreshToken(ctx http.Context) http.Response {
	token, err := facades.Auth(ctx).Refresh()
	if err != nil {
		facades.Log().Error("Failed to refresh token: " + err.Error())
		return ctx.Response().Status(401).Json(http.Json{
			"success": false,
			"message": "Gagal memperbarui token",
		})
	}

	return ctx.Response().Status(200).Json(http.Json{
		"success": true,
		"message": "Token berhasil diperbarui",
		"data": http.Json{
			"token": token,
		},
	})
}

// SuperAdminLogin handles superadmin login
func (c *AuthController) SuperAdminLogin(ctx http.Context) http.Response {
	var request services.SuperAdminLoginRequest

	if err := ctx.Request().Bind(&request); err != nil {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Invalid request data",
			"errors":  err.Error(),
		})
	}

	// Basic validation
	if strings.TrimSpace(request.Email) == "" {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Email wajib diisi",
		})
	}

	if strings.TrimSpace(request.Password) == "" {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Password wajib diisi",
		})
	}

	// Call service
	response, err := c.authService.SuperAdminLogin(&request)
	if err != nil {
		facades.Log().Error("Auth service error: " + err.Error())
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Terjadi kesalahan sistem",
		})
	}

	// Determine status code based on response
	statusCode := 200
	if !response.Success {
		if strings.Contains(response.Message, "Akses ditolak") {
			statusCode = 403
		} else {
			statusCode = 401
		}
	}

	return ctx.Response().Status(statusCode).Json(http.Json{
		"success": response.Success,
		"message": response.Message,
		"data":    response.Data,
		"errors":  response.Errors,
	})
}
