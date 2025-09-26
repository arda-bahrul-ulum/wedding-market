package providers

import (
	"goravel/app/contracts/repositories"
	serviceImpl "goravel/app/services"

	"github.com/goravel/framework/contracts/foundation"
	"github.com/goravel/framework/facades"
)

type ServiceServiceProvider struct {
}

func (receiver *ServiceServiceProvider) Register(app foundation.Application) {
	// Register services with dependency injection
	facades.App().Bind("services.auth", func(app foundation.Application) (any, error) {
		userRepo, err := facades.App().Make("repositories.user")
		if err != nil {
			return nil, err
		}
		vendorRepo, err := facades.App().Make("repositories.vendor_profile")
		if err != nil {
			return nil, err
		}
		customerRepo, err := facades.App().Make("repositories.customer_profile")
		if err != nil {
			return nil, err
		}
		
		return serviceImpl.NewAuthService(
			userRepo.(repositories.UserRepositoryInterface),
			vendorRepo.(repositories.VendorProfileRepositoryInterface),
			customerRepo.(repositories.CustomerProfileRepositoryInterface),
		), nil
	})

	// Register User Service
	facades.App().Bind("services.user", func(app foundation.Application) (any, error) {
		userRepo, err := facades.App().Make("repositories.user")
		if err != nil {
			return nil, err
		}
		vendorRepo, err := facades.App().Make("repositories.vendor_profile")
		if err != nil {
			return nil, err
		}
		customerRepo, err := facades.App().Make("repositories.customer_profile")
		if err != nil {
			return nil, err
		}
		orderRepo, err := facades.App().Make("repositories.order")
		if err != nil {
			return nil, err
		}
		return serviceImpl.NewUserService(
			userRepo.(repositories.UserRepositoryInterface),
			vendorRepo.(repositories.VendorProfileRepositoryInterface),
			customerRepo.(repositories.CustomerProfileRepositoryInterface),
			orderRepo.(repositories.OrderRepositoryInterface),
		), nil
	})

	// Register Vendor Service
	facades.App().Bind("services.vendor", func(app foundation.Application) (any, error) {
		vendorRepo, err := facades.App().Make("repositories.vendor_profile")
		if err != nil {
			return nil, err
		}
		userRepo, err := facades.App().Make("repositories.user")
		if err != nil {
			return nil, err
		}
		serviceRepo, err := facades.App().Make("repositories.service")
		if err != nil {
			return nil, err
		}
		portfolioRepo, err := facades.App().Make("repositories.portfolio")
		if err != nil {
			return nil, err
		}
		orderRepo, err := facades.App().Make("repositories.order")
		if err != nil {
			return nil, err
		}
		return serviceImpl.NewVendorService(
			vendorRepo.(repositories.VendorProfileRepositoryInterface),
			userRepo.(repositories.UserRepositoryInterface),
			serviceRepo.(repositories.ServiceRepositoryInterface),
			portfolioRepo.(repositories.PortfolioRepositoryInterface),
			orderRepo.(repositories.OrderRepositoryInterface),
		), nil
	})

	// Register Order Service
	facades.App().Bind("services.order", func(app foundation.Application) (any, error) {
		orderRepo, err := facades.App().Make("repositories.order")
		if err != nil {
			return nil, err
		}
		serviceRepo, err := facades.App().Make("repositories.service")
		if err != nil {
			return nil, err
		}
		packageRepo, err := facades.App().Make("repositories.package")
		if err != nil {
			return nil, err
		}
		userRepo, err := facades.App().Make("repositories.user")
		if err != nil {
			return nil, err
		}
		vendorRepo, err := facades.App().Make("repositories.vendor_profile")
		if err != nil {
			return nil, err
		}
		return serviceImpl.NewOrderService(
			orderRepo.(repositories.OrderRepositoryInterface),
			serviceRepo.(repositories.ServiceRepositoryInterface),
			packageRepo.(repositories.PackageRepositoryInterface),
			userRepo.(repositories.UserRepositoryInterface),
			vendorRepo.(repositories.VendorProfileRepositoryInterface),
		), nil
	})

	// Register Service Service
	facades.App().Bind("services.service", func(app foundation.Application) (any, error) {
		serviceRepo, err := facades.App().Make("repositories.service")
		if err != nil {
			return nil, err
		}
		categoryRepo, err := facades.App().Make("repositories.category")
		if err != nil {
			return nil, err
		}
		vendorRepo, err := facades.App().Make("repositories.vendor_profile")
		if err != nil {
			return nil, err
		}
		return serviceImpl.NewServiceService(
			serviceRepo.(repositories.ServiceRepositoryInterface),
			categoryRepo.(repositories.CategoryRepositoryInterface),
			vendorRepo.(repositories.VendorProfileRepositoryInterface),
		), nil
	})

	// Register Review Service
	facades.App().Bind("services.review", func(app foundation.Application) (any, error) {
		reviewRepo, err := facades.App().Make("repositories.review")
		if err != nil {
			return nil, err
		}
		orderRepo, err := facades.App().Make("repositories.order")
		if err != nil {
			return nil, err
		}
		userRepo, err := facades.App().Make("repositories.user")
		if err != nil {
			return nil, err
		}
		vendorRepo, err := facades.App().Make("repositories.vendor_profile")
		if err != nil {
			return nil, err
		}
		return serviceImpl.NewReviewService(
			reviewRepo.(repositories.ReviewRepositoryInterface),
			orderRepo.(repositories.OrderRepositoryInterface),
			userRepo.(repositories.UserRepositoryInterface),
			vendorRepo.(repositories.VendorProfileRepositoryInterface),
		), nil
	})

	// Register Portfolio Service
	facades.App().Bind("services.portfolio", func(app foundation.Application) (any, error) {
		portfolioRepo, err := facades.App().Make("repositories.portfolio")
		if err != nil {
			return nil, err
		}
		vendorRepo, err := facades.App().Make("repositories.vendor_profile")
		if err != nil {
			return nil, err
		}
		return serviceImpl.NewPortfolioService(
			portfolioRepo.(repositories.PortfolioRepositoryInterface),
			vendorRepo.(repositories.VendorProfileRepositoryInterface),
		), nil
	})

	// Register Package Service
	facades.App().Bind("services.package", func(app foundation.Application) (any, error) {
		packageRepo, err := facades.App().Make("repositories.package")
		if err != nil {
			return nil, err
		}
		vendorRepo, err := facades.App().Make("repositories.vendor_profile")
		if err != nil {
			return nil, err
		}
		return serviceImpl.NewPackageService(
			packageRepo.(repositories.PackageRepositoryInterface),
			vendorRepo.(repositories.VendorProfileRepositoryInterface),
		), nil
	})

	// Register Admin Service
	facades.App().Bind("services.admin", func(app foundation.Application) (any, error) {
		userRepo, err := facades.App().Make("repositories.user")
		if err != nil {
			return nil, err
		}
		vendorRepo, err := facades.App().Make("repositories.vendor_profile")
		if err != nil {
			return nil, err
		}
		customerRepo, err := facades.App().Make("repositories.customer_profile")
		if err != nil {
			return nil, err
		}
		orderRepo, err := facades.App().Make("repositories.order")
		if err != nil {
			return nil, err
		}
		return serviceImpl.NewAdminService(
			userRepo.(repositories.UserRepositoryInterface),
			vendorRepo.(repositories.VendorProfileRepositoryInterface),
			customerRepo.(repositories.CustomerProfileRepositoryInterface),
			orderRepo.(repositories.OrderRepositoryInterface),
		), nil
	})

	// Register Category Service
	facades.App().Bind("services.category", func(app foundation.Application) (any, error) {
		categoryRepo, err := facades.App().Make("repositories.category")
		if err != nil {
			return nil, err
		}
		return serviceImpl.NewCategoryService(
			categoryRepo.(repositories.CategoryRepositoryInterface),
		), nil
	})
}

func (receiver *ServiceServiceProvider) Boot(app foundation.Application) {
	//
}
	