package controllers

import (
	"strconv"

	"goravel/app/contracts/services"
	"goravel/app/models"

	"github.com/goravel/framework/contracts/http"
)

type VendorController struct {
	vendorService  services.VendorServiceInterface
	serviceService services.ServiceServiceInterface
	orderService   services.OrderServiceInterface
}

func NewVendorController(
	vendorService services.VendorServiceInterface,
	serviceService services.ServiceServiceInterface,
	orderService services.OrderServiceInterface,
) *VendorController {
	return &VendorController{
		vendorService:  vendorService,
		serviceService: serviceService,
		orderService:   orderService,
	}
}

// GetProfile returns vendor profile
func (c *VendorController) GetProfile(ctx http.Context) http.Response {
	user := ctx.Value("user").(models.User)

	response, err := c.vendorService.GetVendorProfile(user.ID)
	if err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to get vendor profile",
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

// UpdateProfile updates vendor profile
func (c *VendorController) UpdateProfile(ctx http.Context) http.Response {
	user := ctx.Value("user").(models.User)

	var request services.UpdateVendorProfileRequest
	if err := ctx.Request().Bind(&request); err != nil {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Invalid request data",
			"errors":  err.Error(),
		})
	}

	response, err := c.vendorService.UpdateVendorProfile(user.ID, &request)
	if err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to update vendor profile",
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

// GetServices returns vendor's services
func (c *VendorController) GetServices(ctx http.Context) http.Response {
	user := ctx.Value("user").(models.User)

	// Get query parameters
	page, _ := strconv.Atoi(ctx.Request().Query("page", "1"))
	limit, _ := strconv.Atoi(ctx.Request().Query("limit", "10"))
	categoryID := ctx.Request().Query("category_id", "")
	search := ctx.Request().Query("search", "")

	filters := map[string]interface{}{
		"user_id":     user.ID,
		"page":        page,
		"limit":       limit,
		"category_id": categoryID,
		"search":      search,
	}

	response, err := c.serviceService.GetVendorServices(user.ID, filters)
	if err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to get vendor services",
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

// CreateService creates a new service
func (c *VendorController) CreateService(ctx http.Context) http.Response {
	user := ctx.Value("user").(models.User)

	var request services.CreateServiceRequest
	if err := ctx.Request().Bind(&request); err != nil {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Invalid request data",
			"errors":  err.Error(),
		})
	}

	request.UserID = user.ID

	response, err := c.serviceService.CreateService(user.ID, &request)
	if err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to create service",
		})
	}

	statusCode := 201
	if !response.Success {
		if response.Message == "Vendor profile not found" || response.Message == "Category not found" {
			statusCode = 404
		} else {
			statusCode = 500
		}
	}

	return ctx.Response().Status(statusCode).Json(response)
}

// UpdateService updates a service
func (c *VendorController) UpdateService(ctx http.Context) http.Response {
	user := ctx.Value("user").(models.User)
	serviceID := ctx.Request().Route("id")

	var request services.UpdateServiceRequest
	if err := ctx.Request().Bind(&request); err != nil {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Invalid request data",
			"errors":  err.Error(),
		})
	}

	// Convert serviceID to uint
	serviceIDUint, err := strconv.ParseUint(serviceID, 10, 32)
	if err != nil {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Invalid service ID format",
		})
	}

	request.UserID = user.ID

	response, err := c.serviceService.UpdateService(user.ID, uint(serviceIDUint), &request)
	if err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to update service",
		})
	}

	statusCode := 200
	if !response.Success {
		if response.Message == "Vendor profile not found" || response.Message == "Service not found" || response.Message == "Category not found" {
			statusCode = 404
		} else {
			statusCode = 500
		}
	}

	return ctx.Response().Status(statusCode).Json(response)
}

// DeleteService deletes a service
func (c *VendorController) DeleteService(ctx http.Context) http.Response {
	user := ctx.Value("user").(models.User)
	serviceID := ctx.Request().Route("id")

	// Convert serviceID to uint
	serviceIDUint, err := strconv.ParseUint(serviceID, 10, 32)
	if err != nil {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Invalid service ID format",
		})
	}

	response, err := c.serviceService.DeleteService(user.ID, uint(serviceIDUint))
	if err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to delete service",
		})
	}

	statusCode := 200
	if !response.Success {
		if response.Message == "Vendor profile not found" || response.Message == "Service not found" {
			statusCode = 404
		} else if response.Message == "Cannot delete service with active orders" {
			statusCode = 400
		} else {
			statusCode = 500
		}
	}

	return ctx.Response().Status(statusCode).Json(response)
}

// GetOrders returns vendor's orders
func (c *VendorController) GetOrders(ctx http.Context) http.Response {
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

// UpdateOrderStatus updates order status
func (c *VendorController) UpdateOrderStatus(ctx http.Context) http.Response {
	user := ctx.Value("user").(models.User)
	orderID := ctx.Request().Route("id")

	var request services.UpdateOrderStatusRequest
	if err := ctx.Request().Bind(&request); err != nil {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Invalid request data",
			"errors":  err.Error(),
		})
	}

	// Convert orderID to uint
	orderIDUint, err := strconv.ParseUint(orderID, 10, 32)
	if err != nil {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Invalid order ID format",
		})
	}

	request.UserID = user.ID

	response, err := c.orderService.UpdateOrderStatus(uint(orderIDUint), user.ID, &request)
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