package repositories

import (
	"goravel/app/models"
)

// VendorProfileRepositoryInterface defines vendor profile-specific repository operations
type VendorProfileRepositoryInterface interface {
	BaseRepositoryInterface[models.VendorProfile]
	
	// Vendor profile-specific methods
	FindByUserID(userID uint) (*models.VendorProfile, error)
	FindByBusinessType(businessType string) ([]*models.VendorProfile, error)
	FindVerifiedVendors() ([]*models.VendorProfile, error)
	FindActiveVendors() ([]*models.VendorProfile, error)
	FindByLocation(city, province string) ([]*models.VendorProfile, error)
	FindBySubscriptionPlan(plan string) ([]*models.VendorProfile, error)
	UpdateSubscription(id uint, plan string, expiresAt interface{}) error
	VerifyVendor(id uint) error
	FindWithServices(id uint) (*models.VendorProfile, error)
	FindWithUser(id uint) (*models.VendorProfile, error)
	SearchVendors(query string, filters map[string]interface{}, page, limit int) ([]*models.VendorProfile, int64, error)
}
