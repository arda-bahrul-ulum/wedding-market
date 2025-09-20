package controllers

import (
	"strconv"

	"goravel/app/models"

	"github.com/goravel/framework/contracts/http"
	"github.com/goravel/framework/facades"
)

type PortfolioController struct{}

func NewPortfolioController() *PortfolioController {
	return &PortfolioController{}
}

// GetPortfolios returns vendor's portfolios
func (c *PortfolioController) GetPortfolios(ctx http.Context) http.Response {
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
	featured := ctx.Request().Query("featured", "")

	// Build query
	query := facades.Orm().Query().Model(&models.Portfolio{}).Where("vendor_id", vendorProfile.ID)

	if featured == "true" {
		query = query.Where("is_featured", true)
	}

	query = query.Order("sort_order, created_at desc")

	// Get total count
	total, err := query.Count()
	if err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to count portfolios",
		})
	}

	// Calculate pagination
	offset := (page - 1) * limit
	totalPages := int(float64(total)/float64(limit) + 0.5)

	// Get portfolios
	var portfolios []models.Portfolio
	if err := query.Offset(offset).Limit(limit).Get(&portfolios); err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to fetch portfolios",
		})
	}

	return ctx.Response().Status(200).Json(http.Json{
		"success": true,
		"data": http.Json{
			"portfolios": portfolios,
			"pagination": http.Json{
				"current_page": page,
				"per_page":     limit,
				"total":        total,
				"total_pages":  totalPages,
			},
		},
	})
}

// CreatePortfolio creates a new portfolio item
func (c *PortfolioController) CreatePortfolio(ctx http.Context) http.Response {
	user := ctx.Value("user").(models.User)

	var request struct {
		Title       string `json:"title" validate:"required"`
		Description string `json:"description"`
		ImageURL    string `json:"image_url" validate:"required"`
		ImageType   string `json:"image_type" validate:"required,oneof=image video"`
		IsFeatured  bool   `json:"is_featured"`
		SortOrder   int    `json:"sort_order"`
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

	// Create portfolio
	portfolio := models.Portfolio{
		VendorID:    vendorProfile.ID,
		Title:       request.Title,
		Description: request.Description,
		ImageURL:    request.ImageURL,
		ImageType:   request.ImageType,
		IsFeatured:  request.IsFeatured,
		SortOrder:   request.SortOrder,
	}

	if err := facades.Orm().Query().Create(&portfolio); err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to create portfolio",
		})
	}

	return ctx.Response().Status(201).Json(http.Json{
		"success": true,
		"message": "Portfolio created successfully",
		"data":    portfolio,
	})
}

// UpdatePortfolio updates a portfolio item
func (c *PortfolioController) UpdatePortfolio(ctx http.Context) http.Response {
	user := ctx.Value("user").(models.User)
	portfolioID := ctx.Request().Route("id")

	var request struct {
		Title       string `json:"title" validate:"required"`
		Description string `json:"description"`
		ImageURL    string `json:"image_url" validate:"required"`
		ImageType   string `json:"image_type" validate:"required,oneof=image video"`
		IsFeatured  bool   `json:"is_featured"`
		SortOrder   int    `json:"sort_order"`
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

	// Get portfolio
	var portfolio models.Portfolio
	if err := facades.Orm().Query().Where("id", portfolioID).Where("vendor_id", vendorProfile.ID).First(&portfolio); err != nil {
		return ctx.Response().Status(404).Json(http.Json{
			"success": false,
			"message": "Portfolio not found",
		})
	}

	// Update portfolio
	portfolio.Title = request.Title
	portfolio.Description = request.Description
	portfolio.ImageURL = request.ImageURL
	portfolio.ImageType = request.ImageType
	portfolio.IsFeatured = request.IsFeatured
	portfolio.SortOrder = request.SortOrder

	if err := facades.Orm().Query().Save(&portfolio); err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to update portfolio",
		})
	}

	return ctx.Response().Status(200).Json(http.Json{
		"success": true,
		"message": "Portfolio updated successfully",
		"data":    portfolio,
	})
}

// DeletePortfolio deletes a portfolio item
func (c *PortfolioController) DeletePortfolio(ctx http.Context) http.Response {
	user := ctx.Value("user").(models.User)
	portfolioID := ctx.Request().Route("id")

	// Get vendor profile
	var vendorProfile models.VendorProfile
	if err := facades.Orm().Query().Where("user_id", user.ID).First(&vendorProfile); err != nil {
		return ctx.Response().Status(404).Json(http.Json{
			"success": false,
			"message": "Vendor profile not found",
		})
	}

	// Get portfolio
	var portfolio models.Portfolio
	if err := facades.Orm().Query().Where("id", portfolioID).Where("vendor_id", vendorProfile.ID).First(&portfolio); err != nil {
		return ctx.Response().Status(404).Json(http.Json{
			"success": false,
			"message": "Portfolio not found",
		})
	}

	// Delete portfolio
	if _, err := facades.Orm().Query().Delete(&portfolio); err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to delete portfolio",
		})
	}

	return ctx.Response().Status(200).Json(http.Json{
		"success": true,
		"message": "Portfolio deleted successfully",
	})
}
