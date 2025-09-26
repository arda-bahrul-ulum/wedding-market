package repositories

import (
	"goravel/app/models"
)

// CategoryRepositoryInterface defines category-specific repository operations
type CategoryRepositoryInterface interface {
	BaseRepositoryInterface[models.Category]
	
	// Category-specific methods
	FindBySlug(slug string) (*models.Category, error)
	FindActiveCategories() ([]*models.Category, error)
	FindOrderedBySort() ([]*models.Category, error)
	FindWithServices(id uint) (*models.Category, error)
	UpdateSortOrder(id uint, sortOrder int) error
	ActivateCategory(id uint) error
	DeactivateCategory(id uint) error
}
