package models

import (
	"time"

	"github.com/goravel/framework/database/orm"
)

type Review struct {
	orm.Model
	OrderID     uint    `json:"order_id" gorm:"not null"`
	CustomerID  uint    `json:"customer_id" gorm:"not null"`
	VendorID    uint    `json:"vendor_id" gorm:"not null"`
	Rating      int     `json:"rating" gorm:"not null;check:rating >= 1 AND rating <= 5"`
	Comment     string  `json:"comment"`
	Images      string  `json:"images"` // JSON array of image URLs
	IsHighlighted bool  `json:"is_highlighted" gorm:"default:false"`
	VendorReply string  `json:"vendor_reply"`
	RepliedAt   *time.Time `json:"replied_at"`
	
	// Relations
	Order    Order         `json:"order,omitempty" gorm:"foreignKey:OrderID"`
	Customer User          `json:"customer,omitempty" gorm:"foreignKey:CustomerID"`
	Vendor   VendorProfile `json:"vendor,omitempty" gorm:"foreignKey:VendorID"`
}
