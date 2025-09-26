package repositories

import "goravel/app/models"

type PortfolioRepositoryInterface interface {
	BaseRepositoryInterface[models.Portfolio]
	
	// Portfolio-specific methods
	FindByID(id uint) (*models.Portfolio, error)
	FindByVendorID(vendorID uint) ([]*models.Portfolio, error)
	FindFeaturedByVendorID(vendorID uint) ([]*models.Portfolio, error)
	FindByImageType(imageType string) ([]*models.Portfolio, error)
	FindWithFilters(filters map[string]interface{}) ([]*models.Portfolio, int64, error)
	GetPortfoliosByVendorWithPagination(vendorID uint, page, limit int) ([]*models.Portfolio, int64, error)
	UpdateSortOrder(portfolioID uint, sortOrder int) error
	UpdateFeaturedStatus(portfolioID uint, isFeatured bool) error
	GetFeaturedPortfolio(vendorID uint) (*models.Portfolio, error)
}
