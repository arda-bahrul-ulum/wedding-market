package services

import (
	"regexp"
	"strings"
	"time"

	"goravel/app/contracts/repositories"
	"goravel/app/contracts/services"
	"goravel/app/models"

	"github.com/goravel/framework/facades"
	"golang.org/x/crypto/bcrypt"
)

// AuthService implements AuthServiceInterface
type AuthService struct {
	userRepo         repositories.UserRepositoryInterface
	vendorRepo       repositories.VendorProfileRepositoryInterface
	customerRepo     repositories.CustomerProfileRepositoryInterface
}

// NewAuthService creates a new auth service instance
func NewAuthService(
	userRepo repositories.UserRepositoryInterface,
	vendorRepo repositories.VendorProfileRepositoryInterface,
	customerRepo repositories.CustomerProfileRepositoryInterface,
) services.AuthServiceInterface {
	return &AuthService{
		userRepo:     userRepo,
		vendorRepo:   vendorRepo,
		customerRepo: customerRepo,
	}
}

// Initialize initializes the auth service
func (s *AuthService) Initialize() error {
	return nil
}

// Cleanup cleans up the auth service
func (s *AuthService) Cleanup() error {
	return nil
}

// Register handles user registration
func (s *AuthService) Register(request *services.RegisterRequest) (*services.ServiceResponse, error) {
	// Validate email format
	if !s.ValidateEmail(request.Email) {
		return services.NewErrorResponse("Format email tidak valid", nil), nil
	}

	// Validate password
	if valid, message := s.ValidatePassword(request.Password); !valid {
		return services.NewErrorResponse(message, nil), nil
	}

	// Validate phone
	if !s.ValidatePhone(request.Phone) {
		return services.NewErrorResponse("Format nomor telepon tidak valid (contoh: 08123456789)", nil), nil
	}

	// Check if email already exists
	existingUser, err := s.userRepo.FindByEmail(request.Email)
	if err == nil && existingUser != nil {
		return services.NewErrorResponse("Email sudah terdaftar", nil), nil
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(request.Password), bcrypt.DefaultCost)
	if err != nil {
		facades.Log().Error("Failed to hash password: " + err.Error())
		return services.NewErrorResponse("Gagal memproses password", nil), nil
	}

	// Create user
	now := time.Now()
	user := &models.User{
		Name:            strings.TrimSpace(request.Name),
		Email:           strings.ToLower(strings.TrimSpace(request.Email)),
		Password:        string(hashedPassword),
		Role:            request.Role,
		Phone:           strings.TrimSpace(request.Phone),
		IsActive:        true,
		EmailVerifiedAt: &now,
	}

	if err := s.userRepo.Create(user); err != nil {
		facades.Log().Error("Failed to create user: " + err.Error())
		return services.NewErrorResponse("Gagal membuat akun", nil), nil
	}

	// Create profile based on role
	if request.Role == models.RoleVendor {
		vendorProfile := &models.VendorProfile{
			UserID:       user.ID,
			BusinessName: user.Name + " Business",
			BusinessType: models.BusinessTypePersonal,
			IsActive:     true,
		}
		if err := s.vendorRepo.Create(vendorProfile); err != nil {
			facades.Log().Error("Failed to create vendor profile: " + err.Error())
		}
	} else if request.Role == models.RoleCustomer {
		customerProfile := &models.CustomerProfile{
			UserID:   user.ID,
			FullName: user.Name,
			Phone:    &user.Phone,
			IsActive: true,
		}
		if err := s.customerRepo.Create(customerProfile); err != nil {
			facades.Log().Error("Failed to create customer profile: " + err.Error())
		}
	}

	userData := map[string]interface{}{
		"id":    user.ID,
		"name":  user.Name,
		"email": user.Email,
		"role":  user.Role,
	}

	return services.NewServiceResponse(true, "Akun berhasil dibuat", userData), nil
}

// Login handles user login
func (s *AuthService) Login(request *services.LoginRequest) (*services.ServiceResponse, error) {
	// Validate email format
	if !s.ValidateEmail(request.Email) {
		return services.NewErrorResponse("Format email tidak valid", nil), nil
	}

	// Find user by email and role
	user, err := s.userRepo.FindByEmailAndRole(request.Email, request.Role)
	if err != nil || user == nil {
		return services.NewErrorResponse("Email atau password salah", nil), nil
	}

	// Check password
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(request.Password)); err != nil {
		return services.NewErrorResponse("Email atau password salah", nil), nil
	}

	// Check if user is active
	if !user.IsActive {
		return services.NewErrorResponse("Akun tidak aktif", nil), nil
	}

	// Update last login
	if err := s.userRepo.UpdateLastLogin(user.ID); err != nil {
		facades.Log().Error("Failed to update last login: " + err.Error())
	}

	// Generate JWT token (simplified - you might want to implement proper JWT generation)
	token := "jwt_token_placeholder" // This should be replaced with actual JWT generation

	authResponse := &services.AuthResponse{
		Token: token,
		User:  user,
	}

	return services.NewServiceResponse(true, "Login berhasil", authResponse), nil
}

// Logout handles user logout
func (s *AuthService) Logout(token string) (*services.ServiceResponse, error) {
	// Implement token invalidation logic here
	// This is a placeholder implementation
	return services.NewServiceResponse(true, "Logout berhasil", nil), nil
}

// RefreshToken handles token refresh
func (s *AuthService) RefreshToken(token string) (*services.ServiceResponse, error) {
	// Implement token refresh logic here
	// This is a placeholder implementation
	newToken := "new_jwt_token_placeholder"
	return services.NewServiceResponse(true, "Token berhasil diperbarui", map[string]string{"token": newToken}), nil
}

// GetCurrentUser gets current user information
func (s *AuthService) GetCurrentUser(token string) (*services.ServiceResponse, error) {
	// This should extract user from token
	// Placeholder implementation
	return services.NewServiceResponse(true, "Data user berhasil diambil", nil), nil
}

// CheckUserRole checks user role by email
func (s *AuthService) CheckUserRole(email string) (*services.ServiceResponse, error) {
	if !s.ValidateEmail(email) {
		return services.NewErrorResponse("Format email tidak valid", nil), nil
	}

	user, err := s.userRepo.FindByEmail(email)
	if err != nil || user == nil {
		return services.NewErrorResponse("Email tidak terdaftar", nil), nil
	}

	if !user.IsActive {
		return services.NewErrorResponse("Akun tidak aktif", nil), nil
	}

	return services.NewServiceResponse(true, "Role user berhasil ditemukan", map[string]string{"role": user.Role}), nil
}

// SuperAdminLogin handles super admin login
func (s *AuthService) SuperAdminLogin(request *services.SuperAdminLoginRequest) (*services.ServiceResponse, error) {
	// Find user by email
	user, err := s.userRepo.FindByEmail(request.Email)
	if err != nil || user == nil {
		return services.NewErrorResponse("Email atau password salah", nil), nil
	}

	// Check if user is superadmin
	if !user.IsSuperUser() {
		return services.NewErrorResponse("Akses ditolak. Hanya superadmin yang dapat mengakses halaman ini", nil), nil
	}

	// Check password
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(request.Password)); err != nil {
		return services.NewErrorResponse("Email atau password salah", nil), nil
	}

	// Check if user is active
	if !user.IsActive {
		return services.NewErrorResponse("Akun tidak aktif", nil), nil
	}

	// Update last login
	if err := s.userRepo.UpdateLastLogin(user.ID); err != nil {
		facades.Log().Error("Failed to update last login: " + err.Error())
	}

	// Generate JWT token
	token := "superadmin_jwt_token_placeholder"

	authResponse := &services.AuthResponse{
		Token: token,
		User:  user,
	}

	return services.NewServiceResponse(true, "Login superadmin berhasil", authResponse), nil
}

// ChangePassword changes user password
func (s *AuthService) ChangePassword(userID uint, oldPassword, newPassword string) (*services.ServiceResponse, error) {
	user, err := s.userRepo.Find(userID)
	if err != nil {
		return services.NewErrorResponse("User tidak ditemukan", nil), nil
	}

	// Verify old password
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(oldPassword)); err != nil {
		return services.NewErrorResponse("Password lama tidak benar", nil), nil
	}

	// Validate new password
	if valid, message := s.ValidatePassword(newPassword); !valid {
		return services.NewErrorResponse(message, nil), nil
	}

	// Hash new password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(newPassword), bcrypt.DefaultCost)
	if err != nil {
		return services.NewErrorResponse("Gagal memproses password baru", nil), nil
	}

	// Update password
	if err := s.userRepo.UpdateByID(userID, map[string]interface{}{"password": string(hashedPassword)}); err != nil {
		return services.NewErrorResponse("Gagal mengubah password", nil), nil
	}

	return services.NewServiceResponse(true, "Password berhasil diubah", nil), nil
}

// ResetPassword resets user password
func (s *AuthService) ResetPassword(email string) (*services.ServiceResponse, error) {
	// Implement password reset logic here
	// This should send reset email, etc.
	return services.NewServiceResponse(true, "Email reset password telah dikirim", nil), nil
}

// ValidateEmail validates email format
func (s *AuthService) ValidateEmail(email string) bool {
	emailRegex := regexp.MustCompile(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`)
	return emailRegex.MatchString(email)
}

// ValidatePassword validates password strength
func (s *AuthService) ValidatePassword(password string) (bool, string) {
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

// ValidatePhone validates Indonesian phone number
func (s *AuthService) ValidatePhone(phone string) bool {
	if phone == "" {
		return true // phone is optional
	}
	phoneRegex := regexp.MustCompile(`^08\d{8,11}$`)
	return phoneRegex.MatchString(phone)
}
