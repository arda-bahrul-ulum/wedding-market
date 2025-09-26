package controllers

import (
	"strconv"

	"goravel/app/contracts/services"
	"goravel/app/models"

	"github.com/goravel/framework/contracts/http"
)

type PortfolioController struct {
	portfolioService services.PortfolioServiceInterface
}

func NewPortfolioController(portfolioService services.PortfolioServiceInterface) *PortfolioController {
	return &PortfolioController{
		portfolioService: portfolioService,
	}
}

// GetPortfolios returns vendor's portfolios
func (c *PortfolioController) GetPortfolios(ctx http.Context) http.Response {
	user := ctx.Value("user").(models.User)

	// Get query parameters
	page, _ := strconv.Atoi(ctx.Request().Query("page", "1"))
	limit, _ := strconv.Atoi(ctx.Request().Query("limit", "10"))
	featured := ctx.Request().Query("featured", "")

	filters := map[string]interface{}{
		"user_id":  user.ID,
		"page":     page,
		"limit":    limit,
		"featured": featured,
	}

	response, err := c.portfolioService.GetPortfolios(0, filters)
	if err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to get portfolios",
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

// CreatePortfolio creates a new portfolio item
func (c *PortfolioController) CreatePortfolio(ctx http.Context) http.Response {
	user := ctx.Value("user").(models.User)

	var request services.CreatePortfolioRequest
	if err := ctx.Request().Bind(&request); err != nil {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Invalid request data",
			"errors":  err.Error(),
		})
	}

	request.UserID = user.ID

	response, err := c.portfolioService.CreatePortfolio(user.ID, &request)
	if err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to create portfolio",
		})
	}

	statusCode := 201
	if !response.Success {
		if response.Message == "Vendor profile not found" {
			statusCode = 404
		} else {
			statusCode = 500
		}
	}

	return ctx.Response().Status(statusCode).Json(response)
}

// UpdatePortfolio updates a portfolio item
func (c *PortfolioController) UpdatePortfolio(ctx http.Context) http.Response {
	user := ctx.Value("user").(models.User)
	portfolioIDStr := ctx.Request().Route("id")

	portfolioID, err := strconv.ParseUint(portfolioIDStr, 10, 32)
	if err != nil {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Invalid portfolio ID format",
		})
	}

	var request services.UpdatePortfolioRequest
	if err := ctx.Request().Bind(&request); err != nil {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Invalid request data",
			"errors":  err.Error(),
		})
	}

	request.UserID = user.ID

	response, err := c.portfolioService.UpdatePortfolio(user.ID, uint(portfolioID), &request)
	if err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to update portfolio",
		})
	}

	statusCode := 200
	if !response.Success {
		if response.Message == "Vendor profile not found" || response.Message == "Portfolio not found" {
			statusCode = 404
		} else {
			statusCode = 500
		}
	}

	return ctx.Response().Status(statusCode).Json(response)
}

// DeletePortfolio deletes a portfolio item
func (c *PortfolioController) DeletePortfolio(ctx http.Context) http.Response {
	user := ctx.Value("user").(models.User)
	portfolioIDStr := ctx.Request().Route("id")

	portfolioID, err := strconv.ParseUint(portfolioIDStr, 10, 32)
	if err != nil {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Invalid portfolio ID format",
		})
	}

	response, err := c.portfolioService.DeletePortfolio(user.ID, uint(portfolioID))
	if err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to delete portfolio",
		})
	}

	statusCode := 200
	if !response.Success {
		if response.Message == "Vendor profile not found" || response.Message == "Portfolio not found" {
			statusCode = 404
		} else {
			statusCode = 500
		}
	}

	return ctx.Response().Status(statusCode).Json(response)
}

// GetPortfolioDetail returns detailed portfolio information
func (c *PortfolioController) GetPortfolioDetail(ctx http.Context) http.Response {
	portfolioIDStr := ctx.Request().Route("id")
	portfolioID, err := strconv.ParseUint(portfolioIDStr, 10, 32)
	if err != nil {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Invalid portfolio ID format",
		})
	}

	response, err := c.portfolioService.GetPortfolioDetail(uint(portfolioID))
	if err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to get portfolio detail",
		})
	}

	statusCode := 200
	if !response.Success {
		if response.Message == "Portfolio not found" {
			statusCode = 404
		} else {
			statusCode = 500
		}
	}

	return ctx.Response().Status(statusCode).Json(response)
}

// GetVendorPortfolios returns portfolios for a specific vendor (public endpoint)
func (c *PortfolioController) GetVendorPortfolios(ctx http.Context) http.Response {
	vendorIDStr := ctx.Request().Route("id")
	vendorID, err := strconv.ParseUint(vendorIDStr, 10, 32)
	if err != nil {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Invalid vendor ID format",
		})
	}

	// Get query parameters
	page, _ := strconv.Atoi(ctx.Request().Query("page", "1"))
	limit, _ := strconv.Atoi(ctx.Request().Query("limit", "10"))
	featured := ctx.Request().Query("featured", "")

	filters := map[string]interface{}{
		"vendor_id": uint(vendorID),
		"page":      page,
		"limit":     limit,
		"featured":  featured,
	}

	response, err := c.portfolioService.GetPortfolios(uint(vendorID), filters)
	if err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to get vendor portfolios",
		})
	}

	statusCode := 200
	if !response.Success {
		statusCode = 500
	}

	return ctx.Response().Status(statusCode).Json(response)
}