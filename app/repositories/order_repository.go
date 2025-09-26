package repositories

import (
	"goravel/app/contracts/repositories"
	"goravel/app/models"
	"time"

	"github.com/goravel/framework/facades"
)

type OrderRepository struct {
	BaseRepository[models.Order]
}

func NewOrderRepository() repositories.OrderRepositoryInterface {
	return &OrderRepository{
		BaseRepository: BaseRepository[models.Order]{},
	}
}

func (r *OrderRepository) FindByOrderNumber(orderNumber string) (*models.Order, error) {
	var order models.Order
	err := facades.Orm().Query().Where("order_number", orderNumber).First(&order)
	if err != nil {
		return nil, err
	}
	return &order, nil
}

func (r *OrderRepository) FindByCustomerID(customerID uint) ([]*models.Order, error) {
	var orders []*models.Order
	err := facades.Orm().Query().Where("customer_id", customerID).Order("created_at desc").Get(&orders)
	return orders, err
}

func (r *OrderRepository) FindByVendorID(vendorID uint) ([]*models.Order, error) {
	var orders []*models.Order
	err := facades.Orm().Query().Where("vendor_id", vendorID).Order("created_at desc").Get(&orders)
	return orders, err
}

func (r *OrderRepository) FindByStatus(status string) ([]*models.Order, error) {
	var orders []*models.Order
	err := facades.Orm().Query().Where("status", status).Order("created_at desc").Get(&orders)
	return orders, err
}

func (r *OrderRepository) FindByDateRange(startDate, endDate time.Time) ([]*models.Order, error) {
	var orders []*models.Order
	err := facades.Orm().Query().Where("created_at >= ? AND created_at <= ?", startDate, endDate).Order("created_at desc").Get(&orders)
	return orders, err
}

func (r *OrderRepository) FindWithFilters(filters map[string]interface{}) ([]*models.Order, int64, error) {
	query := facades.Orm().Query().Model(&models.Order{})
	
	// Apply filters
	if status, ok := filters["status"].(string); ok && status != "" && status != "all" {
		query = query.Where("status", status)
	}
	if paymentStatus, ok := filters["payment_status"].(string); ok && paymentStatus != "" && paymentStatus != "all" {
		query = query.Where("payment_status", paymentStatus)
	}
	if vendorID, ok := filters["vendor_id"].(string); ok && vendorID != "" {
		query = query.Where("vendor_id", vendorID)
	}
	if customerID, ok := filters["customer_id"].(string); ok && customerID != "" {
		query = query.Where("customer_id", customerID)
	}
	if search, ok := filters["search"].(string); ok && search != "" {
		query = query.Where("order_number LIKE ?", "%"+search+"%")
	}
	if startDate, ok := filters["start_date"].(string); ok && startDate != "" {
		if parsedDate, err := time.Parse("2006-01-02", startDate); err == nil {
			query = query.Where("DATE(created_at) >= ?", parsedDate.Format("2006-01-02"))
		}
	}
	if endDate, ok := filters["end_date"].(string); ok && endDate != "" {
		if parsedDate, err := time.Parse("2006-01-02", endDate); err == nil {
			query = query.Where("DATE(created_at) <= ?", parsedDate.Format("2006-01-02"))
		}
	}
	
	// Sorting
	sortBy := "created_at"
	sortOrder := "desc"
	if sb, ok := filters["sort_by"].(string); ok && sb != "" {
		validSortFields := map[string]bool{
			"created_at": true, "updated_at": true, "total_amount": true,
			"status": true, "payment_status": true, "event_date": true,
		}
		if validSortFields[sb] {
			sortBy = sb
		}
	}
	if so, ok := filters["sort_order"].(string); ok && so != "" {
		if so == "asc" {
			sortOrder = "asc"
		}
	}
	query = query.Order(sortBy + " " + sortOrder)
	
	// Get total count
	total, err := query.Count()
	if err != nil {
		return nil, 0, err
	}
	
	// Pagination
	page := 1
	limit := 10
	if p, ok := filters["page"].(int); ok && p > 0 {
		page = p
	}
	if l, ok := filters["limit"].(int); ok && l > 0 {
		limit = l
	}
	offset := (page - 1) * limit
	
	var orders []*models.Order
	err = query.Offset(offset).Limit(limit).Get(&orders)
	return orders, total, err
}

func (r *OrderRepository) UpdateStatus(orderID uint, status string, notes string) error {
	updateData := map[string]interface{}{
		"status": status,
	}
	if notes != "" {
		updateData["notes"] = notes
	}
	_, err := facades.Orm().Query().Where("id", orderID).Update(updateData)
	return err
}

func (r *OrderRepository) BulkUpdateStatus(orderIDs []uint, status string, notes string) error {
	updateData := map[string]interface{}{
		"status": status,
	}
	if notes != "" {
		updateData["notes"] = notes
	}
	orderIDsInterface := make([]interface{}, len(orderIDs))
	for i, id := range orderIDs {
		orderIDsInterface[i] = id
	}
	_, err := facades.Orm().Query().WhereIn("id", orderIDsInterface).Update(updateData)
	return err
}

func (r *OrderRepository) GetOrderStatistics(vendorID *uint, startDate, endDate *time.Time) (map[string]interface{}, error) {
	query := facades.Orm().Query().Model(&models.Order{})
	
	if vendorID != nil {
		query = query.Where("vendor_id", *vendorID)
	}
	if startDate != nil {
		query = query.Where("created_at >= ?", *startDate)
	}
	if endDate != nil {
		query = query.Where("created_at <= ?", *endDate)
	}
	
	stats := make(map[string]interface{})
	
	// Total orders
	totalOrders, err := query.Count()
	if err != nil {
		return nil, err
	}
	stats["total_orders"] = totalOrders
	
	// Orders by status
	statusCounts := make(map[string]int64)
	statuses := []string{"pending", "accepted", "rejected", "in_progress", "completed", "cancelled", "refunded"}
	
	for _, status := range statuses {
		count, err := facades.Orm().Query().Model(&models.Order{}).Where("status", status).Count()
		if err == nil {
			statusCounts[status] = count
		}
	}
	stats["status_counts"] = statusCounts
	
	// Revenue calculations
	var totalRevenue float64
	if err := facades.Orm().Query().Model(&models.Order{}).Where("status", "completed").Select("SUM(total_amount)").Scan(&totalRevenue); err != nil {
		totalRevenue = 0
	}
	stats["total_revenue"] = totalRevenue
	
	var totalCommission float64
	if err := facades.Orm().Query().Model(&models.Order{}).Where("status", "completed").Select("SUM(commission)").Scan(&totalCommission); err != nil {
		totalCommission = 0
	}
	stats["total_commission"] = totalCommission
	
	var pendingRevenue float64
	var pendingStatuses = []interface{}{"accepted", "in_progress"}
	if err := facades.Orm().Query().Model(&models.Order{}).WhereIn("status", pendingStatuses).Select("SUM(total_amount)").Scan(&pendingRevenue); err != nil {
		pendingRevenue = 0
	}
	stats["pending_revenue"] = pendingRevenue
	
	return stats, nil
}

func (r *OrderRepository) GetTopVendorsByRevenue(limit int) ([]map[string]interface{}, error) {
	var topVendors []struct {
		VendorID   uint    `json:"vendor_id"`
		Revenue    float64 `json:"revenue"`
		OrderCount int64   `json:"order_count"`
	}
	
	err := facades.Orm().Query().
		Model(&models.Order{}).
		Select("vendor_id, SUM(total_amount) as revenue, COUNT(*) as order_count").
		Where("status", "completed").
		Group("vendor_id").
		Order("revenue desc").
		Limit(limit).
		Scan(&topVendors)
	
	if err != nil {
		return nil, err
	}
	
	result := make([]map[string]interface{}, len(topVendors))
	for i, vendor := range topVendors {
		result[i] = map[string]interface{}{
			"vendor_id":   vendor.VendorID,
			"revenue":     vendor.Revenue,
			"order_count": vendor.OrderCount,
		}
		
		// Get vendor name
		var vendorProfile models.VendorProfile
		if err := facades.Orm().Query().Where("id", vendor.VendorID).First(&vendorProfile); err == nil {
			result[i]["vendor_name"] = vendorProfile.BusinessName
		}
	}
	
	return result, nil
}

func (r *OrderRepository) ExportOrders(filters map[string]interface{}) ([]*models.Order, error) {
	query := facades.Orm().Query().Model(&models.Order{})
	
	// Apply same filters as FindWithFilters but without pagination
	if status, ok := filters["status"].(string); ok && status != "" && status != "all" {
		query = query.Where("status", status)
	}
	if paymentStatus, ok := filters["payment_status"].(string); ok && paymentStatus != "" && paymentStatus != "all" {
		query = query.Where("payment_status", paymentStatus)
	}
	if vendorID, ok := filters["vendor_id"].(string); ok && vendorID != "" {
		query = query.Where("vendor_id", vendorID)
	}
	if customerID, ok := filters["customer_id"].(string); ok && customerID != "" {
		query = query.Where("customer_id", customerID)
	}
	if search, ok := filters["search"].(string); ok && search != "" {
		query = query.Where("order_number LIKE ?", "%"+search+"%")
	}
	if startDate, ok := filters["start_date"].(string); ok && startDate != "" {
		if parsedDate, err := time.Parse("2006-01-02", startDate); err == nil {
			query = query.Where("DATE(created_at) >= ?", parsedDate.Format("2006-01-02"))
		}
	}
	if endDate, ok := filters["end_date"].(string); ok && endDate != "" {
		if parsedDate, err := time.Parse("2006-01-02", endDate); err == nil {
			query = query.Where("DATE(created_at) <= ?", parsedDate.Format("2006-01-02"))
		}
	}
	
	query = query.Order("created_at DESC")
	
	var orders []*models.Order
	err := query.Get(&orders)
	return orders, err
}
