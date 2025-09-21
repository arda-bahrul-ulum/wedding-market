package migrations

import (
	"github.com/goravel/framework/contracts/database/schema"
	"github.com/goravel/framework/facades"
)

type M20210101000017AddUniqueConstraintToSystemSettingsKey struct{}

// Signature The unique signature for the migration.
func (r *M20210101000017AddUniqueConstraintToSystemSettingsKey) Signature() string {
	return "20210101000017_add_unique_constraint_to_system_settings_key"
}

// Up Run the migrations.
func (r *M20210101000017AddUniqueConstraintToSystemSettingsKey) Up() error {
	if facades.Schema().HasTable("system_settings") {
		if err := facades.Schema().Table("system_settings", func(table schema.Blueprint) {
			table.Unique("key")
		}); err != nil {
			return err
		}
	}
	return nil
}

// Down Reverse the migrations.
func (r *M20210101000017AddUniqueConstraintToSystemSettingsKey) Down() error {
	if facades.Schema().HasTable("system_settings") {
		if err := facades.Schema().Table("system_settings", func(table schema.Blueprint) {
			table.DropUnique("system_settings_key_unique")
		}); err != nil {
			return err
		}
	}
	return nil
}
