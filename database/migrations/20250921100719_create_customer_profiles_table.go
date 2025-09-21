package migrations

import (
	"github.com/goravel/framework/contracts/database/schema"
	"github.com/goravel/framework/facades"
)

type M20250921100719CreateCustomerProfilesTable struct{}

// Signature The unique signature for the migration.
func (r *M20250921100719CreateCustomerProfilesTable) Signature() string {
	return "20250921100719_create_customer_profiles_table"
}

// Up Run the migrations.
func (r *M20250921100719CreateCustomerProfilesTable) Up() error {
	if !facades.Schema().HasTable("customer_profiles") {
		return facades.Schema().Create("customer_profiles", func(table schema.Blueprint) {
			table.ID()
			table.UnsignedBigInteger("user_id")
			table.String("full_name")
			table.String("phone").Nullable()
			table.String("address").Nullable()
			table.String("city").Nullable()
			table.String("province").Nullable()
			table.String("postal_code").Nullable()
			table.Date("birth_date").Nullable()
			table.String("gender").Nullable()
			table.Text("bio").Nullable()
			table.String("avatar").Nullable()
			table.Boolean("is_active").Default(true)
			table.Timestamps()

			// Foreign key constraint
			table.Foreign("user_id").References("id").On("users")
			
			// Indexes
			table.Index("user_id")
			table.Index("is_active")
		})
	}

	return nil
}

// Down Reverse the migrations.
func (r *M20250921100719CreateCustomerProfilesTable) Down() error {
 	return facades.Schema().DropIfExists("customer_profiles")
}
