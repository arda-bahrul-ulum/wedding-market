package repositories

import (
	"goravel/app/contracts/repositories"
	"goravel/app/models"

	"github.com/goravel/framework/facades"
)

type ServiceRepository struct {
	BaseRepository[models.Service]
}

func NewServiceRepository() repositories.ServiceRepositoryInterface {
	return &ServiceRepository{
		BaseRepository: BaseRepository[models.Service]{},
	}
}

func (r *ServiceRepository) FindByVendorID(vendorID uint) ([]*models.Service, error) {
	var services []*models.Service
	err := facades.Orm().Query().Where("vendor_id", vendorID).Order("created_at desc").Get(&services)
	return services, err
}

func (r *ServiceRepository) FindByCategoryID(categoryID uint) ([]*models.Service, error) {
	var services []*models.Service
	err := facades.Orm().Query().Where("category_id", categoryID).Where("is_active", true).Order("created_at desc").Get(&services)
	return services, err
}

func (r *ServiceRepository) FindByPriceRange(minPrice, maxPrice float64) ([]*models.Service, error) {
	var services []*models.Service
	query := facades.Orm().Query().Where("is_active", true)
	
	if minPrice > 0 {
		query = query.Where("price >= ?", minPrice)
	}
	if maxPrice > 0 {
		query = query.Where("price <= ?", maxPrice)
	}
	
	err := query.Order("created_at desc").Get(&services)
	return services, err
}

func (r *ServiceRepository) FindActiveServices() ([]*models.Service, error) {
	var services []*models.Service
	err := facades.Orm().Query().Where("is_active", true).Order("created_at desc").Get(&services)
	return services, err
}

func (r *ServiceRepository) FindWithFilters(filters map[string]interface{}) ([]*models.Service, int64, error) {
	query := facades.Orm().Query().Model(&models.Service{}).Where("is_active", true)
	
	// Apply filters
	if vendorID, ok := filters["vendor_id"].(string); ok && vendorID != "" {
		query = query.Where("vendor_id", vendorID)
	}
	if categoryID, ok := filters["category_id"].(string); ok && categoryID != "" {
		query = query.Where("category_id", categoryID)
	}
	if minPrice, ok := filters["min_price"].(float64); ok && minPrice > 0 {
		query = query.Where("price >= ?", minPrice)
	}
	if maxPrice, ok := filters["max_price"].(float64); ok && maxPrice > 0 {
		query = query.Where("price <= ?", maxPrice)
	}
	if search, ok := filters["search"].(string); ok && search != "" {
		query = query.Where("name ILIKE ? OR description ILIKE ?", "%"+search+"%", "%"+search+"%")
	}
	
	// Sorting
	sortBy := "created_at"
	sortOrder := "desc"
	if sb, ok := filters["sort_by"].(string); ok && sb != "" {
		sortBy = sb
	}
	if so, ok := filters["sort_order"].(string); ok && so != "" {
		sortOrder = so
	}
	query = query.Order(sortBy + " " + sortOrder)
	
	// Get total count
	total, err := query.Count()
	if err != nil {
		return nil, 0, err
	}
	
	// Pagination
	page := 1
	limit := 12
	if p, ok := filters["page"].(int); ok && p > 0 {
		page = p
	}
	if l, ok := filters["limit"].(int); ok && l > 0 {
		limit = l
	}
	offset := (page - 1) * limit
	
	var services []*models.Service
	err = query.Offset(offset).Limit(limit).Get(&services)
	return services, total, err
}

func (r *ServiceRepository) SearchServices(query string) ([]*models.Service, error) {
	var services []*models.Service
	err := facades.Orm().Query().
		Where("is_active", true).
		Where("name ILIKE ? OR description ILIKE ?", "%"+query+"%", "%"+query+"%").
		Order("created_at desc").
		Get(&services)
	return services, err
}

func (r *ServiceRepository) GetServicesByVendorWithPagination(vendorID uint, page, limit int) ([]*models.Service, int64, error) {
	query := facades.Orm().Query().Model(&models.Service{}).Where("vendor_id", vendorID)
	
	// Get total count
	total, err := query.Count()
	if err != nil {
		return nil, 0, err
	}
	
	// Pagination
	offset := (page - 1) * limit
	
	var services []*models.Service
	err = query.Offset(offset).Limit(limit).Order("created_at desc").Get(&services)
	return services, total, err
}

func (r *ServiceRepository) UpdateStatus(serviceID uint, isActive bool) error {
	_, err := facades.Orm().Query().Where("id", serviceID).Update(map[string]interface{}{
		"is_active": isActive,
	})
	return err
}

func (r *ServiceRepository) CheckActiveOrders(serviceID uint) (int64, error) {
	return facades.Orm().Query().
		Model(&models.OrderItem{}).
		Where("service_id", serviceID).
		Where("order_id IN (SELECT id FROM orders WHERE status IN ('pending', 'accepted', 'in_progress'))").
		Count()
}
