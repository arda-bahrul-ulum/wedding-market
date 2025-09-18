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
				"message": "Token akses diperlukan",
			})
			return
		}

		// Extract token (assuming "Bearer <token>" format)
		if len(authHeader) < 7 || authHeader[:7] != "Bearer " {
			ctx.Response().Status(401).Json(http.Json{
				"success": false,
				"message": "Format token tidak valid",
			})
			return
		}

		token := authHeader[7:]

		// Verify token and get user
		user, err := facades.Auth().Parse(token)
		if err != nil {
			facades.Log().Error("Token parse error: " + err.Error())
			ctx.Response().Status(401).Json(http.Json{
				"success": false,
				"message": "Token tidak valid atau telah kedaluwarsa",
			})
			return
		}

		// Get user from database
		var userModel models.User
		// The user from Parse() should be the user ID directly
		userID := user
		if err := facades.Orm().Query().Where("id", userID).First(&userModel); err != nil {
			facades.Log().Error("User not found: " + err.Error())
			ctx.Response().Status(401).Json(http.Json{
				"success": false,
				"message": "User tidak ditemukan",
			})
			return
		}

		// Check if user is active
		if !userModel.IsActive {
			ctx.Response().Status(401).Json(http.Json{
				"success": false,
				"message": "Akun tidak aktif",
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
		
		// Check if user exists in context (auth middleware should have set it)
		userInterface := ctx.Value("user")
		if userInterface == nil {
			ctx.Response().Status(401).Json(http.Json{
				"success": false,
				"message": "User tidak terautentikasi",
			})
			return
		}

		user := userInterface.(models.User)

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
				"message": "Akses ditolak. Role tidak sesuai",
			})
			return
		}

		ctx.Request().Next()
	}
}
