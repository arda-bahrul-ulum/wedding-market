package controllers

import (
	"encoding/json"
	"fmt"
	"strconv"
	"time"

	"goravel/app/models"

	"github.com/goravel/framework/contracts/http"
	"github.com/goravel/framework/facades"
)

type AdminController struct{}

func NewAdminController() *AdminController {
	return &AdminController{}
}

// GetDashboard returns admin dashboard statistics
func (c *AdminController) GetDashboard(ctx http.Context) http.Response {
	// Get statistics
	var stats struct {
		TotalUsers      int64   `json:"total_users"`
		TotalCustomers  int64   `json:"total_customers"`
		TotalVendors    int64   `json:"total_vendors"`
		TotalOrders     int64   `json:"total_orders"`
		TotalRevenue    float64 `json:"total_revenue"`
		PendingOrders   int64   `json:"pending_orders"`
		ActiveVendors   int64   `json:"active_vendors"`
		NewUsersToday   int64   `json:"new_users_today"`
		NewOrdersToday  int64   `json:"new_orders_today"`
	}

	// Count users
	stats.TotalUsers, _ = facades.Orm().Query().Model(&models.User{}).Count()
	stats.TotalCustomers, _ = facades.Orm().Query().Model(&models.User{}).Where("role", "customer").Count()

	// Count vendors
	stats.TotalVendors, _ = facades.Orm().Query().Model(&models.VendorProfile{}).Count()
	stats.ActiveVendors, _ = facades.Orm().Query().Model(&models.VendorProfile{}).Where("is_active", true).Count()

	// Count orders
	stats.TotalOrders, _ = facades.Orm().Query().Model(&models.Order{}).Count()
	stats.PendingOrders, _ = facades.Orm().Query().Model(&models.Order{}).Where("status", "pending").Count()

	// Calculate revenue
	facades.Orm().Query().Model(&models.Order{}).Where("status", "completed").Select("SUM(commission)").Scan(&stats.TotalRevenue)

	// Count today's data
	today := time.Now().Format("2006-01-02")
	stats.NewUsersToday, _ = facades.Orm().Query().Model(&models.User{}).Where("DATE(created_at) = ?", today).Count()
	stats.NewOrdersToday, _ = facades.Orm().Query().Model(&models.Order{}).Where("DATE(created_at) = ?", today).Count()

	return ctx.Response().Status(200).Json(http.Json{
		"success": true,
		"data":    stats,
	})
}

// GetUsers returns paginated list of users
func (c *AdminController) GetUsers(ctx http.Context) http.Response {
	// Get query parameters
	page, _ := strconv.Atoi(ctx.Request().Query("page", "1"))
	limit, _ := strconv.Atoi(ctx.Request().Query("limit", "10"))
	role := ctx.Request().Query("role", "")
	search := ctx.Request().Query("search", "")

	// Build query
	query := facades.Orm().Query().Model(&models.User{})

	if role != "" {
		query = query.Where("role", role)
	}

	if search != "" {
		query = query.Where("name ILIKE ? OR email ILIKE ?", "%"+search+"%", "%"+search+"%")
	}

	query = query.Order("created_at desc")

	// Get total count
	total, err := query.Count()
	if err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to count users",
		})
	}

	// Calculate pagination
	offset := (page - 1) * limit
	totalPages := int(float64(total)/float64(limit) + 0.5)

	// Get users
	var users []models.User
	if err := query.Offset(offset).Limit(limit).Get(&users); err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to fetch users",
		})
	}

	// Load vendor profiles for vendor users
	for i := range users {
		if users[i].Role == "vendor" {
			facades.Orm().Query().Where("user_id", users[i].ID).First(&users[i].VendorProfile)
		}
	}

	return ctx.Response().Status(200).Json(http.Json{
		"success": true,
		"data": http.Json{
			"users": users,
			"pagination": http.Json{
				"current_page": page,
				"per_page":     limit,
				"total":        total,
				"total_pages":  totalPages,
			},
		},
	})
}

// GetVendors returns paginated list of vendors
func (c *AdminController) GetVendors(ctx http.Context) http.Response {
	// Get query parameters
	page, _ := strconv.Atoi(ctx.Request().Query("page", "1"))
	limit, _ := strconv.Atoi(ctx.Request().Query("limit", "10"))
	status := ctx.Request().Query("status", "") // active, inactive
	verification := ctx.Request().Query("verification", "") // verified, unverified
	businessType := ctx.Request().Query("business_type", "")
	search := ctx.Request().Query("search", "")

	// Build query
	query := facades.Orm().Query().Model(&models.VendorProfile{})

	// Status filter
	switch status {
	case "active":
		query = query.Where("is_active", true)
	case "inactive":
		query = query.Where("is_active", false)
	}

	// Verification filter
	switch verification {
	case "verified":
		query = query.Where("is_verified", true)
	case "unverified":
		query = query.Where("is_verified", false)
	}

	// Business type filter
	if businessType != "" {
		query = query.Where("business_type", businessType)
	}

	// Search filter
	if search != "" {
		query = query.Where("business_name ILIKE ? OR description ILIKE ?", "%"+search+"%", "%"+search+"%")
	}

	query = query.Order("created_at desc")

	// Get total count
	total, err := query.Count()
	if err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to count vendors",
		})
	}

	// Calculate pagination
	offset := (page - 1) * limit
	totalPages := int(float64(total)/float64(limit) + 0.5)

	// Get vendors
	var vendors []models.VendorProfile
	if err := query.Offset(offset).Limit(limit).Get(&vendors); err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to fetch vendors",
		})
	}

	// Load user data
	for i := range vendors {
		facades.Orm().Query().Where("id", vendors[i].UserID).First(&vendors[i].User)
	}

	return ctx.Response().Status(200).Json(http.Json{
		"success": true,
		"data": http.Json{
			"vendors": vendors,
			"pagination": http.Json{
				"current_page": page,
				"per_page":     limit,
				"total":        total,
				"total_pages":  totalPages,
			},
		},
	})
}

// UpdateVendorStatus updates vendor status
func (c *AdminController) UpdateVendorStatus(ctx http.Context) http.Response {
	vendorID := ctx.Request().Route("id")

	var request struct {
		IsActive   *bool `json:"is_active"`
		IsVerified *bool `json:"is_verified"`
	}

	if err := ctx.Request().Bind(&request); err != nil {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Invalid request data",
			"errors":  err.Error(),
		})
	}

	// Get vendor
	var vendor models.VendorProfile
	if err := facades.Orm().Query().Where("id", vendorID).First(&vendor); err != nil {
		return ctx.Response().Status(404).Json(http.Json{
			"success": false,
			"message": "Vendor not found",
		})
	}

	// Update status
	if request.IsActive != nil {
		vendor.IsActive = *request.IsActive
	}
	if request.IsVerified != nil {
		vendor.IsVerified = *request.IsVerified
	}

	if err := facades.Orm().Query().Save(&vendor); err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to update vendor status",
		})
	}

	return ctx.Response().Status(200).Json(http.Json{
		"success": true,
		"message": "Vendor status updated successfully",
		"data":    vendor,
	})
}

// CreateVendor creates a new vendor
func (c *AdminController) CreateVendor(ctx http.Context) http.Response {
	var request struct {
		UserID          uint   `json:"user_id" validate:"required"`
		BusinessName    string `json:"business_name" validate:"required,min=3"`
		BusinessType    string `json:"business_type" validate:"required,oneof=personal company wedding_organizer venue photographer makeup_artist catering decoration"`
		Description     string `json:"description"`
		Address         string `json:"address"`
		City            string `json:"city"`
		Province        string `json:"province"`
		PostalCode      string `json:"postal_code"`
		Latitude        float64 `json:"latitude"`
		Longitude       float64 `json:"longitude"`
		Website         string `json:"website"`
		Instagram       string `json:"instagram"`
		Whatsapp        string `json:"whatsapp"`
		SubscriptionPlan string `json:"subscription_plan" validate:"oneof=free premium enterprise"`
	}

	if err := ctx.Request().Bind(&request); err != nil {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Invalid request data",
			"errors":  err.Error(),
		})
	}

	// Check if user exists
	var user models.User
	if err := facades.Orm().Query().Where("id", request.UserID).First(&user); err != nil {
		return ctx.Response().Status(404).Json(http.Json{
			"success": false,
			"message": "User not found",
		})
	}

	// Check if user already has vendor profile
	var existingVendor models.VendorProfile
	if err := facades.Orm().Query().Where("user_id", request.UserID).First(&existingVendor); err == nil {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "User already has vendor profile",
		})
	}

	// Create vendor profile
	vendor := models.VendorProfile{
		UserID:           request.UserID,
		BusinessName:     request.BusinessName,
		BusinessType:     request.BusinessType,
		Description:      request.Description,
		Address:          request.Address,
		City:             request.City,
		Province:         request.Province,
		PostalCode:       request.PostalCode,
		Latitude:         request.Latitude,
		Longitude:        request.Longitude,
		Website:          request.Website,
		Instagram:        request.Instagram,
		Whatsapp:         request.Whatsapp,
		IsVerified:       false,
		IsActive:         true,
		SubscriptionPlan: request.SubscriptionPlan,
	}

	if err := facades.Orm().Query().Create(&vendor); err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to create vendor profile",
		})
	}

	// Load user data
	facades.Orm().Query().Where("id", vendor.UserID).First(&vendor.User)

	return ctx.Response().Status(201).Json(http.Json{
		"success": true,
		"message": "Vendor profile created successfully",
		"data":    vendor,
	})
}

// UpdateVendor updates vendor profile
func (c *AdminController) UpdateVendor(ctx http.Context) http.Response {
	vendorID := ctx.Request().Route("id")

	var request struct {
		BusinessName    string `json:"business_name" validate:"required,min=3"`
		BusinessType    string `json:"business_type" validate:"required,oneof=personal company wedding_organizer venue photographer makeup_artist catering decoration"`
		Description     string `json:"description"`
		Address         string `json:"address"`
		City            string `json:"city"`
		Province        string `json:"province"`
		PostalCode      string `json:"postal_code"`
		Latitude        float64 `json:"latitude"`
		Longitude       float64 `json:"longitude"`
		Website         string `json:"website"`
		Instagram       string `json:"instagram"`
		Whatsapp        string `json:"whatsapp"`
		SubscriptionPlan string `json:"subscription_plan" validate:"oneof=free premium enterprise"`
	}

	if err := ctx.Request().Bind(&request); err != nil {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Invalid request data",
			"errors":  err.Error(),
		})
	}

	// Get vendor
	var vendor models.VendorProfile
	if err := facades.Orm().Query().Where("id", vendorID).First(&vendor); err != nil {
		return ctx.Response().Status(404).Json(http.Json{
			"success": false,
			"message": "Vendor not found",
		})
	}

	// Update vendor data
	vendor.BusinessName = request.BusinessName
	vendor.BusinessType = request.BusinessType
	vendor.Description = request.Description
	vendor.Address = request.Address
	vendor.City = request.City
	vendor.Province = request.Province
	vendor.PostalCode = request.PostalCode
	vendor.Latitude = request.Latitude
	vendor.Longitude = request.Longitude
	vendor.Website = request.Website
	vendor.Instagram = request.Instagram
	vendor.Whatsapp = request.Whatsapp
	vendor.SubscriptionPlan = request.SubscriptionPlan

	if err := facades.Orm().Query().Save(&vendor); err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to update vendor profile",
		})
	}

	// Load user data
	facades.Orm().Query().Where("id", vendor.UserID).First(&vendor.User)

	return ctx.Response().Status(200).Json(http.Json{
		"success": true,
		"message": "Vendor profile updated successfully",
		"data":    vendor,
	})
}

// DeleteVendor deletes vendor profile
func (c *AdminController) DeleteVendor(ctx http.Context) http.Response {
	vendorID := ctx.Request().Route("id")

	// Get vendor
	var vendor models.VendorProfile
	if err := facades.Orm().Query().Where("id", vendorID).First(&vendor); err != nil {
		return ctx.Response().Status(404).Json(http.Json{
			"success": false,
			"message": "Vendor not found",
		})
	}

	// Delete vendor profile
	if _, err := facades.Orm().Query().Delete(&vendor); err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to delete vendor profile",
		})
	}

	return ctx.Response().Status(200).Json(http.Json{
		"success": true,
		"message": "Vendor profile deleted successfully",
	})
}

// GetOrders returns paginated list of orders with advanced filtering
func (c *AdminController) GetOrders(ctx http.Context) http.Response {
	// Get query parameters
	page, _ := strconv.Atoi(ctx.Request().Query("page", "1"))
	limit, _ := strconv.Atoi(ctx.Request().Query("limit", "10"))
	status := ctx.Request().Query("status", "")
	paymentStatus := ctx.Request().Query("payment_status", "")
	search := ctx.Request().Query("search", "")
	vendorID := ctx.Request().Query("vendor_id", "")
	customerID := ctx.Request().Query("customer_id", "")
	startDate := ctx.Request().Query("start_date", "")
	endDate := ctx.Request().Query("end_date", "")
	sortBy := ctx.Request().Query("sort_by", "created_at")
	sortOrder := ctx.Request().Query("sort_order", "desc")

	// Build query
	query := facades.Orm().Query().Model(&models.Order{})

	// Apply filters
	if status != "" && status != "all" {
		query = query.Where("status", status)
	}

	if paymentStatus != "" && paymentStatus != "all" {
		query = query.Where("payment_status", paymentStatus)
	}

	if vendorID != "" {
		query = query.Where("vendor_id", vendorID)
	}

	if customerID != "" {
		query = query.Where("customer_id", customerID)
	}

	// Date range filter
	if startDate != "" {
		if parsedDate, err := time.Parse("2006-01-02", startDate); err == nil {
			query = query.Where("DATE(created_at) >= ?", parsedDate.Format("2006-01-02"))
		}
	}

	if endDate != "" {
		if parsedDate, err := time.Parse("2006-01-02", endDate); err == nil {
			query = query.Where("DATE(created_at) <= ?", parsedDate.Format("2006-01-02"))
		}
	}

	// Search functionality
	if search != "" {
		searchTerm := "%" + search + "%"
		query = query.Where("order_number LIKE ?", searchTerm)
	}

	// Sorting
	validSortFields := map[string]bool{
		"created_at":     true,
		"updated_at":     true,
		"total_amount":   true,
		"status":         true,
		"payment_status": true,
		"event_date":     true,
	}

	if validSortFields[sortBy] {
		if sortOrder == "asc" {
			query = query.Order(sortBy + " ASC")
		} else {
			query = query.Order(sortBy + " DESC")
		}
	} else {
		query = query.Order("created_at DESC")
	}

	// Get total count
	total, err := query.Count()
	if err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to count orders",
		})
	}

	// Calculate pagination
	offset := (page - 1) * limit
	totalPages := int(float64(total)/float64(limit) + 0.5)

	// Get orders
	var orders []models.Order
	if err := query.Offset(offset).Limit(limit).Get(&orders); err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to fetch orders",
		})
	}

	// Load related data
	for i := range orders {
		facades.Orm().Query().Where("id", orders[i].CustomerID).First(&orders[i].Customer)
		facades.Orm().Query().Where("id", orders[i].VendorID).First(&orders[i].Vendor)
		facades.Orm().Query().Where("id", orders[i].Vendor.UserID).First(&orders[i].Vendor.User)
		facades.Orm().Query().Where("order_id", orders[i].ID).Get(&orders[i].Items)
		facades.Orm().Query().Where("order_id", orders[i].ID).Get(&orders[i].Payments)
	}

	return ctx.Response().Status(200).Json(http.Json{
		"success": true,
		"data": http.Json{
			"orders": orders,
			"pagination": http.Json{
				"current_page": page,
				"per_page":     limit,
				"total":        total,
				"total_pages":  totalPages,
			},
			"filters": http.Json{
				"status":         status,
				"payment_status": paymentStatus,
				"search":         search,
				"vendor_id":      vendorID,
				"customer_id":    customerID,
				"start_date":     startDate,
				"end_date":       endDate,
				"sort_by":        sortBy,
				"sort_order":     sortOrder,
			},
		},
	})
}

// BulkUpdateOrderStatus updates multiple orders status
func (c *AdminController) BulkUpdateOrderStatus(ctx http.Context) http.Response {
	var request struct {
		OrderIDs []uint  `json:"order_ids" validate:"required,min=1"`
		Status   string  `json:"status" validate:"required,oneof=pending accepted rejected in_progress completed cancelled refunded"`
		Notes    string  `json:"notes"`
	}

	if err := ctx.Request().Bind(&request); err != nil {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Invalid request data",
			"errors":  err.Error(),
		})
	}

	// Validate that all orders exist
	var existingOrders []models.Order
	orderIDs := make([]interface{}, len(request.OrderIDs))
	for i, id := range request.OrderIDs {
		orderIDs[i] = id
	}
	if err := facades.Orm().Query().WhereIn("id", orderIDs).Get(&existingOrders); err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to fetch orders",
		})
	}

	if len(existingOrders) != len(request.OrderIDs) {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Some orders not found",
		})
	}

	// Update orders
	updateData := map[string]interface{}{
		"status": request.Status,
	}

	if request.Notes != "" {
		updateData["notes"] = request.Notes
	}

	if _, err := facades.Orm().Query().WhereIn("id", orderIDs).Update(updateData); err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to update orders",
		})
	}

	return ctx.Response().Status(200).Json(http.Json{
		"success": true,
		"message": fmt.Sprintf("Successfully updated %d orders", len(request.OrderIDs)),
	})
}

// BulkDeleteOrders deletes multiple orders
func (c *AdminController) BulkDeleteOrders(ctx http.Context) http.Response {
	var request struct {
		OrderIDs []uint `json:"order_ids" validate:"required,min=1"`
	}

	if err := ctx.Request().Bind(&request); err != nil {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Invalid request data",
			"errors":  err.Error(),
		})
	}

	// Validate that all orders exist and can be deleted
	var existingOrders []models.Order
	orderIDs := make([]interface{}, len(request.OrderIDs))
	for i, id := range request.OrderIDs {
		orderIDs[i] = id
	}
	if err := facades.Orm().Query().WhereIn("id", orderIDs).Get(&existingOrders); err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to fetch orders",
		})
	}

	if len(existingOrders) != len(request.OrderIDs) {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Some orders not found",
		})
	}

	// Check if orders can be deleted (only pending and cancelled orders)
	for _, order := range existingOrders {
		if order.Status != "pending" && order.Status != "cancelled" {
			return ctx.Response().Status(400).Json(http.Json{
				"success": false,
				"message": fmt.Sprintf("Order %s cannot be deleted in current status", order.OrderNumber),
			})
		}
	}

	// Delete order items first
	if _, err := facades.Orm().Query().WhereIn("order_id", orderIDs).Delete(&models.OrderItem{}); err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to delete order items",
		})
	}

	// Delete orders
	if _, err := facades.Orm().Query().WhereIn("id", orderIDs).Delete(&models.Order{}); err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to delete orders",
		})
	}

	return ctx.Response().Status(200).Json(http.Json{
		"success": true,
		"message": fmt.Sprintf("Successfully deleted %d orders", len(request.OrderIDs)),
	})
}

// ExportOrders exports orders to CSV
func (c *AdminController) ExportOrders(ctx http.Context) http.Response {
	// Get query parameters (same as GetOrders)
	status := ctx.Request().Query("status", "")
	paymentStatus := ctx.Request().Query("payment_status", "")
	search := ctx.Request().Query("search", "")
	vendorID := ctx.Request().Query("vendor_id", "")
	customerID := ctx.Request().Query("customer_id", "")
	startDate := ctx.Request().Query("start_date", "")
	endDate := ctx.Request().Query("end_date", "")

	// Build query (same as GetOrders but without pagination)
	query := facades.Orm().Query().Model(&models.Order{})

	// Apply filters (same as GetOrders)
	if status != "" && status != "all" {
		query = query.Where("status", status)
	}

	if paymentStatus != "" && paymentStatus != "all" {
		query = query.Where("payment_status", paymentStatus)
	}

	if vendorID != "" {
		query = query.Where("vendor_id", vendorID)
	}

	if customerID != "" {
		query = query.Where("customer_id", customerID)
	}

	if startDate != "" {
		if parsedDate, err := time.Parse("2006-01-02", startDate); err == nil {
			query = query.Where("DATE(created_at) >= ?", parsedDate.Format("2006-01-02"))
		}
	}

	if endDate != "" {
		if parsedDate, err := time.Parse("2006-01-02", endDate); err == nil {
			query = query.Where("DATE(created_at) <= ?", parsedDate.Format("2006-01-02"))
		}
	}

	if search != "" {
		searchTerm := "%" + search + "%"
		query = query.Where("order_number LIKE ?", searchTerm)
	}

	query = query.Order("created_at DESC")

	// Get all orders
	var orders []models.Order
	if err := query.Get(&orders); err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to fetch orders",
		})
	}

	// Load related data
	for i := range orders {
		facades.Orm().Query().Where("id", orders[i].CustomerID).First(&orders[i].Customer)
		facades.Orm().Query().Where("id", orders[i].VendorID).First(&orders[i].Vendor)
		facades.Orm().Query().Where("id", orders[i].Vendor.UserID).First(&orders[i].Vendor.User)
		facades.Orm().Query().Where("order_id", orders[i].ID).Get(&orders[i].Items)
	}

	// Generate CSV content
	csvContent := "Order Number,Customer Name,Customer Email,Vendor Name,Status,Payment Status,Total Amount,Commission,Vendor Amount,Event Date,Event Location,Items Count,Created At\n"

	for _, order := range orders {
		csvContent += fmt.Sprintf("%s,%s,%s,%s,%s,%s,%.2f,%.2f,%.2f,%s,%s,%d,%s\n",
			order.OrderNumber,
			order.Customer.Name,
			order.Customer.Email,
			order.Vendor.BusinessName,
			order.Status,
			order.PaymentStatus,
			order.TotalAmount,
			order.Commission,
			order.VendorAmount,
			order.EventDate.Format("2006-01-02"),
			order.EventLocation,
			len(order.Items),
			order.CreatedAt.Format("2006-01-02 15:04:05"),
		)
	}

	// Return CSV content
	return ctx.Response().Status(200).String(csvContent)
}

// GetOrderStatusOptions returns available order status options
func (c *AdminController) GetOrderStatusOptions(ctx http.Context) http.Response {
	statusOptions := []map[string]interface{}{
		{"value": "all", "label": "All Status"},
		{"value": "pending", "label": "Pending"},
		{"value": "accepted", "label": "Accepted"},
		{"value": "rejected", "label": "Rejected"},
		{"value": "in_progress", "label": "In Progress"},
		{"value": "completed", "label": "Completed"},
		{"value": "cancelled", "label": "Cancelled"},
		{"value": "refunded", "label": "Refunded"},
	}

	paymentStatusOptions := []map[string]interface{}{
		{"value": "all", "label": "All Payment Status"},
		{"value": "pending", "label": "Pending"},
		{"value": "paid", "label": "Paid"},
		{"value": "partial", "label": "Partial"},
		{"value": "refunded", "label": "Refunded"},
	}

	return ctx.Response().Status(200).Json(http.Json{
		"success": true,
		"data": http.Json{
			"status_options":        statusOptions,
			"payment_status_options": paymentStatusOptions,
		},
	})
}

// GetOrderStatistics returns order statistics for admin dashboard
func (c *AdminController) GetOrderStatistics(ctx http.Context) http.Response {
	// Get date range from query parameters
	startDate := ctx.Request().Query("start_date", "")
	endDate := ctx.Request().Query("end_date", "")

	query := facades.Orm().Query().Model(&models.Order{})

	if startDate != "" {
		if parsedDate, err := time.Parse("2006-01-02", startDate); err == nil {
			query = query.Where("created_at >= ?", parsedDate)
		}
	}

	if endDate != "" {
		if parsedDate, err := time.Parse("2006-01-02", endDate); err == nil {
			query = query.Where("created_at <= ?", parsedDate.Add(24*time.Hour))
		}
	}

	// Get total orders
	totalOrders, err := query.Count()
	if err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to count orders",
		})
	}

	// Get orders by status
	statusCounts := make(map[string]int64)
	statuses := []string{"pending", "accepted", "rejected", "in_progress", "completed", "cancelled", "refunded"}

	for _, status := range statuses {
		count, err := facades.Orm().Query().Model(&models.Order{}).Where("status", status).Count()
		if err == nil {
			statusCounts[status] = count
		}
	}

	// Get total revenue
	var totalRevenue float64
	if err := facades.Orm().Query().Model(&models.Order{}).Where("status", "completed").Select("SUM(total_amount)").Scan(&totalRevenue); err != nil {
		totalRevenue = 0
	}

	// Get total commission
	var totalCommission float64
	if err := facades.Orm().Query().Model(&models.Order{}).Where("status", "completed").Select("SUM(commission)").Scan(&totalCommission); err != nil {
		totalCommission = 0
	}

	// Get pending revenue
	var pendingRevenue float64
	var pendingStatuses = []interface{}{"accepted", "in_progress"}
	if err := facades.Orm().Query().Model(&models.Order{}).WhereIn("status", pendingStatuses).Select("SUM(total_amount)").Scan(&pendingRevenue); err != nil {
		pendingRevenue = 0
	}

	// Get top vendors by revenue
	var topVendors []struct {
		VendorID   uint    `json:"vendor_id"`
		VendorName string  `json:"vendor_name"`
		Revenue    float64 `json:"revenue"`
		OrderCount int64   `json:"order_count"`
	}

	if err := facades.Orm().Query().
		Model(&models.Order{}).
		Select("vendor_id, SUM(total_amount) as revenue, COUNT(*) as order_count").
		Where("status", "completed").
		Group("vendor_id").
		Order("revenue desc").
		Limit(10).
		Scan(&topVendors); err != nil {
		topVendors = []struct {
			VendorID   uint    `json:"vendor_id"`
			VendorName string  `json:"vendor_name"`
			Revenue    float64 `json:"revenue"`
			OrderCount int64   `json:"order_count"`
		}{}
	}

	// Get vendor names
	for i := range topVendors {
		var vendor models.VendorProfile
		if err := facades.Orm().Query().Where("id", topVendors[i].VendorID).First(&vendor); err == nil {
			topVendors[i].VendorName = vendor.BusinessName
		}
	}

	return ctx.Response().Status(200).Json(http.Json{
		"success": true,
		"data": http.Json{
			"total_orders":     totalOrders,
			"status_counts":    statusCounts,
			"total_revenue":    totalRevenue,
			"total_commission": totalCommission,
			"pending_revenue":  pendingRevenue,
			"top_vendors":      topVendors,
		},
	})
}

// GetModuleSettings returns module settings
func (c *AdminController) GetModuleSettings(ctx http.Context) http.Response {
	var settings []models.ModuleSetting
	if err := facades.Orm().Query().Order("module_name").Get(&settings); err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to fetch module settings",
		})
	}

	return ctx.Response().Status(200).Json(http.Json{
		"success": true,
		"data":    settings,
	})
}

// UpdateModuleSetting updates a module setting
func (c *AdminController) UpdateModuleSetting(ctx http.Context) http.Response {
	moduleName := ctx.Request().Route("module")

	var request struct {
		IsEnabled bool   `json:"is_enabled"`
		Settings  string `json:"settings"`
	}

	if err := ctx.Request().Bind(&request); err != nil {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Invalid request data",
			"errors":  err.Error(),
		})
	}

	// Get or create module setting
	var setting models.ModuleSetting
	if err := facades.Orm().Query().Where("module_name", moduleName).First(&setting); err != nil {
		// Create new setting
		setting = models.ModuleSetting{
			ModuleName: moduleName,
			IsEnabled:  request.IsEnabled,
			Settings:   request.Settings,
		}
		if err := facades.Orm().Query().Create(&setting); err != nil {
			return ctx.Response().Status(500).Json(http.Json{
				"success": false,
				"message": "Failed to create module setting",
			})
		}
	} else {
		// Update existing setting
		setting.IsEnabled = request.IsEnabled
		setting.Settings = request.Settings
		if err := facades.Orm().Query().Save(&setting); err != nil {
			return ctx.Response().Status(500).Json(http.Json{
				"success": false,
				"message": "Failed to update module setting",
			})
		}
	}

	return ctx.Response().Status(200).Json(http.Json{
		"success": true,
		"message": "Module setting updated successfully",
		"data":    setting,
	})
}

// GetSystemSettings returns system settings
func (c *AdminController) GetSystemSettings(ctx http.Context) http.Response {
	var settings []models.SystemSetting
	if err := facades.Orm().Query().Order("key").Get(&settings); err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to fetch system settings",
		})
	}

	// Debug: Log all settings from database
	facades.Log().Info(fmt.Sprintf("Total settings from database: %d", len(settings)))
	for _, setting := range settings {
		if setting.Key == "site_description" {
			facades.Log().Info(fmt.Sprintf("Found site_description: Key=%s, Value=%s, Type=%s", setting.Key, setting.Value, setting.Type))
		}
	}

	// Mapping backend keys to frontend keys based on actual database data
	keyMapping := map[string]string{
		// General Settings - from actual database
		"site_name":           "siteName",
		"site_description":    "siteDescription", 
		"site_url":            "siteUrl",
		"admin_email":         "adminEmail",
		"support_email":       "supportEmail",
		
		// Commission Settings - from actual database
		"commission_rate":     "commissionRate",
		"minimum_commission":  "minimumCommission",
		"maximum_commission":  "maximumCommission",
		
		// Payment Settings - from actual database
		"payment_timeout":     "paymentTimeout",
		"refund_period":       "refundPeriod",
		"escrow_period":       "escrowPeriod",
		
		// Subscription Settings - from actual database
		"free_plan_limit":     "freePlanLimit",
		"premium_plan_price":  "premiumPlanPrice",
		"enterprise_plan_price": "enterprisePlanPrice",
		
		// Email Settings - from actual database
		"smtp_host":           "smtpHost",
		"smtp_port":           "smtpPort",
		"smtp_username":       "smtpUsername",
		"smtp_password":       "smtpPassword",
		"smtp_encryption":     "smtpEncryption",
		
		// SEO Settings - from actual database
		"meta_title":          "metaTitle",
		"meta_description":    "metaDescription",
		"meta_keywords":       "metaKeywords",
		
		// Security Settings - from actual database
		"max_login_attempts":  "maxLoginAttempts",
		"lockout_duration":    "lockoutDuration",
		"session_timeout":     "sessionTimeout",
		"require_email_verification": "requireEmailVerification",
		
		// Notification Settings - from actual database
		"email_notifications": "emailNotifications",
		"sms_notifications":   "smsNotifications",
		"push_notifications":  "pushNotifications",
		
		// Feature Settings - from actual database
		"enable_registration":         "enableRegistration",
		"enable_vendor_registration":  "enableVendorRegistration",
		"enable_reviews":              "enableReviews",
		"enable_wishlist":             "enableWishlist",
		"enable_chat":                 "enableChat",
		"enable_blog":                 "enableBlog",
		"enable_faq":                  "enableFaq",
		"enable_ai_chatbot":           "enableAiChatbot",
		"enable_vendor_collaboration": "enableVendorCollaboration",
		"enable_dp_cicilan":           "enableDpCicilan",
		"enable_promo_voucher":        "enablePromoVoucher",
		
		// Payment Gateway Settings - from actual database
		"enable_xendit":        "enableXendit",
		"enable_midtrans":      "enableMidtrans",
		"enable_manual_transfer": "enableManualTransfer",
		"enable_cod":           "enableCod",
		
		// SEO Module Settings - from actual database
		"enable_seo_basic":     "enableSeoBasic",
		"enable_seo_advanced":  "enableSeoAdvanced",
		"enable_seo_automation": "enableSeoAutomation",
	}

	// Since we already cleaned the data, no need to remove duplicates
	// Convert settings to frontend format
	frontendSettings := make([]models.SystemSetting, 0, len(settings))
	for _, setting := range settings {
		// Map backend key to frontend key
		if frontendKey, exists := keyMapping[setting.Key]; exists {
			setting.Key = frontendKey
		}
		// Debug logging for site_description
		if setting.Key == "site_description" || setting.Key == "siteDescription" {
			facades.Log().Info(fmt.Sprintf("Debug site_description: Key=%s, Value=%s, Type=%s", setting.Key, setting.Value, setting.Type))
		}
		frontendSettings = append(frontendSettings, setting)
	}

	return ctx.Response().Status(200).Json(http.Json{
		"success": true,
		"data":    frontendSettings,
	})
}

// UpdateSystemSetting updates a system setting
func (c *AdminController) UpdateSystemSetting(ctx http.Context) http.Response {
	settingKey := ctx.Request().Route("key")

	var request struct {
		Value string `json:"value" validate:"required"`
		Type  string `json:"type" validate:"required,oneof=string number boolean json"`
	}

	if err := ctx.Request().Bind(&request); err != nil {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Invalid request data",
			"errors":  err.Error(),
		})
	}

	// Get or create system setting
	var setting models.SystemSetting
	if err := facades.Orm().Query().Where("key", settingKey).First(&setting); err != nil {
		// Create new setting
		setting = models.SystemSetting{
			Key:   settingKey,
			Value: request.Value,
			Type:  request.Type,
		}
		if err := facades.Orm().Query().Create(&setting); err != nil {
			return ctx.Response().Status(500).Json(http.Json{
				"success": false,
				"message": "Failed to create system setting",
			})
		}
	} else {
		// Update existing setting
		setting.Value = request.Value
		setting.Type = request.Type
		if err := facades.Orm().Query().Save(&setting); err != nil {
			return ctx.Response().Status(500).Json(http.Json{
				"success": false,
				"message": "Failed to update system setting",
			})
		}
	}

	return ctx.Response().Status(200).Json(http.Json{
		"success": true,
		"message": "System setting updated successfully",
		"data":    setting,
	})
}

// BulkUpdateSystemSettings updates multiple system settings at once
func (c *AdminController) BulkUpdateSystemSettings(ctx http.Context) http.Response {
	var request struct {
		Settings map[string]interface{} `json:"settings" validate:"required"`
	}

	if err := ctx.Request().Bind(&request); err != nil {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Invalid request data",
			"errors":  err.Error(),
		})
	}

	// Mapping frontend keys to backend keys based on actual database data
	keyMapping := map[string]string{
		// General Settings - from actual database
		"siteName":           "site_name",
		"siteDescription":    "site_description", 
		"siteUrl":            "site_url",
		"adminEmail":         "admin_email",
		"supportEmail":       "support_email",
		
		// Commission Settings - from actual database
		"commissionRate":     "commission_rate",
		"minimumCommission":  "minimum_commission",
		"maximumCommission":  "maximum_commission",
		
		// Payment Settings - from actual database
		"paymentTimeout":     "payment_timeout",
		"refundPeriod":       "refund_period",
		"escrowPeriod":       "escrow_period",
		
		// Subscription Settings - from actual database
		"freePlanLimit":      "free_plan_limit",
		"premiumPlanPrice":   "premium_plan_price",
		"enterprisePlanPrice": "enterprise_plan_price",
		
		// Email Settings - from actual database
		"smtpHost":           "smtp_host",
		"smtpPort":           "smtp_port",
		"smtpUsername":       "smtp_username",
		"smtpPassword":       "smtp_password",
		"smtpEncryption":     "smtp_encryption",
		
		// SEO Settings - from actual database
		"metaTitle":          "meta_title",
		"metaDescription":    "meta_description",
		"metaKeywords":       "meta_keywords",
		
		// Security Settings - from actual database
		"maxLoginAttempts":   "max_login_attempts",
		"lockoutDuration":    "lockout_duration",
		"sessionTimeout":     "session_timeout",
		"requireEmailVerification": "require_email_verification",
		
		// Notification Settings - from actual database
		"emailNotifications": "email_notifications",
		"smsNotifications":   "sms_notifications",
		"pushNotifications":  "push_notifications",
		
		// Feature Settings - from actual database
		"enableRegistration":         "enable_registration",
		"enableVendorRegistration":   "enable_vendor_registration",
		"enableReviews":              "enable_reviews",
		"enableWishlist":             "enable_wishlist",
		"enableChat":                 "enable_chat",
		"enableBlog":                 "enable_blog",
		"enableFaq":                  "enable_faq",
		"enableAiChatbot":            "enable_ai_chatbot",
		"enableVendorCollaboration":  "enable_vendor_collaboration",
		"enableDpCicilan":            "enable_dp_cicilan",
		"enablePromoVoucher":         "enable_promo_voucher",
		
		// Payment Gateway Settings - from actual database
		"enableXendit":        "enable_xendit",
		"enableMidtrans":      "enable_midtrans",
		"enableManualTransfer": "enable_manual_transfer",
		"enableCod":           "enable_cod",
		
		// SEO Module Settings - from actual database
		"enableSeoBasic":     "enable_seo_basic",
		"enableSeoAdvanced":  "enable_seo_advanced",
		"enableSeoAutomation": "enable_seo_automation",
	}

	updatedSettings := make([]models.SystemSetting, 0, len(request.Settings))

	// Process each setting using upsert approach
	for frontendKey, value := range request.Settings {
		// Get backend key from mapping, fallback to frontend key if not found
		backendKey := keyMapping[frontendKey]
		if backendKey == "" {
			// Skip unknown keys to avoid creating invalid settings
			continue
		}

		// Convert value to string based on its type
		var valueStr string
		var valueType string

		switch v := value.(type) {
		case string:
			valueStr = v
			valueType = "string"
		case float64:
			valueStr = fmt.Sprintf("%.2f", v)
			valueType = "number"
		case bool:
			if v {
				valueStr = "true"
			} else {
				valueStr = "false"
			}
			valueType = "boolean"
		case map[string]interface{}, []interface{}:
			// Convert to JSON string
			if jsonBytes, err := json.Marshal(v); err == nil {
				valueStr = string(jsonBytes)
				valueType = "json"
			} else {
				continue // Skip invalid JSON
			}
		default:
			valueStr = fmt.Sprintf("%v", v)
			valueType = "string"
		}

		// Use upsert approach - update if exists, create if not
		var setting models.SystemSetting
		result := facades.Orm().Query().Where("key", backendKey).First(&setting)
		
		if result.Error() != "" {
			// Key doesn't exist, create new setting
			setting = models.SystemSetting{
				Key:   backendKey,
				Value: valueStr,
				Type:  valueType,
			}
			if err := facades.Orm().Query().Create(&setting); err != nil {
				return ctx.Response().Status(500).Json(http.Json{
					"success": false,
					"message": fmt.Sprintf("Failed to create setting %s: %v", backendKey, err),
				})
			}
		} else {
			// Key exists, update the setting
			setting.Value = valueStr
			setting.Type = valueType
			if _, err := facades.Orm().Query().Where("key", backendKey).Update(&setting); err != nil {
				return ctx.Response().Status(500).Json(http.Json{
					"success": false,
					"message": fmt.Sprintf("Failed to update setting %s: %v", backendKey, err),
				})
			}
		}

		updatedSettings = append(updatedSettings, setting)
	}

	return ctx.Response().Status(200).Json(http.Json{
		"success": true,
		"message": fmt.Sprintf("Successfully updated %d settings", len(updatedSettings)),
		"data":    updatedSettings,
	})
}

// UpdateSystemSettingByKey updates a single system setting by key
func (c *AdminController) UpdateSystemSettingByKey(ctx http.Context) http.Response {
	key := ctx.Request().Input("key")
	if key == "" {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Key parameter is required",
		})
	}

	var request struct {
		Value interface{} `json:"value" validate:"required"`
		Type  string      `json:"type,omitempty"`
	}

	if err := ctx.Request().Bind(&request); err != nil {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Invalid request data",
			"errors":  err.Error(),
		})
	}

	// Convert value to string based on its type
	var valueStr string
	var valueType string

	if request.Type != "" {
		// Use provided type
		valueType = request.Type
		switch request.Type {
		case "string":
			valueStr = fmt.Sprintf("%v", request.Value)
		case "number":
			if v, ok := request.Value.(float64); ok {
				valueStr = fmt.Sprintf("%.2f", v)
			} else {
				valueStr = fmt.Sprintf("%v", request.Value)
			}
		case "boolean":
			if v, ok := request.Value.(bool); ok {
				if v {
					valueStr = "true"
				} else {
					valueStr = "false"
				}
			} else {
				valueStr = fmt.Sprintf("%v", request.Value)
			}
		case "json":
			if jsonBytes, err := json.Marshal(request.Value); err == nil {
				valueStr = string(jsonBytes)
			} else {
				return ctx.Response().Status(400).Json(http.Json{
					"success": false,
					"message": "Invalid JSON value",
				})
			}
		default:
			valueStr = fmt.Sprintf("%v", request.Value)
			valueType = "string"
		}
	} else {
		// Auto-detect type
		switch v := request.Value.(type) {
		case string:
			valueStr = v
			valueType = "string"
		case float64:
			valueStr = fmt.Sprintf("%.2f", v)
			valueType = "number"
		case bool:
			if v {
				valueStr = "true"
			} else {
				valueStr = "false"
			}
			valueType = "boolean"
		case map[string]interface{}, []interface{}:
			if jsonBytes, err := json.Marshal(v); err == nil {
				valueStr = string(jsonBytes)
				valueType = "json"
			} else {
				return ctx.Response().Status(400).Json(http.Json{
					"success": false,
					"message": "Invalid JSON value",
				})
			}
		default:
			valueStr = fmt.Sprintf("%v", v)
			valueType = "string"
		}
	}

	// Use upsert approach
	var setting models.SystemSetting
	result := facades.Orm().Query().Where("key", key).First(&setting)
	
	if result.Error() != "" {
		// Key doesn't exist, create new setting
		setting = models.SystemSetting{
			Key:   key,
			Value: valueStr,
			Type:  valueType,
		}
		if err := facades.Orm().Query().Create(&setting); err != nil {
			return ctx.Response().Status(500).Json(http.Json{
				"success": false,
				"message": fmt.Sprintf("Failed to create setting %s: %v", key, err),
			})
		}
	} else {
		// Key exists, update the setting
		setting.Value = valueStr
		setting.Type = valueType
		if _, err := facades.Orm().Query().Where("key", key).Update(&setting); err != nil {
			return ctx.Response().Status(500).Json(http.Json{
				"success": false,
				"message": fmt.Sprintf("Failed to update setting %s: %v", key, err),
			})
		}
	}

	return ctx.Response().Status(200).Json(http.Json{
		"success": true,
		"message": fmt.Sprintf("Successfully updated setting %s", key),
		"data":    setting,
	})
}

// GetSystemSettingByKey gets a single system setting by key
func (c *AdminController) GetSystemSettingByKey(ctx http.Context) http.Response {
	key := ctx.Request().Input("key")
	if key == "" {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Key parameter is required",
		})
	}

	var setting models.SystemSetting
	if err := facades.Orm().Query().Where("key", key).First(&setting); err != nil {
		return ctx.Response().Status(404).Json(http.Json{
			"success": false,
			"message": fmt.Sprintf("Setting with key '%s' not found", key),
		})
	}

	return ctx.Response().Status(200).Json(http.Json{
		"success": true,
		"data":    setting,
	})
}

// UpdateUser updates user data
func (c *AdminController) UpdateUser(ctx http.Context) http.Response {
	userID := ctx.Request().Route("id")

	var request struct {
		Name    string `json:"name" validate:"required,min=3"`
		Email   string `json:"email" validate:"required,email"`
		Role    string `json:"role" validate:"required,oneof=customer vendor admin super_user"`
		IsActive *bool `json:"is_active"`
	}

	if err := ctx.Request().Bind(&request); err != nil {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Invalid request data",
			"errors":  err.Error(),
		})
	}

	// Get user
	var user models.User
	if err := facades.Orm().Query().Where("id", userID).First(&user); err != nil {
		return ctx.Response().Status(404).Json(http.Json{
			"success": false,
			"message": "User not found",
		})
	}

	// Check if email is already taken by another user
	var existingUser models.User
	if err := facades.Orm().Query().Where("email", request.Email).Where("id !=", userID).First(&existingUser); err == nil {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Email already taken",
		})
	}

	// Prevent changing super_user role
	if user.Role == "super_user" && request.Role != "super_user" {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Cannot change super user role",
		})
	}

	// Update user data
	user.Name = request.Name
	user.Email = request.Email
	user.Role = request.Role
	if request.IsActive != nil {
		user.IsActive = *request.IsActive
	}

	if err := facades.Orm().Query().Save(&user); err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to update user",
		})
	}

	return ctx.Response().Status(200).Json(http.Json{
		"success": true,
		"message": "User updated successfully",
		"data":    user,
	})
}

// UpdateUserStatus updates user status (activate/deactivate)
func (c *AdminController) UpdateUserStatus(ctx http.Context) http.Response {
	userID := ctx.Request().Route("id")

	var request struct {
		IsActive *bool `json:"is_active"`
	}

	if err := ctx.Request().Bind(&request); err != nil {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Invalid request data",
			"errors":  err.Error(),
		})
	}

	// Get user
	var user models.User
	if err := facades.Orm().Query().Where("id", userID).First(&user); err != nil {
		return ctx.Response().Status(404).Json(http.Json{
			"success": false,
			"message": "User not found",
		})
	}

	// Prevent deactivating super_user
	if user.Role == "super_user" && request.IsActive != nil && !*request.IsActive {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Cannot deactivate super user",
		})
	}

	// Update status
	if request.IsActive != nil {
		user.IsActive = *request.IsActive
	}

	if err := facades.Orm().Query().Save(&user); err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to update user status",
		})
	}

	return ctx.Response().Status(200).Json(http.Json{
		"success": true,
		"message": "User status updated successfully",
		"data":    user,
	})
}

// DeleteUser deletes a user
func (c *AdminController) DeleteUser(ctx http.Context) http.Response {
	userID := ctx.Request().Route("id")

	// Get user
	var user models.User
	if err := facades.Orm().Query().Where("id", userID).First(&user); err != nil {
		return ctx.Response().Status(404).Json(http.Json{
			"success": false,
			"message": "User not found",
		})
	}

	// Prevent deleting super_user
	if user.Role == "super_user" {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Cannot delete super user",
		})
	}

	// Delete user (this will cascade delete related records)
	if _, err := facades.Orm().Query().Delete(&user); err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to delete user",
		})
	}

	return ctx.Response().Status(200).Json(http.Json{
		"success": true,
		"message": "User deleted successfully",
	})
}
