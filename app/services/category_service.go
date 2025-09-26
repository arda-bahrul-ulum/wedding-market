package services

import (
	"goravel/app/contracts/repositories"
	"goravel/app/contracts/services"
	"goravel/app/models"

	"github.com/goravel/framework/facades"
)

type CategoryService struct {
	categoryRepo repositories.CategoryRepositoryInterface
}

func NewCategoryService(categoryRepo repositories.CategoryRepositoryInterface) services.CategoryServiceInterface {
	return &CategoryService{
		categoryRepo: categoryRepo,
	}
}

func (s *CategoryService) GetCategories(filters *services.CategoryFilters, page, limit int) (*services.ServiceResponse, error) {
	// Convert service filters to repository filters
	repoFilters := &repositories.CategoryFilters{
		Name:     filters.Name,
		IsActive: filters.IsActive,
	}
	
	categories, total, err := s.categoryRepo.FindWithFilters(repoFilters, page, limit)
	if err != nil {
		return services.NewErrorResponse("Gagal mengambil data kategori", err), nil
	}

	return services.NewSuccessResponse("Data kategori berhasil diambil", map[string]interface{}{
		"categories": categories,
		"pagination": map[string]interface{}{
			"page":        page,
			"limit":       limit,
			"total":       total,
			"total_pages": calculateTotalPages(total, limit),
		},
	}), nil
}

func (s *CategoryService) GetCategory(id uint) (*services.ServiceResponse, error) {
	category, err := s.categoryRepo.Find(id)
	if err != nil {
		return services.NewErrorResponse("Kategori tidak ditemukan", err), nil
	}

	return services.NewSuccessResponse("Data kategori berhasil diambil", category), nil
}

func (s *CategoryService) CreateCategory(request *services.CreateCategoryRequest) (*services.ServiceResponse, error) {
	// Validasi input
	if request.Name == "" {
		return services.NewErrorResponse("Nama kategori harus diisi", nil), nil
	}

	// Cek apakah nama kategori sudah ada
	existingCategory, _ := s.categoryRepo.FindByName(request.Name)
	if existingCategory != nil {
		return services.NewErrorResponse("Nama kategori sudah ada", nil), nil
	}

	// Buat kategori
	category := &models.Category{
		Name:        request.Name,
		Description: request.Description,
		Icon:        request.Icon,
		Color:       request.Color,
		IsActive:    request.IsActive,
	}

	// Generate slug
	category.GenerateSlug()

	if err := s.categoryRepo.Create(category); err != nil {
		facades.Log().Error("Failed to create category: " + err.Error())
		return services.NewErrorResponse("Gagal membuat kategori", err), nil
	}

	return services.NewSuccessResponse("Kategori berhasil dibuat", category), nil
}

func (s *CategoryService) UpdateCategory(id uint, request *services.UpdateCategoryRequest) (*services.ServiceResponse, error) {
	// Cari kategori
	category, err := s.categoryRepo.Find(id)
	if err != nil {
		return services.NewErrorResponse("Kategori tidak ditemukan", err), nil
	}

	// Validasi nama jika diubah
	if request.Name != "" && request.Name != category.Name {
		existingCategory, _ := s.categoryRepo.FindByName(request.Name)
		if existingCategory != nil {
			return services.NewErrorResponse("Nama kategori sudah ada", nil), nil
		}
		category.Name = request.Name
		category.GenerateSlug() // Regenerate slug
	}

	// Update field yang ada
	if request.Description != "" {
		category.Description = request.Description
	}
	if request.Icon != "" {
		category.Icon = request.Icon
	}
	if request.Color != "" {
		category.Color = request.Color
	}
	if request.IsActive != nil {
		category.IsActive = *request.IsActive
	}

	if err := s.categoryRepo.Update(category); err != nil {
		facades.Log().Error("Failed to update category: " + err.Error())
		return services.NewErrorResponse("Gagal mengupdate kategori", err), nil
	}

	return services.NewSuccessResponse("Kategori berhasil diupdate", category), nil
}

func (s *CategoryService) DeleteCategory(id uint) (*services.ServiceResponse, error) {
	// Cari kategori
	category, err := s.categoryRepo.Find(id)
	if err != nil {
		return services.NewErrorResponse("Kategori tidak ditemukan", err), nil
	}

	// Soft delete
	category.IsActive = false
	if err := s.categoryRepo.Update(category); err != nil {
		facades.Log().Error("Failed to delete category: " + err.Error())
		return services.NewErrorResponse("Gagal menghapus kategori", err), nil
	}

	return services.NewSuccessResponse("Kategori berhasil dihapus", nil), nil
}

func (s *CategoryService) ActivateCategory(id uint) (*services.ServiceResponse, error) {
	category, err := s.categoryRepo.Find(id)
	if err != nil {
		return services.NewErrorResponse("Kategori tidak ditemukan", err), nil
	}

	category.IsActive = true
	if err := s.categoryRepo.Update(category); err != nil {
		return services.NewErrorResponse("Gagal mengaktifkan kategori", err), nil
	}

	return services.NewSuccessResponse("Kategori berhasil diaktifkan", category), nil
}

func (s *CategoryService) DeactivateCategory(id uint) (*services.ServiceResponse, error) {
	category, err := s.categoryRepo.Find(id)
	if err != nil {
		return services.NewErrorResponse("Kategori tidak ditemukan", err), nil
	}

	category.IsActive = false
	if err := s.categoryRepo.Update(category); err != nil {
		return services.NewErrorResponse("Gagal menonaktifkan kategori", err), nil
	}

	return services.NewSuccessResponse("Kategori berhasil dinonaktifkan", category), nil
}

func (s *CategoryService) GetCategoryStatistics() (*services.ServiceResponse, error) {
	stats, err := s.categoryRepo.GetStatistics()
	if err != nil {
		return services.NewErrorResponse("Gagal mengambil statistik kategori", err), nil
	}

	return services.NewSuccessResponse("Statistik kategori berhasil diambil", stats), nil
}

func (s *CategoryService) Initialize() error {
	// Initialize category service
	return nil
}

func (s *CategoryService) Cleanup() error {
	// Cleanup category service resources
	return nil
}

// Helper function
func calculateTotalPages(total int64, limit int) int {
	if limit <= 0 {
		return 1
	}
	pages := int(total) / limit
	if int(total)%limit > 0 {
		pages++
	}
	return pages
}