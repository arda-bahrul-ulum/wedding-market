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

	// Register new repositories
	facades.App().Bind("repositories.order", func(app foundation.Application) (any, error) {
		return repoImpl.NewOrderRepository(), nil
	})

	facades.App().Bind("repositories.service", func(app foundation.Application) (any, error) {
		return repoImpl.NewServiceRepository(), nil
	})

	facades.App().Bind("repositories.package", func(app foundation.Application) (any, error) {
		return repoImpl.NewPackageRepository(), nil
	})

	facades.App().Bind("repositories.review", func(app foundation.Application) (any, error) {
		return repoImpl.NewReviewRepository(), nil
	})

	facades.App().Bind("repositories.portfolio", func(app foundation.Application) (any, error) {
		return repoImpl.NewPortfolioRepository(), nil
	})
}

func (receiver *RepositoryServiceProvider) Boot(app foundation.Application) {
	//
}
