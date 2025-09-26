package seeders

import (
	"github.com/goravel/framework/contracts/database/seeder"
	"github.com/goravel/framework/facades"
)

type DatabaseSeeder struct{}

// Signature The name and signature of the seeder.
func (s *DatabaseSeeder) Signature() string {
	return "DatabaseSeeder"
}

// Run executes the seeder logic.
func (s *DatabaseSeeder) Run() error {
	// Run other seeders using CallOnce to ensure they run only once
	if err := facades.Seeder().CallOnce([]seeder.Seeder{&CategorySeeder{}}); err != nil {
		return err
	}
	
	if err := facades.Seeder().CallOnce([]seeder.Seeder{&SuperUserSeeder{}}); err != nil {
		return err
	}
	
	return nil
}