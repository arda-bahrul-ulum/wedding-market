package models

import (
	"github.com/goravel/framework/database/orm"
)

type Portfolio struct {
	orm.Model
	VendorID    uint   `json:"vendor_id" gorm:"not null"`
	Title       string `json:"title" gorm:"not null"`
	Description string `json:"description"`
	ImageURL    string `json:"image_url" gorm:"not null"`
	ImageType   string `json:"image_type" gorm:"default:'image';check:image_type IN ('image', 'video')"`
	IsFeatured  bool   `json:"is_featured" gorm:"default:false"`
	SortOrder   int    `json:"sort_order" gorm:"default:0"`
	
	// Relations
	Vendor VendorProfile `json:"vendor,omitempty" gorm:"foreignKey:VendorID"`
}
