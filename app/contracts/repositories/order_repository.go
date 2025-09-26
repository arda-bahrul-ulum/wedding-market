package repositories

import (
	"goravel/app/models"
	"time"
)

type OrderRepositoryInterface interface {
	BaseRepositoryInterface[models.Order]
	
	// Order-specific methods
	FindByID(id uint) (*models.Order, error)
	FindByOrderNumber(orderNumber string) (*models.Order, error)
	FindByCustomerID(customerID uint) ([]*models.Order, error)
	FindByVendorID(vendorID uint) ([]*models.Order, error)
	FindByStatus(status string) ([]*models.Order, error)
	FindByDateRange(startDate, endDate time.Time) ([]*models.Order, error)
	FindWithFilters(filters map[string]interface{}) ([]*models.Order, int64, error)
	UpdateStatus(orderID uint, status string, notes string) error
	BulkUpdateStatus(orderIDs []uint, status string, notes string) error
	GetOrderStatistics(vendorID *uint, startDate, endDate *time.Time) (map[string]interface{}, error)
	GetTopVendorsByRevenue(limit int) ([]map[string]interface{}, error)
	ExportOrders(filters map[string]interface{}) ([]*models.Order, error)
}
