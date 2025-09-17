package seeders

import (
	"goravel/app/models"

	"github.com/goravel/framework/facades"
)

type CategorySeeder struct{}

// Signature The name and signature of the seeder.
func (s *CategorySeeder) Signature() string {
	return "CategorySeeder"
}

// Run executes the seeder logic.
func (s *CategorySeeder) Run() error {
	categories := []models.Category{
		{
			Name:        "Venue",
			Slug:        "venue",
			Description: "Tempat pernikahan dan acara",
			Icon:        "home",
			IsActive:    true,
			SortOrder:   1,
		},
		{
			Name:        "Make Up Artist (MUA)",
			Slug:        "makeup-artist",
			Description: "Jasa rias pengantin dan tamu",
			Icon:        "user",
			IsActive:    true,
			SortOrder:   2,
		},
		{
			Name:        "Dekorasi",
			Slug:        "dekorasi",
			Description: "Dekorasi pernikahan dan bunga",
			Icon:        "flower",
			IsActive:    true,
			SortOrder:   3,
		},
		{
			Name:        "Fotografer",
			Slug:        "fotografer",
			Description: "Jasa fotografi pernikahan",
			Icon:        "camera",
			IsActive:    true,
			SortOrder:   4,
		},
		{
			Name:        "Videografer",
			Slug:        "videografer",
			Description: "Jasa videografi pernikahan",
			Icon:        "video",
			IsActive:    true,
			SortOrder:   5,
		},
		{
			Name:        "Catering",
			Slug:        "catering",
			Description: "Jasa catering dan makanan",
			Icon:        "utensils",
			IsActive:    true,
			SortOrder:   6,
		},
		{
			Name:        "Wedding Organizer",
			Slug:        "wedding-organizer",
			Description: "Paket lengkap pernikahan",
			Icon:        "calendar",
			IsActive:    true,
			SortOrder:   7,
		},
		{
			Name:        "Entertainment",
			Slug:        "entertainment",
			Description: "Hiburan dan musik",
			Icon:        "music",
			IsActive:    true,
			SortOrder:   8,
		},
		{
			Name:        "Transportasi",
			Slug:        "transportasi",
			Description: "Sewa mobil dan transportasi",
			Icon:        "car",
			IsActive:    true,
			SortOrder:   9,
		},
		{
			Name:        "Lainnya",
			Slug:        "lainnya",
			Description: "Jasa pernikahan lainnya",
			Icon:        "more",
			IsActive:    true,
			SortOrder:   10,
		},
	}

	for _, category := range categories {
		var existingCategory models.Category
		if err := facades.Orm().Query().Where("slug", category.Slug).First(&existingCategory); err != nil {
			if err := facades.Orm().Query().Create(&category); err != nil {
				return err
			}
		}
	}

	return nil
}
