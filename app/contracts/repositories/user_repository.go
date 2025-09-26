package repositories

import (
	"goravel/app/models"
)

// UserRepositoryInterface defines user-specific repository operations
type UserRepositoryInterface interface {
	BaseRepositoryInterface[models.User]
	
	// User-specific methods
	FindByEmail(email string) (*models.User, error)
	FindByRole(role string) ([]*models.User, error)
	FindActiveUsers() ([]*models.User, error)
	FindByEmailAndRole(email, role string) (*models.User, error)
	UpdateLastLogin(id uint) error
	ActivateUser(id uint) error
	DeactivateUser(id uint) error
	FindWithProfile(id uint) (*models.User, error)
	SearchUsers(query string, role string, page, limit int) ([]*models.User, int64, error)
}
