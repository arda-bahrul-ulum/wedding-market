package controllers

import (
	"strings"
	"time"

	"goravel/app/models"

	"github.com/goravel/framework/contracts/http"
	"github.com/goravel/framework/facades"
)

type UserController struct{}

func NewUserController() *UserController {
	return &UserController{}
}

// UpdateProfile handles profile updates for both customer and vendor
func (c *UserController) UpdateProfile(ctx http.Context) http.Response {
	var request struct {
		ProfileType   string `json:"profile_type"` // "customer" or "vendor"
		FullName      string `json:"full_name"`
		Phone         string `json:"phone"`
		Address       string `json:"address"`
		City          string `json:"city"`
		Province      string `json:"province"`
		PostalCode    string `json:"postal_code"`
		BirthDate     string `json:"birth_date"`
		Gender        string `json:"gender"`
		Bio           string `json:"bio"`
		// Vendor specific fields
		BusinessName  string `json:"business_name"`
		BusinessType  string `json:"business_type"`
		Description   string `json:"description"`
		Website       string `json:"website"`
		Instagram     string `json:"instagram"`
		Whatsapp      string `json:"whatsapp"`
	}

	if err := ctx.Request().Bind(&request); err != nil {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Invalid request data",
			"errors":  err.Error(),
		})
	}

	// Get user from context
	userInterface := ctx.Value("user")
	if userInterface == nil {
		return ctx.Response().Status(401).Json(http.Json{
			"success": false,
			"message": "Unauthorized - user not found in context",
		})
	}

	user, ok := userInterface.(models.User)
	if !ok {
		return ctx.Response().Status(401).Json(http.Json{
			"success": false,
			"message": "Unauthorized - invalid user data",
		})
	}

	// Validate profile type
	if request.ProfileType != "customer" && request.ProfileType != "vendor" {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Profile type must be customer or vendor",
		})
	}

	// Validate role matches profile type
	if (request.ProfileType == "customer" && user.Role != "customer") ||
		(request.ProfileType == "vendor" && user.Role != "vendor") {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "Profile type does not match user role",
		})
	}

	if request.ProfileType == "customer" {
		// Update customer profile
		var customerProfile models.CustomerProfile
		err := facades.Orm().Query().Where("user_id", user.ID).First(&customerProfile)
		if err != nil {
			return ctx.Response().Status(404).Json(http.Json{
				"success": false,
				"message": "Customer profile not found",
			})
		}

		// Update fields
		if request.FullName != "" {
			customerProfile.FullName = strings.TrimSpace(request.FullName)
		}
		if request.Phone != "" {
			customerProfile.Phone = &request.Phone
		}
		if request.Address != "" {
			customerProfile.Address = &request.Address
		}
		if request.City != "" {
			customerProfile.City = &request.City
		}
		if request.Province != "" {
			customerProfile.Province = &request.Province
		}
		if request.PostalCode != "" {
			customerProfile.PostalCode = &request.PostalCode
		}
		if request.BirthDate != "" {
			if birthDate, err := time.Parse("2006-01-02", request.BirthDate); err == nil {
				customerProfile.BirthDate = &birthDate
			}
		}
		if request.Gender != "" {
			customerProfile.Gender = &request.Gender
		}
		if request.Bio != "" {
			customerProfile.Bio = &request.Bio
		}

		if err := facades.Orm().Query().Save(&customerProfile); err != nil {
			facades.Log().Error("Failed to update customer profile: " + err.Error())
			return ctx.Response().Status(500).Json(http.Json{
				"success": false,
				"message": "Gagal memperbarui profil customer",
			})
		}

		return ctx.Response().Status(200).Json(http.Json{
			"success": true,
			"message": "Profil customer berhasil diperbarui",
			"data": http.Json{
				"customer_profile": customerProfile,
			},
		})

	} else {
		// Update vendor profile
		var vendorProfile models.VendorProfile
		err := facades.Orm().Query().Where("user_id", user.ID).First(&vendorProfile)
		if err != nil {
			return ctx.Response().Status(404).Json(http.Json{
				"success": false,
				"message": "Vendor profile not found",
			})
		}

		// Update fields
		if request.BusinessName != "" {
			vendorProfile.BusinessName = strings.TrimSpace(request.BusinessName)
		}
		if request.BusinessType != "" {
			vendorProfile.BusinessType = request.BusinessType
		}
		if request.Description != "" {
			vendorProfile.Description = request.Description
		}
		if request.Address != "" {
			vendorProfile.Address = request.Address
		}
		if request.City != "" {
			vendorProfile.City = request.City
		}
		if request.Province != "" {
			vendorProfile.Province = request.Province
		}
		if request.PostalCode != "" {
			vendorProfile.PostalCode = request.PostalCode
		}
		if request.Website != "" {
			vendorProfile.Website = request.Website
		}
		if request.Instagram != "" {
			vendorProfile.Instagram = request.Instagram
		}
		if request.Whatsapp != "" {
			vendorProfile.Whatsapp = request.Whatsapp
		}

		if err := facades.Orm().Query().Save(&vendorProfile); err != nil {
			facades.Log().Error("Failed to update vendor profile: " + err.Error())
			return ctx.Response().Status(500).Json(http.Json{
				"success": false,
				"message": "Gagal memperbarui profil vendor",
			})
		}

		return ctx.Response().Status(200).Json(http.Json{
			"success": true,
			"message": "Profil vendor berhasil diperbarui",
			"data": http.Json{
				"vendor_profile": vendorProfile,
			},
		})
	}
}

// Show returns user information by ID
func (c *UserController) Show(ctx http.Context) http.Response {
	userID := ctx.Request().Input("id")
	if userID == "" {
		return ctx.Response().Status(400).Json(http.Json{
			"success": false,
			"message": "User ID is required",
		})
	}

	var user models.User
	err := facades.Orm().Query().Where("id", userID).First(&user)
	if err != nil {
		return ctx.Response().Status(404).Json(http.Json{
			"success": false,
			"message": "User not found",
		})
	}

	// Load profile based on role
	if user.Role == "vendor" {
		var vendorProfile models.VendorProfile
		if err := facades.Orm().Query().Where("user_id", user.ID).First(&vendorProfile); err == nil {
			user.VendorProfile = &vendorProfile
		}
	} else if user.Role == "customer" {
		var customerProfile models.CustomerProfile
		if err := facades.Orm().Query().Where("user_id", user.ID).First(&customerProfile); err == nil {
			user.CustomerProfile = &customerProfile
		}
	}

	return ctx.Response().Status(200).Json(http.Json{
		"success": true,
		"message": "User data retrieved successfully",
		"data": http.Json{
			"user": user,
		},
	})
}