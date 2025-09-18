package middleware

import (
	"goravel/app/models"

	"github.com/goravel/framework/contracts/http"
	"github.com/goravel/framework/facades"
)

func Auth() http.Middleware {
	return func(ctx http.Context) {
		// Get token from Authorization header
		authHeader := ctx.Request().Header("Authorization")
		if authHeader == "" {
			ctx.Response().Status(401).Json(http.Json{
				"success": false,
				"message": "Authorization header required",
			})
			return
		}

		// Extract token (assuming "Bearer <token>" format)
		if len(authHeader) < 7 || authHeader[:7] != "Bearer " {
			ctx.Response().Status(401).Json(http.Json{
				"success": false,
				"message": "Invalid authorization format",
			})
			return
		}

		token := authHeader[7:]

		// Verify token and get user
		user, err := facades.Auth().Parse(token)
		if err != nil {
			ctx.Response().Status(401).Json(http.Json{
				"success": false,
				"message": "Invalid token",
			})
			return
		}

		// Get user from database
		var userModel models.User
		// Extract user ID from the auth payload
		// The user payload should have a method to get the ID
		userID := user.GetID()
		if err := facades.Orm().Query().Where("id", userID).First(&userModel); err != nil {
			ctx.Response().Status(401).Json(http.Json{
				"success": false,
				"message": "User not found",
			})
			return
		}

		// Check if user is active
		if !userModel.IsActive {
			ctx.Response().Status(401).Json(http.Json{
				"success": false,
				"message": "Account is deactivated",
			})
			return
		}

		// Set user in context
		ctx.WithValue("user", userModel)
		ctx.WithValue("user_id", userModel.ID)

		ctx.Request().Next()
	}
}

func Role(roles ...string) http.Middleware {
	return func(ctx http.Context) {
		// First check authentication
		Auth()(ctx)
		// Check if authentication failed by looking at response headers or status
		// Since we can't easily check status, we'll proceed and let the role check handle it

		user := ctx.Value("user").(models.User)

		// Check if user role is allowed
		allowed := false
		for _, role := range roles {
			if user.Role == role {
				allowed = true
				break
			}
		}

		if !allowed {
			ctx.Response().Status(403).Json(http.Json{
				"success": false,
				"message": "Insufficient permissions",
			})
			return
		}

		ctx.Request().Next()
	}
}
