package repositories

import (
	"goravel/app/contracts/repositories"
	"goravel/app/models"

	"github.com/goravel/framework/facades"
)

// CustomerProfileRepository implements CustomerProfileRepositoryInterface
type CustomerProfileRepository struct {
	*BaseRepository[models.CustomerProfile]
}

// NewCustomerProfileRepository creates a new customer profile repository instance
func NewCustomerProfileRepository() repositories.CustomerProfileRepositoryInterface {
	return &CustomerProfileRepository{
		BaseRepository: NewBaseRepository(models.CustomerProfile{}),
	}
}

// FindByUserID finds customer profile by user ID
func (r *CustomerProfileRepository) FindByUserID(userID uint) (*models.CustomerProfile, error) {
	var profile models.CustomerProfile
	err := facades.Orm().Query().Where("user_id", userID).First(&profile)
	if err != nil {
		return nil, err
	}
	return &profile, nil
}

// FindByGender finds customer profiles by gender
func (r *CustomerProfileRepository) FindByGender(gender string) ([]*models.CustomerProfile, error) {
	var profiles []*models.CustomerProfile
	err := facades.Orm().Query().Where("gender", gender).Find(&profiles)
	return profiles, err
}

// FindByLocation finds customer profiles by location
func (r *CustomerProfileRepository) FindByLocation(city, province string) ([]*models.CustomerProfile, error) {
	var profiles []*models.CustomerProfile
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

// FindActiveCustomers finds all active customer profiles
func (r *CustomerProfileRepository) FindActiveCustomers() ([]*models.CustomerProfile, error) {
	var profiles []*models.CustomerProfile
	err := facades.Orm().Query().Where("is_active", true).Find(&profiles)
	return profiles, err
}

// FindWithCompleteProfile finds customers with complete profiles
func (r *CustomerProfileRepository) FindWithCompleteProfile() ([]*models.CustomerProfile, error) {
	var profiles []*models.CustomerProfile
	err := facades.Orm().Query().
		Where("phone IS NOT NULL").
		Where("address IS NOT NULL").
		Where("city IS NOT NULL").
		Where("province IS NOT NULL").
		Where("birth_date IS NOT NULL").
		Find(&profiles)
	return profiles, err
}

// FindWithUser finds customer profile with user loaded
func (r *CustomerProfileRepository) FindWithUser(id uint) (*models.CustomerProfile, error) {
	var profile models.CustomerProfile
	// For now, just find the profile without preloading user
	// Preload functionality will be implemented when available
	err := facades.Orm().Query().Find(&profile, id)
	if err != nil {
		return nil, err
	}
	return &profile, nil
}

// UpdateProfile updates customer profile by user ID
func (r *CustomerProfileRepository) UpdateProfile(userID uint, updates map[string]interface{}) error {
	_, err := facades.Orm().Query().Model(&models.CustomerProfile{}).
		Where("user_id", userID).
		Update(updates)
	return err
}
