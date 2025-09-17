package migrations

import (
	"github.com/goravel/framework/contracts/database/schema"
	"github.com/goravel/framework/facades"
)

type M20210101000003CreateCategoriesTable struct{}

// Signature The unique signature for the migration.
func (r *M20210101000003CreateCategoriesTable) Signature() string {
	return "20210101000003_create_categories_table"
}

// Up Run the migrations.
func (r *M20210101000003CreateCategoriesTable) Up() error {
	if !facades.Schema().HasTable("categories") {
		if err := facades.Schema().Create("categories", func(table schema.Blueprint) {
			table.ID()
			table.String("name")
			table.String("slug")
			table.Text("description").Nullable()
			table.String("icon").Nullable()
			table.Boolean("is_active").Default(true)
			table.Integer("sort_order").Default(0)
			table.Timestamps()
		}); err != nil {
			return err
		}
	}
	return nil
}

// Down Reverse the migrations.
func (r *M20210101000003CreateCategoriesTable) Down() error {
	if err := facades.Schema().DropIfExists("categories"); err != nil {
		return err
	}
	return nil
}
