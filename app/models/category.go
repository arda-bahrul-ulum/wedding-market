package models

import (
	"strings"

	"github.com/goravel/framework/database/orm"
)

type Category struct {
	orm.Model
	Name        string `json:"name" gorm:"not null;uniqueIndex;size:255"`
	Slug        string `json:"slug" gorm:"not null;uniqueIndex;size:255"`
	Description string `json:"description" gorm:"type:text"`
	Icon        string `json:"icon" gorm:"size:255"`
	IsActive    bool   `json:"is_active" gorm:"default:true"`
	SortOrder   int    `json:"sort_order" gorm:"default:0"`

	// Relations
	Services []Service `json:"services,omitempty" gorm:"foreignKey:CategoryID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL"`
}

// TableName returns the table name for Category model
func (Category) TableName() string {
	return "categories"
}

// GenerateSlug generates a slug from the category name
func (c *Category) GenerateSlug() {
	if c.Slug == "" && c.Name != "" {
		slug := strings.ToLower(c.Name)
		slug = strings.ReplaceAll(slug, " ", "-")
		slug = strings.ReplaceAll(slug, "_", "-")
		// Remove special characters (basic implementation)
		var result strings.Builder
		for _, r := range slug {
			if (r >= 'a' && r <= 'z') || (r >= '0' && r <= '9') || r == '-' {
				result.WriteRune(r)
			}
		}
		c.Slug = result.String()
	}
}

// IsAvailable checks if category is active and available
func (c *Category) IsAvailable() bool {
	return c.IsActive
}
