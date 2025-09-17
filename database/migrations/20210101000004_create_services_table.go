package migrations

import (
	"github.com/goravel/framework/contracts/database/schema"
	"github.com/goravel/framework/facades"
)

type M20210101000004CreateServicesTable struct{}

// Signature The unique signature for the migration.
func (r *M20210101000004CreateServicesTable) Signature() string {
	return "20210101000004_create_services_table"
}

// Up Run the migrations.
func (r *M20210101000004CreateServicesTable) Up() error {
	if !facades.Schema().HasTable("services") {
		if err := facades.Schema().Create("services", func(table schema.Blueprint) {
			table.ID()
			table.UnsignedBigInteger("vendor_id")
			table.UnsignedBigInteger("category_id")
			table.String("name")
			table.Text("description").Nullable()
			table.Decimal("price")
			table.String("price_type").Default("fixed")
			table.Decimal("min_price").Nullable()
			table.Decimal("max_price").Nullable()
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
func (r *M20210101000004CreateServicesTable) Down() error {
	if err := facades.Schema().DropIfExists("services"); err != nil {
		return err
	}
	return nil
}
