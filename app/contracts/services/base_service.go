package services

// BaseServiceInterface defines common service operations
type BaseServiceInterface interface {
	// Service lifecycle
	Initialize() error
	Cleanup() error
}

// ServiceResponse represents a standard service response
type ServiceResponse struct {
	Success bool        `json:"success"`
	Message string      `json:"message"`
	Data    interface{} `json:"data,omitempty"`
	Errors  interface{} `json:"errors,omitempty"`
	Meta    interface{} `json:"meta,omitempty"`
}

// PaginationMeta represents pagination metadata
type PaginationMeta struct {
	CurrentPage int   `json:"current_page"`
	PerPage     int   `json:"per_page"`
	Total       int64 `json:"total"`
	LastPage    int   `json:"last_page"`
	HasNext     bool  `json:"has_next"`
	HasPrev     bool  `json:"has_prev"`
}

// NewServiceResponse creates a new service response
func NewServiceResponse(success bool, message string, data interface{}) *ServiceResponse {
	return &ServiceResponse{
		Success: success,
		Message: message,
		Data:    data,
	}
}

// NewSuccessResponse creates a new success response
func NewSuccessResponse(message string, data interface{}) *ServiceResponse {
	return &ServiceResponse{
		Success: true,
		Message: message,
		Data:    data,
	}
}

// NewErrorResponse creates a new error response
func NewErrorResponse(message string, errors interface{}) *ServiceResponse {
	return &ServiceResponse{
		Success: false,
		Message: message,
		Errors:  errors,
	}
}

// NewPaginatedResponse creates a new paginated response
func NewPaginatedResponse(success bool, message string, data interface{}, meta *PaginationMeta) *ServiceResponse {
	return &ServiceResponse{
		Success: success,
		Message: message,
		Data:    data,
		Meta:    meta,
	}
}

// CalculatePaginationMeta calculates pagination metadata
func CalculatePaginationMeta(page, limit int, total int64) *PaginationMeta {
	lastPage := int((total + int64(limit) - 1) / int64(limit))
	if lastPage < 1 {
		lastPage = 1
	}

	return &PaginationMeta{
		CurrentPage: page,
		PerPage:     limit,
		Total:       total,
		LastPage:    lastPage,
		HasNext:     page < lastPage,
		HasPrev:     page > 1,
	}
}
