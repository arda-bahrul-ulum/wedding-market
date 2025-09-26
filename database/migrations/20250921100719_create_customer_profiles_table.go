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
	return facades.Schema().Create("customer_profiles", func(table schema.Blueprint) {
		table.ID()
		table.UnsignedBigInteger("user_id")
		table.String("full_name", 255)
		table.String("phone", 20).Nullable()
		table.Text("address").Nullable()
		table.String("city", 100).Nullable()
		table.String("province", 100).Nullable()
		table.String("postal_code", 20).Nullable()
		table.Date("birth_date").Nullable()
		table.String("gender", 10).Nullable()
		table.Text("bio").Nullable()
		table.String("avatar", 500).Nullable()
		table.Boolean("is_active").Default(true)
		table.Timestamps()

		// Foreign key constraint
		table.Foreign("user_id").References("id").On("users")

		// Indexes for performance
		table.Index("user_id")
		table.Index("is_active")
		table.Index("city")
		table.Index("province")
		table.Index("gender")
	})
}

// Down Reverse the migrations.
func (r *M20250921100719CreateCustomerProfilesTable) Down() error {
 	return facades.Schema().DropIfExists("customer_profiles")
}
