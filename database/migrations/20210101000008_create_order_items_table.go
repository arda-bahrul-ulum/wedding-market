package migrations

import (
	"github.com/goravel/framework/contracts/database/schema"
	"github.com/goravel/framework/facades"
)

type M20210101000008CreateOrderItemsTable struct{}

// Signature The unique signature for the migration.
func (r *M20210101000008CreateOrderItemsTable) Signature() string {
	return "20210101000008_create_order_items_table"
}

// Up Run the migrations.
func (r *M20210101000008CreateOrderItemsTable) Up() error {
	if !facades.Schema().HasTable("order_items") {
		if err := facades.Schema().Create("order_items", func(table schema.Blueprint) {
			table.ID()
			table.UnsignedBigInteger("order_id")
			table.UnsignedBigInteger("service_id").Nullable()
			table.UnsignedBigInteger("package_id").Nullable()
			table.String("item_type")
			table.String("item_name")
			table.Integer("quantity").Default(1)
			table.Decimal("price")
			table.Decimal("total_price")
			table.Timestamps()
			
		}); err != nil {
			return err
		}
	}
	return nil
}

// Down Reverse the migrations.
func (r *M20210101000008CreateOrderItemsTable) Down() error {
	if err := facades.Schema().DropIfExists("order_items"); err != nil {
		return err
	}
	return nil
}
