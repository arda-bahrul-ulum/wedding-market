package controllers

import (
	"strconv"

	"goravel/app/contracts/services"
	"goravel/app/models"

	"github.com/goravel/framework/contracts/http"
)

type OrderController struct {
	orderService services.OrderServiceInterface
}

func NewOrderController(orderService services.OrderServiceInterface) *OrderController {
	return &OrderController{
		orderService: orderService,
	}
}

// CreateOrder creates a new order
func (c *OrderController) CreateOrder(ctx http.Context) http.Response {
	user := ctx.Value("user").(models.User)

	var request services.CreateOrderRequest
	if err := ctx.Request().Bind(&request); err != nil {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Invalid request data",
			"errors":  err.Error(),
		})
	}

	response, err := c.orderService.Create(user.ID, &request)
	if err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to create order",
		})
	}

	statusCode := 201
	if !response.Success {
		if response.Message == "Vendor not found or inactive" || response.Message == "Service not found" || response.Message == "Package not found" {
			statusCode = 404
		} else {
			statusCode = 500
		}
	}

	return ctx.Response().Status(statusCode).Json(response)
}

// GetOrders returns user's orders
func (c *OrderController) GetOrders(ctx http.Context) http.Response {
	user := ctx.Value("user").(models.User)

	// Get query parameters
	page, _ := strconv.Atoi(ctx.Request().Query("page", "1"))
	limit, _ := strconv.Atoi(ctx.Request().Query("limit", "10"))
	status := ctx.Request().Query("status", "")

	filters := map[string]interface{}{
		"customer_id": user.ID,
		"page":        page,
		"limit":       limit,
		"status":      status,
	}

	response, err := c.orderService.GetOrders(filters)
	if err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to get orders",
		})
	}

	statusCode := 200
	if !response.Success {
		statusCode = 500
	}

	return ctx.Response().Status(statusCode).Json(response)
}

// GetOrderDetail returns order detail
func (c *OrderController) GetOrderDetail(ctx http.Context) http.Response {
	user := ctx.Value("user").(models.User)
	orderIDStr := ctx.Request().Route("id")

	orderID, err := strconv.ParseUint(orderIDStr, 10, 32)
	if err != nil {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Invalid order ID format",
		})
	}

	response, err := c.orderService.GetDetail(uint(orderID), user.ID)
	if err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to get order detail",
		})
	}

	statusCode := 200
	if !response.Success {
		if response.Message == "Order not found" {
			statusCode = 404
		} else {
			statusCode = 500
		}
	}

	return ctx.Response().Status(statusCode).Json(response)
}

// CancelOrder cancels an order
func (c *OrderController) CancelOrder(ctx http.Context) http.Response {
	user := ctx.Value("user").(models.User)
	orderIDStr := ctx.Request().Route("id")

	orderID, err := strconv.ParseUint(orderIDStr, 10, 32)
	if err != nil {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Invalid order ID format",
		})
	}

	response, err := c.orderService.Cancel(uint(orderID), user.ID)
	if err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to cancel order",
		})
	}

	statusCode := 200
	if !response.Success {
		if response.Message == "Order not found" {
			statusCode = 404
		} else if response.Message == "Order cannot be cancelled" {
			statusCode = 400
		} else {
			statusCode = 500
		}
	}

	return ctx.Response().Status(statusCode).Json(response)
}

// UpdateOrder updates an existing order
func (c *OrderController) UpdateOrder(ctx http.Context) http.Response {
	user := ctx.Value("user").(models.User)
	orderIDStr := ctx.Request().Route("id")

	orderID, err := strconv.ParseUint(orderIDStr, 10, 32)
	if err != nil {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Invalid order ID format",
		})
	}

	var request services.UpdateOrderRequest
	if err := ctx.Request().Bind(&request); err != nil {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Invalid request data",
			"errors":  err.Error(),
		})
	}

	request.CustomerID = user.ID

	response, err := c.orderService.Update(user.ID, uint(orderID), &request)
	if err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to update order",
		})
	}

	statusCode := 200
	if !response.Success {
		if response.Message == "Order not found" {
			statusCode = 404
		} else if response.Message == "Order cannot be updated in current status" || response.Message == "Service not found" || response.Message == "Package not found" {
			statusCode = 400
		} else {
			statusCode = 500
		}
	}

	return ctx.Response().Status(statusCode).Json(response)
}

// DeleteOrder deletes an order (soft delete)
func (c *OrderController) DeleteOrder(ctx http.Context) http.Response {
	user := ctx.Value("user").(models.User)
	orderIDStr := ctx.Request().Route("id")

	orderID, err := strconv.ParseUint(orderIDStr, 10, 32)
	if err != nil {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Invalid order ID format",
		})
	}

	response, err := c.orderService.Delete(uint(orderID), user.ID)
	if err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to delete order",
		})
	}

	statusCode := 200
	if !response.Success {
		if response.Message == "Order not found" {
			statusCode = 404
		} else if response.Message == "Order cannot be deleted in current status" {
			statusCode = 400
		} else {
			statusCode = 500
		}
	}

	return ctx.Response().Status(statusCode).Json(response)
}

// GetVendorOrders returns orders for vendor
func (c *OrderController) GetVendorOrders(ctx http.Context) http.Response {
	user := ctx.Value("user").(models.User)

	// Get query parameters
	page, _ := strconv.Atoi(ctx.Request().Query("page", "1"))
	limit, _ := strconv.Atoi(ctx.Request().Query("limit", "10"))
	status := ctx.Request().Query("status", "")

	filters := map[string]interface{}{
		"user_id": user.ID,
		"page":    page,
		"limit":   limit,
		"status":  status,
	}

	response, err := c.orderService.GetVendorOrders(user.ID, filters)
	if err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to get vendor orders",
		})
	}

	statusCode := 200
	if !response.Success {
		if response.Message == "Vendor profile not found" {
			statusCode = 404
		} else {
			statusCode = 500
		}
	}

	return ctx.Response().Status(statusCode).Json(response)
}

// UpdateOrderStatus updates order status (for vendor)
func (c *OrderController) UpdateOrderStatus(ctx http.Context) http.Response {
	user := ctx.Value("user").(models.User)
	orderIDStr := ctx.Request().Route("id")

	orderID, err := strconv.ParseUint(orderIDStr, 10, 32)
	if err != nil {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Invalid order ID format",
		})
	}

	var request services.UpdateOrderStatusRequest
	if err := ctx.Request().Bind(&request); err != nil {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Invalid request data",
			"errors":  err.Error(),
		})
	}

	request.UserID = user.ID

	response, err := c.orderService.UpdateOrderStatus(uint(orderID), user.ID, &request)
	if err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to update order status",
		})
	}

	statusCode := 200
	if !response.Success {
		if response.Message == "Vendor profile not found" || response.Message == "Order not found" {
			statusCode = 404
		} else if response.Message == "Invalid current order status" || response.Message == "Invalid status transition" {
			statusCode = 400
		} else {
			statusCode = 500
		}
	}

	return ctx.Response().Status(statusCode).Json(response)
}

// GetOrderStatistics returns order statistics for vendor
func (c *OrderController) GetOrderStatistics(ctx http.Context) http.Response {
	user := ctx.Value("user").(models.User)

	// Get date range from query parameters
	startDate := ctx.Request().Query("start_date", "")
	endDate := ctx.Request().Query("end_date", "")

	filters := map[string]interface{}{
		"user_id":    user.ID,
		"start_date": startDate,
		"end_date":   endDate,
	}

	response, err := c.orderService.GetOrderStatistics(filters)
	if err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to get order statistics",
		})
	}

	statusCode := 200
	if !response.Success {
		if response.Message == "Vendor profile not found" {
			statusCode = 404
		} else {
			statusCode = 500
		}
	}

	return ctx.Response().Status(statusCode).Json(response)
}

// GetAdminOrders returns all orders for admin
func (c *OrderController) GetAdminOrders(ctx http.Context) http.Response {
	// Get query parameters
	page, _ := strconv.Atoi(ctx.Request().Query("page", "1"))
	limit, _ := strconv.Atoi(ctx.Request().Query("limit", "10"))
	status := ctx.Request().Query("status", "")
	vendorID := ctx.Request().Query("vendor_id", "")
	customerID := ctx.Request().Query("customer_id", "")

	filters := map[string]interface{}{
		"page":        page,
		"limit":       limit,
		"status":      status,
		"vendor_id":   vendorID,
		"customer_id": customerID,
	}

	response, err := c.orderService.GetAdminOrders(filters)
	if err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to get admin orders",
		})
	}

	statusCode := 200
	if !response.Success {
		statusCode = 500
	}

	return ctx.Response().Status(statusCode).Json(response)
}

// GetAdminOrderDetail returns order detail for admin
func (c *OrderController) GetAdminOrderDetail(ctx http.Context) http.Response {
	orderIDStr := ctx.Request().Route("id")
	orderID, err := strconv.ParseUint(orderIDStr, 10, 32)
	if err != nil {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Invalid order ID format",
		})
	}

	response, err := c.orderService.GetAdminOrderDetail(uint(orderID))
	if err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to get admin order detail",
		})
	}

	statusCode := 200
	if !response.Success {
		if response.Message == "Order not found" {
			statusCode = 404
		} else {
			statusCode = 500
		}
	}

	return ctx.Response().Status(statusCode).Json(response)
}

// UpdateAdminOrderStatus updates order status (for admin)
func (c *OrderController) UpdateAdminOrderStatus(ctx http.Context) http.Response {
	orderIDStr := ctx.Request().Route("id")
	orderID, err := strconv.ParseUint(orderIDStr, 10, 32)
	if err != nil {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Invalid order ID format",
		})
	}

	var request services.UpdateOrderStatusRequest
	if err := ctx.Request().Bind(&request); err != nil {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Invalid request data",
			"errors":  err.Error(),
		})
	}

	response, err := c.orderService.UpdateAdminOrderStatus(uint(orderID), &request)
	if err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to update admin order status",
		})
	}

	statusCode := 200
	if !response.Success {
		if response.Message == "Order not found" {
			statusCode = 404
		} else {
			statusCode = 500
		}
	}

	return ctx.Response().Status(statusCode).Json(response)
}

// GetAdminOrderStatistics returns order statistics for admin
func (c *OrderController) GetAdminOrderStatistics(ctx http.Context) http.Response {
	// Get date range from query parameters
	// startDate := ctx.Request().Query("start_date", "")
	// endDate := ctx.Request().Query("end_date", "")

	// filters := map[string]interface{}{
	// 	"start_date": startDate,
	// 	"end_date":   endDate,
	// }

	response, err := c.orderService.GetAdminOrderStatistics(nil, nil)
	if err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to get admin order statistics",
		})
	}

	statusCode := 200
	if !response.Success {
		statusCode = 500
	}

	return ctx.Response().Status(statusCode).Json(response)
}

// ProcessRefund processes order refund (for admin)
func (c *OrderController) ProcessRefund(ctx http.Context) http.Response {
	orderIDStr := ctx.Request().Route("id")
	orderID, err := strconv.ParseUint(orderIDStr, 10, 32)
	if err != nil {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Invalid order ID format",
		})
	}

	var request services.ProcessRefundRequest
	if err := ctx.Request().Bind(&request); err != nil {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Invalid request data",
			"errors":  err.Error(),
		})
	}

	response, err := c.orderService.ProcessRefund(uint(orderID), &request)
	if err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to process refund",
		})
	}

	statusCode := 200
	if !response.Success {
		if response.Message == "Order not found" {
			statusCode = 404
		} else if response.Message == "Order cannot be refunded in current status" {
			statusCode = 400
		} else {
			statusCode = 500
		}
	}

	return ctx.Response().Status(statusCode).Json(response)
}