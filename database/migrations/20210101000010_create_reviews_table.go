package migrations

import (
	"github.com/goravel/framework/contracts/database/schema"
	"github.com/goravel/framework/facades"
)

type M20210101000010CreateReviewsTable struct{}

// Signature The unique signature for the migration.
func (r *M20210101000010CreateReviewsTable) Signature() string {
	return "20210101000010_create_reviews_table"
}

// Up Run the migrations.
func (r *M20210101000010CreateReviewsTable) Up() error {
	if !facades.Schema().HasTable("reviews") {
		if err := facades.Schema().Create("reviews", func(table schema.Blueprint) {
			table.ID()
			table.UnsignedBigInteger("order_id")
			table.UnsignedBigInteger("customer_id")
			table.UnsignedBigInteger("vendor_id")
			table.Integer("rating")
			table.Text("comment").Nullable()
			table.Text("images").Nullable() // JSON array
			table.Boolean("is_highlighted").Default(false)
			table.Text("vendor_reply").Nullable()
			table.Timestamp("replied_at").Nullable()
			table.Timestamps()
			
		}); err != nil {
			return err
		}
	}
	return nil
}

// Down Reverse the migrations.
func (r *M20210101000010CreateReviewsTable) Down() error {
	if err := facades.Schema().DropIfExists("reviews"); err != nil {
		return err
	}
	return nil
}
