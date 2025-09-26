package services

// CategoryServiceInterface defines category service operations
type CategoryServiceInterface interface {
	BaseServiceInterface
	
	// Category management
	GetCategories(filters *CategoryFilters, page, limit int) (*ServiceResponse, error)
	GetCategory(id uint) (*ServiceResponse, error)
	CreateCategory(request *CreateCategoryRequest) (*ServiceResponse, error)
	UpdateCategory(id uint, request *UpdateCategoryRequest) (*ServiceResponse, error)
	DeleteCategory(id uint) (*ServiceResponse, error)
	
	// Category status
	ActivateCategory(id uint) (*ServiceResponse, error)
	DeactivateCategory(id uint) (*ServiceResponse, error)
	
	// Category statistics
	GetCategoryStatistics() (*ServiceResponse, error)
}

// CreateCategoryRequest represents category creation request
type CreateCategoryRequest struct {
	Name        string `json:"name" validate:"required,min=3,max=100"`
	Description string `json:"description" validate:"omitempty,max=500"`
	Icon        string `json:"icon" validate:"omitempty"`
	Color       string `json:"color" validate:"omitempty"`
	IsActive    bool   `json:"is_active"`
}

// UpdateCategoryRequest represents category update request
type UpdateCategoryRequest struct {
	Name        string `json:"name" validate:"omitempty,min=3,max=100"`
	Description string `json:"description" validate:"omitempty,max=500"`
	Icon        string `json:"icon" validate:"omitempty"`
	Color       string `json:"color" validate:"omitempty"`
	IsActive    *bool  `json:"is_active"`
}

// CategoryFilters represents category filtering options
type CategoryFilters struct {
	Name     string `json:"name"`
	IsActive *bool  `json:"is_active"`
}

// CategoryStatistics represents category statistics data
type CategoryStatistics struct {
	TotalCategories    int64 `json:"total_categories"`
	ActiveCategories   int64 `json:"active_categories"`
	InactiveCategories int64 `json:"inactive_categories"`
}
