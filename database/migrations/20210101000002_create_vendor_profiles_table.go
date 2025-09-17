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
	if !facades.Schema().HasTable("vendor_profiles") {
		if err := facades.Schema().Create("vendor_profiles", func(table schema.Blueprint) {
			table.ID()
			table.UnsignedBigInteger("user_id")
			table.String("business_name")
			table.String("business_type")
			table.Text("description").Nullable()
			table.Text("address").Nullable()
			table.String("city").Nullable()
			table.String("province").Nullable()
			table.String("postal_code").Nullable()
			table.Double("latitude").Nullable()
			table.Double("longitude").Nullable()
			table.String("website").Nullable()
			table.String("instagram").Nullable()
			table.String("whatsapp").Nullable()
			table.Boolean("is_verified").Default(false)
			table.Boolean("is_active").Default(true)
			table.String("subscription_plan").Default("free")
			table.Timestamp("subscription_expires_at").Nullable()
			table.Timestamps()
		}); err != nil {
			return err
		}
	}
	return nil
}

// Down Reverse the migrations.
func (r *M20210101000002CreateVendorProfilesTable) Down() error {
	if err := facades.Schema().DropIfExists("vendor_profiles"); err != nil {
		return err
	}
	return nil
}
