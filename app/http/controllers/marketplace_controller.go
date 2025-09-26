package controllers

import (
	"strconv"

	"goravel/app/contracts/services"

	"github.com/goravel/framework/contracts/http"
)

type MarketplaceController struct {
	serviceService services.ServiceServiceInterface
	vendorService  services.VendorServiceInterface
	packageService services.PackageServiceInterface
}

func NewMarketplaceController(
	serviceService services.ServiceServiceInterface,
	vendorService services.VendorServiceInterface,
	packageService services.PackageServiceInterface,
) *MarketplaceController {
	return &MarketplaceController{
		serviceService: serviceService,
		vendorService:  vendorService,
		packageService: packageService,
	}
}

// GetCategories returns all active categories
func (c *MarketplaceController) GetCategories(ctx http.Context) http.Response {
	// For now, return empty response since GetCategories is not implemented in ServiceService
	// This would need to be implemented in the service layer
	return ctx.Response().Status(200).Json(http.Json{
		"success": true,
		"message": "Categories retrieved successfully",
		"data":    []interface{}{},
	})
}

// GetVendors returns paginated list of vendors with filters
func (c *MarketplaceController) GetVendors(ctx http.Context) http.Response {
	// Get query parameters
	page, _ := strconv.Atoi(ctx.Request().Query("page", "1"))
	limit, _ := strconv.Atoi(ctx.Request().Query("limit", "12"))
	city := ctx.Request().Query("city", "")
	province := ctx.Request().Query("province", "")

	// Create VendorFilters struct
	vendorFilters := &services.VendorFilters{
		City:     city,
		Province: province,
	}

	response, err := c.vendorService.GetVendors(vendorFilters, page, limit)
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

// GetVendorDetail returns detailed vendor information
func (c *MarketplaceController) GetVendorDetail(ctx http.Context) http.Response {
	vendorIDStr := ctx.Request().Route("id")
	vendorID, err := strconv.ParseUint(vendorIDStr, 10, 32)
	if err != nil {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Invalid vendor ID",
		})
	}

	response, err := c.vendorService.GetVendor(uint(vendorID))
	if err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to get vendor detail",
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

// GetServices returns services with filters
func (c *MarketplaceController) GetServices(ctx http.Context) http.Response {
	// Get query parameters
	page, _ := strconv.Atoi(ctx.Request().Query("page", "1"))
	limit, _ := strconv.Atoi(ctx.Request().Query("limit", "12"))
	vendorID := ctx.Request().Query("vendor_id", "")
	categoryID := ctx.Request().Query("category_id", "")
	minPrice, _ := strconv.ParseFloat(ctx.Request().Query("min_price", "0"), 64)
	maxPrice, _ := strconv.ParseFloat(ctx.Request().Query("max_price", "0"), 64)
	search := ctx.Request().Query("search", "")
	sortBy := ctx.Request().Query("sort_by", "created_at")
	sortOrder := ctx.Request().Query("sort_order", "desc")

	filters := map[string]interface{}{
		"page":        page,
		"limit":       limit,
		"vendor_id":   vendorID,
		"category_id": categoryID,
		"min_price":   minPrice,
		"max_price":   maxPrice,
		"search":      search,
		"sort_by":     sortBy,
		"sort_order":  sortOrder,
	}

	// Extract search query from filters
	searchQuery := ""
	if searchVal, exists := filters["search"]; exists {
		searchQuery = searchVal.(string)
	}

	response, err := c.serviceService.SearchServices(searchQuery, filters)
	if err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to get services",
		})
	}

	statusCode := 200
	if !response.Success {
		statusCode = 500
	}

	return ctx.Response().Status(statusCode).Json(response)
}

// GetPackages returns packages with filters
func (c *MarketplaceController) GetPackages(ctx http.Context) http.Response {
	// Get query parameters
	page, _ := strconv.Atoi(ctx.Request().Query("page", "1"))
	limit, _ := strconv.Atoi(ctx.Request().Query("limit", "12"))
	vendorID := ctx.Request().Query("vendor_id", "")
	minPrice, _ := strconv.ParseFloat(ctx.Request().Query("min_price", "0"), 64)
	maxPrice, _ := strconv.ParseFloat(ctx.Request().Query("max_price", "0"), 64)
	search := ctx.Request().Query("search", "")
	sortBy := ctx.Request().Query("sort_by", "created_at")
	sortOrder := ctx.Request().Query("sort_order", "desc")

	filters := map[string]interface{}{
		"page":        page,
		"limit":       limit,
		"vendor_id":   vendorID,
		"min_price":   minPrice,
		"max_price":   maxPrice,
		"search":      search,
		"sort_by":     sortBy,
		"sort_order":  sortOrder,
	}

	response, err := c.packageService.SearchPackages(filters)
	if err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to get packages",
		})
	}

	statusCode := 200
	if !response.Success {
		statusCode = 500
	}

	return ctx.Response().Status(statusCode).Json(response)
}