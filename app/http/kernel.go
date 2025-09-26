package http

import (
	"github.com/goravel/framework/contracts/http"
)

type Kernel struct {
}

// The application's global HTTP middleware stack.
// These middleware are run during every request to your application.
func (kernel Kernel) Middleware() []http.Middleware {
	return []http.Middleware{
		// CORS middleware is handled by Goravel framework configuration
		// See config/cors.go for CORS settings
		
		// Add other global middleware here as needed
		// Example: Logging, Rate Limiting, etc.
	}
}
