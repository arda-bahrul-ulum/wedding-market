package migrations

import (
	"github.com/goravel/framework/contracts/database/schema"
	"github.com/goravel/framework/facades"
)

type M20210101000014CreateChatsTable struct{}

// Signature The unique signature for the migration.
func (r *M20210101000014CreateChatsTable) Signature() string {
	return "20210101000014_create_chats_table"
}

// Up Run the migrations.
func (r *M20210101000014CreateChatsTable) Up() error {
	if !facades.Schema().HasTable("chats") {
		if err := facades.Schema().Create("chats", func(table schema.Blueprint) {
			table.ID()
			table.UnsignedBigInteger("order_id")
			table.UnsignedBigInteger("user_id")
			table.Text("message")
			table.String("message_type").Default("text")
			table.Boolean("is_read").Default(false)
			table.Timestamps()
			
		}); err != nil {
			return err
		}
	}
	return nil
}

// Down Reverse the migrations.
func (r *M20210101000014CreateChatsTable) Down() error {
	if err := facades.Schema().DropIfExists("chats"); err != nil {
		return err
	}
	return nil
}
