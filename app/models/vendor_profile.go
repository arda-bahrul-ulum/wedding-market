package models

import (
	"time"

	"github.com/goravel/framework/database/orm"
)

type VendorProfile struct {
	orm.Model
	UserID          uint   `json:"user_id" gorm:"not null;uniqueIndex"`
	BusinessName    string `json:"business_name" gorm:"not null"`
	BusinessType    string `json:"business_type" gorm:"not null;check:business_type IN ('personal', 'company', 'wedding_organizer')"`
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
	IsVerified      bool   `json:"is_verified" gorm:"default:false"`
	IsActive        bool   `json:"is_active" gorm:"default:true"`
	SubscriptionPlan string `json:"subscription_plan" gorm:"default:'free';check:subscription_plan IN ('free', 'premium', 'enterprise')"`
	SubscriptionExpiresAt *time.Time `json:"subscription_expires_at"`
	
	// Computed fields (not stored in database)
	ServicesCount     int     `json:"services_count" gorm:"-"`
	AverageRating     float64 `json:"average_rating" gorm:"-"`
	TotalReviews      int     `json:"total_reviews" gorm:"-"`
	FeaturedPortfolio *Portfolio `json:"featured_portfolio,omitempty" gorm:"-"`
	
	// Relations
	User        User         `json:"user,omitempty" gorm:"foreignKey:UserID"`
	Services    []Service    `json:"services,omitempty" gorm:"foreignKey:VendorID"`
	Packages    []Package    `json:"packages,omitempty" gorm:"foreignKey:VendorID"`
	Orders      []Order      `json:"orders,omitempty" gorm:"foreignKey:VendorID"`
	Reviews     []Review     `json:"reviews,omitempty" gorm:"foreignKey:VendorID"`
	Portfolios  []Portfolio  `json:"portfolios,omitempty" gorm:"foreignKey:VendorID"`
	Availabilities []Availability `json:"availabilities,omitempty" gorm:"foreignKey:VendorID"`
}
