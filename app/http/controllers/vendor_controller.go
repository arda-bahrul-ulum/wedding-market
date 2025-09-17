package controllers

import (
	"strconv"
	"time"

	"goravel/app/models"

	"github.com/goravel/framework/contracts/http"
	"github.com/goravel/framework/facades"
)

type VendorController struct{}

func NewVendorController() *VendorController {
	return &VendorController{}
}

// GetProfile returns vendor profile
func (c *VendorController) GetProfile(ctx http.Context) http.Response {
	user := ctx.Value("user").(models.User)

	var vendorProfile models.VendorProfile
	if err := facades.Orm().Query().Where("user_id", user.ID).First(&vendorProfile); err != nil {
		return ctx.Response().Status(404).Json(http.Json{
			"success": false,
			"message": "Vendor profile not found",
		})
	}

	// Load user data
	vendorProfile.User = user

	return ctx.Response().Status(200).Json(http.Json{
		"success": true,
		"data":    vendorProfile,
	})
}

// UpdateProfile updates vendor profile
func (c *VendorController) UpdateProfile(ctx http.Context) http.Response {
	user := ctx.Value("user").(models.User)

	var request struct {
		BusinessName string  `json:"business_name" validate:"required"`
		BusinessType string  `json:"business_type" validate:"required,oneof=personal company wedding_organizer"`
		Description  string  `json:"description"`
		Address      string  `json:"address"`
		City         string  `json:"city"`
		Province     string  `json:"province"`
		PostalCode   string  `json:"postal_code"`
		Latitude     float64 `json:"latitude"`
		Longitude    float64 `json:"longitude"`
		Website      string  `json:"website"`
		Instagram    string  `json:"instagram"`
		Whatsapp     string  `json:"whatsapp"`
	}

	if err := ctx.Request().Bind(&request); err != nil {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Invalid request data",
			"errors":  err.Error(),
		})
	}

	var vendorProfile models.VendorProfile
	if err := facades.Orm().Query().Where("user_id", user.ID).First(&vendorProfile); err != nil {
		return ctx.Response().Status(404).Json(http.Json{
			"success": false,
			"message": "Vendor profile not found",
		})
	}

	// Update profile
	vendorProfile.BusinessName = request.BusinessName
	vendorProfile.BusinessType = request.BusinessType
	vendorProfile.Description = request.Description
	vendorProfile.Address = request.Address
	vendorProfile.City = request.City
	vendorProfile.Province = request.Province
	vendorProfile.PostalCode = request.PostalCode
	vendorProfile.Latitude = request.Latitude
	vendorProfile.Longitude = request.Longitude
	vendorProfile.Website = request.Website
	vendorProfile.Instagram = request.Instagram
	vendorProfile.Whatsapp = request.Whatsapp

	if err := facades.Orm().Query().Save(&vendorProfile); err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to update profile",
		})
	}

	return ctx.Response().Status(200).Json(http.Json{
		"success": true,
		"message": "Profile updated successfully",
		"data":    vendorProfile,
	})
}

// GetServices returns vendor's services
func (c *VendorController) GetServices(ctx http.Context) http.Response {
	user := ctx.Value("user").(models.User)

	// Get vendor profile
	var vendorProfile models.VendorProfile
	if err := facades.Orm().Query().Where("user_id", user.ID).First(&vendorProfile); err != nil {
		return ctx.Response().Status(404).Json(http.Json{
			"success": false,
			"message": "Vendor profile not found",
		})
	}

	// Get query parameters
	page, _ := strconv.Atoi(ctx.Request().Query("page", "1"))
	limit, _ := strconv.Atoi(ctx.Request().Query("limit", "10"))
	categoryID := ctx.Request().Query("category_id", "")
	search := ctx.Request().Query("search", "")

	// Build query
	query := facades.Orm().Query().Model(&models.Service{}).Where("vendor_id", vendorProfile.ID)

	if categoryID != "" {
		query = query.Where("category_id", categoryID)
	}

	if search != "" {
		query = query.Where("name ILIKE ? OR description ILIKE ?", "%"+search+"%", "%"+search+"%")
	}

	query = query.Order("created_at desc")

	// Get total count
	total, err := query.Count()
	if err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to count services",
		})
	}

	// Calculate pagination
	offset := (page - 1) * limit
	totalPages := int(float64(total)/float64(limit) + 0.5)

	// Get services
	var services []models.Service
	if err := query.Offset(offset).Limit(limit).Get(&services); err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to fetch services",
		})
	}

	// Load categories
	for i := range services {
		facades.Orm().Query().Where("id", services[i].CategoryID).First(&services[i].Category)
	}

	return ctx.Response().Status(200).Json(http.Json{
		"success": true,
		"data": http.Json{
			"services": services,
			"pagination": http.Json{
				"current_page": page,
				"per_page":     limit,
				"total":        total,
				"total_pages":  totalPages,
			},
		},
	})
}

// CreateService creates a new service
func (c *VendorController) CreateService(ctx http.Context) http.Response {
	user := ctx.Value("user").(models.User)

	var request struct {
		CategoryID uint    `json:"category_id" validate:"required"`
		Name       string  `json:"name" validate:"required"`
		Description string `json:"description"`
		Price      float64 `json:"price" validate:"required,min=0"`
		PriceType  string  `json:"price_type" validate:"required,oneof=fixed hourly daily custom"`
		MinPrice   float64 `json:"min_price"`
		MaxPrice   float64 `json:"max_price"`
		Images     string  `json:"images"` // JSON array
		Tags       string  `json:"tags"`   // JSON array
	}

	if err := ctx.Request().Bind(&request); err != nil {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Invalid request data",
			"errors":  err.Error(),
		})
	}

	// Get vendor profile
	var vendorProfile models.VendorProfile
	if err := facades.Orm().Query().Where("user_id", user.ID).First(&vendorProfile); err != nil {
		return ctx.Response().Status(404).Json(http.Json{
			"success": false,
			"message": "Vendor profile not found",
		})
	}

	// Verify category exists
	var category models.Category
	if err := facades.Orm().Query().Where("id", request.CategoryID).Where("is_active", true).First(&category); err != nil {
		return ctx.Response().Status(404).Json(http.Json{
			"success": false,
			"message": "Category not found",
		})
	}

	// Create service
	service := models.Service{
		VendorID:    vendorProfile.ID,
		CategoryID:  request.CategoryID,
		Name:        request.Name,
		Description: request.Description,
		Price:       request.Price,
		PriceType:   request.PriceType,
		MinPrice:    request.MinPrice,
		MaxPrice:    request.MaxPrice,
		IsActive:    true,
		Images:      request.Images,
		Tags:        request.Tags,
	}

	if err := facades.Orm().Query().Create(&service); err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to create service",
		})
	}

	// Load category
	service.Category = category

	return ctx.Response().Status(201).Json(http.Json{
		"success": true,
		"message": "Service created successfully",
		"data":    service,
	})
}

// UpdateService updates a service
func (c *VendorController) UpdateService(ctx http.Context) http.Response {
	user := ctx.Value("user").(models.User)
	serviceID := ctx.Request().Route("id")

	// Get vendor profile
	var vendorProfile models.VendorProfile
	if err := facades.Orm().Query().Where("user_id", user.ID).First(&vendorProfile); err != nil {
		return ctx.Response().Status(404).Json(http.Json{
			"success": false,
			"message": "Vendor profile not found",
		})
	}

	// Get service
	var service models.Service
	if err := facades.Orm().Query().Where("id", serviceID).Where("vendor_id", vendorProfile.ID).First(&service); err != nil {
		return ctx.Response().Status(404).Json(http.Json{
			"success": false,
			"message": "Service not found",
		})
	}

	var request struct {
		CategoryID  uint    `json:"category_id" validate:"required"`
		Name        string  `json:"name" validate:"required"`
		Description string  `json:"description"`
		Price       float64 `json:"price" validate:"required,min=0"`
		PriceType   string  `json:"price_type" validate:"required,oneof=fixed hourly daily custom"`
		MinPrice    float64 `json:"min_price"`
		MaxPrice    float64 `json:"max_price"`
		IsActive    bool    `json:"is_active"`
		Images      string  `json:"images"`
		Tags        string  `json:"tags"`
	}

	if err := ctx.Request().Bind(&request); err != nil {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Invalid request data",
			"errors":  err.Error(),
		})
	}

	// Verify category exists
	var category models.Category
	if err := facades.Orm().Query().Where("id", request.CategoryID).Where("is_active", true).First(&category); err != nil {
		return ctx.Response().Status(404).Json(http.Json{
			"success": false,
			"message": "Category not found",
		})
	}

	// Update service
	service.CategoryID = request.CategoryID
	service.Name = request.Name
	service.Description = request.Description
	service.Price = request.Price
	service.PriceType = request.PriceType
	service.MinPrice = request.MinPrice
	service.MaxPrice = request.MaxPrice
	service.IsActive = request.IsActive
	service.Images = request.Images
	service.Tags = request.Tags

	if err := facades.Orm().Query().Save(&service); err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to update service",
		})
	}

	// Load category
	service.Category = category

	return ctx.Response().Status(200).Json(http.Json{
		"success": true,
		"message": "Service updated successfully",
		"data":    service,
	})
}

// DeleteService deletes a service
func (c *VendorController) DeleteService(ctx http.Context) http.Response {
	user := ctx.Value("user").(models.User)
	serviceID := ctx.Request().Route("id")

	// Get vendor profile
	var vendorProfile models.VendorProfile
	if err := facades.Orm().Query().Where("user_id", user.ID).First(&vendorProfile); err != nil {
		return ctx.Response().Status(404).Json(http.Json{
			"success": false,
			"message": "Vendor profile not found",
		})
	}

	// Get service
	var service models.Service
	if err := facades.Orm().Query().Where("id", serviceID).Where("vendor_id", vendorProfile.ID).First(&service); err != nil {
		return ctx.Response().Status(404).Json(http.Json{
			"success": false,
			"message": "Service not found",
		})
	}

	// Check if service has active orders
	orderCount, err := facades.Orm().Query().Model(&models.OrderItem{}).Where("service_id", serviceID).Where("order_id IN (SELECT id FROM orders WHERE status IN ('pending', 'accepted', 'in_progress'))").Count()
	if err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to check active orders",
		})
	}

	if orderCount > 0 {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Cannot delete service with active orders",
		})
	}

	// Delete service
	if _, err := facades.Orm().Query().Delete(&service); err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to delete service",
		})
	}

	return ctx.Response().Status(200).Json(http.Json{
		"success": true,
		"message": "Service deleted successfully",
	})
}

// GetOrders returns vendor's orders
func (c *VendorController) GetOrders(ctx http.Context) http.Response {
	user := ctx.Value("user").(models.User)

	// Get vendor profile
	var vendorProfile models.VendorProfile
	if err := facades.Orm().Query().Where("user_id", user.ID).First(&vendorProfile); err != nil {
		return ctx.Response().Status(404).Json(http.Json{
			"success": false,
			"message": "Vendor profile not found",
		})
	}

	// Get query parameters
	page, _ := strconv.Atoi(ctx.Request().Query("page", "1"))
	limit, _ := strconv.Atoi(ctx.Request().Query("limit", "10"))
	status := ctx.Request().Query("status", "")

	// Build query
	query := facades.Orm().Query().Model(&models.Order{}).Where("vendor_id", vendorProfile.ID)

	if status != "" {
		query = query.Where("status", status)
	}

	query = query.Order("created_at desc")

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
		facades.Orm().Query().Where("order_id", orders[i].ID).Get(&orders[i].Items)
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
		},
	})
}

// UpdateOrderStatus updates order status
func (c *VendorController) UpdateOrderStatus(ctx http.Context) http.Response {
	user := ctx.Value("user").(models.User)
	orderID := ctx.Request().Route("id")

	var request struct {
		Status string `json:"status" validate:"required,oneof=accepted rejected in_progress completed"`
		Notes  string `json:"notes"`
	}

	if err := ctx.Request().Bind(&request); err != nil {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Invalid request data",
			"errors":  err.Error(),
		})
	}

	// Get vendor profile
	var vendorProfile models.VendorProfile
	if err := facades.Orm().Query().Where("user_id", user.ID).First(&vendorProfile); err != nil {
		return ctx.Response().Status(404).Json(http.Json{
			"success": false,
			"message": "Vendor profile not found",
		})
	}

	// Get order
	var order models.Order
	if err := facades.Orm().Query().Where("id", orderID).Where("vendor_id", vendorProfile.ID).First(&order); err != nil {
		return ctx.Response().Status(404).Json(http.Json{
			"success": false,
			"message": "Order not found",
		})
	}

	// Check if status change is valid
	validTransitions := map[string][]string{
		"pending":    {"accepted", "rejected"},
		"accepted":   {"in_progress", "rejected"},
		"in_progress": {"completed"},
		"completed":  {},
		"rejected":   {},
		"cancelled":  {},
		"refunded":   {},
	}

	allowedStatuses, exists := validTransitions[order.Status]
	if !exists {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Invalid current order status",
		})
	}

	validTransition := false
	for _, status := range allowedStatuses {
		if status == request.Status {
			validTransition = true
			break
		}
	}

	if !validTransition {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Invalid status transition",
		})
	}

	// Update order
	order.Status = request.Status
	if request.Notes != "" {
		order.Notes = request.Notes
	}

	// If order is completed, release escrow
	if request.Status == "completed" {
		order.EscrowReleased = true
		now := time.Now()
		order.EscrowReleasedAt = &now
	}

	if err := facades.Orm().Query().Save(&order); err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to update order status",
		})
	}

	return ctx.Response().Status(200).Json(http.Json{
		"success": true,
		"message": "Order status updated successfully",
		"data":    order,
	})
}
