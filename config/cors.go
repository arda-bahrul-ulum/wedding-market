package config

import (
	"github.com/goravel/framework/facades"
)

func init() {
	config := facades.Config()
	config.Add("cors", map[string]any{
		// Cross-Origin Resource Sharing (CORS) Configuration
		//
		// Here you may configure your settings for cross-origin resource sharing
		// or "CORS". This determines what cross-origin operations may execute
		// in web browsers. You are free to adjust these settings as needed.
		//
		// To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
		"paths":                []string{"*"},
		"allowed_methods":      []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		"allowed_origins":      []string{"http://localhost:5173"},
		"allowed_headers":      []string{"Content-Type", "Authorization", "X-Requested-With"},
		"exposed_headers":      []string{},
		"max_age":              86400,
		"supports_credentials": true,
	})
}
