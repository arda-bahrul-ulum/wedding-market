package models

import (
	"github.com/goravel/framework/database/orm"
)

type Package struct {
	orm.Model
	VendorID    uint    `json:"vendor_id" gorm:"not null"`
	Name        string  `json:"name" gorm:"not null"`
	Description string  `json:"description"`
	Price       float64 `json:"price" gorm:"not null"`
	IsActive    bool    `json:"is_active" gorm:"default:true"`
	IsFeatured  bool    `json:"is_featured" gorm:"default:false"`
	Images      string  `json:"images"` // JSON array of image URLs
	Tags        string  `json:"tags"`   // JSON array of tags
	
	// Relations
	Vendor      VendorProfile `json:"vendor,omitempty" gorm:"foreignKey:VendorID"`
	Items       []PackageItem `json:"items,omitempty" gorm:"foreignKey:PackageID"`
	OrderItems  []OrderItem   `json:"order_items,omitempty" gorm:"foreignKey:PackageID"`
}
