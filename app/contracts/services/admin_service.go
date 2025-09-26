package services

type AdminServiceInterface interface {
	BaseServiceInterface

	// Dashboard operations
	GetDashboard() (*ServiceResponse, error)
	GetOrderStatistics(filters map[string]interface{}) (*ServiceResponse, error)

	// User management
	GetUsers(filters map[string]interface{}) (*ServiceResponse, error)
	UpdateUser(userID uint, request *AdminUpdateUserRequest) (*ServiceResponse, error)
	UpdateUserStatus(userID uint, request *UpdateUserStatusRequest) (*ServiceResponse, error)
	DeleteUser(userID uint) (*ServiceResponse, error)

	// Vendor management
	GetVendors(filters map[string]interface{}) (*ServiceResponse, error)
	CreateVendor(request *CreateVendorRequest) (*ServiceResponse, error)
	UpdateVendor(vendorID uint, request *UpdateVendorRequest) (*ServiceResponse, error)
	UpdateVendorStatus(vendorID uint, request *UpdateVendorStatusRequest) (*ServiceResponse, error)
	DeleteVendor(vendorID uint) (*ServiceResponse, error)

	// Order management
	GetOrders(filters map[string]interface{}) (*ServiceResponse, error)
	GetAdminOrders(filters map[string]interface{}) (*ServiceResponse, error)
	GetOrderDetail(orderID uint) (*ServiceResponse, error)
	UpdateOrderStatus(orderID uint, request *UpdateOrderStatusRequest) (*ServiceResponse, error)
	UpdateAdminOrderStatus(orderID uint, request *UpdateOrderStatusRequest) (*ServiceResponse, error)
	BulkUpdateOrderStatus(request *BulkUpdateOrderStatusRequest) (*ServiceResponse, error)
	BulkDeleteOrders(request *BulkDeleteOrdersRequest) error
	ExportOrders(filters map[string]interface{}) (*ServiceResponse, error)
	GetOrderStatusOptions() (*ServiceResponse, error)
	ProcessRefund(orderID uint, request *ProcessRefundRequest) (*ServiceResponse, error)

	// Statistics
	GetVendorStatistics() (*ServiceResponse, error)
	GetUserStatistics() (*ServiceResponse, error)
}

type AdminUpdateUserRequest struct {
	Name     string `json:"name" validate:"required,min=3"`
	Email    string `json:"email" validate:"required,email"`
	Role     string `json:"role" validate:"required,oneof=customer vendor admin super_user"`
	IsActive *bool  `json:"is_active"`
}

type UpdateUserStatusRequest struct {
	IsActive bool `json:"is_active"`
}

type CreateVendorRequest struct {
	UserID           uint    `json:"user_id" validate:"required"`
	BusinessName     string  `json:"business_name" validate:"required,min=3"`
	BusinessType     string  `json:"business_type" validate:"required"`
	Description      string  `json:"description"`
	Address          string  `json:"address"`
	City             string  `json:"city"`
	Province         string  `json:"province"`
	PostalCode       string  `json:"postal_code"`
	Latitude         float64 `json:"latitude"`
	Longitude        float64 `json:"longitude"`
	Website          string  `json:"website"`
	Instagram        string  `json:"instagram"`
	Whatsapp         string  `json:"whatsapp"`
	SubscriptionPlan string  `json:"subscription_plan" validate:"oneof=free premium enterprise"`
}

type UpdateVendorRequest struct {
	BusinessName     string  `json:"business_name" validate:"required,min=3"`
	BusinessType     string  `json:"business_type" validate:"required"`
	Description      string  `json:"description"`
	Address          string  `json:"address"`
	City             string  `json:"city"`
	Province         string  `json:"province"`
	PostalCode       string  `json:"postal_code"`
	Latitude         float64 `json:"latitude"`
	Longitude        float64 `json:"longitude"`
	Website          string  `json:"website"`
	Instagram        string  `json:"instagram"`
	Whatsapp         string  `json:"whatsapp"`
	SubscriptionPlan string  `json:"subscription_plan" validate:"oneof=free premium enterprise"`
}

type UpdateVendorStatusRequest struct {
	IsActive   *bool `json:"is_active"`
	IsVerified *bool `json:"is_verified"`
}
