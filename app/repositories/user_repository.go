package repositories

import (
	"strings"
	"time"

	"goravel/app/contracts/repositories"
	"goravel/app/models"

	"github.com/goravel/framework/facades"
)

// UserRepository implements UserRepositoryInterface
type UserRepository struct {
	*BaseRepository[models.User]
}

// NewUserRepository creates a new user repository instance
func NewUserRepository() repositories.UserRepositoryInterface {
	return &UserRepository{
		BaseRepository: NewBaseRepository(models.User{}),
	}
}

// FindByEmail finds a user by email
func (r *UserRepository) FindByEmail(email string) (*models.User, error) {
	var user models.User
	err := facades.Orm().Query().Where("email", strings.ToLower(strings.TrimSpace(email))).First(&user)
	if err != nil {
		return nil, err
	}
	return &user, nil
}

// FindByRole finds users by role
func (r *UserRepository) FindByRole(role string) ([]*models.User, error) {
	var users []*models.User
	err := facades.Orm().Query().Where("role", role).Find(&users)
	return users, err
}

// FindActiveUsers finds all active users
func (r *UserRepository) FindActiveUsers() ([]*models.User, error) {
	var users []*models.User
	err := facades.Orm().Query().Where("is_active", true).Find(&users)
	return users, err
}

// FindByEmailAndRole finds a user by email and role
func (r *UserRepository) FindByEmailAndRole(email, role string) (*models.User, error) {
	var user models.User
	err := facades.Orm().Query().
		Where("email", strings.ToLower(strings.TrimSpace(email))).
		Where("role", role).
		First(&user)
	if err != nil {
		return nil, err
	}
	return &user, nil
}

// UpdateLastLogin updates user's last login timestamp
func (r *UserRepository) UpdateLastLogin(id uint) error {
	now := time.Now()
	_, err := facades.Orm().Query().Model(&models.User{}).
		Where("id", id).
		Update("last_login_at", now)
	return err
}

// ActivateUser activates a user account
func (r *UserRepository) ActivateUser(id uint) error {
	_, err := facades.Orm().Query().Model(&models.User{}).
		Where("id", id).
		Update("is_active", true)
	return err
}

// DeactivateUser deactivates a user account
func (r *UserRepository) DeactivateUser(id uint) error {
	_, err := facades.Orm().Query().Model(&models.User{}).
		Where("id", id).
		Update("is_active", false)
	return err
}

// FindWithProfile finds a user with their profile loaded
func (r *UserRepository) FindWithProfile(id uint) (*models.User, error) {
	var user models.User
	// For now, just find the user without preloading
	// Preload functionality will be implemented when available
	err := facades.Orm().Query().Find(&user, id)
	if err != nil {
		return nil, err
	}
	return &user, nil
}

// SearchUsers searches users with filters and pagination
func (r *UserRepository) SearchUsers(query string, role string, page, limit int) ([]*models.User, int64, error) {
	var users []*models.User

	// Build query
	dbQuery := facades.Orm().Query().Model(&models.User{})
	
	if query != "" {
		searchTerm := "%" + strings.ToLower(query) + "%"
		// Simplified search for now
		dbQuery = dbQuery.Where("LOWER(name) LIKE ?", searchTerm).
			OrWhere("LOWER(email) LIKE ?", searchTerm)
	}
	
	if role != "" {
		dbQuery = dbQuery.Where("role", role)
	}

	// Get total count
	total, countErr := dbQuery.Count()
	if countErr != nil {
		return nil, 0, countErr
	}

	// Get paginated results
	offset := (page - 1) * limit
	err := dbQuery.Offset(offset).Limit(limit).Find(&users)

	return users, total, err
}
