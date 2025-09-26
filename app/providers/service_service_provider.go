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

	// Register other services here when they are created
	// facades.App().Bind("services.user", func(app foundation.Application) (any, error) {
	//     userRepo, err := facades.App().Make("repositories.user")
	//     if err != nil {
	//         return nil, err
	//     }
	//     return serviceImpl.NewUserService(userRepo.(repositories.UserRepositoryInterface)), nil
	// })
}

func (receiver *ServiceServiceProvider) Boot(app foundation.Application) {
	//
}
	