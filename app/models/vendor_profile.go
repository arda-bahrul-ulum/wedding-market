package models

import (
	"time"

	"github.com/goravel/framework/database/orm"
)

const (
	BusinessTypePersonal         = "personal"
	BusinessTypeCompany          = "company"
	BusinessTypeWeddingOrganizer = "wedding_organizer"

	SubscriptionPlanFree       = "free"
	SubscriptionPlanPremium    = "premium"
	SubscriptionPlanEnterprise = "enterprise"
)

type VendorProfile struct {
	orm.Model
	UserID                uint       `json:"user_id" gorm:"not null;uniqueIndex"`
	BusinessName          string     `json:"business_name" gorm:"not null;size:255"`
	BusinessType          string     `json:"business_type" gorm:"not null;size:50;check:business_type IN ('personal', 'company', 'wedding_organizer')"`
	Description           string     `json:"description" gorm:"type:text"`
	Address               string     `json:"address" gorm:"type:text"`
	City                  string     `json:"city" gorm:"size:100"`
	Province              string     `json:"province" gorm:"size:100"`
	PostalCode            string     `json:"postal_code" gorm:"size:20"`
	Latitude              float64    `json:"latitude" gorm:"type:decimal(10,8)"`
	Longitude             float64    `json:"longitude" gorm:"type:decimal(11,8)"`
	Website               string     `json:"website" gorm:"size:500"`
	Instagram             string     `json:"instagram" gorm:"size:255"`
	Whatsapp              string     `json:"whatsapp" gorm:"size:20"`
	IsVerified            bool       `json:"is_verified" gorm:"default:false"`
	IsActive              bool       `json:"is_active" gorm:"default:true"`
	SubscriptionPlan      string     `json:"subscription_plan" gorm:"default:'free';size:20;check:subscription_plan IN ('free', 'premium', 'enterprise')"`
	SubscriptionExpiresAt *time.Time `json:"subscription_expires_at"`

	// Computed fields (not stored in database)
	ServicesCount     int        `json:"services_count" gorm:"-"`
	AverageRating     float64    `json:"average_rating" gorm:"-"`
	TotalReviews      int        `json:"total_reviews" gorm:"-"`
	FeaturedPortfolio *Portfolio `json:"featured_portfolio,omitempty" gorm:"-"`

	// Relations
	User           User           `json:"user,omitempty" gorm:"foreignKey:UserID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	Services       []Service      `json:"services,omitempty" gorm:"foreignKey:VendorID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	Packages       []Package      `json:"packages,omitempty" gorm:"foreignKey:VendorID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	Orders         []Order        `json:"orders,omitempty" gorm:"foreignKey:VendorID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL"`
	Reviews        []Review       `json:"reviews,omitempty" gorm:"foreignKey:VendorID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	Portfolios     []Portfolio    `json:"portfolios,omitempty" gorm:"foreignKey:VendorID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	Availabilities []Availability `json:"availabilities,omitempty" gorm:"foreignKey:VendorID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
}

// TableName returns the table name for VendorProfile model
func (VendorProfile) TableName() string {
	return "vendor_profiles"
}

// IsPersonalBusiness checks if vendor is a personal business
func (v *VendorProfile) IsPersonalBusiness() bool {
	return v.BusinessType == BusinessTypePersonal
}

// IsCompanyBusiness checks if vendor is a company business
func (v *VendorProfile) IsCompanyBusiness() bool {
	return v.BusinessType == BusinessTypeCompany
}

// IsWeddingOrganizer checks if vendor is a wedding organizer
func (v *VendorProfile) IsWeddingOrganizer() bool {
	return v.BusinessType == BusinessTypeWeddingOrganizer
}

// HasPremiumSubscription checks if vendor has premium subscription
func (v *VendorProfile) HasPremiumSubscription() bool {
	return v.SubscriptionPlan == SubscriptionPlanPremium
}

// HasEnterpriseSubscription checks if vendor has enterprise subscription
func (v *VendorProfile) HasEnterpriseSubscription() bool {
	return v.SubscriptionPlan == SubscriptionPlanEnterprise
}

// IsSubscriptionExpired checks if subscription is expired
func (v *VendorProfile) IsSubscriptionExpired() bool {
	if v.SubscriptionExpiresAt == nil {
		return false
	}
	return v.SubscriptionExpiresAt.Before(time.Now())
}
