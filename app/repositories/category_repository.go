package repositories

import (
	"goravel/app/contracts/repositories"
	"goravel/app/models"

	"github.com/goravel/framework/contracts/database/orm"
	"github.com/goravel/framework/facades"
)

type CategoryRepository struct {
	db orm.Query
}

func NewCategoryRepository() repositories.CategoryRepositoryInterface {
	return &CategoryRepository{
		db: facades.Orm().Query(),
	}
}

func (r *CategoryRepository) Create(category *models.Category) error {
	return r.db.Create(category)
}

func (r *CategoryRepository) FindByID(id uint) (*models.Category, error) {
	var category models.Category
	err := r.db.Where("id = ?", id).First(&category)
	return &category, err
}

func (r *CategoryRepository) FindAll() ([]*models.Category, error) {
	var categories []*models.Category
	err := r.db.Find(&categories)
	return categories, err
}

func (r *CategoryRepository) Update(category *models.Category) error {
	return r.db.Save(category)
}

func (r *CategoryRepository) Delete(category *models.Category) error {
	_, err := r.db.Delete(category)
	return err
}

func (r *CategoryRepository) FindBy(field string, value interface{}) (*models.Category, error) {
	var category models.Category
	err := r.db.Where(field+" = ?", value).First(&category)
	return &category, err
}

func (r *CategoryRepository) FindBySlug(slug string) (*models.Category, error) {
	var category models.Category
	err := r.db.Where("slug = ?", slug).First(&category)
	return &category, err
}

func (r *CategoryRepository) FindByName(name string) (*models.Category, error) {
	var category models.Category
	err := r.db.Where("name = ?", name).First(&category)
	return &category, err
}

func (r *CategoryRepository) FindActiveCategories() ([]*models.Category, error) {
	var categories []*models.Category
	err := r.db.Where("is_active = ?", true).Order("sort_order ASC, name ASC").Find(&categories)
	return categories, err
}

func (r *CategoryRepository) FindOrderedBySort() ([]*models.Category, error) {
	var categories []*models.Category
	err := r.db.Order("sort_order ASC, name ASC").Find(&categories)
	return categories, err
}

func (r *CategoryRepository) FindWithServices(id uint) (*models.Category, error) {
	var category models.Category
	err := r.db.Where("id = ?", id).First(&category)
	return &category, err
}

func (r *CategoryRepository) FindWithFilters(filters *repositories.CategoryFilters, page, limit int) ([]*models.Category, int64, error) {
	var categories []*models.Category
	var total int64

	query := r.db.Model(&models.Category{})

	// Apply filters
	if filters.Name != "" {
		query = query.Where("name ILIKE ?", "%"+filters.Name+"%")
	}
	if filters.IsActive != nil {
		query = query.Where("is_active = ?", *filters.IsActive)
	}

	// Count total
	total, err := query.Count()
	if err != nil {
		return nil, 0, err
	}

	// Apply pagination and ordering
	offset := (page - 1) * limit
	err = query.Order("created_at DESC").Offset(offset).Limit(limit).Find(&categories)

	return categories, total, err
}

func (r *CategoryRepository) UpdateSortOrder(id uint, sortOrder int) error {
	_, err := r.db.Model(&models.Category{}).Where("id = ?", id).Update("sort_order", sortOrder)
	return err
}

func (r *CategoryRepository) ActivateCategory(id uint) error {
	_, err := r.db.Model(&models.Category{}).Where("id = ?", id).Update("is_active", true)
	return err
}

func (r *CategoryRepository) DeactivateCategory(id uint) error {
	_, err := r.db.Model(&models.Category{}).Where("id = ?", id).Update("is_active", false)
	return err
}

func (r *CategoryRepository) GetStatistics() (*repositories.CategoryStatistics, error) {
	var stats repositories.CategoryStatistics

	// Total categories
	var err error
	stats.TotalCategories, err = r.db.Model(&models.Category{}).Count()
	if err != nil {
		return nil, err
	}

	// Active categories
	stats.ActiveCategories, err = r.db.Model(&models.Category{}).Where("is_active = ?", true).Count()
	if err != nil {
		return nil, err
	}

	// Inactive categories
	stats.InactiveCategories = stats.TotalCategories - stats.ActiveCategories

	return &stats, nil
}

// Implement missing methods from BaseRepositoryInterface
func (r *CategoryRepository) CreateBatch(categories []*models.Category) error {
	return r.db.Create(categories)
}

func (r *CategoryRepository) Find(id uint) (*models.Category, error) {
	var category models.Category
	err := r.db.Where("id = ?", id).First(&category)
	return &category, err
}

func (r *CategoryRepository) FindWhere(conditions map[string]interface{}) ([]*models.Category, error) {
	var categories []*models.Category
	query := r.db.Model(&models.Category{})
	for field, value := range conditions {
		query = query.Where(field+" = ?", value)
	}
	err := query.Find(&categories)
	return categories, err
}

func (r *CategoryRepository) FindWithPagination(page, limit int) ([]*models.Category, int64, error) {
	var categories []*models.Category
	var total int64

	// Count total
	var err error
	total, err = r.db.Model(&models.Category{}).Count()
	if err != nil {
		return nil, 0, err
	}

	// Apply pagination
	offset := (page - 1) * limit
	err = r.db.Order("created_at DESC").Offset(offset).Limit(limit).Find(&categories)

	return categories, total, err
}

func (r *CategoryRepository) UpdateByID(id uint, updates map[string]interface{}) error {
	_, err := r.db.Model(&models.Category{}).Where("id = ?", id).Update(updates)
	return err
}

func (r *CategoryRepository) UpdateWhere(conditions map[string]interface{}, updates map[string]interface{}) error {
	query := r.db.Model(&models.Category{})
	for field, value := range conditions {
		query = query.Where(field+" = ?", value)
	}
	_, err := query.Update(updates)
	return err
}


func (r *CategoryRepository) DeleteByID(id uint) error {
	_, err := r.db.Delete(&models.Category{}, id)
	return err
}

func (r *CategoryRepository) DeleteWhere(conditions map[string]interface{}) error {
	query := r.db.Model(&models.Category{})
	for field, value := range conditions {
		query = query.Where(field+" = ?", value)
	}
	_, err := query.Delete(&models.Category{})
	return err
}

func (r *CategoryRepository) Count() (int64, error) {
	return r.db.Model(&models.Category{}).Count()
}

func (r *CategoryRepository) CountWhere(conditions map[string]interface{}) (int64, error) {
	query := r.db.Model(&models.Category{})
	for field, value := range conditions {
		query = query.Where(field+" = ?", value)
	}
	return query.Count()
}

func (r *CategoryRepository) Exists(conditions map[string]interface{}) (bool, error) {
	count, err := r.CountWhere(conditions)
	return count > 0, err
}

func (r *CategoryRepository) ExistsByID(id uint) (bool, error) {
	count, err := r.db.Model(&models.Category{}).Where("id = ?", id).Count()
	return count > 0, err
}

func (r *CategoryRepository) Query() orm.Query {
	return r.db
}
