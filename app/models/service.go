package models

import (
	"github.com/goravel/framework/database/orm"
)

type Service struct {
	orm.Model
	VendorID      uint    `json:"vendor_id" gorm:"not null"`
	CategoryID    uint    `json:"category_id" gorm:"not null"`
	Name          string  `json:"name" gorm:"not null"`
	Description   string  `json:"description"`
	Price         float64 `json:"price" gorm:"not null"`
	PriceType     string  `json:"price_type" gorm:"default:'fixed';check:price_type IN ('fixed', 'hourly', 'daily', 'custom')"`
	MinPrice      float64 `json:"min_price"`
	MaxPrice      float64 `json:"max_price"`
	IsActive      bool    `json:"is_active" gorm:"default:true"`
	IsFeatured    bool    `json:"is_featured" gorm:"default:false"`
	Images        string  `json:"images"` // JSON array of image URLs
	Tags          string  `json:"tags"`   // JSON array of tags
	
	// Relations
	Vendor        VendorProfile `json:"vendor,omitempty" gorm:"foreignKey:VendorID"`
	Category      Category      `json:"category,omitempty" gorm:"foreignKey:CategoryID"`
	OrderItems    []OrderItem   `json:"order_items,omitempty" gorm:"foreignKey:ServiceID"`
	PackageItems  []PackageItem `json:"package_items,omitempty" gorm:"foreignKey:ServiceID"`
}
