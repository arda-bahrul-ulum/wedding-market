package controllers

import (
	"strconv"
	"time"

	"goravel/app/models"

	"github.com/goravel/framework/contracts/http"
	"github.com/goravel/framework/facades"
)

type ReviewController struct{}

func NewReviewController() *ReviewController {
	return &ReviewController{}
}

// CreateReview creates a new review
func (c *ReviewController) CreateReview(ctx http.Context) http.Response {
	user := ctx.Value("user").(models.User)

	var request struct {
		OrderID  uint   `json:"order_id" validate:"required"`
		Rating   int    `json:"rating" validate:"required,min=1,max=5"`
		Comment  string `json:"comment"`
		Images   string `json:"images"` // JSON array of image URLs
	}

	if err := ctx.Request().Bind(&request); err != nil {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Invalid request data",
			"errors":  err.Error(),
		})
	}

	// Verify order exists and belongs to user
	var order models.Order
	if err := facades.Orm().Query().Where("id", request.OrderID).Where("customer_id", user.ID).First(&order); err != nil {
		return ctx.Response().Status(404).Json(http.Json{
			"success": false,
			"message": "Order not found",
		})
	}

	// Check if order is completed
	if order.Status != "completed" {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Can only review completed orders",
		})
	}

	// Check if review already exists
	var existingReview models.Review
	if err := facades.Orm().Query().Where("order_id", request.OrderID).First(&existingReview); err == nil {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Review already exists for this order",
		})
	}

	// Create review
	review := models.Review{
		OrderID:    request.OrderID,
		CustomerID: user.ID,
		VendorID:   order.VendorID,
		Rating:     request.Rating,
		Comment:    request.Comment,
		Images:     request.Images,
	}

	if err := facades.Orm().Query().Create(&review); err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to create review",
		})
	}

	// Load related data
	review.Order = order
	facades.Orm().Query().Where("id", order.VendorID).First(&review.Vendor)

	return ctx.Response().Status(201).Json(http.Json{
		"success": true,
		"message": "Review created successfully",
		"data":    review,
	})
}

// GetReviews returns reviews with filters
func (c *ReviewController) GetReviews(ctx http.Context) http.Response {
	// Get query parameters
	page, _ := strconv.Atoi(ctx.Request().Query("page", "1"))
	limit, _ := strconv.Atoi(ctx.Request().Query("limit", "10"))
	vendorID := ctx.Request().Query("vendor_id", "")
	rating := ctx.Request().Query("rating", "")

	// Build query
	query := facades.Orm().Query().Model(&models.Review{})

	if vendorID != "" {
		query = query.Where("vendor_id", vendorID)
	}

	if rating != "" {
		query = query.Where("rating", rating)
	}

	query = query.Order("created_at desc")

	// Get total count
	total, err := query.Count()
	if err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to count reviews",
		})
	}

	// Calculate pagination
	offset := (page - 1) * limit
	totalPages := int(float64(total)/float64(limit) + 0.5)

	// Get reviews
	var reviews []models.Review
	if err := query.Offset(offset).Limit(limit).Get(&reviews); err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to fetch reviews",
		})
	}

	// Load related data
	for i := range reviews {
		facades.Orm().Query().Where("id", reviews[i].CustomerID).First(&reviews[i].Customer)
		facades.Orm().Query().Where("id", reviews[i].VendorID).First(&reviews[i].Vendor)
		facades.Orm().Query().Where("id", reviews[i].OrderID).First(&reviews[i].Order)
	}

	return ctx.Response().Status(200).Json(http.Json{
		"success": true,
		"data": http.Json{
			"reviews": reviews,
			"pagination": http.Json{
				"current_page": page,
				"per_page":     limit,
				"total":        total,
				"total_pages":  totalPages,
			},
		},
	})
}

// ReplyToReview allows vendor to reply to review
func (c *ReviewController) ReplyToReview(ctx http.Context) http.Response {
	user := ctx.Value("user").(models.User)
	reviewID := ctx.Request().Route("id")

	var request struct {
		Reply string `json:"reply" validate:"required"`
	}

	if err := ctx.Request().Bind(&request); err != nil {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Invalid request data",
			"errors":  err.Error(),
		})
	}

	// Get review
	var review models.Review
	if err := facades.Orm().Query().Where("id", reviewID).First(&review); err != nil {
		return ctx.Response().Status(404).Json(http.Json{
			"success": false,
			"message": "Review not found",
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

	// Check if review belongs to this vendor
	if review.VendorID != vendorProfile.ID {
		return ctx.Response().Status(403).Json(http.Json{
			"success": false,
			"message": "Unauthorized to reply to this review",
		})
	}

	// Update review with reply
	review.VendorReply = request.Reply
	now := time.Now()
	review.RepliedAt = &now

	if err := facades.Orm().Query().Save(&review); err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to reply to review",
		})
	}

	return ctx.Response().Status(200).Json(http.Json{
		"success": true,
		"message": "Reply added successfully",
		"data":    review,
	})
}
