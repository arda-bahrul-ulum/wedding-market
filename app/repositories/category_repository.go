package repositories

import (
	"goravel/app/contracts/repositories"
	"goravel/app/models"

	"github.com/goravel/framework/facades"
)

// CategoryRepository implements CategoryRepositoryInterface
type CategoryRepository struct {
	*BaseRepository[models.Category]
}

// NewCategoryRepository creates a new category repository instance
func NewCategoryRepository() repositories.CategoryRepositoryInterface {
	return &CategoryRepository{
		BaseRepository: NewBaseRepository(models.Category{}),
	}
}

// FindBySlug finds a category by slug
func (r *CategoryRepository) FindBySlug(slug string) (*models.Category, error) {
	var category models.Category
	err := facades.Orm().Query().Where("slug", slug).First(&category)
	if err != nil {
		return nil, err
	}
	return &category, nil
}

// FindActiveCategories finds all active categories
func (r *CategoryRepository) FindActiveCategories() ([]*models.Category, error) {
	var categories []*models.Category
	err := facades.Orm().Query().Where("is_active", true).Find(&categories)
	return categories, err
}

// FindOrderedBySort finds categories ordered by sort order
func (r *CategoryRepository) FindOrderedBySort() ([]*models.Category, error) {
	var categories []*models.Category
	err := facades.Orm().Query().
		Where("is_active", true).
		Order("sort_order ASC").
		Find(&categories)
	return categories, err
}

// FindWithServices finds category with services loaded
func (r *CategoryRepository) FindWithServices(id uint) (*models.Category, error) {
	var category models.Category
	// For now, just find the category without preloading services
	// Preload functionality will be implemented when available
	err := facades.Orm().Query().Find(&category, id)
	if err != nil {
		return nil, err
	}
	return &category, nil
}

// UpdateSortOrder updates category sort order
func (r *CategoryRepository) UpdateSortOrder(id uint, sortOrder int) error {
	_, err := facades.Orm().Query().Model(&models.Category{}).
		Where("id", id).
		Update("sort_order", sortOrder)
	return err
}

// ActivateCategory activates a category
func (r *CategoryRepository) ActivateCategory(id uint) error {
	_, err := facades.Orm().Query().Model(&models.Category{}).
		Where("id", id).
		Update("is_active", true)
	return err
}

// DeactivateCategory deactivates a category
func (r *CategoryRepository) DeactivateCategory(id uint) error {
	_, err := facades.Orm().Query().Model(&models.Category{}).
		Where("id", id).
		Update("is_active", false)
	return err
}
