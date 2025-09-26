package models

import (
	"time"

	"github.com/goravel/framework/database/orm"
)

const (
	RoleCustomer  = "customer"
	RoleVendor    = "vendor"
	RoleAdmin     = "admin"
	RoleSuperUser = "super_user"
)

type User struct {
	orm.Model
	Name            string     `json:"name" gorm:"not null;size:255"`
	Email           string     `json:"email" gorm:"uniqueIndex;not null;size:255"`
	Password        string     `json:"-" gorm:"not null;size:255"`
	Phone           string     `json:"phone" gorm:"size:20"`
	Avatar          string     `json:"avatar" gorm:"size:500"`
	Role            string     `json:"role" gorm:"default:'customer';size:20;check:role IN ('customer', 'vendor', 'admin', 'super_user')"`
	IsActive        bool       `json:"is_active" gorm:"default:true"`
	EmailVerifiedAt *time.Time `json:"email_verified_at"`
	LastLoginAt     *time.Time `json:"last_login_at"`

	// Relations
	VendorProfile   *VendorProfile   `json:"vendor_profile,omitempty" gorm:"foreignKey:UserID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	CustomerProfile *CustomerProfile `json:"customer_profile,omitempty" gorm:"foreignKey:UserID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	Orders          []Order          `json:"orders,omitempty" gorm:"foreignKey:CustomerID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL"`
	Reviews         []Review         `json:"reviews,omitempty" gorm:"foreignKey:CustomerID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL"`
	Wishlists       []Wishlist       `json:"wishlists,omitempty" gorm:"foreignKey:CustomerID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	Chats           []Chat           `json:"chats,omitempty" gorm:"foreignKey:UserID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
}

// TableName returns the table name for User model
func (User) TableName() string {
	return "users"
}

// IsCustomer checks if user is a customer
func (u *User) IsCustomer() bool {
	return u.Role == RoleCustomer
}

// IsVendor checks if user is a vendor
func (u *User) IsVendor() bool {
	return u.Role == RoleVendor
}

// IsAdmin checks if user is an admin
func (u *User) IsAdmin() bool {
	return u.Role == RoleAdmin
}

// IsSuperUser checks if user is a super user
func (u *User) IsSuperUser() bool {
	return u.Role == RoleSuperUser
}

// HasRole checks if user has specific role
func (u *User) HasRole(role string) bool {
	return u.Role == role
}

// HasAnyRole checks if user has any of the specified roles
func (u *User) HasAnyRole(roles ...string) bool {
	for _, role := range roles {
		if u.Role == role {
			return true
		}
	}
	return false
}