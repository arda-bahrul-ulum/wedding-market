package controllers

import (
	"crypto/rand"
	"encoding/hex"
	"fmt"
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

		switch item.ItemType {
		case "service":
			var service models.Service
			if err := facades.Orm().Query().Where("id", item.ItemID).Where("is_active", true).First(&service); err != nil {
				return ctx.Response().Status(404).Json(http.Json{
					"success": false,
					"message": "Service not found",
				})
			}
			itemName = service.Name
			itemPrice = service.Price
		case "package":
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

	// Use default commission rate (5%)
	var commissionRate float64 = 0.05

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

// UpdateOrder updates an existing order
func (c *OrderController) UpdateOrder(ctx http.Context) http.Response {
	user := ctx.Value("user").(models.User)
	orderID := ctx.Request().Route("id")

	var order models.Order
	if err := facades.Orm().Query().Where("id", orderID).Where("customer_id", user.ID).First(&order); err != nil {
		return ctx.Response().Status(404).Json(http.Json{
			"success": false,
			"message": "Order not found",
		})
	}

	// Check if order can be updated
	if order.Status != "pending" {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Order cannot be updated in current status",
		})
	}

	type OrderItemRequest struct {
		ID          *uint   `json:"id"`
		ItemType    string  `json:"item_type" validate:"required,oneof=service package"`
		ItemID      uint    `json:"item_id" validate:"required"`
		Quantity    int     `json:"quantity" validate:"required,min=1"`
		CustomPrice *float64 `json:"custom_price"`
	}

	var request struct {
		EventDate     *time.Time          `json:"event_date"`
		EventLocation *string             `json:"event_location"`
		Notes         *string             `json:"notes"`
		Items         []OrderItemRequest  `json:"items"`
	}

	if err := ctx.Request().Bind(&request); err != nil {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Invalid request data",
			"errors":  err.Error(),
		})
	}

	// Update order fields if provided
	if request.EventDate != nil {
		order.EventDate = *request.EventDate
	}
	if request.EventLocation != nil {
		order.EventLocation = *request.EventLocation
	}
	if request.Notes != nil {
		order.Notes = *request.Notes
	}

	// Update order items if provided
	if len(request.Items) > 0 {
		// Delete existing order items
		if _, err := facades.Orm().Query().Where("order_id", order.ID).Delete(&models.OrderItem{}); err != nil {
			return ctx.Response().Status(500).Json(http.Json{
				"success": false,
				"message": "Failed to delete existing order items",
			})
		}

		// Calculate new total amount
		var totalAmount float64
		var orderItems []models.OrderItem

		for _, item := range request.Items {
			var itemName string
			var itemPrice float64

			switch item.ItemType {
			case "service":
				var service models.Service
				if err := facades.Orm().Query().Where("id", item.ItemID).Where("is_active", true).First(&service); err != nil {
					return ctx.Response().Status(404).Json(http.Json{
						"success": false,
						"message": "Service not found",
					})
				}
				itemName = service.Name
				itemPrice = service.Price
			case "package":
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
				OrderID:    order.ID,
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

		// Use default commission rate (5%)
		var commissionRate float64 = 0.05

		commission := totalAmount * commissionRate
		vendorAmount := totalAmount - commission

		order.TotalAmount = totalAmount
		order.Commission = commission
		order.VendorAmount = vendorAmount

		// Create new order items
		for i := range orderItems {
			if err := facades.Orm().Query().Create(&orderItems[i]); err != nil {
				return ctx.Response().Status(500).Json(http.Json{
					"success": false,
					"message": "Failed to create order items",
				})
			}
		}
	}

	// Save updated order
	if err := facades.Orm().Query().Save(&order); err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to update order",
		})
	}

	// Load order with relations
	facades.Orm().Query().Where("id", order.ID).First(&order)
	facades.Orm().Query().Where("id", order.CustomerID).First(&order.Customer)
	facades.Orm().Query().Where("id", order.VendorID).First(&order.Vendor)
	facades.Orm().Query().Where("id", order.Vendor.UserID).First(&order.Vendor.User)
	facades.Orm().Query().Where("order_id", order.ID).Get(&order.Items)

	return ctx.Response().Status(200).Json(http.Json{
		"success": true,
		"message": "Order updated successfully",
		"data":    order,
	})
}

// DeleteOrder deletes an order (soft delete)
func (c *OrderController) DeleteOrder(ctx http.Context) http.Response {
	user := ctx.Value("user").(models.User)
	orderID := ctx.Request().Route("id")

	var order models.Order
	if err := facades.Orm().Query().Where("id", orderID).Where("customer_id", user.ID).First(&order); err != nil {
		return ctx.Response().Status(404).Json(http.Json{
			"success": false,
			"message": "Order not found",
		})
	}

	// Check if order can be deleted
	if order.Status != "pending" && order.Status != "cancelled" {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Order cannot be deleted in current status",
		})
	}

	// Delete order items first
	if _, err := facades.Orm().Query().Where("order_id", order.ID).Delete(&models.OrderItem{}); err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to delete order items",
		})
	}

	// Delete order
	if _, err := facades.Orm().Query().Delete(&order); err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to delete order",
		})
	}

	return ctx.Response().Status(200).Json(http.Json{
		"success": true,
		"message": "Order deleted successfully",
	})
}

// GetVendorOrders returns orders for vendor
func (c *OrderController) GetVendorOrders(ctx http.Context) http.Response {
	user := ctx.Value("user").(models.User)

	// Get vendor profile
	var vendor models.VendorProfile
	if err := facades.Orm().Query().Where("user_id", user.ID).First(&vendor); err != nil {
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
	query := facades.Orm().Query().Model(&models.Order{}).Where("vendor_id", vendor.ID)

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

// UpdateOrderStatus updates order status (for vendor)
func (c *OrderController) UpdateOrderStatus(ctx http.Context) http.Response {
	user := ctx.Value("user").(models.User)
	orderID := ctx.Request().Route("id")

	// Get vendor profile
	var vendor models.VendorProfile
	if err := facades.Orm().Query().Where("user_id", user.ID).First(&vendor); err != nil {
		return ctx.Response().Status(404).Json(http.Json{
			"success": false,
			"message": "Vendor profile not found",
		})
	}

	var order models.Order
	if err := facades.Orm().Query().Where("id", orderID).Where("vendor_id", vendor.ID).First(&order); err != nil {
		return ctx.Response().Status(404).Json(http.Json{
			"success": false,
			"message": "Order not found",
		})
	}

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

	// Validate status transition
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
			"message": fmt.Sprintf("Cannot change status from %s to %s", order.Status, request.Status),
		})
	}

	// Update order status
	order.Status = request.Status
	if request.Notes != "" {
		order.Notes = request.Notes
	}

	if err := facades.Orm().Query().Save(&order); err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to update order status",
		})
	}

	// Load order with relations
	facades.Orm().Query().Where("id", order.ID).First(&order)
	facades.Orm().Query().Where("id", order.CustomerID).First(&order.Customer)
	facades.Orm().Query().Where("id", order.VendorID).First(&order.Vendor)
	facades.Orm().Query().Where("id", order.Vendor.UserID).First(&order.Vendor.User)
	facades.Orm().Query().Where("order_id", order.ID).Get(&order.Items)

	return ctx.Response().Status(200).Json(http.Json{
		"success": true,
		"message": "Order status updated successfully",
		"data":    order,
	})
}

// GetOrderStatistics returns order statistics for vendor
func (c *OrderController) GetOrderStatistics(ctx http.Context) http.Response {
	user := ctx.Value("user").(models.User)

	// Get vendor profile
	var vendor models.VendorProfile
	if err := facades.Orm().Query().Where("user_id", user.ID).First(&vendor); err != nil {
		return ctx.Response().Status(404).Json(http.Json{
			"success": false,
			"message": "Vendor profile not found",
		})
	}

	// Get date range from query parameters
	startDate := ctx.Request().Query("start_date", "")
	endDate := ctx.Request().Query("end_date", "")

	query := facades.Orm().Query().Model(&models.Order{}).Where("vendor_id", vendor.ID)

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
		count, err := facades.Orm().Query().Model(&models.Order{}).Where("vendor_id", vendor.ID).Where("status", status).Count()
		if err == nil {
			statusCounts[status] = count
		}
	}

	// Get total revenue
	var totalRevenue float64
	if err := facades.Orm().Query().Model(&models.Order{}).Where("vendor_id", vendor.ID).Where("status", "completed").Select("SUM(vendor_amount)").Scan(&totalRevenue); err != nil {
		totalRevenue = 0
	}

	// Get pending revenue (accepted orders)
	var pendingRevenue float64
	var pendingStatuses = []interface{}{"accepted", "in_progress"}
	if err := facades.Orm().Query().Model(&models.Order{}).Where("vendor_id", vendor.ID).WhereIn("status", pendingStatuses).Select("SUM(vendor_amount)").Scan(&pendingRevenue); err != nil {
		pendingRevenue = 0
	}

	return ctx.Response().Status(200).Json(http.Json{
		"success": true,
		"data": http.Json{
			"total_orders":     totalOrders,
			"status_counts":    statusCounts,
			"total_revenue":    totalRevenue,
			"pending_revenue":  pendingRevenue,
		},
	})
}

// GetAdminOrders returns all orders for admin
func (c *OrderController) GetAdminOrders(ctx http.Context) http.Response {
	// Get query parameters
	page, _ := strconv.Atoi(ctx.Request().Query("page", "1"))
	limit, _ := strconv.Atoi(ctx.Request().Query("limit", "10"))
	status := ctx.Request().Query("status", "")
	vendorID := ctx.Request().Query("vendor_id", "")
	customerID := ctx.Request().Query("customer_id", "")

	// Build query
	query := facades.Orm().Query().Model(&models.Order{})

	if status != "" {
		query = query.Where("status", status)
	}
	if vendorID != "" {
		query = query.Where("vendor_id", vendorID)
	}
	if customerID != "" {
		query = query.Where("customer_id", customerID)
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

// GetAdminOrderDetail returns order detail for admin
func (c *OrderController) GetAdminOrderDetail(ctx http.Context) http.Response {
	orderIDStr := ctx.Request().Route("id")
	orderID, err := strconv.Atoi(orderIDStr)
	if err != nil {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Invalid order ID",
		})
	}

	var order models.Order
	if err := facades.Orm().Query().Where("id", orderID).First(&order); err != nil {
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

// UpdateAdminOrderStatus updates order status (for admin)
func (c *OrderController) UpdateAdminOrderStatus(ctx http.Context) http.Response {
	orderIDStr := ctx.Request().Route("id")
	orderID, err := strconv.Atoi(orderIDStr)
	if err != nil {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Invalid order ID",
		})
	}

	var order models.Order
	if err := facades.Orm().Query().Where("id", orderID).First(&order); err != nil {
		return ctx.Response().Status(404).Json(http.Json{
			"success": false,
			"message": "Order not found",
		})
	}

	var request struct {
		Status string `json:"status" validate:"required,oneof=pending accepted rejected in_progress completed cancelled refunded"`
		Notes  string `json:"notes"`
	}

	if err := ctx.Request().Bind(&request); err != nil {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Invalid request data",
			"errors":  err.Error(),
		})
	}

	// Update order status
	order.Status = request.Status
	if request.Notes != "" {
		order.Notes = request.Notes
	}

	if err := facades.Orm().Query().Save(&order); err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to update order status",
		})
	}

	// Load order with relations
	facades.Orm().Query().Where("id", order.ID).First(&order)
	facades.Orm().Query().Where("id", order.CustomerID).First(&order.Customer)
	facades.Orm().Query().Where("id", order.VendorID).First(&order.Vendor)
	facades.Orm().Query().Where("id", order.Vendor.UserID).First(&order.Vendor.User)
	facades.Orm().Query().Where("order_id", order.ID).Get(&order.Items)

	return ctx.Response().Status(200).Json(http.Json{
		"success": true,
		"message": "Order status updated successfully",
		"data":    order,
	})
}

// GetAdminOrderStatistics returns order statistics for admin
func (c *OrderController) GetAdminOrderStatistics(ctx http.Context) http.Response {
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

// ProcessRefund processes order refund (for admin)
func (c *OrderController) ProcessRefund(ctx http.Context) http.Response {
	orderIDStr := ctx.Request().Route("id")
	orderID, err := strconv.Atoi(orderIDStr)
	if err != nil {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Invalid order ID",
		})
	}

	var order models.Order
	if err := facades.Orm().Query().Where("id", orderID).First(&order); err != nil {
		return ctx.Response().Status(404).Json(http.Json{
			"success": false,
			"message": "Order not found",
		})
	}

	var request struct {
		Reason string `json:"reason" validate:"required"`
		Amount *float64 `json:"amount"`
	}

	if err := ctx.Request().Bind(&request); err != nil {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Invalid request data",
			"errors":  err.Error(),
		})
	}

	// Check if order can be refunded
	if order.Status != "completed" && order.Status != "accepted" {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Order cannot be refunded in current status",
		})
	}

	// Set refund amount (default to total amount if not specified)
	refundAmount := order.TotalAmount
	if request.Amount != nil {
		refundAmount = *request.Amount
	}

	// Update order status to refunded
	order.Status = "refunded"
	order.Notes = fmt.Sprintf("Refund processed: %s", request.Reason)

	if err := facades.Orm().Query().Save(&order); err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to process refund",
		})
	}

	// Load order with relations
	facades.Orm().Query().Where("id", order.ID).First(&order)
	facades.Orm().Query().Where("id", order.CustomerID).First(&order.Customer)
	facades.Orm().Query().Where("id", order.VendorID).First(&order.Vendor)
	facades.Orm().Query().Where("id", order.Vendor.UserID).First(&order.Vendor.User)
	facades.Orm().Query().Where("order_id", order.ID).Get(&order.Items)

	return ctx.Response().Status(200).Json(http.Json{
		"success": true,
		"message": "Refund processed successfully",
		"data": http.Json{
			"order":        order,
			"refund_amount": refundAmount,
			"reason":       request.Reason,
		},
	})
}

// Helper function to generate random string
func generateRandomString(length int) string {
	bytes := make([]byte, length/2)
	rand.Read(bytes)
	return hex.EncodeToString(bytes)
}
