package models

import (
	"github.com/goravel/framework/database/orm"
)

type OrderItem struct {
	orm.Model
	OrderID     uint    `json:"order_id" gorm:"not null"`
	ServiceID   *uint   `json:"service_id"`
	PackageID   *uint   `json:"package_id"`
	ItemType    string  `json:"item_type" gorm:"not null;check:item_type IN ('service', 'package')"`
	ItemName    string  `json:"item_name" gorm:"not null"`
	Quantity    int     `json:"quantity" gorm:"default:1"`
	Price       float64 `json:"price" gorm:"not null"`
	TotalPrice  float64 `json:"total_price" gorm:"not null"`
	
	// Relations
	Order   Order   `json:"order,omitempty" gorm:"foreignKey:OrderID"`
	Service *Service `json:"service,omitempty" gorm:"foreignKey:ServiceID"`
	Package *Package `json:"package,omitempty" gorm:"foreignKey:PackageID"`
}
