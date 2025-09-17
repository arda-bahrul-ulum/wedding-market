package migrations

import (
	"github.com/goravel/framework/contracts/database/schema"
	"github.com/goravel/framework/facades"
)

type M20210101000006CreatePackageItemsTable struct{}

// Signature The unique signature for the migration.
func (r *M20210101000006CreatePackageItemsTable) Signature() string {
	return "20210101000006_create_package_items_table"
}

// Up Run the migrations.
func (r *M20210101000006CreatePackageItemsTable) Up() error {
	if !facades.Schema().HasTable("package_items") {
		if err := facades.Schema().Create("package_items", func(table schema.Blueprint) {
			table.ID()
			table.UnsignedBigInteger("package_id")
			table.UnsignedBigInteger("service_id")
			table.Integer("quantity").Default(1)
			table.Decimal("price").Nullable()
			table.Timestamps()
			
		}); err != nil {
			return err
		}
	}
	return nil
}

// Down Reverse the migrations.
func (r *M20210101000006CreatePackageItemsTable) Down() error {
	if err := facades.Schema().DropIfExists("package_items"); err != nil {
		return err
	}
	return nil
}
