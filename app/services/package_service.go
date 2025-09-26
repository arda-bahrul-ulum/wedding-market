package services

import (
	"goravel/app/contracts/repositories"
	"goravel/app/contracts/services"
	"goravel/app/models"

	"github.com/goravel/framework/facades"
)

type PackageService struct {
	packageRepo repositories.PackageRepositoryInterface
	vendorRepo  repositories.VendorProfileRepositoryInterface
}

func NewPackageService(
	packageRepo repositories.PackageRepositoryInterface,
	vendorRepo repositories.VendorProfileRepositoryInterface,
) services.PackageServiceInterface {
	return &PackageService{
		packageRepo: packageRepo,
		vendorRepo:  vendorRepo,
	}
}

func (s *PackageService) Get(filters map[string]interface{}) (*services.ServiceResponse, error) {
	packages, _, err := s.packageRepo.FindWithFilters(filters)
	if err != nil {
		facades.Log().Error("Failed to get packages: " + err.Error())
		return &services.ServiceResponse{
			Success: false,
			Message: "Failed to get packages",
		}, err
	}

	return &services.ServiceResponse{
		Success: true,
		Message: "Packages retrieved successfully",
		Data:    packages,
	}, nil
}

func (s *PackageService) GetDetail(packageID uint) (*services.ServiceResponse, error) {
	pkg, err := s.packageRepo.Find(packageID)
	if err != nil {
		return &services.ServiceResponse{
			Success: false,
			Message: "Package not found",
		}, nil
	}

	return &services.ServiceResponse{
		Success: true,
		Message: "Package retrieved successfully",
		Data:    pkg,
	}, nil
}

func (s *PackageService) Create(request *services.CreatePackageRequest) (*services.ServiceResponse, error) {
	// Check if vendor exists and is active
	vendor, err := s.vendorRepo.FindBy("user_id", request.VendorID)
	if err != nil {
		return &services.ServiceResponse{
			Success: false,
			Message: "Vendor profile not found",
		}, nil
	}

	if !vendor.IsActive {
		return &services.ServiceResponse{
			Success: false,
			Message: "Vendor is not active",
		}, nil
	}

	// Create package
	pkg := &models.Package{
		VendorID:    request.VendorID,
		Name:        request.Name,
		Description: request.Description,
		Price:       request.Price,
		IsActive:    request.IsActive,
	}

	if err := s.packageRepo.Create(pkg); err != nil {
		facades.Log().Error("Failed to create package: " + err.Error())
		return &services.ServiceResponse{
			Success: false,
			Message: "Failed to create package",
		}, err
	}

	return &services.ServiceResponse{
		Success: true,
		Message: "Package created successfully",
		Data:    pkg,
	}, nil
}

func (s *PackageService) Update(packageID uint, request *services.UpdatePackageRequest) (*services.ServiceResponse, error) {
	pkg, err := s.packageRepo.Find(packageID)
	if err != nil {
		return &services.ServiceResponse{
			Success: false,
			Message: "Package not found",
		}, nil
	}

	// Update fields if provided
	if request.Name != "" {
		pkg.Name = request.Name
	}
	if request.Description != "" {
		pkg.Description = request.Description
	}
	if request.Price > 0 {
		pkg.Price = request.Price
	}
	if request.Duration > 0 {
		// Note: Duration field might not exist in Package model
		// This would need to be added to the model if required
	}
	if request.IsActive != nil {
		pkg.IsActive = *request.IsActive
	}

	if err := s.packageRepo.Update(pkg); err != nil {
		facades.Log().Error("Failed to update package: " + err.Error())
		return &services.ServiceResponse{
			Success: false,
			Message: "Failed to update package",
		}, err
	}

	return &services.ServiceResponse{
		Success: true,
		Message: "Package updated successfully",
		Data:    pkg,
	}, nil
}

func (s *PackageService) Delete(vendorID, packageID uint) (*services.ServiceResponse, error) {
	// Check if vendor exists
	vendor, err := s.vendorRepo.FindBy("user_id", vendorID)
	if err != nil {
		return &services.ServiceResponse{
			Success: false,
			Message: "Vendor profile not found",
		}, nil
	}

	// Check if package exists and belongs to vendor
	pkg, err := s.packageRepo.Find(packageID)
	if err != nil {
		return &services.ServiceResponse{
			Success: false,
			Message: "Package not found",
		}, nil
	}

	if pkg.VendorID != vendor.ID {
		return &services.ServiceResponse{
			Success: false,
			Message: "Package does not belong to this vendor",
		}, nil
	}

	// Check if package has active orders
	// Note: This would require checking order_items table
	// For now, we'll allow deletion

	if err := s.packageRepo.Delete(pkg); err != nil {
		facades.Log().Error("Failed to delete package: " + err.Error())
		return &services.ServiceResponse{
			Success: false,
			Message: "Failed to delete package",
		}, err
	}

	return &services.ServiceResponse{
		Success: true,
		Message: "Package deleted successfully",
	}, nil
}

func (s *PackageService) GetVendorPackages(filters map[string]interface{}) (*services.ServiceResponse, error) {
	// Check if vendor exists
	vendorID, exists := filters["user_id"]
	if !exists {
		return &services.ServiceResponse{
			Success: false,
			Message: "Vendor ID is required",
		}, nil
	}

	vendor, err := s.vendorRepo.FindBy("user_id", vendorID)
	if err != nil {
		return &services.ServiceResponse{
			Success: false,
			Message: "Vendor profile not found",
		}, nil
	}

	// Add vendor_id to filters
	filters["vendor_id"] = vendor.ID

	packages, _, err := s.packageRepo.FindWithFilters(filters)
	if err != nil {
		facades.Log().Error("Failed to get vendor packages: " + err.Error())
		return &services.ServiceResponse{
			Success: false,
			Message: "Failed to get vendor packages",
		}, err
	}

	return &services.ServiceResponse{
		Success: true,
		Message: "Vendor packages retrieved successfully",
		Data:    packages,
	}, nil
}

func (s *PackageService) SearchPackages(filters map[string]interface{}) (*services.ServiceResponse, error) {
	packages, _, err := s.packageRepo.FindWithFilters(filters)
	if err != nil {
		facades.Log().Error("Failed to search packages: " + err.Error())
		return &services.ServiceResponse{
			Success: false,
			Message: "Failed to search packages",
		}, err
	}

	return &services.ServiceResponse{
		Success: true,
		Message: "Packages search completed successfully",
		Data:    packages,
	}, nil
}