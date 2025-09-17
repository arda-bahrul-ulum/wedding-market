package migrations

import (
	"github.com/goravel/framework/contracts/database/schema"
	"github.com/goravel/framework/facades"
)

type M20210101000012CreatePortfoliosTable struct{}

// Signature The unique signature for the migration.
func (r *M20210101000012CreatePortfoliosTable) Signature() string {
	return "20210101000012_create_portfolios_table"
}

// Up Run the migrations.
func (r *M20210101000012CreatePortfoliosTable) Up() error {
	if !facades.Schema().HasTable("portfolios") {
		if err := facades.Schema().Create("portfolios", func(table schema.Blueprint) {
			table.ID()
			table.UnsignedBigInteger("vendor_id")
			table.String("title")
			table.Text("description").Nullable()
			table.String("image_url")
			table.String("image_type").Default("image")
			table.Boolean("is_featured").Default(false)
			table.Integer("sort_order").Default(0)
			table.Timestamps()
			
		}); err != nil {
			return err
		}
	}
	return nil
}

// Down Reverse the migrations.
func (r *M20210101000012CreatePortfoliosTable) Down() error {
	if err := facades.Schema().DropIfExists("portfolios"); err != nil {
		return err
	}
	return nil
}
