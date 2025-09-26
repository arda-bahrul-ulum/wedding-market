package controllers

import (
	"strconv"

	"goravel/app/contracts/services"
	"goravel/app/models"

	"github.com/goravel/framework/contracts/http"
)

type ReviewController struct {
	reviewService services.ReviewServiceInterface
}

func NewReviewController(reviewService services.ReviewServiceInterface) *ReviewController {
	return &ReviewController{
		reviewService: reviewService,
	}
}

// CreateReview creates a new review
func (c *ReviewController) CreateReview(ctx http.Context) http.Response {
	user := ctx.Value("user").(models.User)

	var request services.CreateReviewRequest
	if err := ctx.Request().Bind(&request); err != nil {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Invalid request data",
			"errors":  err.Error(),
		})
	}

	request.CustomerID = user.ID

	response, err := c.reviewService.CreateReview(user.ID, &request)
	if err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to create review",
		})
	}

	statusCode := 201
	if !response.Success {
		if response.Message == "Order not found" {
			statusCode = 404
		} else if response.Message == "Can only review completed orders" || response.Message == "Review already exists for this order" {
			statusCode = 400
		} else {
			statusCode = 500
		}
	}

	return ctx.Response().Status(statusCode).Json(response)
}

// GetReviews returns reviews with filters
func (c *ReviewController) GetReviews(ctx http.Context) http.Response {
	// Get query parameters
	page, _ := strconv.Atoi(ctx.Request().Query("page", "1"))
	limit, _ := strconv.Atoi(ctx.Request().Query("limit", "10"))
	vendorID := ctx.Request().Query("vendor_id", "")
	rating := ctx.Request().Query("rating", "")

	filters := map[string]interface{}{
		"page":      page,
		"limit":     limit,
		"vendor_id": vendorID,
		"rating":    rating,
	}

	response, err := c.reviewService.GetReviews(filters)
	if err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to get reviews",
		})
	}

	statusCode := 200
	if !response.Success {
		statusCode = 500
	}

	return ctx.Response().Status(statusCode).Json(response)
}

// GetReviewDetail returns detailed review information
func (c *ReviewController) GetReviewDetail(ctx http.Context) http.Response {
	reviewIDStr := ctx.Request().Route("id")
	reviewID, err := strconv.ParseUint(reviewIDStr, 10, 32)
	if err != nil {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Invalid review ID format",
		})
	}

	response, err := c.reviewService.GetReviewDetail(uint(reviewID))
	if err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to get review detail",
		})
	}

	statusCode := 200
	if !response.Success {
		if response.Message == "Review not found" {
			statusCode = 404
		} else {
			statusCode = 500
		}
	}

	return ctx.Response().Status(statusCode).Json(response)
}

// ReplyToReview allows vendor to reply to review
func (c *ReviewController) ReplyToReview(ctx http.Context) http.Response {
	user := ctx.Value("user").(models.User)
	reviewIDStr := ctx.Request().Route("id")

	reviewID, err := strconv.ParseUint(reviewIDStr, 10, 32)
	if err != nil {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Invalid review ID format",
		})
	}

	var request services.ReplyToReviewRequest
	if err := ctx.Request().Bind(&request); err != nil {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Invalid request data",
			"errors":  err.Error(),
		})
	}

	request.UserID = user.ID

	response, err := c.reviewService.ReplyToReview(uint(reviewID), user.ID, &request)
	if err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to reply to review",
		})
	}

	statusCode := 200
	if !response.Success {
		if response.Message == "Review not found" || response.Message == "Vendor profile not found" {
			statusCode = 404
		} else if response.Message == "Unauthorized to reply to this review" {
			statusCode = 403
		} else {
			statusCode = 500
		}
	}

	return ctx.Response().Status(statusCode).Json(response)
}

// GetVendorReviews returns reviews for a specific vendor
func (c *ReviewController) GetVendorReviews(ctx http.Context) http.Response {
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
	rating := ctx.Request().Query("rating", "")

	filters := map[string]interface{}{
		"vendor_id": uint(vendorID),
		"page":      page,
		"limit":     limit,
		"rating":    rating,
	}

	response, err := c.reviewService.GetVendorReviews(uint(vendorID), filters)
	if err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to get vendor reviews",
		})
	}

	statusCode := 200
	if !response.Success {
		statusCode = 500
	}

	return ctx.Response().Status(statusCode).Json(response)
}

// GetVendorReviewStatistics returns review statistics for a vendor
func (c *ReviewController) GetVendorReviewStatistics(ctx http.Context) http.Response {
	vendorIDStr := ctx.Request().Route("id")
	vendorID, err := strconv.ParseUint(vendorIDStr, 10, 32)
	if err != nil {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Invalid vendor ID format",
		})
	}

	response, err := c.reviewService.GetVendorReviewStatistics(uint(vendorID))
	if err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to get vendor review statistics",
		})
	}

	statusCode := 200
	if !response.Success {
		statusCode = 500
	}

	return ctx.Response().Status(statusCode).Json(response)
}