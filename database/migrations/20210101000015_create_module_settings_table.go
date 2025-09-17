package migrations

import (
	"github.com/goravel/framework/contracts/database/schema"
	"github.com/goravel/framework/facades"
)

type M20210101000015CreateModuleSettingsTable struct{}

// Signature The unique signature for the migration.
func (r *M20210101000015CreateModuleSettingsTable) Signature() string {
	return "20210101000015_create_module_settings_table"
}

// Up Run the migrations.
func (r *M20210101000015CreateModuleSettingsTable) Up() error {
	if !facades.Schema().HasTable("module_settings") {
		if err := facades.Schema().Create("module_settings", func(table schema.Blueprint) {
			table.ID()
			table.String("module_name")
			table.Boolean("is_enabled").Default(true)
			table.Text("settings").Nullable() // JSON configuration
			table.Timestamps()
		}); err != nil {
			return err
		}
	}
	return nil
}

// Down Reverse the migrations.
func (r *M20210101000015CreateModuleSettingsTable) Down() error {
	if err := facades.Schema().DropIfExists("module_settings"); err != nil {
		return err
	}
	return nil
}
