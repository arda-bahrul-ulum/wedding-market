package migrations

import (
	"github.com/goravel/framework/contracts/database/schema"
	"github.com/goravel/framework/facades"
)

type M20210101000013CreateAvailabilitiesTable struct{}

// Signature The unique signature for the migration.
func (r *M20210101000013CreateAvailabilitiesTable) Signature() string {
	return "20210101000013_create_availabilities_table"
}

// Up Run the migrations.
func (r *M20210101000013CreateAvailabilitiesTable) Up() error {
	if !facades.Schema().HasTable("availabilities") {
		if err := facades.Schema().Create("availabilities", func(table schema.Blueprint) {
			table.ID()
			table.UnsignedBigInteger("vendor_id")
			table.Timestamp("date")
			table.String("start_time").Nullable()
			table.String("end_time").Nullable()
			table.Boolean("is_available").Default(true)
			table.Integer("max_bookings").Default(1)
			table.Integer("current_bookings").Default(0)
			table.Timestamps()
			
		}); err != nil {
			return err
		}
	}
	return nil
}

// Down Reverse the migrations.
func (r *M20210101000013CreateAvailabilitiesTable) Down() error {
	if err := facades.Schema().DropIfExists("availabilities"); err != nil {
		return err
	}
	return nil
}
