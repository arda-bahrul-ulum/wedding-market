package routes

import (
	"github.com/goravel/framework/facades"

	"goravel/app/contracts/services"
	"goravel/app/http/controllers"
	"goravel/app/http/middleware"
	"goravel/app/models"
)

func Api() {
	// Initialize controllers through dependency injection
	authControllerInterface, err := facades.App().Make("controllers.auth")
	if err != nil {
		facades.Log().Error("Failed to make auth controller: " + err.Error())
		return
	}
	authController := authControllerInterface.(*controllers.AuthController)
	
	// Get service instances
	serviceServiceInterface, _ := facades.App().Make("services.service")
	serviceService := serviceServiceInterface.(services.ServiceServiceInterface)
	
	vendorServiceInterface, _ := facades.App().Make("services.vendor")
	vendorService := vendorServiceInterface.(services.VendorServiceInterface)
	
	packageServiceInterface, _ := facades.App().Make("services.package")
	packageService := packageServiceInterface.(services.PackageServiceInterface)
	
	orderServiceInterface, _ := facades.App().Make("services.order")
	orderService := orderServiceInterface.(services.OrderServiceInterface)
	
	adminServiceInterface, _ := facades.App().Make("services.admin")
	adminService := adminServiceInterface.(services.AdminServiceInterface)
	
	userServiceInterface, _ := facades.App().Make("services.user")
	userService := userServiceInterface.(services.UserServiceInterface)
	
	reviewServiceInterface, _ := facades.App().Make("services.review")
	reviewService := reviewServiceInterface.(services.ReviewServiceInterface)
	
	portfolioServiceInterface, _ := facades.App().Make("services.portfolio")
	portfolioService := portfolioServiceInterface.(services.PortfolioServiceInterface)

	categoryServiceInterface, _ := facades.App().Make("services.category")
	categoryService := categoryServiceInterface.(services.CategoryServiceInterface)

	// Initialize controllers with dependencies
	marketplaceController := controllers.NewMarketplaceController(serviceService, vendorService, packageService)
	orderController := controllers.NewOrderController(orderService)
	vendorController := controllers.NewVendorController(vendorService, serviceService, orderService)
	adminController := controllers.NewAdminController(adminService)
	userController := controllers.NewUserController(userService)
	reviewController := controllers.NewReviewController(reviewService)
	portfolioController := controllers.NewPortfolioController(portfolioService)
	adminCategoryController := controllers.NewAdminCategoryController(categoryService)

	// Public routes
	api := facades.Route().Prefix("api/v1")

	// Authentication routes
	api.Post("/auth/register", authController.Register)
	api.Post("/auth/login", authController.Login)
	api.Post("/auth/check-role", authController.CheckUserRole)
	api.Post("/auth/refresh", authController.RefreshToken)
	api.Post("/auth/superadmin/login", authController.SuperAdminLogin)

	// Marketplace routes (public)
	api.Get("/categories", marketplaceController.GetCategories)
	api.Get("/vendors", marketplaceController.GetVendors)
	api.Get("/vendors/{id}", marketplaceController.GetVendorDetail)
	api.Get("/services", marketplaceController.GetServices)
	api.Get("/packages", marketplaceController.GetPackages)

	// Admin routes - parameterized routes first to avoid conflicts
	api.Middleware(middleware.Auth(), middleware.Role(models.RoleAdmin, models.RoleSuperUser)).Put("/admin/users/{id}", adminController.UpdateUser)
	api.Middleware(middleware.Auth(), middleware.Role(models.RoleAdmin, models.RoleSuperUser)).Put("/admin/users/{id}/status", adminController.UpdateUserStatus)
	api.Middleware(middleware.Auth(), middleware.Role(models.RoleAdmin, models.RoleSuperUser)).Delete("/admin/users/{id}", adminController.DeleteUser)
	api.Middleware(middleware.Auth(), middleware.Role(models.RoleAdmin, models.RoleSuperUser)).Put("/admin/vendors/{id}/status", adminController.UpdateVendorStatus)
	
	// Admin routes - specific routes
	api.Middleware(middleware.Auth(), middleware.Role(models.RoleAdmin, models.RoleSuperUser)).Get("/admin/dashboard", adminController.GetDashboard)
	api.Middleware(middleware.Auth(), middleware.Role(models.RoleAdmin, models.RoleSuperUser)).Get("/admin/users", adminController.GetUsers)
	api.Middleware(middleware.Auth(), middleware.Role(models.RoleAdmin, models.RoleSuperUser)).Get("/admin/vendors", adminController.GetVendors)
	api.Middleware(middleware.Auth(), middleware.Role(models.RoleAdmin, models.RoleSuperUser)).Post("/admin/vendors", adminController.CreateVendor)
	api.Middleware(middleware.Auth(), middleware.Role(models.RoleAdmin, models.RoleSuperUser)).Put("/admin/vendors/{id}", adminController.UpdateVendor)
	api.Middleware(middleware.Auth(), middleware.Role(models.RoleAdmin, models.RoleSuperUser)).Delete("/admin/vendors/{id}", adminController.DeleteVendor)
	api.Middleware(middleware.Auth(), middleware.Role(models.RoleAdmin, models.RoleSuperUser)).Get("/admin/orders", adminController.GetOrders)
	api.Middleware(middleware.Auth(), middleware.Role(models.RoleAdmin, models.RoleSuperUser)).Get("/admin/orders/statistics", adminController.GetOrderStatistics)
	api.Middleware(middleware.Auth(), middleware.Role(models.RoleAdmin, models.RoleSuperUser)).Post("/admin/orders/bulk-update-status", adminController.BulkUpdateOrderStatus)
	api.Middleware(middleware.Auth(), middleware.Role(models.RoleAdmin, models.RoleSuperUser)).Post("/admin/orders/bulk-delete", adminController.BulkDeleteOrders)
	api.Middleware(middleware.Auth(), middleware.Role(models.RoleAdmin, models.RoleSuperUser)).Get("/admin/orders/export", adminController.ExportOrders)
	api.Middleware(middleware.Auth(), middleware.Role(models.RoleAdmin, models.RoleSuperUser)).Get("/admin/orders/status-options", adminController.GetOrderStatusOptions)
	api.Middleware(middleware.Auth(), middleware.Role(models.RoleAdmin, models.RoleSuperUser)).Get("/admin/orders/{id}", orderController.GetAdminOrderDetail)
	api.Middleware(middleware.Auth(), middleware.Role(models.RoleAdmin, models.RoleSuperUser)).Put("/admin/orders/{id}/status", orderController.UpdateAdminOrderStatus)
	api.Middleware(middleware.Auth(), middleware.Role(models.RoleAdmin, models.RoleSuperUser)).Post("/admin/orders/{id}/refund", orderController.ProcessRefund)
	
	// Admin Category Management Routes
	api.Middleware(middleware.Auth(), middleware.Role(models.RoleAdmin, models.RoleSuperUser)).Get("/admin/categories", adminCategoryController.GetCategories)
	api.Middleware(middleware.Auth(), middleware.Role(models.RoleAdmin, models.RoleSuperUser)).Get("/admin/categories/statistics", adminCategoryController.GetCategoryStatistics)
	api.Middleware(middleware.Auth(), middleware.Role(models.RoleAdmin, models.RoleSuperUser)).Get("/admin/categories/{id}", adminCategoryController.GetCategory)
	api.Middleware(middleware.Auth(), middleware.Role(models.RoleAdmin, models.RoleSuperUser)).Post("/admin/categories", adminCategoryController.CreateCategory)
	api.Middleware(middleware.Auth(), middleware.Role(models.RoleAdmin, models.RoleSuperUser)).Put("/admin/categories/{id}", adminCategoryController.UpdateCategory)
	api.Middleware(middleware.Auth(), middleware.Role(models.RoleAdmin, models.RoleSuperUser)).Delete("/admin/categories/{id}", adminCategoryController.DeleteCategory)
	api.Middleware(middleware.Auth(), middleware.Role(models.RoleAdmin, models.RoleSuperUser)).Put("/admin/categories/{id}/activate", adminCategoryController.ActivateCategory)
	api.Middleware(middleware.Auth(), middleware.Role(models.RoleAdmin, models.RoleSuperUser)).Put("/admin/categories/{id}/deactivate", adminCategoryController.DeactivateCategory)

	// Authentication protected routes
	api.Middleware(middleware.Auth()).Post("/auth/logout", authController.Logout)
	api.Middleware(middleware.Auth()).Get("/auth/me", authController.Me)

	// Customer routes
	api.Middleware(middleware.Auth(), middleware.Role(models.RoleCustomer)).Get("/orders", orderController.GetOrders)
	api.Middleware(middleware.Auth(), middleware.Role(models.RoleCustomer)).Get("/orders/{id}", orderController.GetOrderDetail)
	api.Middleware(middleware.Auth(), middleware.Role(models.RoleCustomer)).Post("/orders", orderController.CreateOrder)
	api.Middleware(middleware.Auth(), middleware.Role(models.RoleCustomer)).Put("/orders/{id}", orderController.UpdateOrder)
	api.Middleware(middleware.Auth(), middleware.Role(models.RoleCustomer)).Delete("/orders/{id}", orderController.DeleteOrder)
	api.Middleware(middleware.Auth(), middleware.Role(models.RoleCustomer)).Put("/orders/{id}/cancel", orderController.CancelOrder)
	// Wishlist routes will be implemented later
	// api.Middleware(middleware.Auth(), middleware.Role(models.RoleCustomer)).Get("/wishlist", userController.GetWishlist)
	// api.Middleware(middleware.Auth(), middleware.Role(models.RoleCustomer)).Post("/wishlist", userController.AddToWishlist)
	// api.Middleware(middleware.Auth(), middleware.Role(models.RoleCustomer)).Delete("/wishlist/{id}", userController.RemoveFromWishlist)
	api.Middleware(middleware.Auth(), middleware.Role(models.RoleCustomer)).Post("/reviews", reviewController.CreateReview)

	// Vendor routes
	api.Middleware(middleware.Auth(), middleware.Role(models.RoleVendor)).Get("/vendor/profile", vendorController.GetProfile)
	api.Middleware(middleware.Auth(), middleware.Role(models.RoleVendor)).Put("/vendor/profile", vendorController.UpdateProfile)
	api.Middleware(middleware.Auth(), middleware.Role(models.RoleVendor)).Get("/vendor/services", vendorController.GetServices)
	api.Middleware(middleware.Auth(), middleware.Role(models.RoleVendor)).Post("/vendor/services", vendorController.CreateService)
	api.Middleware(middleware.Auth(), middleware.Role(models.RoleVendor)).Put("/vendor/services/{id}", vendorController.UpdateService)
	api.Middleware(middleware.Auth(), middleware.Role(models.RoleVendor)).Delete("/vendor/services/{id}", vendorController.DeleteService)
	api.Middleware(middleware.Auth(), middleware.Role(models.RoleVendor)).Get("/vendor/orders", orderController.GetVendorOrders)
	api.Middleware(middleware.Auth(), middleware.Role(models.RoleVendor)).Get("/vendor/orders/{id}", orderController.GetOrderDetail)
	api.Middleware(middleware.Auth(), middleware.Role(models.RoleVendor)).Put("/vendor/orders/{id}/status", orderController.UpdateOrderStatus)
	api.Middleware(middleware.Auth(), middleware.Role(models.RoleVendor)).Get("/vendor/orders/statistics", orderController.GetOrderStatistics)
	api.Middleware(middleware.Auth(), middleware.Role(models.RoleVendor)).Get("/vendor/portfolios", portfolioController.GetPortfolios)
	api.Middleware(middleware.Auth(), middleware.Role(models.RoleVendor)).Post("/vendor/portfolios", portfolioController.CreatePortfolio)
	api.Middleware(middleware.Auth(), middleware.Role(models.RoleVendor)).Put("/vendor/portfolios/{id}", portfolioController.UpdatePortfolio)
	api.Middleware(middleware.Auth(), middleware.Role(models.RoleVendor)).Delete("/vendor/portfolios/{id}", portfolioController.DeletePortfolio)
	api.Middleware(middleware.Auth(), middleware.Role(models.RoleVendor)).Post("/reviews/{id}/reply", reviewController.ReplyToReview)

	// User profile routes
	api.Middleware(middleware.Auth()).Put("/profile", userController.UpdateProfile)
	
	// Public routes
	api.Get("/reviews", reviewController.GetReviews)
	api.Get("/users/{id}", userController.Show)
}
