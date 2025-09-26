package controllers

import (
	"goravel/app/contracts/services"
	"strconv"

	"github.com/goravel/framework/contracts/http"
)

type AdminCategoryController struct {
	categoryService services.CategoryServiceInterface
}

func NewAdminCategoryController(categoryService services.CategoryServiceInterface) *AdminCategoryController {
	return &AdminCategoryController{
		categoryService: categoryService,
	}
}

// GetCategories retrieves all categories with pagination and filtering
func (c *AdminCategoryController) GetCategories(ctx http.Context) http.Response {
	// Parse query parameters
	page, _ := strconv.Atoi(ctx.Request().Query("page", "1"))
	limit, _ := strconv.Atoi(ctx.Request().Query("limit", "10"))
	
	// Parse filters
	filters := &services.CategoryFilters{
		Name:     ctx.Request().Query("name", ""),
		IsActive: parseBoolPointer(ctx.Request().Query("is_active", "")),
	}

	response, err := c.categoryService.GetCategories(filters, page, limit)
	if err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"error": err.Error(),
		})
	}

	if response.Success {
		return ctx.Response().Status(200).Json(response)
	} else {
		return ctx.Response().Status(400).Json(response)
	}
}

// GetCategory retrieves a specific category by ID
func (c *AdminCategoryController) GetCategory(ctx http.Context) http.Response {
	categoryID := ctx.Request().Input("id")
	
	categoryIDUint, err := strconv.ParseUint(categoryID, 10, 32)
	if err != nil {
		return ctx.Response().Status(400).Json(http.Json{
			"error": "Invalid category ID",
		})
	}

	response, err := c.categoryService.GetCategory(uint(categoryIDUint))
	if err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"error": err.Error(),
		})
	}

	if response.Success {
		return ctx.Response().Status(200).Json(response)
	} else {
		return ctx.Response().Status(404).Json(response)
	}
}

// CreateCategory creates a new category
func (c *AdminCategoryController) CreateCategory(ctx http.Context) http.Response {
	var request services.CreateCategoryRequest
	if err := ctx.Request().Bind(&request); err != nil {
		return ctx.Response().Status(400).Json(http.Json{
			"error": err.Error(),
		})
	}

	response, err := c.categoryService.CreateCategory(&request)
	if err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"error": err.Error(),
		})
	}

	if response.Success {
		return ctx.Response().Status(201).Json(response)
	} else {
		return ctx.Response().Status(400).Json(response)
	}
}

// UpdateCategory updates an existing category
func (c *AdminCategoryController) UpdateCategory(ctx http.Context) http.Response {
	categoryID := ctx.Request().Input("id")
	
	categoryIDUint, err := strconv.ParseUint(categoryID, 10, 32)
	if err != nil {
		return ctx.Response().Status(400).Json(http.Json{
			"error": "Invalid category ID",
		})
	}

	var request services.UpdateCategoryRequest
	if err := ctx.Request().Bind(&request); err != nil {
		return ctx.Response().Status(400).Json(http.Json{
			"error": err.Error(),
		})
	}

	response, err := c.categoryService.UpdateCategory(uint(categoryIDUint), &request)
	if err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"error": err.Error(),
		})
	}

	if response.Success {
		return ctx.Response().Status(200).Json(response)
	} else {
		return ctx.Response().Status(400).Json(response)
	}
}

// DeleteCategory deletes a category (soft delete)
func (c *AdminCategoryController) DeleteCategory(ctx http.Context) http.Response {
	categoryID := ctx.Request().Input("id")
	
	categoryIDUint, err := strconv.ParseUint(categoryID, 10, 32)
	if err != nil {
		return ctx.Response().Status(400).Json(http.Json{
			"error": "Invalid category ID",
		})
	}

	response, err := c.categoryService.DeleteCategory(uint(categoryIDUint))
	if err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"error": err.Error(),
		})
	}

	if response.Success {
		return ctx.Response().Status(200).Json(response)
	} else {
		return ctx.Response().Status(400).Json(response)
	}
}

// ActivateCategory activates a category
func (c *AdminCategoryController) ActivateCategory(ctx http.Context) http.Response {
	categoryID := ctx.Request().Input("id")
	
	categoryIDUint, err := strconv.ParseUint(categoryID, 10, 32)
	if err != nil {
		return ctx.Response().Status(400).Json(http.Json{
			"error": "Invalid category ID",
		})
	}

	response, err := c.categoryService.ActivateCategory(uint(categoryIDUint))
	if err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"error": err.Error(),
		})
	}

	if response.Success {
		return ctx.Response().Status(200).Json(response)
	} else {
		return ctx.Response().Status(400).Json(response)
	}
}

// DeactivateCategory deactivates a category
func (c *AdminCategoryController) DeactivateCategory(ctx http.Context) http.Response {
	categoryID := ctx.Request().Input("id")
	
	categoryIDUint, err := strconv.ParseUint(categoryID, 10, 32)
	if err != nil {
		return ctx.Response().Status(400).Json(http.Json{
			"error": "Invalid category ID",
		})
	}

	response, err := c.categoryService.DeactivateCategory(uint(categoryIDUint))
	if err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"error": err.Error(),
		})
	}

	if response.Success {
		return ctx.Response().Status(200).Json(response)
	} else {
		return ctx.Response().Status(400).Json(response)
	}
}

// GetCategoryStatistics retrieves category statistics
func (c *AdminCategoryController) GetCategoryStatistics(ctx http.Context) http.Response {
	response, err := c.categoryService.GetCategoryStatistics()
	if err != nil {
		return ctx.Response().Status(500).Json(http.Json{
			"error": err.Error(),
		})
	}

	if response.Success {
		return ctx.Response().Status(200).Json(response)
	} else {
		return ctx.Response().Status(400).Json(response)
	}
}

// Helper function to parse bool pointer from string
func parseBoolPointer(value string) *bool {
	if value == "" {
		return nil
	}
	if value == "true" {
		b := true
		return &b
	}
	if value == "false" {
		b := false
		return &b
	}
	return nil
}