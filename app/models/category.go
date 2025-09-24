package models

import (
	"github.com/goravel/framework/database/orm"
)

type Category struct {
	orm.Model
	Name        string `json:"name" gorm:"not null;uniqueIndex"`
	Slug        string `json:"slug" gorm:"not null;uniqueIndex"`
	Description string `json:"description"`
	Icon        string `json:"icon"`
	IsActive    bool   `json:"is_active" gorm:"default:true"`
	SortOrder   int    `json:"sort_order" gorm:"default:0"`
	
	// Relations
	Services []Service `json:"services,omitempty" gorm:"foreignKey:CategoryID"`
}
