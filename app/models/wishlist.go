package models

import (
	"github.com/goravel/framework/database/orm"
)

type Wishlist struct {
	orm.Model
	CustomerID uint `json:"customer_id" gorm:"not null"`
	ServiceID  *uint `json:"service_id"`
	PackageID  *uint `json:"package_id"`
	ItemType   string `json:"item_type" gorm:"not null;check:item_type IN ('service', 'package')"`
	
	// Relations
	Customer User     `json:"customer,omitempty" gorm:"foreignKey:CustomerID"`
	Service  *Service `json:"service,omitempty" gorm:"foreignKey:ServiceID"`
	Package  *Package `json:"package,omitempty" gorm:"foreignKey:PackageID"`
}
