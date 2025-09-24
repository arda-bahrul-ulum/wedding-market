package database

import (
	"goravel/database/migrations"
	"goravel/database/seeders"

	"github.com/goravel/framework/contracts/database/schema"
	"github.com/goravel/framework/contracts/database/seeder"
)

type Kernel struct {
}

func (kernel Kernel) Migrations() []schema.Migration {
	return []schema.Migration{
		&migrations.M20210101000001CreateUsersTable{},
		&migrations.M20210101000002CreateJobsTable{},
		&migrations.M20210101000002CreateVendorProfilesTable{},
		&migrations.M20210101000003CreateCategoriesTable{},
		&migrations.M20210101000004CreateServicesTable{},
		&migrations.M20210101000005CreatePackagesTable{},
		&migrations.M20210101000006CreatePackageItemsTable{},
		&migrations.M20210101000007CreateOrdersTable{},
		&migrations.M20210101000008CreateOrderItemsTable{},
		&migrations.M20210101000009CreatePaymentsTable{},
		&migrations.M20210101000010CreateReviewsTable{},
		&migrations.M20210101000011CreateWishlistsTable{},
		&migrations.M20210101000012CreatePortfoliosTable{},
		&migrations.M20210101000013CreateAvailabilitiesTable{},
		&migrations.M20210101000014CreateChatsTable{},
		&migrations.M20210101000015CreateModuleSettingsTable{},
		&migrations.M20210101000016CreateSystemSettingsTable{},
		&migrations.M20250921100719CreateCustomerProfilesTable{},
	}
}
func (kernel Kernel) Seeders() []seeder.Seeder {
	return []seeder.Seeder{
		&seeders.DatabaseSeeder{},
	}
}
