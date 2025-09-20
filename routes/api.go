package routes

import (
	"github.com/goravel/framework/facades"

	"goravel/app/http/controllers"
	"goravel/app/http/middleware"
)

func Api() {
	// Initialize controllers
	authController := controllers.NewAuthController()
	marketplaceController := controllers.NewMarketplaceController()
	orderController := controllers.NewOrderController()
	vendorController := controllers.NewVendorController()
	adminController := controllers.NewAdminController()
	userController := controllers.NewUserController()
	reviewController := controllers.NewReviewController()
	portfolioController := controllers.NewPortfolioController()

	// Public routes
	api := facades.Route().Prefix("api/v1")

	// Authentication routes
	api.Post("/auth/register", authController.Register)
	api.Post("/auth/login", authController.Login)
	api.Post("/auth/refresh", authController.RefreshToken)

	// Marketplace routes (public)
	api.Get("/categories", marketplaceController.GetCategories)
	api.Get("/vendors", marketplaceController.GetVendors)
	api.Get("/vendors/{id}", marketplaceController.GetVendorDetail)
	api.Get("/services", marketplaceController.GetServices)
	api.Get("/packages", marketplaceController.GetPackages)

	// Admin routes - parameterized routes first to avoid conflicts
	api.Middleware(middleware.Auth(), middleware.Role("admin", "super_user")).Put("/admin/users/{id}", adminController.UpdateUser)
	api.Middleware(middleware.Auth(), middleware.Role("admin", "super_user")).Put("/admin/users/{id}/status", adminController.UpdateUserStatus)
	api.Middleware(middleware.Auth(), middleware.Role("admin", "super_user")).Delete("/admin/users/{id}", adminController.DeleteUser)
	api.Middleware(middleware.Auth(), middleware.Role("admin", "super_user")).Put("/admin/vendors/{id}/status", adminController.UpdateVendorStatus)
	api.Middleware(middleware.Auth(), middleware.Role("admin", "super_user")).Put("/admin/module-settings/{module}", adminController.UpdateModuleSetting)
	api.Middleware(middleware.Auth(), middleware.Role("admin", "super_user")).Put("/admin/system-settings/{key}", adminController.UpdateSystemSetting)
	
	// Admin routes - specific routes
	api.Middleware(middleware.Auth(), middleware.Role("admin", "super_user")).Get("/admin/dashboard", adminController.GetDashboard)
	api.Middleware(middleware.Auth(), middleware.Role("admin", "super_user")).Get("/admin/users", adminController.GetUsers)
	api.Middleware(middleware.Auth(), middleware.Role("admin", "super_user")).Get("/admin/vendors", adminController.GetVendors)
	api.Middleware(middleware.Auth(), middleware.Role("admin", "super_user")).Post("/admin/vendors", adminController.CreateVendor)
	api.Middleware(middleware.Auth(), middleware.Role("admin", "super_user")).Put("/admin/vendors/{id}", adminController.UpdateVendor)
	api.Middleware(middleware.Auth(), middleware.Role("admin", "super_user")).Delete("/admin/vendors/{id}", adminController.DeleteVendor)
	api.Middleware(middleware.Auth(), middleware.Role("admin", "super_user")).Get("/admin/orders", adminController.GetOrders)
	api.Middleware(middleware.Auth(), middleware.Role("admin", "super_user")).Get("/admin/module-settings", adminController.GetModuleSettings)
	api.Middleware(middleware.Auth(), middleware.Role("admin", "super_user")).Get("/admin/system-settings", adminController.GetSystemSettings)

	// Authentication protected routes
	api.Middleware(middleware.Auth()).Post("/auth/logout", authController.Logout)
	api.Middleware(middleware.Auth()).Get("/auth/me", authController.Me)

	// Customer routes
	api.Middleware(middleware.Auth(), middleware.Role("customer")).Get("/orders", orderController.GetOrders)
	api.Middleware(middleware.Auth(), middleware.Role("customer")).Get("/orders/{id}", orderController.GetOrderDetail)
	api.Middleware(middleware.Auth(), middleware.Role("customer")).Post("/orders", orderController.CreateOrder)
	api.Middleware(middleware.Auth(), middleware.Role("customer")).Put("/orders/{id}/cancel", orderController.CancelOrder)
	api.Middleware(middleware.Auth(), middleware.Role("customer")).Get("/wishlist", userController.GetWishlist)
	api.Middleware(middleware.Auth(), middleware.Role("customer")).Post("/wishlist", userController.AddToWishlist)
	api.Middleware(middleware.Auth(), middleware.Role("customer")).Delete("/wishlist/{id}", userController.RemoveFromWishlist)
	api.Middleware(middleware.Auth(), middleware.Role("customer")).Post("/reviews", reviewController.CreateReview)

	// Vendor routes
	api.Middleware(middleware.Auth(), middleware.Role("vendor")).Get("/vendor/profile", vendorController.GetProfile)
	api.Middleware(middleware.Auth(), middleware.Role("vendor")).Put("/vendor/profile", vendorController.UpdateProfile)
	api.Middleware(middleware.Auth(), middleware.Role("vendor")).Get("/vendor/services", vendorController.GetServices)
	api.Middleware(middleware.Auth(), middleware.Role("vendor")).Post("/vendor/services", vendorController.CreateService)
	api.Middleware(middleware.Auth(), middleware.Role("vendor")).Put("/vendor/services/{id}", vendorController.UpdateService)
	api.Middleware(middleware.Auth(), middleware.Role("vendor")).Delete("/vendor/services/{id}", vendorController.DeleteService)
	api.Middleware(middleware.Auth(), middleware.Role("vendor")).Get("/vendor/orders", vendorController.GetOrders)
	api.Middleware(middleware.Auth(), middleware.Role("vendor")).Put("/vendor/orders/{id}/status", vendorController.UpdateOrderStatus)
	api.Middleware(middleware.Auth(), middleware.Role("vendor")).Get("/vendor/portfolios", portfolioController.GetPortfolios)
	api.Middleware(middleware.Auth(), middleware.Role("vendor")).Post("/vendor/portfolios", portfolioController.CreatePortfolio)
	api.Middleware(middleware.Auth(), middleware.Role("vendor")).Put("/vendor/portfolios/{id}", portfolioController.UpdatePortfolio)
	api.Middleware(middleware.Auth(), middleware.Role("vendor")).Delete("/vendor/portfolios/{id}", portfolioController.DeletePortfolio)
	api.Middleware(middleware.Auth(), middleware.Role("vendor")).Post("/reviews/{id}/reply", reviewController.ReplyToReview)

	// User profile routes
	api.Middleware(middleware.Auth()).Put("/profile", userController.UpdateProfile)
	
	// Public routes
	api.Get("/reviews", reviewController.GetReviews)
	api.Get("/users/{id}", userController.Show)
}
