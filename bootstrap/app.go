package bootstrap

import (
	"github.com/goravel/framework/foundation"

	"goravel/config"
)

func Boot() {
	// Create new application instance
	app := foundation.NewApplication()

	// Bootstrap the application
	app.Boot()

	// Bootstrap configuration
	config.Boot()
}
