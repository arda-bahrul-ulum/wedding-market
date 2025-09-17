package controllers

import (
	"math"
	"strconv"

	"goravel/app/models"

	"github.com/goravel/framework/contracts/http"
	"github.com/goravel/framework/facades"
)

type MarketplaceController struct{}

func NewMarketplaceController() *MarketplaceController {
	return &MarketplaceController{}
}

// GetCategories returns all active categories
func (c *MarketplaceController) GetCategories(ctx http.Context) http.Response {
	var categories []models.Category
	if err := facades.Orm().Query().Where("is_active", true).Order("sort_order").Get(&categories); err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to fetch categories",
		})
	}

	return ctx.Response().Status(200).Json(http.Json{
		"success": true,
		"data":    categories,
	})
}

// GetVendors returns paginated list of vendors with filters
func (c *MarketplaceController) GetVendors(ctx http.Context) http.Response {
	// Get query parameters
	page, _ := strconv.Atoi(ctx.Request().Query("page", "1"))
	limit, _ := strconv.Atoi(ctx.Request().Query("limit", "12"))
	categoryID := ctx.Request().Query("category_id", "")
	city := ctx.Request().Query("city", "")
	province := ctx.Request().Query("province", "")
	minPrice, _ := strconv.ParseFloat(ctx.Request().Query("min_price", "0"), 64)
	maxPrice, _ := strconv.ParseFloat(ctx.Request().Query("max_price", "0"), 64)
	search := ctx.Request().Query("search", "")
	sortBy := ctx.Request().Query("sort_by", "created_at")
	sortOrder := ctx.Request().Query("sort_order", "desc")

	// Build query
	query := facades.Orm().Query().Model(&models.VendorProfile{}).
		Where("is_active", true).
		Where("is_verified", true)

	// Apply filters
	if categoryID != "" {
		query = query.Where("id IN (SELECT vendor_id FROM services WHERE category_id = ? AND is_active = true)", categoryID)
	}

	if city != "" {
		query = query.Where("city ILIKE ?", "%"+city+"%")
	}

	if province != "" {
		query = query.Where("province ILIKE ?", "%"+province+"%")
	}

	if search != "" {
		query = query.Where("business_name ILIKE ? OR description ILIKE ?", "%"+search+"%", "%"+search+"%")
	}

	// Apply price filter
	if minPrice > 0 || maxPrice > 0 {
		priceQuery := "id IN (SELECT vendor_id FROM services WHERE is_active = true"
		if minPrice > 0 {
			priceQuery += " AND price >= " + strconv.FormatFloat(minPrice, 'f', 2, 64)
		}
		if maxPrice > 0 {
			priceQuery += " AND price <= " + strconv.FormatFloat(maxPrice, 'f', 2, 64)
		}
		priceQuery += ")"
		query = query.Where(priceQuery)
	}

	// Apply sorting
	if sortBy == "rating" {
		query = query.Order("(SELECT AVG(rating) FROM reviews WHERE vendor_id = vendor_profiles.id) " + sortOrder)
	} else if sortBy == "price" {
		query = query.Order("(SELECT MIN(price) FROM services WHERE vendor_id = vendor_profiles.id AND is_active = true) " + sortOrder)
	} else {
		query = query.Order(sortBy + " " + sortOrder)
	}

	// Get total count
	total, err := query.Count()
	if err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to count vendors",
		})
	}

	// Calculate pagination
	offset := (page - 1) * limit
	totalPages := int(math.Ceil(float64(total) / float64(limit)))

	// Get vendors
	var vendors []models.VendorProfile
	if err := query.Offset(offset).Limit(limit).Get(&vendors); err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to fetch vendors",
		})
	}

	// Load related data for each vendor
	for i := range vendors {
		// Load user data
		facades.Orm().Query().Where("id", vendors[i].UserID).First(&vendors[i].User)

		// Load services count
		_, _ = facades.Orm().Query().Model(&models.Service{}).Where("vendor_id", vendors[i].ID).Where("is_active", true).Count()	

		// Load average rating
		var avgRating float64
		facades.Orm().Query().Model(&models.Review{}).Where("vendor_id", vendors[i].ID).Select("AVG(rating)").Scan(&avgRating)

		// Load featured portfolio
		var portfolio models.Portfolio
		facades.Orm().Query().Where("vendor_id", vendors[i].ID).Where("is_featured", true).First(&portfolio)
	}

	return ctx.Response().Status(200).Json(http.Json{
		"success": true,
		"data": http.Json{
			"vendors":     vendors,
			"pagination": http.Json{
				"current_page": page,
				"per_page":     limit,
				"total":        total,
				"total_pages":  totalPages,
			},
		},
	})
}

// GetVendorDetail returns detailed vendor information
func (c *MarketplaceController) GetVendorDetail(ctx http.Context) http.Response {
	vendorID := ctx.Request().Route("id")

	var vendor models.VendorProfile
	if err := facades.Orm().Query().Where("id", vendorID).Where("is_active", true).First(&vendor); err != nil {
		return ctx.Response().Status(404).Json(http.Json{
			"success": false,
			"message": "Vendor not found",
		})
	}

	// Load user data
	facades.Orm().Query().Where("id", vendor.UserID).First(&vendor.User)

	// Load services
	var services []models.Service
	facades.Orm().Query().Where("vendor_id", vendor.ID).Where("is_active", true).Get(&services)

	// Load packages
	var packages []models.Package
	facades.Orm().Query().Where("vendor_id", vendor.ID).Where("is_active", true).Get(&packages)

	// Load portfolios
	var portfolios []models.Portfolio
	facades.Orm().Query().Where("vendor_id", vendor.ID).Order("sort_order").Get(&portfolios)

	// Load reviews
	var reviews []models.Review
	facades.Orm().Query().Where("vendor_id", vendor.ID).Order("created_at desc").Limit(10).Get(&reviews)

	// Load review statistics
	var reviewStats struct {
		TotalReviews int64   `json:"total_reviews"`
		AverageRating float64 `json:"average_rating"`
		RatingCounts  map[int]int64 `json:"rating_counts"`
	}

	reviewStats.TotalReviews, _ = facades.Orm().Query().Model(&models.Review{}).Where("vendor_id", vendor.ID).Count()
	facades.Orm().Query().Model(&models.Review{}).Where("vendor_id", vendor.ID).Select("AVG(rating)").Scan(&reviewStats.AverageRating)

	// Get rating counts
	reviewStats.RatingCounts = make(map[int]int64)
	for i := 1; i <= 5; i++ {
		count, _ := facades.Orm().Query().Model(&models.Review{}).Where("vendor_id", vendor.ID).Where("rating", i).Count()
		reviewStats.RatingCounts[i] = count
	}

	return ctx.Response().Status(200).Json(http.Json{
		"success": true,
		"data": http.Json{
			"vendor":        vendor,
			"services":      services,
			"packages":      packages,
			"portfolios":    portfolios,
			"reviews":       reviews,
			"review_stats":  reviewStats,
		},
	})
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

	// Build query
	query := facades.Orm().Query().Model(&models.Service{}).
		Where("is_active", true)

	// Apply filters
	if vendorID != "" {
		query = query.Where("vendor_id", vendorID)
	}

	if categoryID != "" {
		query = query.Where("category_id", categoryID)
	}

	if minPrice > 0 {
		query = query.Where("price >= ?", minPrice)
	}

	if maxPrice > 0 {
		query = query.Where("price <= ?", maxPrice)
	}

	if search != "" {
		query = query.Where("name ILIKE ? OR description ILIKE ?", "%"+search+"%", "%"+search+"%")
	}

	// Apply sorting
	query = query.Order(sortBy + " " + sortOrder)

	// Get total count
	total, err := query.Count()
	if err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to count services",
		})
	}

	// Calculate pagination
	offset := (page - 1) * limit
	totalPages := int(math.Ceil(float64(total) / float64(limit)))

	// Get services
	var services []models.Service
	if err := query.Offset(offset).Limit(limit).Get(&services); err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to fetch services",
		})
	}

	// Load related data
	for i := range services {
		// Load vendor
		facades.Orm().Query().Where("id", services[i].VendorID).First(&services[i].Vendor)
		facades.Orm().Query().Where("id", services[i].Vendor.UserID).First(&services[i].Vendor.User)

		// Load category
		facades.Orm().Query().Where("id", services[i].CategoryID).First(&services[i].Category)
	}

	return ctx.Response().Status(200).Json(http.Json{
		"success": true,
		"data": http.Json{
			"services": services,
			"pagination": http.Json{
				"current_page": page,
				"per_page":     limit,
				"total":        total,
				"total_pages":  totalPages,
			},
		},
	})
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

	// Build query
	query := facades.Orm().Query().Model(&models.Package{}).
		Where("is_active", true)

	// Apply filters
	if vendorID != "" {
		query = query.Where("vendor_id", vendorID)
	}

	if minPrice > 0 {
		query = query.Where("price >= ?", minPrice)
	}

	if maxPrice > 0 {
		query = query.Where("price <= ?", maxPrice)
	}

	if search != "" {
		query = query.Where("name ILIKE ? OR description ILIKE ?", "%"+search+"%", "%"+search+"%")
	}

	// Apply sorting
	query = query.Order(sortBy + " " + sortOrder)

	// Get total count
	total, err := query.Count()
	if err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to count packages",
		})
	}

	// Calculate pagination
	offset := (page - 1) * limit
	totalPages := int(math.Ceil(float64(total) / float64(limit)))

	// Get packages
	var packages []models.Package
	if err := query.Offset(offset).Limit(limit).Get(&packages); err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to fetch packages",
		})
	}

	// Load related data
	for i := range packages {
		// Load vendor
		facades.Orm().Query().Where("id", packages[i].VendorID).First(&packages[i].Vendor)
		facades.Orm().Query().Where("id", packages[i].Vendor.UserID).First(&packages[i].Vendor.User)

		// Load package items
		facades.Orm().Query().Where("package_id", packages[i].ID).Get(&packages[i].Items)
	}

	return ctx.Response().Status(200).Json(http.Json{
		"success": true,
		"data": http.Json{
			"packages": packages,
			"pagination": http.Json{
				"current_page": page,
				"per_page":     limit,
				"total":        total,
				"total_pages":  totalPages,
			},
		},
	})
}
