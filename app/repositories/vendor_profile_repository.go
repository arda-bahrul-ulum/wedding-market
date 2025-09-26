package repositories

import (
	"strings"

	"goravel/app/contracts/repositories"
	"goravel/app/models"

	"github.com/goravel/framework/facades"
)

// VendorProfileRepository implements VendorProfileRepositoryInterface
type VendorProfileRepository struct {
	*BaseRepository[models.VendorProfile]
}

// NewVendorProfileRepository creates a new vendor profile repository instance
func NewVendorProfileRepository() repositories.VendorProfileRepositoryInterface {
	return &VendorProfileRepository{
		BaseRepository: NewBaseRepository(models.VendorProfile{}),
	}
}

// FindByUserID finds vendor profile by user ID
func (r *VendorProfileRepository) FindByUserID(userID uint) (*models.VendorProfile, error) {
	var profile models.VendorProfile
	err := facades.Orm().Query().Where("user_id", userID).First(&profile)
	if err != nil {
		return nil, err
	}
	return &profile, nil
}

// FindByBusinessType finds vendor profiles by business type
func (r *VendorProfileRepository) FindByBusinessType(businessType string) ([]*models.VendorProfile, error) {
	var profiles []*models.VendorProfile
	err := facades.Orm().Query().Where("business_type", businessType).Find(&profiles)
	return profiles, err
}

// FindVerifiedVendors finds all verified vendor profiles
func (r *VendorProfileRepository) FindVerifiedVendors() ([]*models.VendorProfile, error) {
	var profiles []*models.VendorProfile
	err := facades.Orm().Query().Where("is_verified", true).Find(&profiles)
	return profiles, err
}

// FindActiveVendors finds all active vendor profiles
func (r *VendorProfileRepository) FindActiveVendors() ([]*models.VendorProfile, error) {
	var profiles []*models.VendorProfile
	err := facades.Orm().Query().Where("is_active", true).Find(&profiles)
	return profiles, err
}

// FindByLocation finds vendor profiles by location
func (r *VendorProfileRepository) FindByLocation(city, province string) ([]*models.VendorProfile, error) {
	var profiles []*models.VendorProfile
	query := facades.Orm().Query()
	
	if city != "" {
		query = query.Where("city", city)
	}
	if province != "" {
		query = query.Where("province", province)
	}
	
	err := query.Find(&profiles)
	return profiles, err
}

// FindBySubscriptionPlan finds vendor profiles by subscription plan
func (r *VendorProfileRepository) FindBySubscriptionPlan(plan string) ([]*models.VendorProfile, error) {
	var profiles []*models.VendorProfile
	err := facades.Orm().Query().Where("subscription_plan", plan).Find(&profiles)
	return profiles, err
}

// UpdateSubscription updates vendor subscription
func (r *VendorProfileRepository) UpdateSubscription(id uint, plan string, expiresAt interface{}) error {
	updates := map[string]interface{}{
		"subscription_plan": plan,
	}
	if expiresAt != nil {
		updates["subscription_expires_at"] = expiresAt
	}
	
	_, err := facades.Orm().Query().Model(&models.VendorProfile{}).
		Where("id", id).
		Update(updates)
	return err
}

// VerifyVendor verifies a vendor profile
func (r *VendorProfileRepository) VerifyVendor(id uint) error {
	_, err := facades.Orm().Query().Model(&models.VendorProfile{}).
		Where("id", id).
		Update("is_verified", true)
	return err
}

// FindWithServices finds vendor profile with services loaded
func (r *VendorProfileRepository) FindWithServices(id uint) (*models.VendorProfile, error) {
	var profile models.VendorProfile
	// For now, just find the profile without preloading services
	// Preload functionality will be implemented when available
	err := facades.Orm().Query().Find(&profile, id)
	if err != nil {
		return nil, err
	}
	return &profile, nil
}

// FindWithUser finds vendor profile with user loaded
func (r *VendorProfileRepository) FindWithUser(id uint) (*models.VendorProfile, error) {
	var profile models.VendorProfile
	// For now, just find the profile without preloading user
	// Preload functionality will be implemented when available
	err := facades.Orm().Query().Find(&profile, id)
	if err != nil {
		return nil, err
	}
	return &profile, nil
}

// SearchVendors searches vendor profiles with filters and pagination
func (r *VendorProfileRepository) SearchVendors(query string, filters map[string]interface{}, page, limit int) ([]*models.VendorProfile, int64, error) {
	var profiles []*models.VendorProfile
	var total int64

	// Build query
	dbQuery := facades.Orm().Query().Model(&models.VendorProfile{})
	
	// Text search
	if query != "" {
		searchTerm := "%" + strings.ToLower(query) + "%"
		dbQuery = dbQuery.Where(facades.Orm().Query().
			Where("LOWER(business_name) LIKE ?", searchTerm).
			OrWhere("LOWER(description) LIKE ?", searchTerm))
	}
	
	// Apply filters
	for field, value := range filters {
		if value != nil && value != "" {
			dbQuery = dbQuery.Where(field, value)
		}
	}

	// Get total count
	total, countErr := dbQuery.Count()
	if countErr != nil {
		return nil, 0, countErr
	}

	// Get paginated results
	offset := (page - 1) * limit
	err := dbQuery.Offset(offset).Limit(limit).Find(&profiles)

	return profiles, total, err
}
