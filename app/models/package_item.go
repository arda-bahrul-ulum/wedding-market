package models

import (
	"github.com/goravel/framework/database/orm"
)

type PackageItem struct {
	orm.Model
	PackageID uint    `json:"package_id" gorm:"not null"`
	ServiceID uint    `json:"service_id" gorm:"not null"`
	Quantity  int     `json:"quantity" gorm:"default:1"`
	Price     float64 `json:"price"` // Override price for this package
	
	// Relations
	Package Package `json:"package,omitempty" gorm:"foreignKey:PackageID"`
	Service Service `json:"service,omitempty" gorm:"foreignKey:ServiceID"`
}
