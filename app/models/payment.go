package models

import (
	"time"

	"github.com/goravel/framework/database/orm"
)

type Payment struct {
	orm.Model
	OrderID         uint    `json:"order_id" gorm:"not null"`
	Amount          float64 `json:"amount" gorm:"not null"`
	PaymentMethod   string  `json:"payment_method" gorm:"not null"`
	PaymentGateway  string  `json:"payment_gateway"`
	TransactionID   string  `json:"transaction_id"`
	Status          string  `json:"status" gorm:"default:'pending';check:status IN ('pending', 'success', 'failed', 'cancelled', 'refunded')"`
	GatewayResponse string  `json:"gateway_response"` // JSON response from payment gateway
	PaidAt          *time.Time `json:"paid_at"`
	
	// Relations
	Order Order `json:"order,omitempty" gorm:"foreignKey:OrderID"`
}
