package migrations

import (
	"github.com/goravel/framework/contracts/database/schema"
	"github.com/goravel/framework/facades"
)

type M20210101000016CreateSystemSettingsTable struct{}

// Signature The unique signature for the migration.
func (r *M20210101000016CreateSystemSettingsTable) Signature() string {
	return "20210101000016_create_system_settings_table"
}

// Up Run the migrations.
func (r *M20210101000016CreateSystemSettingsTable) Up() error {
	if !facades.Schema().HasTable("system_settings") {
		if err := facades.Schema().Create("system_settings", func(table schema.Blueprint) {
			table.ID()
			table.String("key")
			table.Text("value").Nullable()
			table.String("type").Default("string")
			table.Timestamps()
		}); err != nil {
			return err
		}
	}
	return nil
}

// Down Reverse the migrations.
func (r *M20210101000016CreateSystemSettingsTable) Down() error {
	if err := facades.Schema().DropIfExists("system_settings"); err != nil {
		return err
	}
	return nil
}
