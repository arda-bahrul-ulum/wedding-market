package repositories

import "goravel/app/models"

type ServiceRepositoryInterface interface {
	BaseRepositoryInterface[models.Service]
	
	// Service-specific methods
	FindByID(id uint) (*models.Service, error)
	FindByVendorID(vendorID uint) ([]*models.Service, error)
	FindByCategoryID(categoryID uint) ([]*models.Service, error)
	FindByPriceRange(minPrice, maxPrice float64) ([]*models.Service, error)
	FindActiveServices() ([]*models.Service, error)
	FindWithFilters(filters map[string]interface{}) ([]*models.Service, int64, error)
	SearchServices(query string) ([]*models.Service, error)
	GetServicesByVendorWithPagination(vendorID uint, page, limit int) ([]*models.Service, int64, error)
	UpdateStatus(serviceID uint, isActive bool) error
	CheckActiveOrders(serviceID uint) (int64, error)
}
