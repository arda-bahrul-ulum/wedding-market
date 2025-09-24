package models

import (
	"time"

	"github.com/goravel/framework/database/orm"
)

type User struct {
	orm.Model
	Name         string    `json:"name" gorm:"not null"`
	Email        string    `json:"email" gorm:"uniqueIndex;not null"`
	Password     string    `json:"-" gorm:"not null"`
	Phone        string    `json:"phone"`
	Avatar       string    `json:"avatar"`
	Role         string    `json:"role" gorm:"default:'customer';check:role IN ('customer', 'vendor', 'admin', 'super_user')"`
	IsActive     bool      `json:"is_active" gorm:"default:true"`
	EmailVerifiedAt *time.Time `json:"email_verified_at"`
	LastLoginAt  *time.Time `json:"last_login_at"`
	
	// Relations
	VendorProfile   *VendorProfile   `json:"vendor_profile,omitempty" gorm:"foreignKey:UserID"`
	CustomerProfile *CustomerProfile `json:"customer_profile,omitempty" gorm:"foreignKey:UserID"`
	Orders          []Order          `json:"orders,omitempty" gorm:"foreignKey:CustomerID"`
	Reviews         []Review         `json:"reviews,omitempty" gorm:"foreignKey:CustomerID"`
	Wishlists       []Wishlist       `json:"wishlists,omitempty" gorm:"foreignKey:CustomerID"`
	Chats           []Chat           `json:"chats,omitempty" gorm:"foreignKey:UserID"`
}