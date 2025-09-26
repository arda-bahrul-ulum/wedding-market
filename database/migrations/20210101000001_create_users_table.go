package migrations

import (
	"github.com/goravel/framework/contracts/database/schema"
	"github.com/goravel/framework/facades"
)

type M20210101000001CreateUsersTable struct{}

// Signature The unique signature for the migration.
func (r *M20210101000001CreateUsersTable) Signature() string {
	return "20210101000001_create_users_table"
}

// Up Run the migrations.
func (r *M20210101000001CreateUsersTable) Up() error {
	return facades.Schema().Create("users", func(table schema.Blueprint) {
		table.ID()
		table.String("name", 255)
		table.String("email", 255)
		table.String("password", 255)
		table.String("phone", 20).Nullable()
		table.String("avatar", 500).Nullable()
		table.String("role", 20).Default("customer")
		table.Boolean("is_active").Default(true)
		table.Timestamp("email_verified_at").Nullable()
		table.Timestamp("last_login_at").Nullable()
		table.Timestamps()

		// Add indexes for performance
		table.Index("email")
		table.Index("role")
		table.Index("is_active")
	})
}

// Down Reverse the migrations.
func (r *M20210101000001CreateUsersTable) Down() error {
	if err := facades.Schema().DropIfExists("users"); err != nil {
		return err
	}
	return nil
}