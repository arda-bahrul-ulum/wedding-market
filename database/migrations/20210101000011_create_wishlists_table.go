package migrations

import (
	"github.com/goravel/framework/contracts/database/schema"
	"github.com/goravel/framework/facades"
)

type M20210101000011CreateWishlistsTable struct{}

// Signature The unique signature for the migration.
func (r *M20210101000011CreateWishlistsTable) Signature() string {
	return "20210101000011_create_wishlists_table"
}

// Up Run the migrations.
func (r *M20210101000011CreateWishlistsTable) Up() error {
	if !facades.Schema().HasTable("wishlists") {
		if err := facades.Schema().Create("wishlists", func(table schema.Blueprint) {
			table.ID()
			table.UnsignedBigInteger("customer_id")
			table.UnsignedBigInteger("service_id").Nullable()
			table.UnsignedBigInteger("package_id").Nullable()
			table.String("item_type")
			table.Timestamps()
			
		}); err != nil {
			return err
		}
	}
	return nil
}

// Down Reverse the migrations.
func (r *M20210101000011CreateWishlistsTable) Down() error {
	if err := facades.Schema().DropIfExists("wishlists"); err != nil {
		return err
	}
	return nil
}
