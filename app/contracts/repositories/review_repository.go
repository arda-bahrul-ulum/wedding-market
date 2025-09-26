package repositories

import "goravel/app/models"

type ReviewRepositoryInterface interface {
	BaseRepositoryInterface[models.Review]
	
	// Review-specific methods
	FindByVendorID(vendorID uint) ([]*models.Review, error)
	FindByCustomerID(customerID uint) ([]*models.Review, error)
	FindByOrderID(orderID uint) (*models.Review, error)
	FindByRating(rating int) ([]*models.Review, error)
	FindWithFilters(filters map[string]interface{}) ([]*models.Review, int64, error)
	GetAverageRating(vendorID uint) (float64, error)
	GetRatingCounts(vendorID uint) (map[int]int64, error)
	GetTotalReviews(vendorID uint) (int64, error)
	AddVendorReply(reviewID uint, reply string) error
	CheckExistingReview(orderID uint) (bool, error)
}
