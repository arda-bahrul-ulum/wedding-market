package migrations

import (
	"github.com/goravel/framework/contracts/database/schema"
	"github.com/goravel/framework/facades"
)

type M20210101000009CreatePaymentsTable struct{}

// Signature The unique signature for the migration.
func (r *M20210101000009CreatePaymentsTable) Signature() string {
	return "20210101000009_create_payments_table"
}

// Up Run the migrations.
func (r *M20210101000009CreatePaymentsTable) Up() error {
	if !facades.Schema().HasTable("payments") {
		if err := facades.Schema().Create("payments", func(table schema.Blueprint) {
			table.ID()
			table.UnsignedBigInteger("order_id")
			table.Decimal("amount")
			table.String("payment_method")
			table.String("payment_gateway").Nullable()
			table.String("transaction_id").Nullable()
			table.String("status").Default("pending")
			table.Text("gateway_response").Nullable() // JSON response
			table.Timestamp("paid_at").Nullable()
			table.Timestamps()
			
		}); err != nil {
			return err
		}
	}
	return nil
}

// Down Reverse the migrations.
func (r *M20210101000009CreatePaymentsTable) Down() error {
	if err := facades.Schema().DropIfExists("payments"); err != nil {
		return err
	}
	return nil
}
