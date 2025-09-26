package services

import (
	"goravel/app/models"
)

// AuthServiceInterface defines authentication service operations
type AuthServiceInterface interface {
	BaseServiceInterface
	
	// Registration
	Register(request *RegisterRequest) (*ServiceResponse, error)
	
	// Authentication
	Login(request *LoginRequest) (*ServiceResponse, error)
	Logout(token string) (*ServiceResponse, error)
	RefreshToken(token string) (*ServiceResponse, error)
	
	// User operations
	GetCurrentUser(token string) (*ServiceResponse, error)
	CheckUserRole(email string) (*ServiceResponse, error)
	
	// Super admin operations
	SuperAdminLogin(request *SuperAdminLoginRequest) (*ServiceResponse, error)
	
	// Password operations
	ChangePassword(userID uint, oldPassword, newPassword string) (*ServiceResponse, error)
	ResetPassword(email string) (*ServiceResponse, error)
	
	// Validation helpers
	ValidateEmail(email string) bool
	ValidatePassword(password string) (bool, string)
	ValidatePhone(phone string) bool
}

// RegisterRequest represents registration request data
type RegisterRequest struct {
	Name            string `json:"name" validate:"required,min=3"`
	Email           string `json:"email" validate:"required,email"`
	Password        string `json:"password" validate:"required,min=8"`
	ConfirmPassword string `json:"confirm_password" validate:"required,eqfield=Password"`
	Role            string `json:"role" validate:"required,oneof=customer vendor"`
	Phone           string `json:"phone" validate:"omitempty"`
	AgreeTerms      bool   `json:"agree_terms" validate:"required"`
}

// LoginRequest represents login request data
type LoginRequest struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required"`
	Role     string `json:"role" validate:"required,oneof=customer vendor"`
}

// SuperAdminLoginRequest represents super admin login request data
type SuperAdminLoginRequest struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required"`
}

// AuthResponse represents authentication response data
type AuthResponse struct {
	Token string      `json:"token"`
	User  *models.User `json:"user"`
}
