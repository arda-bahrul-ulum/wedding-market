package migrations

import (
	"github.com/goravel/framework/contracts/database/schema"
	"github.com/goravel/framework/facades"
)

type M20210101000005CreatePackagesTable struct{}

// Signature The unique signature for the migration.
func (r *M20210101000005CreatePackagesTable) Signature() string {
	return "20210101000005_create_packages_table"
}

// Up Run the migrations.
func (r *M20210101000005CreatePackagesTable) Up() error {
	if !facades.Schema().HasTable("packages") {
		if err := facades.Schema().Create("packages", func(table schema.Blueprint) {
			table.ID()
			table.UnsignedBigInteger("vendor_id")
			table.String("name")
			table.Text("description").Nullable()
			table.Decimal("price")
			table.Boolean("is_active").Default(true)
			table.Boolean("is_featured").Default(false)
			table.Text("images").Nullable() // JSON array
			table.Text("tags").Nullable()   // JSON array
			table.Timestamps()
			
		}); err != nil {
			return err
		}
	}
	return nil
}

// Down Reverse the migrations.
func (r *M20210101000005CreatePackagesTable) Down() error {
	if err := facades.Schema().DropIfExists("packages"); err != nil {
		return err
	}
	return nil
}
