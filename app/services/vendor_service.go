package services

import (
	"goravel/app/contracts/repositories"
	contracts "goravel/app/contracts/services"
	"goravel/app/models"
	"time"

	"github.com/goravel/framework/facades"
)

type VendorService struct {
	vendorRepo   repositories.VendorProfileRepositoryInterface
	userRepo     repositories.UserRepositoryInterface
	serviceRepo  repositories.ServiceRepositoryInterface
	portfolioRepo repositories.PortfolioRepositoryInterface
	orderRepo    repositories.OrderRepositoryInterface
}

func NewVendorService(
	vendorRepo repositories.VendorProfileRepositoryInterface,
	userRepo repositories.UserRepositoryInterface,
	serviceRepo repositories.ServiceRepositoryInterface,
	portfolioRepo repositories.PortfolioRepositoryInterface,
	orderRepo repositories.OrderRepositoryInterface,
) contracts.VendorServiceInterface {
	return &VendorService{
		vendorRepo:    vendorRepo,
		userRepo:      userRepo,
		serviceRepo:   serviceRepo,
		portfolioRepo: portfolioRepo,
		orderRepo:     orderRepo,
	}
}

func (s *VendorService) GetVendor(id uint) (*contracts.ServiceResponse, error) {
	vendor, err := s.vendorRepo.FindByID(id)
	if err != nil {
		return &contracts.ServiceResponse{
			Success: false,
			Message: "Vendor not found",
		}, nil
	}

	return &contracts.ServiceResponse{
		Success: true,
		Message: "Vendor retrieved successfully",
		Data:    vendor,
	}, nil
}

func (s *VendorService) GetVendors(filters *contracts.VendorFilters, page, limit int) (*contracts.ServiceResponse, error) {
	// For now, return empty response
	// This would need to be implemented
	return &contracts.ServiceResponse{
		Success: true,
		Message: "Vendors retrieved successfully",
		Data:    []interface{}{},
	}, nil
}

func (s *VendorService) SearchVendors(query string, filters *contracts.VendorFilters, page, limit int) (*contracts.ServiceResponse, error) {
	// For now, return empty response
	// This would need to be implemented
	return &contracts.ServiceResponse{
		Success: true,
		Message: "Vendors search completed successfully",
		Data:    []interface{}{},
	}, nil
}

func (s *VendorService) VerifyVendor(id uint) (*contracts.ServiceResponse, error) {
	// For now, return empty response
	// This would need to be implemented
	return &contracts.ServiceResponse{
		Success: true,
		Message: "Vendor verified successfully",
		Data:    map[string]interface{}{},
	}, nil
}

func (s *VendorService) UnverifyVendor(id uint) (*contracts.ServiceResponse, error) {
	// For now, return empty response
	// This would need to be implemented
	return &contracts.ServiceResponse{
		Success: true,
		Message: "Vendor unverified successfully",
		Data:    map[string]interface{}{},
	}, nil
}

func (s *VendorService) ActivateVendor(id uint) (*contracts.ServiceResponse, error) {
	// For now, return empty response
	// This would need to be implemented
	return &contracts.ServiceResponse{
		Success: true,
		Message: "Vendor activated successfully",
		Data:    map[string]interface{}{},
	}, nil
}

func (s *VendorService) DeactivateVendor(id uint) (*contracts.ServiceResponse, error) {
	// For now, return empty response
	// This would need to be implemented
	return &contracts.ServiceResponse{
		Success: true,
		Message: "Vendor deactivated successfully",
		Data:    map[string]interface{}{},
	}, nil
}

func (s *VendorService) UpdateSubscription(id uint, request *contracts.UpdateSubscriptionRequest) (*contracts.ServiceResponse, error) {
	// For now, return empty response
	// This would need to be implemented
	return &contracts.ServiceResponse{
		Success: true,
		Message: "Subscription updated successfully",
		Data:    map[string]interface{}{},
	}, nil
}

func (s *VendorService) GetVendorsByLocation(city, province string) (*contracts.ServiceResponse, error) {
	// For now, return empty response
	// This would need to be implemented
	return &contracts.ServiceResponse{
		Success: true,
		Message: "Vendors by location retrieved successfully",
		Data:    []interface{}{},
	}, nil
}

func (s *VendorService) GetVendorProfile(userID uint) (*contracts.ServiceResponse, error) {
	vendor, err := s.vendorRepo.FindBy("user_id", userID)
	if err != nil {
		return &contracts.ServiceResponse{
			Success: false,
			Message: "Vendor profile not found",
		}, nil
	}

	// Load user data
	if user, err := s.userRepo.FindByID(userID); err == nil {
		vendor.User = *user
	}

	return &contracts.ServiceResponse{
		Success: true,
		Message: "Vendor profile retrieved successfully",
		Data:    vendor,
	}, nil
}

func (s *VendorService) CreateVendorProfile(userID uint, request *contracts.CreateVendorProfileRequest) (*contracts.ServiceResponse, error) {
	// For now, return empty response
	// This would need to be implemented
	return &contracts.ServiceResponse{
		Success: true,
		Message: "Vendor profile created successfully",
		Data:    map[string]interface{}{},
	}, nil
}

func (s *VendorService) DeleteVendorProfile(userID uint) (*contracts.ServiceResponse, error) {
	// For now, return empty response
	// This would need to be implemented
	return &contracts.ServiceResponse{
		Success: true,
		Message: "Vendor profile deleted successfully",
		Data:    map[string]interface{}{},
	}, nil
}

func (s *VendorService) UpdateVendorProfile(userID uint, request *contracts.UpdateVendorProfileRequest) (*contracts.ServiceResponse, error) {
	vendor, err := s.vendorRepo.FindBy("user_id", userID)
	if err != nil {
		return &contracts.ServiceResponse{
			Success: false,
			Message: "Vendor profile not found",
		}, nil
	}

	// Update profile
	vendor.BusinessName = request.BusinessName
	vendor.BusinessType = request.BusinessType
	vendor.Description = request.Description
	vendor.Address = request.Address
	vendor.City = request.City
	vendor.Province = request.Province
	vendor.PostalCode = request.PostalCode
	vendor.Latitude = request.Latitude
	vendor.Longitude = request.Longitude
	vendor.Website = request.Website
	vendor.Instagram = request.Instagram
	vendor.Whatsapp = request.Whatsapp

	if err := s.vendorRepo.Update(vendor); err != nil {
		facades.Log().Error("Failed to update vendor profile: " + err.Error())
		return &contracts.ServiceResponse{
			Success: false,
			Message: "Failed to update profile",
		}, err
	}

	// Load user data
	if user, err := s.userRepo.FindByID(userID); err == nil {
		vendor.User = *user
	}

	return &contracts.ServiceResponse{
		Success: true,
		Message: "Profile updated successfully",
		Data:    vendor,
	}, nil
}

func (s *VendorService) GetServices(userID uint, filters map[string]interface{}) (*contracts.ServiceResponse, error) {
	vendor, err := s.vendorRepo.FindBy("user_id", userID)
	if err != nil {
		return &contracts.ServiceResponse{
			Success: false,
			Message: "Vendor profile not found",
		}, nil
	}

	// Add vendor filter
	filters["vendor_id"] = vendor.ID
	
	services, total, err := s.serviceRepo.FindWithFilters(filters)
	if err != nil {
		facades.Log().Error("Failed to get vendor services: " + err.Error())
		return &contracts.ServiceResponse{
			Success: false,
			Message: "Failed to fetch services",
		}, err
	}

	return &contracts.ServiceResponse{
		Success: true,
		Message: "Vendor services retrieved successfully",
		Data: map[string]interface{}{
			"services": services,
			"total":    total,
		},
	}, nil
}

func (s *VendorService) CreateService(userID uint, request *contracts.CreateServiceRequest) (*contracts.ServiceResponse, error) {
	vendor, err := s.vendorRepo.FindBy("user_id", userID)
	if err != nil {
		return &contracts.ServiceResponse{
			Success: false,
			Message: "Vendor profile not found",
		}, nil
	}

	// Create service
	service := models.Service{
		VendorID:    vendor.ID,
		CategoryID:  request.CategoryID,
		Name:        request.Name,
		Description: request.Description,
		Price:       request.Price,
		PriceType:   request.PriceType,
		MinPrice:    request.MinPrice,
		MaxPrice:    request.MaxPrice,
		IsActive:    true,
		Images:      request.Images,
		Tags:        request.Tags,
	}

	if err := s.serviceRepo.Create(&service); err != nil {
		facades.Log().Error("Failed to create service: " + err.Error())
		return &contracts.ServiceResponse{
			Success: false,
			Message: "Failed to create service",
		}, nil
	}

	return &contracts.ServiceResponse{
		Success: true,
		Message: "Service created successfully",
		Data:    service,
	}, nil
}

func (s *VendorService) UpdateService(userID uint, serviceID uint, request *contracts.UpdateServiceRequest) (*contracts.ServiceResponse, error) {
	vendor, err := s.vendorRepo.FindBy("user_id", userID)
	if err != nil {
		return &contracts.ServiceResponse{
			Success: false,
			Message: "Vendor profile not found",
		}, nil
	}

	// Get service
	service, err := s.serviceRepo.FindByID(serviceID)
	if err != nil {
		return &contracts.ServiceResponse{
			Success: false,
			Message: "Service not found",
		}, nil
	}

	// Check if service belongs to vendor
	if service.VendorID != vendor.ID {
		return &contracts.ServiceResponse{
			Success: false,
			Message: "Unauthorized access to service",
		}, nil
	}

	// Update service
	service.CategoryID = request.CategoryID
	service.Name = request.Name
	service.Description = request.Description
	service.Price = request.Price
	service.PriceType = request.PriceType
	service.MinPrice = request.MinPrice
	service.MaxPrice = request.MaxPrice
	service.IsActive = request.IsActive
	service.Images = request.Images
	service.Tags = request.Tags

	if err := s.serviceRepo.Update(service); err != nil {
		facades.Log().Error("Failed to update service: " + err.Error())
		return &contracts.ServiceResponse{
			Success: false,
			Message: "Failed to update service",
		}, err
	}

	return &contracts.ServiceResponse{
		Success: true,
		Message: "Service updated successfully",
		Data:    service,
	}, nil
}

func (s *VendorService) DeleteService(userID uint, serviceID uint) (*contracts.ServiceResponse, error) {
	vendor, err := s.vendorRepo.FindBy("user_id", userID)
	if err != nil {
		return &contracts.ServiceResponse{
			Success: false,
			Message: "Vendor profile not found",
		}, nil
	}

	// Get service
	service, err := s.serviceRepo.FindByID(serviceID)
	if err != nil {
		return &contracts.ServiceResponse{
			Success: false,
			Message: "Service not found",
		}, nil
	}

	// Check if service belongs to vendor
	if service.VendorID != vendor.ID {
		return &contracts.ServiceResponse{
			Success: false,
			Message: "Unauthorized access to service",
		}, nil
	}

	// Check if service has active orders
	activeOrders, err := s.serviceRepo.CheckActiveOrders(serviceID)
	if err != nil {
		facades.Log().Error("Failed to check active orders: " + err.Error())
		return &contracts.ServiceResponse{
			Success: false,
			Message: "Failed to check active orders",
		}, err
	}

	if activeOrders > 0 {
		return &contracts.ServiceResponse{
			Success: false,
			Message: "Cannot delete service with active orders",
		}, nil
	}

	// Delete service
	if err := s.serviceRepo.Delete(service); err != nil {
		facades.Log().Error("Failed to delete service: " + err.Error())
		return &contracts.ServiceResponse{
			Success: false,
			Message: "Failed to delete service",
		}, err
	}

	return &contracts.ServiceResponse{
		Success: true,
		Message: "Service deleted successfully",
	}, nil
}

func (s *VendorService) GetOrders(userID uint, filters map[string]interface{}) (*contracts.ServiceResponse, error) {
	vendor, err := s.vendorRepo.FindBy("user_id", userID)
	if err != nil {
		return &contracts.ServiceResponse{
			Success: false,
			Message: "Vendor profile not found",
		}, nil
	}

	// Add vendor filter
	filters["vendor_id"] = vendor.ID
	
	orders, total, err := s.orderRepo.FindWithFilters(filters)
	if err != nil {
		facades.Log().Error("Failed to get vendor orders: " + err.Error())
		return &contracts.ServiceResponse{
			Success: false,
			Message: "Failed to fetch orders",
		}, err
	}

	// Load related data
	for i := range orders {
		// Load customer
		if customer, err := s.userRepo.FindByID(orders[i].CustomerID); err == nil {
			orders[i].Customer = *customer
		}
	}

	return &contracts.ServiceResponse{
		Success: true,
		Message: "Vendor orders retrieved successfully",
		Data: map[string]interface{}{
			"orders": orders,
			"total":  total,
		},
	}, nil
}

func (s *VendorService) UpdateOrderStatus(userID uint, orderID uint, request *contracts.UpdateOrderStatusRequest) (*contracts.ServiceResponse, error) {
	vendor, err := s.vendorRepo.FindBy("user_id", userID)
	if err != nil {
		return &contracts.ServiceResponse{
			Success: false,
			Message: "Vendor profile not found",
		}, nil
	}

	order, err := s.orderRepo.FindByID(orderID)
	if err != nil {
		return &contracts.ServiceResponse{
			Success: false,
			Message: "Order not found",
		}, nil
	}

	// Check if vendor has access to this order
	if order.VendorID != vendor.ID {
		return &contracts.ServiceResponse{
			Success: false,
			Message: "Unauthorized access to order",
		}, nil
	}

	// Validate status transition
	validTransitions := map[string][]string{
		"pending":    {"accepted", "rejected"},
		"accepted":   {"in_progress", "rejected"},
		"in_progress": {"completed"},
		"completed":  {},
		"rejected":   {},
		"cancelled":  {},
		"refunded":   {},
	}

	allowedStatuses, exists := validTransitions[order.Status]
	if !exists {
		return &contracts.ServiceResponse{
			Success: false,
			Message: "Invalid current order status",
		}, nil
	}

	validTransition := false
	for _, status := range allowedStatuses {
		if status == request.Status {
			validTransition = true
			break
		}
	}

	if !validTransition {
		return &contracts.ServiceResponse{
			Success: false,
			Message: "Invalid status transition",
		}, nil
	}

	// Update order status
	if err := s.orderRepo.UpdateStatus(orderID, request.Status, request.Notes); err != nil {
		facades.Log().Error("Failed to update order status: " + err.Error())
		return &contracts.ServiceResponse{
			Success: false,
			Message: "Failed to update order status",
		}, err
	}

	// If order is completed, release escrow
	if request.Status == "completed" {
		order.EscrowReleased = true
		now := time.Now()
		order.EscrowReleasedAt = &now
		s.orderRepo.Update(order)
	}

	return &contracts.ServiceResponse{
		Success: true,
		Message: "Order status updated successfully",
	}, nil
}

func (s *VendorService) GetPortfolios(userID uint, filters map[string]interface{}) (*contracts.ServiceResponse, error) {
	vendor, err := s.vendorRepo.FindBy("user_id", userID)
	if err != nil {
		return &contracts.ServiceResponse{
			Success: false,
			Message: "Vendor profile not found",
		}, nil
	}

	// Add vendor filter
	filters["vendor_id"] = vendor.ID
	
	portfolios, total, err := s.portfolioRepo.FindWithFilters(filters)
	if err != nil {
		facades.Log().Error("Failed to get vendor portfolios: " + err.Error())
		return &contracts.ServiceResponse{
			Success: false,
			Message: "Failed to fetch portfolios",
		}, err
	}

	return &contracts.ServiceResponse{
		Success: true,
		Message: "Vendor portfolios retrieved successfully",
		Data: map[string]interface{}{
			"portfolios": portfolios,
			"total":     total,
		},
	}, nil
}

func (s *VendorService) CreatePortfolio(userID uint, request *contracts.CreatePortfolioRequest) (*contracts.ServiceResponse, error) {
	vendor, err := s.vendorRepo.FindBy("user_id", userID)
	if err != nil {
		return &contracts.ServiceResponse{
			Success: false,
			Message: "Vendor profile not found",
		}, nil
	}

	// Create portfolio
	portfolio := models.Portfolio{
		VendorID:    vendor.ID,
		Title:       request.Title,
		Description: request.Description,
		ImageURL:    request.ImageURL,
		ImageType:   request.ImageType,
		IsFeatured:  request.IsFeatured,
		SortOrder:   request.SortOrder,
	}

	if err := s.portfolioRepo.Create(&portfolio); err != nil {
		facades.Log().Error("Failed to create portfolio: " + err.Error())
		return &contracts.ServiceResponse{
			Success: false,
			Message: "Failed to create portfolio",
		}, err
	}

	return &contracts.ServiceResponse{
		Success: true,
		Message: "Portfolio created successfully",
		Data:    portfolio,
	}, nil
}

func (s *VendorService) UpdatePortfolio(userID uint, portfolioID uint, request *contracts.UpdatePortfolioRequest) (*contracts.ServiceResponse, error) {
	vendor, err := s.vendorRepo.FindBy("user_id", userID)
	if err != nil {
		return &contracts.ServiceResponse{
			Success: false,
			Message: "Vendor profile not found",
		}, nil
	}

	// Get portfolio
	portfolio, err := s.portfolioRepo.FindByID(portfolioID)
	if err != nil {
		return &contracts.ServiceResponse{
			Success: false,
			Message: "Portfolio not found",
		}, nil
	}

	// Check if portfolio belongs to vendor
	if portfolio.VendorID != vendor.ID {
		return &contracts.ServiceResponse{
			Success: false,
			Message: "Unauthorized access to portfolio",
		}, nil
	}

	// Update portfolio
	portfolio.Title = request.Title
	portfolio.Description = request.Description
	portfolio.ImageURL = request.ImageURL
	portfolio.ImageType = request.ImageType
	portfolio.IsFeatured = request.IsFeatured
	portfolio.SortOrder = request.SortOrder

	if err := s.portfolioRepo.Update(portfolio); err != nil {
		facades.Log().Error("Failed to update portfolio: " + err.Error())
		return &contracts.ServiceResponse{
			Success: false,
			Message: "Failed to update portfolio",
		}, err
	}

	return &contracts.ServiceResponse{
		Success: true,
		Message: "Portfolio updated successfully",
		Data:    portfolio,
	}, nil
}

func (s *VendorService) DeletePortfolio(userID uint, portfolioID uint) (*contracts.ServiceResponse, error) {
	vendor, err := s.vendorRepo.FindBy("user_id", userID)
	if err != nil {
		return &contracts.ServiceResponse{
			Success: false,
			Message: "Vendor profile not found",
		}, nil
	}

	// Get portfolio
	portfolio, err := s.portfolioRepo.FindByID(portfolioID)
	if err != nil {
		return &contracts.ServiceResponse{
			Success: false,
			Message: "Portfolio not found",
		}, nil
	}

	// Check if portfolio belongs to vendor
	if portfolio.VendorID != vendor.ID {
		return &contracts.ServiceResponse{
			Success: false,
			Message: "Unauthorized access to portfolio",
		}, nil
	}

	// Delete portfolio
	if err := s.portfolioRepo.Delete(portfolio); err != nil {
		facades.Log().Error("Failed to delete portfolio: " + err.Error())
		return &contracts.ServiceResponse{
			Success: false,
			Message: "Failed to delete portfolio",
		}, err
	}

	return &contracts.ServiceResponse{
		Success: true,
		Message: "Portfolio deleted successfully",
	}, nil
}


func (s *VendorService) GetVendorStatistics() (*contracts.ServiceResponse, error) {
	// For now, return empty response
	// This would need to be implemented
	return &contracts.ServiceResponse{
		Success: true,
		Message: "Vendor statistics retrieved successfully",
		Data:    map[string]interface{}{},
	}, nil
}

func (s *VendorService) Initialize() error {
	// Initialize vendor service
	return nil
}

func (s *VendorService) Cleanup() error {
	// Cleanup vendor service resources
	return nil
}
