package controllers

import (
	"strconv"
	"time"

	"goravel/app/models"

	"github.com/goravel/framework/contracts/http"
	"github.com/goravel/framework/facades"
)

type AdminController struct{}

func NewAdminController() *AdminController {
	return &AdminController{}
}

// GetDashboard returns admin dashboard statistics
func (c *AdminController) GetDashboard(ctx http.Context) http.Response {
	// Get statistics
	var stats struct {
		TotalUsers      int64   `json:"total_users"`
		TotalCustomers  int64   `json:"total_customers"`
		TotalVendors    int64   `json:"total_vendors"`
		TotalOrders     int64   `json:"total_orders"`
		TotalRevenue    float64 `json:"total_revenue"`
		PendingOrders   int64   `json:"pending_orders"`
		ActiveVendors   int64   `json:"active_vendors"`
		NewUsersToday   int64   `json:"new_users_today"`
		NewOrdersToday  int64   `json:"new_orders_today"`
	}

	// Count users
	stats.TotalUsers, _ = facades.Orm().Query().Model(&models.User{}).Count()
	stats.TotalCustomers, _ = facades.Orm().Query().Model(&models.User{}).Where("role", "customer").Count()

	// Count vendors
	stats.TotalVendors, _ = facades.Orm().Query().Model(&models.VendorProfile{}).Count()
	stats.ActiveVendors, _ = facades.Orm().Query().Model(&models.VendorProfile{}).Where("is_active", true).Count()

	// Count orders
	stats.TotalOrders, _ = facades.Orm().Query().Model(&models.Order{}).Count()
	stats.PendingOrders, _ = facades.Orm().Query().Model(&models.Order{}).Where("status", "pending").Count()

	// Calculate revenue
	facades.Orm().Query().Model(&models.Order{}).Where("status", "completed").Select("SUM(commission)").Scan(&stats.TotalRevenue)

	// Count today's data
	today := time.Now().Format("2006-01-02")
	stats.NewUsersToday, _ = facades.Orm().Query().Model(&models.User{}).Where("DATE(created_at) = ?", today).Count()
	stats.NewOrdersToday, _ = facades.Orm().Query().Model(&models.Order{}).Where("DATE(created_at) = ?", today).Count()

	return ctx.Response().Status(200).Json(http.Json{
		"success": true,
		"data":    stats,
	})
}

// GetUsers returns paginated list of users
func (c *AdminController) GetUsers(ctx http.Context) http.Response {
	// Get query parameters
	page, _ := strconv.Atoi(ctx.Request().Query("page", "1"))
	limit, _ := strconv.Atoi(ctx.Request().Query("limit", "10"))
	role := ctx.Request().Query("role", "")
	search := ctx.Request().Query("search", "")

	// Build query
	query := facades.Orm().Query().Model(&models.User{})

	if role != "" {
		query = query.Where("role", role)
	}

	if search != "" {
		query = query.Where("name ILIKE ? OR email ILIKE ?", "%"+search+"%", "%"+search+"%")
	}

	query = query.Order("created_at desc")

	// Get total count
	total, err := query.Count()
	if err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to count users",
		})
	}

	// Calculate pagination
	offset := (page - 1) * limit
	totalPages := int(float64(total)/float64(limit) + 0.5)

	// Get users
	var users []models.User
	if err := query.Offset(offset).Limit(limit).Get(&users); err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to fetch users",
		})
	}

	// Load vendor profiles for vendor users
	for i := range users {
		if users[i].Role == "vendor" {
			facades.Orm().Query().Where("user_id", users[i].ID).First(&users[i].VendorProfile)
		}
	}

	return ctx.Response().Status(200).Json(http.Json{
		"success": true,
		"data": http.Json{
			"users": users,
			"pagination": http.Json{
				"current_page": page,
				"per_page":     limit,
				"total":        total,
				"total_pages":  totalPages,
			},
		},
	})
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

	// Build query
	query := facades.Orm().Query().Model(&models.VendorProfile{})

	// Status filter
	switch status {
	case "active":
		query = query.Where("is_active", true)
	case "inactive":
		query = query.Where("is_active", false)
	}

	// Verification filter
	switch verification {
	case "verified":
		query = query.Where("is_verified", true)
	case "unverified":
		query = query.Where("is_verified", false)
	}

	// Business type filter
	if businessType != "" {
		query = query.Where("business_type", businessType)
	}

	// Search filter
	if search != "" {
		query = query.Where("business_name ILIKE ? OR description ILIKE ?", "%"+search+"%", "%"+search+"%")
	}

	query = query.Order("created_at desc")

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
	totalPages := int(float64(total)/float64(limit) + 0.5)

	// Get vendors
	var vendors []models.VendorProfile
	if err := query.Offset(offset).Limit(limit).Get(&vendors); err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to fetch vendors",
		})
	}

	// Load user data
	for i := range vendors {
		facades.Orm().Query().Where("id", vendors[i].UserID).First(&vendors[i].User)
	}

	return ctx.Response().Status(200).Json(http.Json{
		"success": true,
		"data": http.Json{
			"vendors": vendors,
			"pagination": http.Json{
				"current_page": page,
				"per_page":     limit,
				"total":        total,
				"total_pages":  totalPages,
			},
		},
	})
}

// UpdateVendorStatus updates vendor status
func (c *AdminController) UpdateVendorStatus(ctx http.Context) http.Response {
	vendorID := ctx.Request().Route("id")

	var request struct {
		IsActive   *bool `json:"is_active"`
		IsVerified *bool `json:"is_verified"`
	}

	if err := ctx.Request().Bind(&request); err != nil {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Invalid request data",
			"errors":  err.Error(),
		})
	}

	// Get vendor
	var vendor models.VendorProfile
	if err := facades.Orm().Query().Where("id", vendorID).First(&vendor); err != nil {
		return ctx.Response().Status(404).Json(http.Json{
			"success": false,
			"message": "Vendor not found",
		})
	}

	// Update status
	if request.IsActive != nil {
		vendor.IsActive = *request.IsActive
	}
	if request.IsVerified != nil {
		vendor.IsVerified = *request.IsVerified
	}

	if err := facades.Orm().Query().Save(&vendor); err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to update vendor status",
		})
	}

	return ctx.Response().Status(200).Json(http.Json{
		"success": true,
		"message": "Vendor status updated successfully",
		"data":    vendor,
	})
}

// CreateVendor creates a new vendor
func (c *AdminController) CreateVendor(ctx http.Context) http.Response {
	var request struct {
		UserID          uint   `json:"user_id" validate:"required"`
		BusinessName    string `json:"business_name" validate:"required,min=3"`
		BusinessType    string `json:"business_type" validate:"required,oneof=personal company wedding_organizer venue photographer makeup_artist catering decoration"`
		Description     string `json:"description"`
		Address         string `json:"address"`
		City            string `json:"city"`
		Province        string `json:"province"`
		PostalCode      string `json:"postal_code"`
		Latitude        float64 `json:"latitude"`
		Longitude       float64 `json:"longitude"`
		Website         string `json:"website"`
		Instagram       string `json:"instagram"`
		Whatsapp        string `json:"whatsapp"`
		SubscriptionPlan string `json:"subscription_plan" validate:"oneof=free premium enterprise"`
	}

	if err := ctx.Request().Bind(&request); err != nil {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Invalid request data",
			"errors":  err.Error(),
		})
	}

	// Check if user exists
	var user models.User
	if err := facades.Orm().Query().Where("id", request.UserID).First(&user); err != nil {
		return ctx.Response().Status(404).Json(http.Json{
			"success": false,
			"message": "User not found",
		})
	}

	// Check if user already has vendor profile
	var existingVendor models.VendorProfile
	if err := facades.Orm().Query().Where("user_id", request.UserID).First(&existingVendor); err == nil {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "User already has vendor profile",
		})
	}

	// Create vendor profile
	vendor := models.VendorProfile{
		UserID:           request.UserID,
		BusinessName:     request.BusinessName,
		BusinessType:     request.BusinessType,
		Description:      request.Description,
		Address:          request.Address,
		City:             request.City,
		Province:         request.Province,
		PostalCode:       request.PostalCode,
		Latitude:         request.Latitude,
		Longitude:        request.Longitude,
		Website:          request.Website,
		Instagram:        request.Instagram,
		Whatsapp:         request.Whatsapp,
		IsVerified:       false,
		IsActive:         true,
		SubscriptionPlan: request.SubscriptionPlan,
	}

	if err := facades.Orm().Query().Create(&vendor); err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to create vendor profile",
		})
	}

	// Load user data
	facades.Orm().Query().Where("id", vendor.UserID).First(&vendor.User)

	return ctx.Response().Status(201).Json(http.Json{
		"success": true,
		"message": "Vendor profile created successfully",
		"data":    vendor,
	})
}

// UpdateVendor updates vendor profile
func (c *AdminController) UpdateVendor(ctx http.Context) http.Response {
	vendorID := ctx.Request().Route("id")

	var request struct {
		BusinessName    string `json:"business_name" validate:"required,min=3"`
		BusinessType    string `json:"business_type" validate:"required,oneof=personal company wedding_organizer venue photographer makeup_artist catering decoration"`
		Description     string `json:"description"`
		Address         string `json:"address"`
		City            string `json:"city"`
		Province        string `json:"province"`
		PostalCode      string `json:"postal_code"`
		Latitude        float64 `json:"latitude"`
		Longitude       float64 `json:"longitude"`
		Website         string `json:"website"`
		Instagram       string `json:"instagram"`
		Whatsapp        string `json:"whatsapp"`
		SubscriptionPlan string `json:"subscription_plan" validate:"oneof=free premium enterprise"`
	}

	if err := ctx.Request().Bind(&request); err != nil {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Invalid request data",
			"errors":  err.Error(),
		})
	}

	// Get vendor
	var vendor models.VendorProfile
	if err := facades.Orm().Query().Where("id", vendorID).First(&vendor); err != nil {
		return ctx.Response().Status(404).Json(http.Json{
			"success": false,
			"message": "Vendor not found",
		})
	}

	// Update vendor data
	vendor.BusinessName = request.BusinessName
	vendor.BusinessType = request.BusinessType
	vendor.Description = request.Description
	vendor.Address = request.Address
	vendor.City = request.City
	vendor.Province = request.Province
	vendor.PostalCode = request.PostalCode
	vendor.Latitude = request.Latitude
	vendor.Longitude = request.Longitude
	vendor.Website = request.Website
	vendor.Instagram = request.Instagram
	vendor.Whatsapp = request.Whatsapp
	vendor.SubscriptionPlan = request.SubscriptionPlan

	if err := facades.Orm().Query().Save(&vendor); err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to update vendor profile",
		})
	}

	// Load user data
	facades.Orm().Query().Where("id", vendor.UserID).First(&vendor.User)

	return ctx.Response().Status(200).Json(http.Json{
		"success": true,
		"message": "Vendor profile updated successfully",
		"data":    vendor,
	})
}

// DeleteVendor deletes vendor profile
func (c *AdminController) DeleteVendor(ctx http.Context) http.Response {
	vendorID := ctx.Request().Route("id")

	// Get vendor
	var vendor models.VendorProfile
	if err := facades.Orm().Query().Where("id", vendorID).First(&vendor); err != nil {
		return ctx.Response().Status(404).Json(http.Json{
			"success": false,
			"message": "Vendor not found",
		})
	}

	// Delete vendor profile
	if _, err := facades.Orm().Query().Delete(&vendor); err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to delete vendor profile",
		})
	}

	return ctx.Response().Status(200).Json(http.Json{
		"success": true,
		"message": "Vendor profile deleted successfully",
	})
}

// GetOrders returns paginated list of orders
func (c *AdminController) GetOrders(ctx http.Context) http.Response {
	// Get query parameters
	page, _ := strconv.Atoi(ctx.Request().Query("page", "1"))
	limit, _ := strconv.Atoi(ctx.Request().Query("limit", "10"))
	status := ctx.Request().Query("status", "")
	paymentStatus := ctx.Request().Query("payment_status", "")

	// Build query
	query := facades.Orm().Query().Model(&models.Order{})

	if status != "" {
		query = query.Where("status", status)
	}

	if paymentStatus != "" {
		query = query.Where("payment_status", paymentStatus)
	}

	query = query.Order("created_at desc")

	// Get total count
	total, err := query.Count()
	if err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to count orders",
		})
	}

	// Calculate pagination
	offset := (page - 1) * limit
	totalPages := int(float64(total)/float64(limit) + 0.5)

	// Get orders
	var orders []models.Order
	if err := query.Offset(offset).Limit(limit).Get(&orders); err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to fetch orders",
		})
	}

	// Load related data
	for i := range orders {
		facades.Orm().Query().Where("id", orders[i].CustomerID).First(&orders[i].Customer)
		facades.Orm().Query().Where("id", orders[i].VendorID).First(&orders[i].Vendor)
		facades.Orm().Query().Where("id", orders[i].Vendor.UserID).First(&orders[i].Vendor.User)
		facades.Orm().Query().Where("order_id", orders[i].ID).Get(&orders[i].Items)
	}

	return ctx.Response().Status(200).Json(http.Json{
		"success": true,
		"data": http.Json{
			"orders": orders,
			"pagination": http.Json{
				"current_page": page,
				"per_page":     limit,
				"total":        total,
				"total_pages":  totalPages,
			},
		},
	})
}

// GetModuleSettings returns module settings
func (c *AdminController) GetModuleSettings(ctx http.Context) http.Response {
	var settings []models.ModuleSetting
	if err := facades.Orm().Query().Order("module_name").Get(&settings); err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to fetch module settings",
		})
	}

	return ctx.Response().Status(200).Json(http.Json{
		"success": true,
		"data":    settings,
	})
}

// UpdateModuleSetting updates a module setting
func (c *AdminController) UpdateModuleSetting(ctx http.Context) http.Response {
	moduleName := ctx.Request().Route("module")

	var request struct {
		IsEnabled bool   `json:"is_enabled"`
		Settings  string `json:"settings"`
	}

	if err := ctx.Request().Bind(&request); err != nil {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Invalid request data",
			"errors":  err.Error(),
		})
	}

	// Get or create module setting
	var setting models.ModuleSetting
	if err := facades.Orm().Query().Where("module_name", moduleName).First(&setting); err != nil {
		// Create new setting
		setting = models.ModuleSetting{
			ModuleName: moduleName,
			IsEnabled:  request.IsEnabled,
			Settings:   request.Settings,
		}
		if err := facades.Orm().Query().Create(&setting); err != nil {
			return ctx.Response().Status(500).Json(http.Json{
				"success": false,
				"message": "Failed to create module setting",
			})
		}
	} else {
		// Update existing setting
		setting.IsEnabled = request.IsEnabled
		setting.Settings = request.Settings
		if err := facades.Orm().Query().Save(&setting); err != nil {
			return ctx.Response().Status(500).Json(http.Json{
				"success": false,
				"message": "Failed to update module setting",
			})
		}
	}

	return ctx.Response().Status(200).Json(http.Json{
		"success": true,
		"message": "Module setting updated successfully",
		"data":    setting,
	})
}

// GetSystemSettings returns system settings
func (c *AdminController) GetSystemSettings(ctx http.Context) http.Response {
	var settings []models.SystemSetting
	if err := facades.Orm().Query().Order("key").Get(&settings); err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to fetch system settings",
		})
	}

	return ctx.Response().Status(200).Json(http.Json{
		"success": true,
		"data":    settings,
	})
}

// UpdateSystemSetting updates a system setting
func (c *AdminController) UpdateSystemSetting(ctx http.Context) http.Response {
	settingKey := ctx.Request().Route("key")

	var request struct {
		Value string `json:"value" validate:"required"`
		Type  string `json:"type" validate:"required,oneof=string number boolean json"`
	}

	if err := ctx.Request().Bind(&request); err != nil {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Invalid request data",
			"errors":  err.Error(),
		})
	}

	// Get or create system setting
	var setting models.SystemSetting
	if err := facades.Orm().Query().Where("key", settingKey).First(&setting); err != nil {
		// Create new setting
		setting = models.SystemSetting{
			Key:   settingKey,
			Value: request.Value,
			Type:  request.Type,
		}
		if err := facades.Orm().Query().Create(&setting); err != nil {
			return ctx.Response().Status(500).Json(http.Json{
				"success": false,
				"message": "Failed to create system setting",
			})
		}
	} else {
		// Update existing setting
		setting.Value = request.Value
		setting.Type = request.Type
		if err := facades.Orm().Query().Save(&setting); err != nil {
			return ctx.Response().Status(500).Json(http.Json{
				"success": false,
				"message": "Failed to update system setting",
			})
		}
	}

	return ctx.Response().Status(200).Json(http.Json{
		"success": true,
		"message": "System setting updated successfully",
		"data":    setting,
	})
}

// UpdateUser updates user data
func (c *AdminController) UpdateUser(ctx http.Context) http.Response {
	userID := ctx.Request().Route("id")

	var request struct {
		Name    string `json:"name" validate:"required,min=3"`
		Email   string `json:"email" validate:"required,email"`
		Role    string `json:"role" validate:"required,oneof=customer vendor admin super_user"`
		IsActive *bool `json:"is_active"`
	}

	if err := ctx.Request().Bind(&request); err != nil {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Invalid request data",
			"errors":  err.Error(),
		})
	}

	// Get user
	var user models.User
	if err := facades.Orm().Query().Where("id", userID).First(&user); err != nil {
		return ctx.Response().Status(404).Json(http.Json{
			"success": false,
			"message": "User not found",
		})
	}

	// Check if email is already taken by another user
	var existingUser models.User
	if err := facades.Orm().Query().Where("email", request.Email).Where("id !=", userID).First(&existingUser); err == nil {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Email already taken",
		})
	}

	// Prevent changing super_user role
	if user.Role == "super_user" && request.Role != "super_user" {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Cannot change super user role",
		})
	}

	// Update user data
	user.Name = request.Name
	user.Email = request.Email
	user.Role = request.Role
	if request.IsActive != nil {
		user.IsActive = *request.IsActive
	}

	if err := facades.Orm().Query().Save(&user); err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to update user",
		})
	}

	return ctx.Response().Status(200).Json(http.Json{
		"success": true,
		"message": "User updated successfully",
		"data":    user,
	})
}

// UpdateUserStatus updates user status (activate/deactivate)
func (c *AdminController) UpdateUserStatus(ctx http.Context) http.Response {
	userID := ctx.Request().Route("id")

	var request struct {
		IsActive *bool `json:"is_active"`
	}

	if err := ctx.Request().Bind(&request); err != nil {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Invalid request data",
			"errors":  err.Error(),
		})
	}

	// Get user
	var user models.User
	if err := facades.Orm().Query().Where("id", userID).First(&user); err != nil {
		return ctx.Response().Status(404).Json(http.Json{
			"success": false,
			"message": "User not found",
		})
	}

	// Prevent deactivating super_user
	if user.Role == "super_user" && request.IsActive != nil && !*request.IsActive {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Cannot deactivate super user",
		})
	}

	// Update status
	if request.IsActive != nil {
		user.IsActive = *request.IsActive
	}

	if err := facades.Orm().Query().Save(&user); err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to update user status",
		})
	}

	return ctx.Response().Status(200).Json(http.Json{
		"success": true,
		"message": "User status updated successfully",
		"data":    user,
	})
}

// DeleteUser deletes a user
func (c *AdminController) DeleteUser(ctx http.Context) http.Response {
	userID := ctx.Request().Route("id")

	// Get user
	var user models.User
	if err := facades.Orm().Query().Where("id", userID).First(&user); err != nil {
		return ctx.Response().Status(404).Json(http.Json{
			"success": false,
			"message": "User not found",
		})
	}

	// Prevent deleting super_user
	if user.Role == "super_user" {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Cannot delete super user",
		})
	}

	// Delete user (this will cascade delete related records)
	if _, err := facades.Orm().Query().Delete(&user); err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"success": false,
			"message": "Failed to delete user",
		})
	}

	return ctx.Response().Status(200).Json(http.Json{
		"success": true,
		"message": "User deleted successfully",
	})
}
