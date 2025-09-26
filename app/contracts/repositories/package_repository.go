package repositories

import "goravel/app/models"

type PackageRepositoryInterface interface {
	BaseRepositoryInterface[models.Package]
	
	// Package-specific methods
	FindByVendorID(vendorID uint) ([]*models.Package, error)
	FindByPriceRange(minPrice, maxPrice float64) ([]*models.Package, error)
	FindActivePackages() ([]*models.Package, error)
	FindWithFilters(filters map[string]interface{}) ([]*models.Package, int64, error)
	SearchPackages(query string) ([]*models.Package, error)
	GetPackagesByVendorWithPagination(vendorID uint, page, limit int) ([]*models.Package, int64, error)
	UpdateStatus(packageID uint, isActive bool) error
	GetPackageWithItems(packageID uint) (*models.Package, error)
}
