package services

// UserServiceInterface defines user service operations
type UserServiceInterface interface {
	BaseServiceInterface
	
	// User management
	GetUser(id uint) (*ServiceResponse, error)
	GetUserByEmail(email string) (*ServiceResponse, error)
	UpdateUser(id uint, request *UpdateUserRequest) (*ServiceResponse, error)
	UpdateProfile(id uint, request *UpdateProfileRequest) (*ServiceResponse, error)
	DeleteUser(id uint) (*ServiceResponse, error)
	
	// User status
	ActivateUser(id uint) (*ServiceResponse, error)
	DeactivateUser(id uint) (*ServiceResponse, error)
	
	// User listing
	GetUsers(filters *UserFilters, page, limit int) (*ServiceResponse, error)
	SearchUsers(query string, role string, page, limit int) (*ServiceResponse, error)
	
	// User statistics
	GetUserStatistics() (*ServiceResponse, error)
	GetUsersByRole(role string) (*ServiceResponse, error)
}

// UpdateUserRequest represents user update request data
type UpdateUserRequest struct {
	Name     string `json:"name" validate:"omitempty,min=3"`
	Email    string `json:"email" validate:"omitempty,email"`
	Phone    string `json:"phone" validate:"omitempty"`
	Avatar   string `json:"avatar" validate:"omitempty"`
	IsActive *bool  `json:"is_active" validate:"omitempty"`
}

// UpdateProfileRequest represents profile update request data
type UpdateProfileRequest struct {
	Name   string `json:"name" validate:"omitempty,min=3"`
	Phone  string `json:"phone" validate:"omitempty"`
	Avatar string `json:"avatar" validate:"omitempty"`
}

// UserFilters represents user filtering options
type UserFilters struct {
	Role     string `json:"role"`
	IsActive *bool  `json:"is_active"`
	Email    string `json:"email"`
	Name     string `json:"name"`
}

// UserStatistics represents user statistics data
type UserStatistics struct {
	TotalUsers     int64 `json:"total_users"`
	TotalCustomers int64 `json:"total_customers"`
	TotalVendors   int64 `json:"total_vendors"`
	TotalAdmins    int64 `json:"total_admins"`
	ActiveUsers    int64 `json:"active_users"`
	InactiveUsers  int64 `json:"inactive_users"`
}
