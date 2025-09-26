package providers

import (
	repoImpl "goravel/app/repositories"

	"github.com/goravel/framework/contracts/foundation"
	"github.com/goravel/framework/facades"
)

type RepositoryServiceProvider struct {
}

func (receiver *RepositoryServiceProvider) Register(app foundation.Application) {
	// Register repositories
	facades.App().Bind("repositories.user", func(app foundation.Application) (any, error) {
		return repoImpl.NewUserRepository(), nil
	})

	facades.App().Bind("repositories.vendor_profile", func(app foundation.Application) (any, error) {
		return repoImpl.NewVendorProfileRepository(), nil
	})

	facades.App().Bind("repositories.customer_profile", func(app foundation.Application) (any, error) {
		return repoImpl.NewCustomerProfileRepository(), nil
	})

	facades.App().Bind("repositories.category", func(app foundation.Application) (any, error) {
		return repoImpl.NewCategoryRepository(), nil
	})
}

func (receiver *RepositoryServiceProvider) Boot(app foundation.Application) {
	//
}
