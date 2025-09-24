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
	// Run other seeders
	if err := facades.Seeder().Call([]seeder.Seeder{&CategorySeeder{}}); err != nil {
		return err
	}
	
	if err := facades.Seeder().Call([]seeder.Seeder{&ModuleSettingSeeder{}}); err != nil {
		return err
	}
	
	if err := facades.Seeder().Call([]seeder.Seeder{&SystemSettingSeeder{}}); err != nil {
		return err
	}
	
	if err := facades.Seeder().Call([]seeder.Seeder{&SuperUserSeeder{}}); err != nil {
		return err
	}
	
	return nil
}