package providers

import (
	"goravel/app/contracts/services"
	"goravel/app/http/controllers"

	"github.com/goravel/framework/contracts/foundation"
	"github.com/goravel/framework/facades"
)

type ControllerServiceProvider struct {
}

func (receiver *ControllerServiceProvider) Register(app foundation.Application) {
	// Register controllers with dependency injection
	facades.App().Bind("controllers.auth", func(app foundation.Application) (any, error) {
		authService, err := facades.App().Make("services.auth")
		if err != nil {
			return nil, err
		}
		return controllers.NewAuthController(authService.(services.AuthServiceInterface)), nil
	})

	// Register User Controller
	facades.App().Bind("controllers.user", func(app foundation.Application) (any, error) {
		userService, err := facades.App().Make("services.user")
		if err != nil {
			return nil, err
		}
		return controllers.NewUserController(userService.(services.UserServiceInterface)), nil
	})

	// Register Vendor Controller
	facades.App().Bind("controllers.vendor", func(app foundation.Application) (any, error) {
		vendorService, err := facades.App().Make("services.vendor")
		if err != nil {
			return nil, err
		}
		serviceService, err := facades.App().Make("services.service")
		if err != nil {
			return nil, err
		}
		orderService, err := facades.App().Make("services.order")
		if err != nil {
			return nil, err
		}
		return controllers.NewVendorController(
			vendorService.(services.VendorServiceInterface),
			serviceService.(services.ServiceServiceInterface),
			orderService.(services.OrderServiceInterface),
		), nil
	})

	// Register Order Controller
	facades.App().Bind("controllers.order", func(app foundation.Application) (any, error) {
		orderService, err := facades.App().Make("services.order")
		if err != nil {
			return nil, err
		}
		return controllers.NewOrderController(orderService.(services.OrderServiceInterface)), nil
	})

	// Register Marketplace Controller
	facades.App().Bind("controllers.marketplace", func(app foundation.Application) (any, error) {
		serviceService, err := facades.App().Make("services.service")
		if err != nil {
			return nil, err
		}
		vendorService, err := facades.App().Make("services.vendor")
		if err != nil {
			return nil, err
		}
		packageService, err := facades.App().Make("services.package")
		if err != nil {
			return nil, err
		}
		return controllers.NewMarketplaceController(
			serviceService.(services.ServiceServiceInterface),
			vendorService.(services.VendorServiceInterface),
			packageService.(services.PackageServiceInterface),
		), nil
	})

	// Register Review Controller
	facades.App().Bind("controllers.review", func(app foundation.Application) (any, error) {
		reviewService, err := facades.App().Make("services.review")
		if err != nil {
			return nil, err
		}
		return controllers.NewReviewController(reviewService.(services.ReviewServiceInterface)), nil
	})

	// Register Portfolio Controller
	facades.App().Bind("controllers.portfolio", func(app foundation.Application) (any, error) {
		portfolioService, err := facades.App().Make("services.portfolio")
		if err != nil {
			return nil, err
		}
		return controllers.NewPortfolioController(portfolioService.(services.PortfolioServiceInterface)), nil
	})

	// Register Admin Controller
	facades.App().Bind("controllers.admin", func(app foundation.Application) (any, error) {
		adminService, err := facades.App().Make("services.admin")
		if err != nil {
			return nil, err
		}
		return controllers.NewAdminController(adminService.(services.AdminServiceInterface)), nil
	})
}

func (receiver *ControllerServiceProvider) Boot(app foundation.Application) {
	//
}
