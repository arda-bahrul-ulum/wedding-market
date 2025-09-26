package services

type PackageServiceInterface interface {
	// Basic CRUD operations
	Get(filters map[string]interface{}) (*ServiceResponse, error)
	GetDetail(packageID uint) (*ServiceResponse, error)
	Create(request *CreatePackageRequest) (*ServiceResponse, error)
	Update(packageID uint, request *UpdatePackageRequest) (*ServiceResponse, error)
	Delete(vendorID, packageID uint) (*ServiceResponse, error)

	// Vendor operations
	GetVendorPackages(filters map[string]interface{}) (*ServiceResponse, error)

	// Search operations
	SearchPackages(filters map[string]interface{}) (*ServiceResponse, error)
}

// Request structs for Package operations
type CreatePackageRequest struct {
	VendorID    uint    `json:"vendor_id" validate:"required"`
	Name        string  `json:"name" validate:"required"`
	Description string  `json:"description" validate:"required"`
	Price       float64 `json:"price" validate:"required,min=0"`
	Duration    int     `json:"duration" validate:"required,min=1"`
	IsActive    bool    `json:"is_active"`
}

type UpdatePackageRequest struct {
	Name        string  `json:"name"`
	Description string  `json:"description"`
	Price       float64 `json:"price" validate:"min=0"`
	Duration    int     `json:"duration" validate:"min=1"`
	IsActive    *bool   `json:"is_active"`
}
