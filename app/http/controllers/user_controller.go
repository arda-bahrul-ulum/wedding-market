package controllers

import (
	"strconv"

	"goravel/app/models"

	"github.com/goravel/framework/contracts/http"
	"github.com/goravel/framework/facades"
)

type UserController struct{}

func NewUserController() *UserController {
	return &UserController{}
}

// Show returns user profile by ID
func (c *UserController) Show(ctx http.Context) http.Response {
	userID := ctx.Request().Route("id")

	var user models.User
	if err := facades.Orm().Query().Where("id", userID).First(&user); err != nil {
		return ctx.Response().Status(404).Json(http.Json{
			"success": false,
			"message": "User not found",
		})
	}

	// Load vendor profile if user is vendor
	if user.Role == "vendor" {
		var vendorProfile models.VendorProfile
		if err := facades.Orm().Query().Where("user_id", user.ID).First(&vendorProfile); err == nil {
			user.VendorProfile = &vendorProfile
		}
	}

	return ctx.Response().Status(200).Json(http.Json{
		"success": true,
		"data":    user,
	})
}

// UpdateProfile updates user profile
func (c *UserController) UpdateProfile(ctx http.Context) http.Response {
	user := ctx.Value("user").(models.User)

	var request struct {
		Name  string `json:"name" validate:"required,min=3"`
		Phone string `json:"phone"`
		Avatar string `json:"avatar"`
	}

	if err := ctx.Request().Bind(&request); err != nil {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Invalid request data",
			"errors":  err.Error(),
		})
	}

	// Update user
	user.Name = request.Name
	user.Phone = request.Phone
	user.Avatar = request.Avatar

	if err := facades.Orm().Query().Save(&user); err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to update profile",
		})
	}

	return ctx.Response().Status(200).Json(http.Json{
		"success": true,
		"message": "Profile updated successfully",
		"data":    user,
	})
}

// GetWishlist returns user's wishlist
func (c *UserController) GetWishlist(ctx http.Context) http.Response {
	user := ctx.Value("user").(models.User)

	// Get query parameters
	page, _ := strconv.Atoi(ctx.Request().Query("page", "1"))
	limit, _ := strconv.Atoi(ctx.Request().Query("limit", "10"))
	itemType := ctx.Request().Query("item_type", "")

	// Build query
	query := facades.Orm().Query().Model(&models.Wishlist{}).Where("customer_id", user.ID)

	if itemType != "" {
		query = query.Where("item_type", itemType)
	}

	query = query.Order("created_at desc")

	// Get total count
	total, err := query.Count()
	if err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to count wishlist items",
		})
	}

	// Calculate pagination
	offset := (page - 1) * limit
	totalPages := int(float64(total)/float64(limit) + 0.5)

	// Get wishlist items
	var wishlistItems []models.Wishlist
	if err := query.Offset(offset).Limit(limit).Get(&wishlistItems); err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to fetch wishlist items",
		})
	}

	// Load related data
	for i := range wishlistItems {
		if wishlistItems[i].ItemType == "service" && wishlistItems[i].ServiceID != nil {
			facades.Orm().Query().Where("id", *wishlistItems[i].ServiceID).First(&wishlistItems[i].Service)
		} else if wishlistItems[i].ItemType == "package" && wishlistItems[i].PackageID != nil {
			facades.Orm().Query().Where("id", *wishlistItems[i].PackageID).First(&wishlistItems[i].Package)
		}
	}

	return ctx.Response().Status(200).Json(http.Json{
		"success": true,
		"data": http.Json{
			"wishlist": wishlistItems,
			"pagination": http.Json{
				"current_page": page,
				"per_page":     limit,
				"total":        total,
				"total_pages":  totalPages,
			},
		},
	})
}

// AddToWishlist adds item to wishlist
func (c *UserController) AddToWishlist(ctx http.Context) http.Response {
	user := ctx.Value("user").(models.User)

	var request struct {
		ItemType string `json:"item_type" validate:"required,oneof=service package"`
		ItemID   uint   `json:"item_id" validate:"required"`
	}

	if err := ctx.Request().Bind(&request); err != nil {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Invalid request data",
			"errors":  err.Error(),
		})
	}

	// Check if item exists
	if request.ItemType == "service" {
		var service models.Service
		if err := facades.Orm().Query().Where("id", request.ItemID).Where("is_active", true).First(&service); err != nil {
			return ctx.Response().Status(404).Json(http.Json{
				"success": false,
				"message": "Service not found",
			})
		}
	} else if request.ItemType == "package" {
		var pkg models.Package
		if err := facades.Orm().Query().Where("id", request.ItemID).Where("is_active", true).First(&pkg); err != nil {
			return ctx.Response().Status(404).Json(http.Json{
				"success": false,
				"message": "Package not found",
			})
		}
	}

	// Check if already in wishlist
	var existingWishlist models.Wishlist
	query := facades.Orm().Query().Where("customer_id", user.ID).Where("item_type", request.ItemType)
	if request.ItemType == "service" {
		query = query.Where("service_id", request.ItemID)
	} else {
		query = query.Where("package_id", request.ItemID)
	}

	if err := query.First(&existingWishlist); err == nil {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Item already in wishlist",
		})
	}

	// Create wishlist item
	wishlistItem := models.Wishlist{
		CustomerID: user.ID,
		ItemType:   request.ItemType,
	}

	if request.ItemType == "service" {
		wishlistItem.ServiceID = &request.ItemID
	} else {
		wishlistItem.PackageID = &request.ItemID
	}

	if err := facades.Orm().Query().Create(&wishlistItem); err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to add to wishlist",
		})
	}

	return ctx.Response().Status(201).Json(http.Json{
		"success": true,
		"message": "Item added to wishlist successfully",
		"data":    wishlistItem,
	})
}

// RemoveFromWishlist removes item from wishlist
func (c *UserController) RemoveFromWishlist(ctx http.Context) http.Response {
	user := ctx.Value("user").(models.User)
	itemID := ctx.Request().Route("id")

	// Get wishlist item
	var wishlistItem models.Wishlist
	if err := facades.Orm().Query().Where("id", itemID).Where("customer_id", user.ID).First(&wishlistItem); err != nil {
		return ctx.Response().Status(404).Json(http.Json{
			"success": false,
			"message": "Wishlist item not found",
		})
	}

	// Delete wishlist item
	if _, err := facades.Orm().Query().Delete(&wishlistItem); err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to remove from wishlist",
		})
	}

	return ctx.Response().Status(200).Json(http.Json{
		"success": true,
		"message": "Item removed from wishlist successfully",
	})
}
