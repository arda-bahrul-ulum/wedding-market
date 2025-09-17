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
	if !facades.Schema().HasTable("users") {
		if err := facades.Schema().Create("users", func(table schema.Blueprint) {
			table.ID()
			table.String("name")
			table.String("email")
			table.String("password")
			table.String("phone").Nullable()
			table.String("avatar").Nullable()
			table.String("role").Default("customer")
			table.Boolean("is_active").Default(true)
			table.Timestamp("email_verified_at").Nullable()
			table.Timestamp("last_login_at").Nullable()
			table.Timestamps()
		}); err != nil {
			return err
		}
	}
	return nil
}

// Down Reverse the migrations.
func (r *M20210101000001CreateUsersTable) Down() error {
	if err := facades.Schema().DropIfExists("users"); err != nil {
		return err
	}
	return nil
}