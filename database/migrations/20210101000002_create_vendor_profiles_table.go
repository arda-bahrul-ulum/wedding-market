package migrations

import (
	"github.com/goravel/framework/contracts/database/schema"
	"github.com/goravel/framework/facades"
)

type M20210101000002CreateVendorProfilesTable struct{}

// Signature The unique signature for the migration.
func (r *M20210101000002CreateVendorProfilesTable) Signature() string {
	return "20210101000002_create_vendor_profiles_table"
}

// Up Run the migrations.
func (r *M20210101000002CreateVendorProfilesTable) Up() error {
	return facades.Schema().Create("vendor_profiles", func(table schema.Blueprint) {
		table.ID()
		table.UnsignedBigInteger("user_id")
		table.String("business_name", 255)
		table.String("business_type", 50)
		table.Text("description").Nullable()
		table.Text("address").Nullable()
		table.String("city", 100).Nullable()
		table.String("province", 100).Nullable()
		table.String("postal_code", 20).Nullable()
		table.Decimal("latitude").Nullable()
		table.Decimal("longitude").Nullable()
		table.String("website", 500).Nullable()
		table.String("instagram", 255).Nullable()
		table.String("whatsapp", 20).Nullable()
		table.Boolean("is_verified").Default(false)
		table.Boolean("is_active").Default(true)
		table.String("subscription_plan", 20).Default("free")
		table.Timestamp("subscription_expires_at").Nullable()
		table.Timestamps()

		// Foreign key constraint
		table.Foreign("user_id").References("id").On("users")

		// Indexes for performance
		table.Index("user_id")
		table.Index("business_type")
		table.Index("is_verified")
		table.Index("is_active")
		table.Index("subscription_plan")
		table.Index("city")
		table.Index("province")
	})
}

// Down Reverse the migrations.
func (r *M20210101000002CreateVendorProfilesTable) Down() error {
	if err := facades.Schema().DropIfExists("vendor_profiles"); err != nil {
		return err
	}
	return nil
}
