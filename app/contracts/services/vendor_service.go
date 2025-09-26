package services

// VendorServiceInterface defines vendor service operations
type VendorServiceInterface interface {
	BaseServiceInterface
	
	// Vendor profile management
	GetVendorProfile(userID uint) (*ServiceResponse, error)
	CreateVendorProfile(userID uint, request *CreateVendorProfileRequest) (*ServiceResponse, error)
	UpdateVendorProfile(userID uint, request *UpdateVendorProfileRequest) (*ServiceResponse, error)
	DeleteVendorProfile(userID uint) (*ServiceResponse, error)
	
	// Vendor operations
	GetVendor(id uint) (*ServiceResponse, error)
	GetVendors(filters *VendorFilters, page, limit int) (*ServiceResponse, error)
	SearchVendors(query string, filters *VendorFilters, page, limit int) (*ServiceResponse, error)
	
	// Vendor verification
	VerifyVendor(id uint) (*ServiceResponse, error)
	UnverifyVendor(id uint) (*ServiceResponse, error)
	
	// Vendor status
	ActivateVendor(id uint) (*ServiceResponse, error)
	DeactivateVendor(id uint) (*ServiceResponse, error)
	
	// Subscription management
	UpdateSubscription(id uint, request *UpdateSubscriptionRequest) (*ServiceResponse, error)
	
	// Vendor statistics
	GetVendorStatistics() (*ServiceResponse, error)
	GetVendorsByLocation(city, province string) (*ServiceResponse, error)
}

// CreateVendorProfileRequest represents vendor profile creation request
type CreateVendorProfileRequest struct {
	BusinessName string  `json:"business_name" validate:"required,min=3"`
	BusinessType string  `json:"business_type" validate:"required,oneof=personal company wedding_organizer"`
	Description  string  `json:"description" validate:"omitempty"`
	Address      string  `json:"address" validate:"omitempty"`
	City         string  `json:"city" validate:"omitempty"`
	Province     string  `json:"province" validate:"omitempty"`
	PostalCode   string  `json:"postal_code" validate:"omitempty"`
	Latitude     float64 `json:"latitude" validate:"omitempty"`
	Longitude    float64 `json:"longitude" validate:"omitempty"`
	Website      string  `json:"website" validate:"omitempty,url"`
	Instagram    string  `json:"instagram" validate:"omitempty"`
	Whatsapp     string  `json:"whatsapp" validate:"omitempty"`
}

// UpdateVendorProfileRequest represents vendor profile update request
type UpdateVendorProfileRequest struct {
	BusinessName string  `json:"business_name" validate:"omitempty,min=3"`
	BusinessType string  `json:"business_type" validate:"omitempty,oneof=personal company wedding_organizer"`
	Description  string  `json:"description" validate:"omitempty"`
	Address      string  `json:"address" validate:"omitempty"`
	City         string  `json:"city" validate:"omitempty"`
	Province     string  `json:"province" validate:"omitempty"`
	PostalCode   string  `json:"postal_code" validate:"omitempty"`
	Latitude     float64 `json:"latitude" validate:"omitempty"`
	Longitude    float64 `json:"longitude" validate:"omitempty"`
	Website      string  `json:"website" validate:"omitempty,url"`
	Instagram    string  `json:"instagram" validate:"omitempty"`
	Whatsapp     string  `json:"whatsapp" validate:"omitempty"`
}

// UpdateSubscriptionRequest represents subscription update request
type UpdateSubscriptionRequest struct {
	Plan      string      `json:"plan" validate:"required,oneof=free premium enterprise"`
	ExpiresAt interface{} `json:"expires_at" validate:"omitempty"`
}

// VendorFilters represents vendor filtering options
type VendorFilters struct {
	BusinessType     string `json:"business_type"`
	City             string `json:"city"`
	Province         string `json:"province"`
	IsVerified       *bool  `json:"is_verified"`
	IsActive         *bool  `json:"is_active"`
	SubscriptionPlan string `json:"subscription_plan"`
}

// VendorStatistics represents vendor statistics data
type VendorStatistics struct {
	TotalVendors        int64 `json:"total_vendors"`
	VerifiedVendors     int64 `json:"verified_vendors"`
	UnverifiedVendors   int64 `json:"unverified_vendors"`
	ActiveVendors       int64 `json:"active_vendors"`
	InactiveVendors     int64 `json:"inactive_vendors"`
	PersonalBusinesses  int64 `json:"personal_businesses"`
	Companies           int64 `json:"companies"`
	WeddingOrganizers   int64 `json:"wedding_organizers"`
	FreeSubscriptions   int64 `json:"free_subscriptions"`
	PremiumSubscriptions int64 `json:"premium_subscriptions"`
	EnterpriseSubscriptions int64 `json:"enterprise_subscriptions"`
}
