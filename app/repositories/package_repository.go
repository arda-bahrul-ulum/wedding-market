package repositories

import (
	"goravel/app/contracts/repositories"
	"goravel/app/models"

	"github.com/goravel/framework/facades"
)

type PackageRepository struct {
	BaseRepository[models.Package]
}

func NewPackageRepository() repositories.PackageRepositoryInterface {
	return &PackageRepository{
		BaseRepository: BaseRepository[models.Package]{},
	}
}

func (r *PackageRepository) FindByVendorID(vendorID uint) ([]*models.Package, error) {
	var packages []*models.Package
	err := facades.Orm().Query().Where("vendor_id", vendorID).Order("created_at desc").Get(&packages)
	return packages, err
}

func (r *PackageRepository) FindByPriceRange(minPrice, maxPrice float64) ([]*models.Package, error) {
	var packages []*models.Package
	query := facades.Orm().Query().Where("is_active", true)
	
	if minPrice > 0 {
		query = query.Where("price >= ?", minPrice)
	}
	if maxPrice > 0 {
		query = query.Where("price <= ?", maxPrice)
	}
	
	err := query.Order("created_at desc").Get(&packages)
	return packages, err
}

func (r *PackageRepository) FindActivePackages() ([]*models.Package, error) {
	var packages []*models.Package
	err := facades.Orm().Query().Where("is_active", true).Order("created_at desc").Get(&packages)
	return packages, err
}

func (r *PackageRepository) FindWithFilters(filters map[string]interface{}) ([]*models.Package, int64, error) {
	query := facades.Orm().Query().Model(&models.Package{}).Where("is_active", true)
	
	// Apply filters
	if vendorID, ok := filters["vendor_id"].(string); ok && vendorID != "" {
		query = query.Where("vendor_id", vendorID)
	}
	if minPrice, ok := filters["min_price"].(float64); ok && minPrice > 0 {
		query = query.Where("price >= ?", minPrice)
	}
	if maxPrice, ok := filters["max_price"].(float64); ok && maxPrice > 0 {
		query = query.Where("price <= ?", maxPrice)
	}
	if search, ok := filters["search"].(string); ok && search != "" {
		query = query.Where("name ILIKE ? OR description ILIKE ?", "%"+search+"%", "%"+search+"%")
	}
	
	// Sorting
	sortBy := "created_at"
	sortOrder := "desc"
	if sb, ok := filters["sort_by"].(string); ok && sb != "" {
		sortBy = sb
	}
	if so, ok := filters["sort_order"].(string); ok && so != "" {
		sortOrder = so
	}
	query = query.Order(sortBy + " " + sortOrder)
	
	// Get total count
	total, err := query.Count()
	if err != nil {
		return nil, 0, err
	}
	
	// Pagination
	page := 1
	limit := 12
	if p, ok := filters["page"].(int); ok && p > 0 {
		page = p
	}
	if l, ok := filters["limit"].(int); ok && l > 0 {
		limit = l
	}
	offset := (page - 1) * limit
	
	var packages []*models.Package
	err = query.Offset(offset).Limit(limit).Get(&packages)
	return packages, total, err
}

func (r *PackageRepository) SearchPackages(query string) ([]*models.Package, error) {
	var packages []*models.Package
	err := facades.Orm().Query().
		Where("is_active", true).
		Where("name ILIKE ? OR description ILIKE ?", "%"+query+"%", "%"+query+"%").
		Order("created_at desc").
		Get(&packages)
	return packages, err
}

func (r *PackageRepository) GetPackagesByVendorWithPagination(vendorID uint, page, limit int) ([]*models.Package, int64, error) {
	query := facades.Orm().Query().Model(&models.Package{}).Where("vendor_id", vendorID)
	
	// Get total count
	total, err := query.Count()
	if err != nil {
		return nil, 0, err
	}
	
	// Pagination
	offset := (page - 1) * limit
	
	var packages []*models.Package
	err = query.Offset(offset).Limit(limit).Order("created_at desc").Get(&packages)
	return packages, total, err
}

func (r *PackageRepository) UpdateStatus(packageID uint, isActive bool) error {
	_, err := facades.Orm().Query().Where("id", packageID).Update(map[string]interface{}{
		"is_active": isActive,
	})
	return err
}

func (r *PackageRepository) GetPackageWithItems(packageID uint) (*models.Package, error) {
	var pkg models.Package
	err := facades.Orm().Query().Where("id", packageID).First(&pkg)
	if err != nil {
		return nil, err
	}
	
	// Load package items
	err = facades.Orm().Query().Where("package_id", pkg.ID).Get(&pkg.Items)
	return &pkg, err
}
