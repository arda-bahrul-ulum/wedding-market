package services

type ServiceServiceInterface interface {
	BaseServiceInterface
	
	// Service operations
	GetServices(filters map[string]interface{}) (*ServiceResponse, error)
	GetServiceDetail(serviceID uint) (*ServiceResponse, error)
	CreateService(vendorID uint, request *CreateServiceRequest) (*ServiceResponse, error)
	UpdateService(serviceID uint, vendorID uint, request *UpdateServiceRequest) (*ServiceResponse, error)
	DeleteService(serviceID uint, vendorID uint) (*ServiceResponse, error)
	
	// Vendor service operations
	GetVendorServices(vendorID uint, filters map[string]interface{}) (*ServiceResponse, error)
	
	// Search operations
	SearchServices(query string, filters map[string]interface{}) (*ServiceResponse, error)
}

type CreateServiceRequest struct {
	UserID      uint    `json:"user_id"`
	CategoryID  uint    `json:"category_id" validate:"required"`
	Name        string  `json:"name" validate:"required"`
	Description string  `json:"description"`
	Price       float64 `json:"price" validate:"required,min=0"`
	PriceType   string  `json:"price_type" validate:"required,oneof=fixed hourly daily custom"`
	MinPrice    float64 `json:"min_price"`
	MaxPrice    float64 `json:"max_price"`
	Images      string  `json:"images"`
	Tags        string  `json:"tags"`
}

type UpdateServiceRequest struct {
	UserID      uint    `json:"user_id"`
	CategoryID  uint    `json:"category_id" validate:"required"`
	Name        string  `json:"name" validate:"required"`
	Description string  `json:"description"`
	Price       float64 `json:"price" validate:"required,min=0"`
	PriceType   string  `json:"price_type" validate:"required,oneof=fixed hourly daily custom"`
	MinPrice    float64 `json:"min_price"`
	MaxPrice    float64 `json:"max_price"`
	IsActive    bool    `json:"is_active"`
	Images      string  `json:"images"`
	Tags        string  `json:"tags"`
}
