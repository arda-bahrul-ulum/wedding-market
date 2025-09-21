package controllers

import (
	"regexp"
	"strings"
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

// validateEmail validates email format
func (c *AuthController) validateEmail(email string) bool {
	emailRegex := regexp.MustCompile(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`)
	return emailRegex.MatchString(email)
}

// validatePassword validates password strength
func (c *AuthController) validatePassword(password string) (bool, string) {
	if len(password) < 8 {
		return false, "Password minimal 8 karakter"
	}
	
	hasUpper := regexp.MustCompile(`[A-Z]`).MatchString(password)
	hasLower := regexp.MustCompile(`[a-z]`).MatchString(password)
	hasNumber := regexp.MustCompile(`[0-9]`).MatchString(password)
	
	if !hasUpper || !hasLower || !hasNumber {
		return false, "Password harus mengandung huruf besar, huruf kecil, dan angka"
	}
	
	return true, ""
}

// validatePhone validates Indonesian phone number
func (c *AuthController) validatePhone(phone string) bool {
	if phone == "" {
		return true // phone is optional
	}
	phoneRegex := regexp.MustCompile(`^08\d{8,11}$`)
	return phoneRegex.MatchString(phone)
}

// Register handles user registration
func (c *AuthController) Register(ctx http.Context) http.Response {
	var request struct {
		Name            string `json:"name"`
		Email           string `json:"email"`
		Password        string `json:"password"`
		ConfirmPassword string `json:"confirm_password"`
		Role            string `json:"role"`
		Phone           string `json:"phone"`
		AgreeTerms      bool   `json:"agree_terms"`
	}

	if err := ctx.Request().Bind(&request); err != nil {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Invalid request data",
			"errors":  err.Error(),
		})
	}

	// Validate required fields
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

	if !c.validateEmail(request.Email) {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Format email tidak valid",
		})
	}

	if strings.TrimSpace(request.Password) == "" {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Password wajib diisi",
		})
	}

	if valid, message := c.validatePassword(request.Password); !valid {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": message,
		})
	}

	if request.Password != request.ConfirmPassword {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Password dan konfirmasi password tidak sama",
		})
	}

	if request.Role != "customer" && request.Role != "vendor" {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Role harus customer atau vendor",
		})
	}

	if !c.validatePhone(request.Phone) {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Format nomor telepon tidak valid (contoh: 08123456789)",
		})
	}

	if !request.AgreeTerms {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Anda harus menyetujui syarat dan ketentuan",
		})
	}

	// Check if email already exists
	var existingUser models.User
	emailToCheck := strings.ToLower(strings.TrimSpace(request.Email))
	
	err := facades.Orm().Query().Where("email", emailToCheck).First(&existingUser)
	if err == nil && existingUser.ID > 0 {
		// Email found, user already exists
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Email sudah terdaftar",
		})
	}
	
	// Check if it's a "record not found" error (which is what we want)
	if err != nil && !strings.Contains(err.Error(), "record not found") && !strings.Contains(err.Error(), "not found") {
		// It's a different database error
		facades.Log().Error("Database error while checking email: " + err.Error())
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Gagal memeriksa email",
		})
	}
	
	// Email is available for registration

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(request.Password), bcrypt.DefaultCost)
	if err != nil {
		facades.Log().Error("Failed to hash password: " + err.Error())
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Gagal memproses password",
		})
	}

	// Create user
	now := time.Now()
	user := models.User{
		Name:            strings.TrimSpace(request.Name),
		Email:           strings.ToLower(strings.TrimSpace(request.Email)),
		Password:        string(hashedPassword),
		Role:            request.Role,
		Phone:           strings.TrimSpace(request.Phone),
		IsActive:        true,
		EmailVerifiedAt: &now,
	}

	if err := facades.Orm().Query().Create(&user); err != nil {
		facades.Log().Error("Failed to create user: " + err.Error())
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Gagal membuat akun",
		})
	}

	// Create profile based on role
	if request.Role == "vendor" {
		vendorProfile := models.VendorProfile{
			UserID:       user.ID,
			BusinessName: user.Name + " Business",
			BusinessType: "personal",
			IsActive:     true,
		}
		if err := facades.Orm().Query().Create(&vendorProfile); err != nil {
			// Log error but don't fail registration
			facades.Log().Error("Failed to create vendor profile: " + err.Error())
		}
	} else if request.Role == "customer" {
		customerProfile := models.CustomerProfile{
			UserID:   user.ID,
			FullName: user.Name,
			IsActive: true,
		}
		if err := facades.Orm().Query().Create(&customerProfile); err != nil {
			// Log error but don't fail registration
			facades.Log().Error("Failed to create customer profile: " + err.Error())
		}
	}

	return ctx.Response().Status(201).Json(http.Json{
		"success": true,
		"message": "Akun berhasil dibuat",
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
		Email    string `json:"email"`
		Password string `json:"password"`
		Role     string `json:"role"`
	}

	if err := ctx.Request().Bind(&request); err != nil {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Invalid request data",
			"errors":  err.Error(),
		})
	}

	// Validate required fields
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

	if !c.validateEmail(request.Email) {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Format email tidak valid",
		})
	}

	// Validate role
	if request.Role != "customer" && request.Role != "vendor" {
		facades.Log().Error("Invalid role provided: " + request.Role)
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Role harus customer atau vendor",
		})
	}

	// Find user
	var user models.User
 	emailToCheck := strings.ToLower(strings.TrimSpace(request.Email))
	facades.Log().Info("Login attempt for email: " + emailToCheck + " with role: " + request.Role)
	
	err := facades.Orm().Query().Where("email", emailToCheck).First(&user)
	if err != nil || user.ID == 0 {
		facades.Log().Info("User not found for email: " + emailToCheck)
		return ctx.Response().Status(401).Json(http.Json{
			"success": false,
			"message": "Email atau password salah",
		})
	}
	
	facades.Log().Info("User found with role: " + user.Role + ", requested role: " + request.Role)

	// Check password
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(request.Password)); err != nil {
		return ctx.Response().Status(401).Json(http.Json{
			"success": false,
			"message": "Email atau password salah",
		})
	}

	// Check if user is active
	if !user.IsActive {
		return ctx.Response().Status(401).Json(http.Json{
			"success": false,
			"message": "Akun tidak aktif",
		})
	}

	// Check if user role matches requested role
	if user.Role != request.Role {
		facades.Log().Info("Role mismatch: user role=" + user.Role + ", requested role=" + request.Role)
		if request.Role == "customer" {
			return ctx.Response().Status(401).Json(http.Json{
				"success": false,
				"message": "Anda belum punya akun customer. Silakan daftar sebagai customer atau login sebagai vendor.",
			})
		} else {
			return ctx.Response().Status(401).Json(http.Json{
				"success": false,
				"message": "Anda belum punya akun vendor. Silakan daftar sebagai vendor atau login sebagai customer.",
			})
		}
	}

	// Update last login
	now := time.Now()
	user.LastLoginAt = &now
	if err := facades.Orm().Query().Save(&user); err != nil {
		facades.Log().Error("Failed to update last login: " + err.Error())
	}

	// Generate JWT token
	token, err := facades.Auth(ctx).LoginUsingID(user.ID)
	if err != nil {
		facades.Log().Error("Failed to generate token: " + err.Error())
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Gagal membuat token",
		})
	}

	return ctx.Response().Status(200).Json(http.Json{
		"success": true,
		"message": "Login berhasil",
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
	if user.Role == "vendor" {
		var vendorProfile models.VendorProfile
		if err := facades.Orm().Query().Where("user_id", user.ID).First(&vendorProfile); err == nil {
			user.VendorProfile = &vendorProfile
		}
	} else if user.Role == "customer" {
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

	// Validate email format
	if strings.TrimSpace(request.Email) == "" {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Email wajib diisi",
		})
	}

	if !c.validateEmail(request.Email) {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Format email tidak valid",
		})
	}

	// Find user by email
	var user models.User
	emailToCheck := strings.ToLower(strings.TrimSpace(request.Email))
	err := facades.Orm().Query().Where("email", emailToCheck).First(&user)
	
	if err != nil || user.ID == 0 {
		return ctx.Response().Status(404).Json(http.Json{
			"success": false,
			"message": "Email tidak terdaftar",
		})
	}

	// Check if user is active
	if !user.IsActive {
		return ctx.Response().Status(403).Json(http.Json{
			"success": false,
			"message": "Akun tidak aktif",
		})
	}

	return ctx.Response().Status(200).Json(http.Json{
		"success": true,
		"message": "Role user berhasil ditemukan",
		"data": http.Json{
			"role": user.Role,
		},
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
