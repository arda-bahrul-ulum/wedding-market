package migrations

import (
	"github.com/goravel/framework/contracts/database/schema"
	"github.com/goravel/framework/facades"
)

type M20210101000007CreateOrdersTable struct{}

// Signature The unique signature for the migration.
func (r *M20210101000007CreateOrdersTable) Signature() string {
	return "20210101000007_create_orders_table"
}

// Up Run the migrations.
func (r *M20210101000007CreateOrdersTable) Up() error {
	if !facades.Schema().HasTable("orders") {
		if err := facades.Schema().Create("orders", func(table schema.Blueprint) {
			table.ID()
			table.String("order_number")
			table.UnsignedBigInteger("customer_id")
			table.UnsignedBigInteger("vendor_id")
			table.String("status").Default("pending")
			table.Decimal("total_amount")
			table.Decimal("commission")
			table.Decimal("vendor_amount")
			table.Timestamp("event_date").Nullable()
			table.Text("event_location").Nullable()
			table.Text("notes").Nullable()
			table.String("payment_status").Default("pending")
			table.String("payment_method").Nullable()
			table.String("payment_ref").Nullable()
			table.Boolean("is_escrow").Default(true)
			table.Boolean("escrow_released").Default(false)
			table.Timestamp("escrow_released_at").Nullable()
			table.Timestamps()
			
		}); err != nil {
			return err
		}
	}
	return nil
}

// Down Reverse the migrations.
func (r *M20210101000007CreateOrdersTable) Down() error {
	if err := facades.Schema().DropIfExists("orders"); err != nil {
		return err
	}
	return nil
}
