package services

type ReviewServiceInterface interface {
	BaseServiceInterface

	// Review operations
	CreateReview(customerID uint, request *CreateReviewRequest) (*ServiceResponse, error)
	GetReviews(filters map[string]interface{}) (*ServiceResponse, error)
	GetReviewDetail(reviewID uint) (*ServiceResponse, error)

	// Vendor review operations
	ReplyToReview(reviewID uint, vendorID uint, request *ReplyToReviewRequest) (*ServiceResponse, error)
	GetVendorReviews(vendorID uint, filters map[string]interface{}) (*ServiceResponse, error)
	GetVendorReviewStatistics(vendorID uint) (*ServiceResponse, error)
}

type CreateReviewRequest struct {
	CustomerID uint   `json:"customer_id"`
	OrderID    uint   `json:"order_id" validate:"required"`
	Rating     int    `json:"rating" validate:"required,min=1,max=5"`
	Comment    string `json:"comment"`
	Images     string `json:"images"`
}

type ReplyToReviewRequest struct {
	UserID uint   `json:"user_id"`
	Reply  string `json:"reply" validate:"required"`
}
