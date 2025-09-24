package models

import (
	"github.com/goravel/framework/database/orm"
)

type Chat struct {
	orm.Model
	OrderID     uint   `json:"order_id" gorm:"not null"`
	UserID      uint   `json:"user_id" gorm:"not null"`
	Message     string `json:"message" gorm:"not null"`
	MessageType string `json:"message_type" gorm:"default:'text';check:message_type IN ('text', 'image', 'file')"`
	IsRead      bool   `json:"is_read" gorm:"default:false"`
	
	// Relations
	Order Order `json:"order,omitempty" gorm:"foreignKey:OrderID"`
	User  User  `json:"user,omitempty" gorm:"foreignKey:UserID"`
}
