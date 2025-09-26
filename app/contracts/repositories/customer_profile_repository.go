package repositories

import (
	"goravel/app/models"
)

// CustomerProfileRepositoryInterface defines customer profile-specific repository operations
type CustomerProfileRepositoryInterface interface {
	BaseRepositoryInterface[models.CustomerProfile]
	
	// Customer profile-specific methods
	FindByUserID(userID uint) (*models.CustomerProfile, error)
	FindByGender(gender string) ([]*models.CustomerProfile, error)
	FindByLocation(city, province string) ([]*models.CustomerProfile, error)
	FindActiveCustomers() ([]*models.CustomerProfile, error)
	FindWithCompleteProfile() ([]*models.CustomerProfile, error)
	FindWithUser(id uint) (*models.CustomerProfile, error)
	UpdateProfile(userID uint, updates map[string]interface{}) error
}
