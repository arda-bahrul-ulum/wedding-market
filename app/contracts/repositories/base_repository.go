package repositories

import (
	"github.com/goravel/framework/contracts/database/orm"
)

// BaseRepositoryInterface defines common repository operations
type BaseRepositoryInterface[T any] interface {
	// Create operations
	Create(model *T) error
	CreateBatch(models []*T) error

	// Read operations
	Find(id uint) (*T, error)
	FindBy(field string, value interface{}) (*T, error)
	FindAll() ([]*T, error)
	FindWhere(conditions map[string]interface{}) ([]*T, error)
	FindWithPagination(page, limit int) ([]*T, int64, error)

	// Update operations
	Update(model *T) error
	UpdateByID(id uint, updates map[string]interface{}) error
	UpdateWhere(conditions map[string]interface{}, updates map[string]interface{}) error

	// Delete operations
	Delete(model *T) error
	DeleteByID(id uint) error
	DeleteWhere(conditions map[string]interface{}) error

	// Count operations
	Count() (int64, error)
	CountWhere(conditions map[string]interface{}) (int64, error)

	// Utility operations
	Exists(conditions map[string]interface{}) (bool, error)
	ExistsByID(id uint) (bool, error)

	// Query builder access
	Query() orm.Query
}
