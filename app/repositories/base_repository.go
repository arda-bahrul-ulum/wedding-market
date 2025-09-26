package repositories

import (
	"errors"

	"github.com/goravel/framework/contracts/database/orm"
	"github.com/goravel/framework/facades"
)

// BaseRepository provides common repository operations
type BaseRepository[T any] struct {
	model T
}

// NewBaseRepository creates a new base repository instance
func NewBaseRepository[T any](model T) *BaseRepository[T] {
	return &BaseRepository[T]{
		model: model,
	}
}

// Create creates a new record
func (r *BaseRepository[T]) Create(model *T) error {
	return facades.Orm().Query().Create(model)
}

// CreateBatch creates multiple records
func (r *BaseRepository[T]) CreateBatch(models []*T) error {
	if len(models) == 0 {
		return errors.New("no models to create")
	}
	return facades.Orm().Query().Create(models)
}

// Find finds a record by ID
func (r *BaseRepository[T]) Find(id uint) (*T, error) {
	var model T
	err := facades.Orm().Query().Find(&model, id)
	if err != nil {
		return nil, err
	}
	return &model, nil
}

// FindBy finds a record by specific field
func (r *BaseRepository[T]) FindBy(field string, value interface{}) (*T, error) {
	var model T
	err := facades.Orm().Query().Where(field, value).First(&model)
	if err != nil {
		return nil, err
	}
	return &model, nil
}

// FindAll finds all records
func (r *BaseRepository[T]) FindAll() ([]*T, error) {
	var models []*T
	err := facades.Orm().Query().Find(&models)
	return models, err
}

// FindWhere finds records with conditions
func (r *BaseRepository[T]) FindWhere(conditions map[string]interface{}) ([]*T, error) {
	var models []*T
	query := facades.Orm().Query()
	
	for field, value := range conditions {
		query = query.Where(field, value)
	}
	
	err := query.Find(&models)
	return models, err
}

// FindWithPagination finds records with pagination
func (r *BaseRepository[T]) FindWithPagination(page, limit int) ([]*T, int64, error) {
	var models []*T
	
	// Get total count
	total, countErr := facades.Orm().Query().Model(&r.model).Count()
	if countErr != nil {
		return nil, 0, countErr
	}
	
	// Get paginated records
	offset := (page - 1) * limit
	err := facades.Orm().Query().Offset(offset).Limit(limit).Find(&models)
	
	return models, total, err
}

// Update updates a record
func (r *BaseRepository[T]) Update(model *T) error {
	return facades.Orm().Query().Save(model)
}

// UpdateByID updates a record by ID
func (r *BaseRepository[T]) UpdateByID(id uint, updates map[string]interface{}) error {
	_, err := facades.Orm().Query().Model(&r.model).Where("id", id).Update(updates)
	return err
}

// UpdateWhere updates records with conditions
func (r *BaseRepository[T]) UpdateWhere(conditions map[string]interface{}, updates map[string]interface{}) error {
	query := facades.Orm().Query().Model(&r.model)
	
	for field, value := range conditions {
		query = query.Where(field, value)
	}
	
	_, err := query.Update(updates)
	return err
}

// Delete deletes a record
func (r *BaseRepository[T]) Delete(model *T) error {
	_, err := facades.Orm().Query().Delete(model)
	return err
}

// DeleteByID deletes a record by ID
func (r *BaseRepository[T]) DeleteByID(id uint) error {
	_, err := facades.Orm().Query().Delete(&r.model, id)
	return err
}

// DeleteWhere deletes records with conditions
func (r *BaseRepository[T]) DeleteWhere(conditions map[string]interface{}) error {
	query := facades.Orm().Query().Model(&r.model)
	
	for field, value := range conditions {
		query = query.Where(field, value)
	}
	
	_, err := query.Delete(&r.model)
	return err
}

// Count counts all records
func (r *BaseRepository[T]) Count() (int64, error) {
	return facades.Orm().Query().Model(&r.model).Count()
}

// CountWhere counts records with conditions
func (r *BaseRepository[T]) CountWhere(conditions map[string]interface{}) (int64, error) {
	query := facades.Orm().Query().Model(&r.model)
	
	for field, value := range conditions {
		query = query.Where(field, value)
	}
	
	return query.Count()
}

// Exists checks if any record exists with conditions
func (r *BaseRepository[T]) Exists(conditions map[string]interface{}) (bool, error) {
	count, err := r.CountWhere(conditions)
	return count > 0, err
}

// ExistsByID checks if a record exists by ID
func (r *BaseRepository[T]) ExistsByID(id uint) (bool, error) {
	return r.Exists(map[string]interface{}{"id": id})
}

// Query returns the query builder for custom operations
func (r *BaseRepository[T]) Query() orm.Query {
	return facades.Orm().Query()
}
