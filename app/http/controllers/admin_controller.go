package controllers

import (
	"strconv"

	"goravel/app/contracts/services"

	"github.com/goravel/framework/contracts/http"
)

type AdminController struct {
	adminService services.AdminServiceInterface
}

func NewAdminController(adminService services.AdminServiceInterface) *AdminController {
	return &AdminController{
		adminService: adminService,
	}
}

// GetDashboard returns admin dashboard statistics
func (c *AdminController) GetDashboard(ctx http.Context) http.Response {
	response, err := c.adminService.GetDashboard()
	if err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to get dashboard statistics",
		})
	}

	statusCode := 200
	if !response.Success {
		statusCode = 500
	}

	return ctx.Response().Status(statusCode).Json(response)
}

// GetUsers returns paginated list of users
func (c *AdminController) GetUsers(ctx http.Context) http.Response {
	// Get query parameters
	page, _ := strconv.Atoi(ctx.Request().Query("page", "1"))
	limit, _ := strconv.Atoi(ctx.Request().Query("limit", "10"))
	role := ctx.Request().Query("role", "")
	search := ctx.Request().Query("search", "")

	filters := map[string]interface{}{
		"page":   page,
		"limit":  limit,
		"role":   role,
		"search": search,
	}

	response, err := c.adminService.GetUsers(filters)
	if err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to get users",
		})
	}

	statusCode := 200
	if !response.Success {
		statusCode = 500
	}

	return ctx.Response().Status(statusCode).Json(response)
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

	filters := map[string]interface{}{
		"page":           page,
		"limit":          limit,
		"status":         status,
		"verification":   verification,
		"business_type":  businessType,
		"search":         search,
	}

	response, err := c.adminService.GetVendors(filters)
	if err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to get vendors",
		})
	}

	statusCode := 200
	if !response.Success {
		statusCode = 500
	}

	return ctx.Response().Status(statusCode).Json(response)
}

// UpdateVendorStatus updates vendor status
func (c *AdminController) UpdateVendorStatus(ctx http.Context) http.Response {
	vendorIDStr := ctx.Request().Route("id")
	vendorID, err := strconv.ParseUint(vendorIDStr, 10, 32)
	if err != nil {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Invalid vendor ID",
		})
	}

	var request services.UpdateVendorStatusRequest
	if err := ctx.Request().Bind(&request); err != nil {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Invalid request data",
			"errors":  err.Error(),
		})
	}

	response, err := c.adminService.UpdateVendorStatus(uint(vendorID), &request)
	if err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to update vendor status",
		})
	}

	statusCode := 200
	if !response.Success {
		if response.Message == "Vendor not found" {
			statusCode = 404
		} else {
			statusCode = 500
		}
	}

	return ctx.Response().Status(statusCode).Json(response)
}

// CreateVendor creates a new vendor
func (c *AdminController) CreateVendor(ctx http.Context) http.Response {
	var request services.CreateVendorRequest
	if err := ctx.Request().Bind(&request); err != nil {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Invalid request data",
			"errors":  err.Error(),
		})
	}

	response, err := c.adminService.CreateVendor(&request)
	if err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to create vendor",
		})
	}

	statusCode := 201
	if !response.Success {
		if response.Message == "User not found" {
			statusCode = 404
		} else if response.Message == "User already has vendor profile" {
			statusCode = 400
		} else {
			statusCode = 500
		}
	}

	return ctx.Response().Status(statusCode).Json(response)
}

// UpdateVendor updates vendor profile
func (c *AdminController) UpdateVendor(ctx http.Context) http.Response {
	vendorIDStr := ctx.Request().Route("id")
	vendorID, err := strconv.ParseUint(vendorIDStr, 10, 32)
	if err != nil {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Invalid vendor ID",
		})
	}

	var request services.UpdateVendorRequest
	if err := ctx.Request().Bind(&request); err != nil {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Invalid request data",
			"errors":  err.Error(),
		})
	}

	response, err := c.adminService.UpdateVendor(uint(vendorID), &request)
	if err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to update vendor",
		})
	}

	statusCode := 200
	if !response.Success {
		if response.Message == "Vendor not found" {
			statusCode = 404
		} else {
			statusCode = 500
		}
	}

	return ctx.Response().Status(statusCode).Json(response)
}

// DeleteVendor deletes vendor profile
func (c *AdminController) DeleteVendor(ctx http.Context) http.Response {
	vendorIDStr := ctx.Request().Route("id")
	vendorID, err := strconv.ParseUint(vendorIDStr, 10, 32)
	if err != nil {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Invalid vendor ID",
		})
	}

	response, err := c.adminService.DeleteVendor(uint(vendorID))
	if err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to delete vendor",
		})
	}

	statusCode := 200
	if !response.Success {
		if response.Message == "Vendor not found" {
			statusCode = 404
		} else {
			statusCode = 500
		}
	}

	return ctx.Response().Status(statusCode).Json(response)
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

	filters := map[string]interface{}{
		"page":           page,
		"limit":          limit,
		"status":         status,
		"payment_status": paymentStatus,
		"search":         search,
		"vendor_id":      vendorID,
		"customer_id":    customerID,
		"start_date":     startDate,
		"end_date":       endDate,
		"sort_by":        sortBy,
		"sort_order":     sortOrder,
	}

	response, err := c.adminService.GetAdminOrders(filters)
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

// BulkUpdateOrderStatus updates multiple orders status
func (c *AdminController) BulkUpdateOrderStatus(ctx http.Context) http.Response {
	var request services.BulkUpdateOrderStatusRequest
	if err := ctx.Request().Bind(&request); err != nil {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Invalid request data",
			"errors":  err.Error(),
		})
	}

	response, err := c.adminService.BulkUpdateOrderStatus(&request)
	if err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to update orders",
		})
	}

	statusCode := 200
	if !response.Success {
		if response.Message == "Some orders not found" {
			statusCode = 400
		} else {
			statusCode = 500
		}
	}

	return ctx.Response().Status(statusCode).Json(response)
}

// BulkDeleteOrders deletes multiple orders
func (c *AdminController) BulkDeleteOrders(ctx http.Context) http.Response {
	var request services.BulkDeleteOrdersRequest
	if err := ctx.Request().Bind(&request); err != nil {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Invalid request data",
			"errors":  err.Error(),
		})
	}

	err := c.adminService.BulkDeleteOrders(&request)
	if err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to delete orders",
		})
	}

	return ctx.Response().Status(200).Json(http.Json{
		"success": true,
		"message": "Orders deleted successfully",
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

	filters := map[string]interface{}{
		"status":         status,
		"payment_status": paymentStatus,
		"search":         search,
		"vendor_id":      vendorID,
		"customer_id":    customerID,
		"start_date":     startDate,
		"end_date":       endDate,
	}

	response, err := c.adminService.ExportOrders(filters)
	if err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to export orders",
		})
	}

	if !response.Success {
		return ctx.Response().Status(500).Json(response)
	}

	// Return CSV content
	return ctx.Response().Status(200).String(response.Data.(string))
}

// GetOrderStatusOptions returns available order status options
func (c *AdminController) GetOrderStatusOptions(ctx http.Context) http.Response {
	response, err := c.adminService.GetOrderStatusOptions()
	if err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to get order status options",
		})
	}

	statusCode := 200
	if !response.Success {
		statusCode = 500
	}

	return ctx.Response().Status(statusCode).Json(response)
}

// GetOrderStatistics returns order statistics for admin dashboard
func (c *AdminController) GetOrderStatistics(ctx http.Context) http.Response {
	// Get date range from query parameters
	startDate := ctx.Request().Query("start_date", "")
	endDate := ctx.Request().Query("end_date", "")

	filters := map[string]interface{}{
		"start_date": startDate,
		"end_date":   endDate,
	}

	response, err := c.adminService.GetOrderStatistics(filters)
	if err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to get order statistics",
		})
	}

	statusCode := 200
	if !response.Success {
		statusCode = 500
	}

	return ctx.Response().Status(statusCode).Json(response)
}

// UpdateUser updates user data
func (c *AdminController) UpdateUser(ctx http.Context) http.Response {
	userIDStr := ctx.Request().Route("id")
	userID, err := strconv.ParseUint(userIDStr, 10, 32)
	if err != nil {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Invalid user ID",
		})
	}

	var request services.AdminUpdateUserRequest
	if err := ctx.Request().Bind(&request); err != nil {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Invalid request data",
			"errors":  err.Error(),
		})
	}

	response, err := c.adminService.UpdateUser(uint(userID), &request)
	if err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to update user",
		})
	}

	statusCode := 200
	if !response.Success {
		if response.Message == "User not found" {
			statusCode = 404
		} else if response.Message == "Email already taken" || response.Message == "Cannot change super user role" {
			statusCode = 400
		} else {
			statusCode = 500
		}
	}

	return ctx.Response().Status(statusCode).Json(response)
}

// UpdateUserStatus updates user status (activate/deactivate)
func (c *AdminController) UpdateUserStatus(ctx http.Context) http.Response {
	userIDStr := ctx.Request().Route("id")
	userID, err := strconv.ParseUint(userIDStr, 10, 32)
	if err != nil {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Invalid user ID",
		})
	}

	var request services.UpdateUserStatusRequest
	if err := ctx.Request().Bind(&request); err != nil {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Invalid request data",
			"errors":  err.Error(),
		})
	}

	response, err := c.adminService.UpdateUserStatus(uint(userID), &request)
	if err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to update user status",
		})
	}

	statusCode := 200
	if !response.Success {
		if response.Message == "User not found" {
			statusCode = 404
		} else if response.Message == "Cannot deactivate super user" {
			statusCode = 400
		} else {
			statusCode = 500
		}
	}

	return ctx.Response().Status(statusCode).Json(response)
}

// DeleteUser deletes a user
func (c *AdminController) DeleteUser(ctx http.Context) http.Response {
	userIDStr := ctx.Request().Route("id")
	userID, err := strconv.ParseUint(userIDStr, 10, 32)
	if err != nil {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Invalid user ID",
		})
	}

	response, err := c.adminService.DeleteUser(uint(userID))
	if err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to delete user",
		})
	}

	statusCode := 200
	if !response.Success {
		if response.Message == "User not found" {
			statusCode = 404
		} else if response.Message == "Cannot delete super user" {
			statusCode = 400
		} else {
			statusCode = 500
		}
	}

	return ctx.Response().Status(statusCode).Json(response)
}

// UpdateAdminOrderStatus updates order status by admin
func (c *AdminController) UpdateAdminOrderStatus(ctx http.Context) http.Response {
	orderIDStr := ctx.Request().Route("id")
	orderID, err := strconv.ParseUint(orderIDStr, 10, 32)
	if err != nil {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Invalid order ID",
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

	response, err := c.adminService.UpdateAdminOrderStatus(uint(orderID), &request)
	if err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to update order status",
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

// ProcessRefund processes refund for an order
func (c *AdminController) ProcessRefund(ctx http.Context) http.Response {
	orderIDStr := ctx.Request().Route("id")
	orderID, err := strconv.ParseUint(orderIDStr, 10, 32)
	if err != nil {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Invalid order ID",
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

	response, err := c.adminService.ProcessRefund(uint(orderID), &request)
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
		} else if response.Message == "Order cannot be refunded" {
			statusCode = 400
		} else {
			statusCode = 500
		}
	}

	return ctx.Response().Status(statusCode).Json(response)
}

// GetVendorStatistics returns vendor statistics for admin dashboard
func (c *AdminController) GetVendorStatistics(ctx http.Context) http.Response {
	response, err := c.adminService.GetVendorStatistics()
	if err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to get vendor statistics",
		})
	}

	statusCode := 200
	if !response.Success {
		statusCode = 500
	}

	return ctx.Response().Status(statusCode).Json(response)
}

// GetUserStatistics returns user statistics for admin dashboard
func (c *AdminController) GetUserStatistics(ctx http.Context) http.Response {
	response, err := c.adminService.GetUserStatistics()
	if err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to get user statistics",
		})
	}

	statusCode := 200
	if !response.Success {
		statusCode = 500
	}

	return ctx.Response().Status(statusCode).Json(response)
}