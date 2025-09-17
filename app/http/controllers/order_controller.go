package controllers

import (
	"crypto/rand"
	"encoding/hex"
	"strconv"
	"time"

	"goravel/app/models"

	"github.com/goravel/framework/contracts/http"
	"github.com/goravel/framework/facades"
)

type OrderController struct{}

func NewOrderController() *OrderController {
	return &OrderController{}
}

// CreateOrder creates a new order
func (c *OrderController) CreateOrder(ctx http.Context) http.Response {
	user := ctx.Value("user").(models.User)

	type OrderItemRequest struct {
		ItemType   string  `json:"item_type" validate:"required,oneof=service package"`
		ItemID     uint    `json:"item_id" validate:"required"`
		Quantity   int     `json:"quantity" validate:"required,min=1"`
		CustomPrice *float64 `json:"custom_price"`
	}

	var request struct {
		VendorID      uint                    `json:"vendor_id" validate:"required"`
		EventDate     time.Time               `json:"event_date" validate:"required"`
		EventLocation string                  `json:"event_location" validate:"required"`
		Notes         string                  `json:"notes"`
		Items         []OrderItemRequest      `json:"items" validate:"required,min=1"`
	}

	if err := ctx.Request().Bind(&request); err != nil {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Invalid request data",
			"errors":  err.Error(),
		})
	}

	// Verify vendor exists and is active
	var vendor models.VendorProfile
	if err := facades.Orm().Query().Where("id", request.VendorID).Where("is_active", true).First(&vendor); err != nil {
		return ctx.Response().Status(404).Json(http.Json{
			"success": false,
			"message": "Vendor not found or inactive",
		})
	}

	// Generate order number
	orderNumber := "WC" + time.Now().Format("20060102") + generateRandomString(6)

	// Calculate total amount and create order items
	var totalAmount float64
	var orderItems []models.OrderItem

	for _, item := range request.Items {
		var itemName string
		var itemPrice float64

		if item.ItemType == "service" {
			var service models.Service
			if err := facades.Orm().Query().Where("id", item.ItemID).Where("is_active", true).First(&service); err != nil {
				return ctx.Response().Status(404).Json(http.Json{
					"success": false,
					"message": "Service not found",
				})
			}
			itemName = service.Name
			itemPrice = service.Price
		} else if item.ItemType == "package" {
			var pkg models.Package
			if err := facades.Orm().Query().Where("id", item.ItemID).Where("is_active", true).First(&pkg); err != nil {
				return ctx.Response().Status(404).Json(http.Json{
					"success": false,
					"message": "Package not found",
				})
			}
			itemName = pkg.Name
			itemPrice = pkg.Price
		}

		// Use custom price if provided
		if item.CustomPrice != nil {
			itemPrice = *item.CustomPrice
		}

		totalItemPrice := itemPrice * float64(item.Quantity)
		totalAmount += totalItemPrice

		orderItem := models.OrderItem{
			ItemType:   item.ItemType,
			ItemName:   itemName,
			Quantity:   item.Quantity,
			Price:      itemPrice,
			TotalPrice: totalItemPrice,
		}

		if item.ItemType == "service" {
			orderItem.ServiceID = &item.ItemID
		} else {
			orderItem.PackageID = &item.ItemID
		}

		orderItems = append(orderItems, orderItem)
	}

	// Get commission rate from system settings
	var commissionRate float64 = 0.05 // Default 5%
	var setting models.SystemSetting
	if err := facades.Orm().Query().Where("key", "commission_rate").First(&setting); err == nil {
		if rate, err := strconv.ParseFloat(setting.Value, 64); err == nil {
			commissionRate = rate
		}
	}

	commission := totalAmount * commissionRate
	vendorAmount := totalAmount - commission

	// Create order
	order := models.Order{
		OrderNumber:   orderNumber,
		CustomerID:    user.ID,
		VendorID:      request.VendorID,
		Status:        "pending",
		TotalAmount:   totalAmount,
		Commission:    commission,
		VendorAmount:  vendorAmount,
		EventDate:     request.EventDate,
		EventLocation: request.EventLocation,
		Notes:         request.Notes,
		PaymentStatus: "pending",
		IsEscrow:      true,
	}

	if err := facades.Orm().Query().Create(&order); err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to create order",
		})
	}

	// Create order items
	for i := range orderItems {
		orderItems[i].OrderID = order.ID
		if err := facades.Orm().Query().Create(&orderItems[i]); err != nil {
			// Rollback order if items creation fails
			facades.Orm().Query().Delete(&order)
			return ctx.Response().Status(500).Json(http.Json{
				"success": false,
				"message": "Failed to create order items",
			})
		}
	}

	// Load order with relations
	facades.Orm().Query().Where("id", order.ID).First(&order)
	facades.Orm().Query().Where("id", order.CustomerID).First(&order.Customer)
	facades.Orm().Query().Where("id", order.VendorID).First(&order.Vendor)
	facades.Orm().Query().Where("id", order.Vendor.UserID).First(&order.Vendor.User)
	facades.Orm().Query().Where("order_id", order.ID).Get(&order.Items)

	return ctx.Response().Status(201).Json(http.Json{
		"success": true,
		"message": "Order created successfully",
		"data":    order,
	})
}

// GetOrders returns user's orders
func (c *OrderController) GetOrders(ctx http.Context) http.Response {
	user := ctx.Value("user").(models.User)

	// Get query parameters
	page, _ := strconv.Atoi(ctx.Request().Query("page", "1"))
	limit, _ := strconv.Atoi(ctx.Request().Query("limit", "10"))
	status := ctx.Request().Query("status", "")

	// Build query
	query := facades.Orm().Query().Model(&models.Order{}).Where("customer_id", user.ID)

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
		facades.Orm().Query().Where("id", orders[i].VendorID).First(&orders[i].Vendor)
		facades.Orm().Query().Where("id", orders[i].Vendor.UserID).First(&orders[i].Vendor.User)
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

// GetOrderDetail returns order detail
func (c *OrderController) GetOrderDetail(ctx http.Context) http.Response {
	user := ctx.Value("user").(models.User)
	orderID := ctx.Request().Route("id")

	var order models.Order
	if err := facades.Orm().Query().Where("id", orderID).Where("customer_id", user.ID).First(&order); err != nil {
		return ctx.Response().Status(404).Json(http.Json{
			"success": false,
			"message": "Order not found",
		})
	}

	// Load related data
	facades.Orm().Query().Where("id", order.CustomerID).First(&order.Customer)
	facades.Orm().Query().Where("id", order.VendorID).First(&order.Vendor)
	facades.Orm().Query().Where("id", order.Vendor.UserID).First(&order.Vendor.User)
	facades.Orm().Query().Where("order_id", order.ID).Get(&order.Items)
	facades.Orm().Query().Where("order_id", order.ID).Get(&order.Payments)

	return ctx.Response().Status(200).Json(http.Json{
		"success": true,
		"data":    order,
	})
}

// CancelOrder cancels an order
func (c *OrderController) CancelOrder(ctx http.Context) http.Response {
	user := ctx.Value("user").(models.User)
	orderID := ctx.Request().Route("id")

	var order models.Order
	if err := facades.Orm().Query().Where("id", orderID).Where("customer_id", user.ID).First(&order); err != nil {
		return ctx.Response().Status(404).Json(http.Json{
			"success": false,
			"message": "Order not found",
		})
	}

	// Check if order can be cancelled
	if order.Status != "pending" && order.Status != "accepted" {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Order cannot be cancelled",
		})
	}

	// Update order status
	order.Status = "cancelled"
	if err := facades.Orm().Query().Save(&order); err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to cancel order",
		})
	}

	return ctx.Response().Status(200).Json(http.Json{
		"success": true,
		"message": "Order cancelled successfully",
	})
}

// Helper function to generate random string
func generateRandomString(length int) string {
	bytes := make([]byte, length/2)
	rand.Read(bytes)
	return hex.EncodeToString(bytes)
}
