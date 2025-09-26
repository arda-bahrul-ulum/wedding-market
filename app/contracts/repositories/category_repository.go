package repositories

import (
	"goravel/app/models"
)

// CategoryRepositoryInterface defines category-specific repository operations
type CategoryRepositoryInterface interface {
	BaseRepositoryInterface[models.Category]
	
	// Category-specific methods
	FindBySlug(slug string) (*models.Category, error)
	FindByName(name string) (*models.Category, error)
	FindActiveCategories() ([]*models.Category, error)
	FindOrderedBySort() ([]*models.Category, error)
	FindWithServices(id uint) (*models.Category, error)
	FindWithFilters(filters *CategoryFilters, page, limit int) ([]*models.Category, int64, error)
	UpdateSortOrder(id uint, sortOrder int) error
	ActivateCategory(id uint) error
	DeactivateCategory(id uint) error
	GetStatistics() (*CategoryStatistics, error)
}

// CategoryFilters represents category filtering options
type CategoryFilters struct {
	Name     string `json:"name"`
	IsActive *bool  `json:"is_active"`
}

// CategoryStatistics represents category statistics data
type CategoryStatistics struct {
	TotalCategories    int64 `json:"total_categories"`
	ActiveCategories   int64 `json:"active_categories"`
	InactiveCategories int64 `json:"inactive_categories"`
}
