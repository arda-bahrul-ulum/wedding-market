package models

import (
	"time"

	"github.com/goravel/framework/database/orm"
)

type Order struct {
	orm.Model
	OrderNumber    string    `json:"order_number" gorm:"not null;uniqueIndex"`
	CustomerID     uint      `json:"customer_id" gorm:"not null"`
	VendorID       uint      `json:"vendor_id" gorm:"not null"`
	Status         string    `json:"status" gorm:"default:'pending';check:status IN ('pending', 'accepted', 'rejected', 'in_progress', 'completed', 'cancelled', 'refunded')"`
	TotalAmount    float64   `json:"total_amount" gorm:"not null"`
	Commission     float64   `json:"commission" gorm:"not null"`
	VendorAmount   float64   `json:"vendor_amount" gorm:"not null"`
	EventDate      time.Time `json:"event_date"`
	EventLocation  string    `json:"event_location"`
	Notes          string    `json:"notes"`
	PaymentStatus  string    `json:"payment_status" gorm:"default:'pending';check:payment_status IN ('pending', 'paid', 'partial', 'refunded')"`
	PaymentMethod  string    `json:"payment_method"`
	PaymentRef     string    `json:"payment_ref"`
	IsEscrow       bool      `json:"is_escrow" gorm:"default:true"`
	EscrowReleased bool      `json:"escrow_released" gorm:"default:false"`
	EscrowReleasedAt *time.Time `json:"escrow_released_at"`
	
	// Relations
	Customer   User        `json:"customer,omitempty" gorm:"foreignKey:CustomerID"`
	Vendor     VendorProfile `json:"vendor,omitempty" gorm:"foreignKey:VendorID"`
	Items      []OrderItem `json:"items,omitempty" gorm:"foreignKey:OrderID"`
	Payments   []Payment   `json:"payments,omitempty" gorm:"foreignKey:OrderID"`
	Reviews    []Review    `json:"reviews,omitempty" gorm:"foreignKey:OrderID"`
}
