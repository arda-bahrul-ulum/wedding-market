package seeders

import (
	"time"

	"goravel/app/models"

	"github.com/goravel/framework/facades"
	"golang.org/x/crypto/bcrypt"
)

type SuperUserSeeder struct{}

// Signature The name and signature of the seeder.
func (s *SuperUserSeeder) Signature() string {
	return "SuperUserSeeder"
}

// Run executes the seeder logic.
func (s *SuperUserSeeder) Run() error {
	// Check if super user already exists
	var existingUser models.User
	if err := facades.Orm().Query().Where("role", models.RoleSuperUser).First(&existingUser); err == nil {
		facades.Log().Info("Super User already exists, skipping seeder")
		return nil // Super user already exists
	}

	// Use a default password for testing (should be changed in production)
	password := "SuperAdmin123!"

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	now := time.Now()
	superUser := models.User{
		Name:            "Super Admin",
		Email:           "superadmin@mail.com",
		Password:        string(hashedPassword),
		Role:            models.RoleSuperUser,
		IsActive:        true,
		EmailVerifiedAt: &now,
	}

	if err := facades.Orm().Query().Create(&superUser); err != nil {
		return err
	}

	// Log the password for initial setup
	facades.Log().Info("Super User created with email: superadmin@mail.com")
	facades.Log().Info("Initial password: " + password)
	facades.Log().Info("Please change the password after first login!")

	return nil
}
