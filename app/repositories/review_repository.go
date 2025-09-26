package repositories

import (
	"goravel/app/contracts/repositories"
	"goravel/app/models"
	"time"

	"github.com/goravel/framework/facades"
)

type ReviewRepository struct {
	BaseRepository[models.Review]
}

func NewReviewRepository() repositories.ReviewRepositoryInterface {
	return &ReviewRepository{
		BaseRepository: BaseRepository[models.Review]{},
	}
}

func (r *ReviewRepository) FindByVendorID(vendorID uint) ([]*models.Review, error) {
	var reviews []*models.Review
	err := facades.Orm().Query().Where("vendor_id", vendorID).Order("created_at desc").Get(&reviews)
	return reviews, err
}

func (r *ReviewRepository) FindByCustomerID(customerID uint) ([]*models.Review, error) {
	var reviews []*models.Review
	err := facades.Orm().Query().Where("customer_id", customerID).Order("created_at desc").Get(&reviews)
	return reviews, err
}

func (r *ReviewRepository) FindByOrderID(orderID uint) (*models.Review, error) {
	var review models.Review
	err := facades.Orm().Query().Where("order_id", orderID).First(&review)
	if err != nil {
		return nil, err
	}
	return &review, nil
}

func (r *ReviewRepository) FindByRating(rating int) ([]*models.Review, error) {
	var reviews []*models.Review
	err := facades.Orm().Query().Where("rating", rating).Order("created_at desc").Get(&reviews)
	return reviews, err
}

func (r *ReviewRepository) FindWithFilters(filters map[string]interface{}) ([]*models.Review, int64, error) {
	query := facades.Orm().Query().Model(&models.Review{})
	
	// Apply filters
	if vendorID, ok := filters["vendor_id"].(string); ok && vendorID != "" {
		query = query.Where("vendor_id", vendorID)
	}
	if rating, ok := filters["rating"].(string); ok && rating != "" {
		query = query.Where("rating", rating)
	}
	
	query = query.Order("created_at desc")
	
	// Get total count
	total, err := query.Count()
	if err != nil {
		return nil, 0, err
	}
	
	// Pagination
	page := 1
	limit := 10
	if p, ok := filters["page"].(int); ok && p > 0 {
		page = p
	}
	if l, ok := filters["limit"].(int); ok && l > 0 {
		limit = l
	}
	offset := (page - 1) * limit
	
	var reviews []*models.Review
	err = query.Offset(offset).Limit(limit).Get(&reviews)
	return reviews, total, err
}

func (r *ReviewRepository) GetAverageRating(vendorID uint) (float64, error) {
	var avgRating float64
	err := facades.Orm().Query().
		Model(&models.Review{}).
		Where("vendor_id", vendorID).
		Select("AVG(rating)").
		Scan(&avgRating)
	return avgRating, err
}

func (r *ReviewRepository) GetRatingCounts(vendorID uint) (map[int]int64, error) {
	ratingCounts := make(map[int]int64)
	for i := 1; i <= 5; i++ {
		count, err := facades.Orm().Query().
			Model(&models.Review{}).
			Where("vendor_id", vendorID).
			Where("rating", i).
			Count()
		if err == nil {
			ratingCounts[i] = count
		}
	}
	return ratingCounts, nil
}

func (r *ReviewRepository) GetTotalReviews(vendorID uint) (int64, error) {
	return facades.Orm().Query().
		Model(&models.Review{}).
		Where("vendor_id", vendorID).
		Count()
}

func (r *ReviewRepository) AddVendorReply(reviewID uint, reply string) error {
	now := time.Now()
	_, err := facades.Orm().Query().Where("id", reviewID).Update(map[string]interface{}{
		"vendor_reply": reply,
		"replied_at":  &now,
	})
	return err
}

func (r *ReviewRepository) CheckExistingReview(orderID uint) (bool, error) {
	var review models.Review
	err := facades.Orm().Query().Where("order_id", orderID).First(&review)
	if err != nil {
		return false, nil // No existing review
	}
	return true, nil // Review exists
}
