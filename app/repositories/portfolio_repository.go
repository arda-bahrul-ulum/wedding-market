package repositories

import (
	"goravel/app/contracts/repositories"
	"goravel/app/models"

	"github.com/goravel/framework/facades"
)

type PortfolioRepository struct {
	BaseRepository[models.Portfolio]
}

func NewPortfolioRepository() repositories.PortfolioRepositoryInterface {
	return &PortfolioRepository{
		BaseRepository: BaseRepository[models.Portfolio]{},
	}
}

func (r *PortfolioRepository) FindByVendorID(vendorID uint) ([]*models.Portfolio, error) {
	var portfolios []*models.Portfolio
	err := facades.Orm().Query().
		Where("vendor_id", vendorID).
		Order("sort_order, created_at desc").
		Get(&portfolios)
	return portfolios, err
}

func (r *PortfolioRepository) FindFeaturedByVendorID(vendorID uint) ([]*models.Portfolio, error) {
	var portfolios []*models.Portfolio
	err := facades.Orm().Query().
		Where("vendor_id", vendorID).
		Where("is_featured", true).
		Order("sort_order, created_at desc").
		Get(&portfolios)
	return portfolios, err
}

func (r *PortfolioRepository) FindByImageType(imageType string) ([]*models.Portfolio, error) {
	var portfolios []*models.Portfolio
	err := facades.Orm().Query().
		Where("image_type", imageType).
		Order("created_at desc").
		Get(&portfolios)
	return portfolios, err
}

func (r *PortfolioRepository) FindWithFilters(filters map[string]interface{}) ([]*models.Portfolio, int64, error) {
	query := facades.Orm().Query().Model(&models.Portfolio{})
	
	// Apply filters
	if vendorID, ok := filters["vendor_id"].(uint); ok && vendorID > 0 {
		query = query.Where("vendor_id", vendorID)
	}
	if featured, ok := filters["featured"].(string); ok && featured == "true" {
		query = query.Where("is_featured", true)
	}
	
	query = query.Order("sort_order, created_at desc")
	
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
	
	var portfolios []*models.Portfolio
	err = query.Offset(offset).Limit(limit).Get(&portfolios)
	return portfolios, total, err
}

func (r *PortfolioRepository) GetPortfoliosByVendorWithPagination(vendorID uint, page, limit int) ([]*models.Portfolio, int64, error) {
	query := facades.Orm().Query().Model(&models.Portfolio{}).Where("vendor_id", vendorID)
	
	// Get total count
	total, err := query.Count()
	if err != nil {
		return nil, 0, err
	}
	
	// Pagination
	offset := (page - 1) * limit
	
	var portfolios []*models.Portfolio
	err = query.Offset(offset).Limit(limit).Order("sort_order, created_at desc").Get(&portfolios)
	return portfolios, total, err
}

func (r *PortfolioRepository) UpdateSortOrder(portfolioID uint, sortOrder int) error {
	_, err := facades.Orm().Query().Where("id", portfolioID).Update(map[string]interface{}{
		"sort_order": sortOrder,
	})
	return err
}

func (r *PortfolioRepository) UpdateFeaturedStatus(portfolioID uint, isFeatured bool) error {
	_, err := facades.Orm().Query().Where("id", portfolioID).Update(map[string]interface{}{
		"is_featured": isFeatured,
	})
	return err
}

func (r *PortfolioRepository) GetFeaturedPortfolio(vendorID uint) (*models.Portfolio, error) {
	var portfolio models.Portfolio
	err := facades.Orm().Query().
		Where("vendor_id", vendorID).
		Where("is_featured", true).
		First(&portfolio)
	if err != nil {
		return nil, err
	}
	return &portfolio, nil
}
