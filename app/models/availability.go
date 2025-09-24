package models

import (
	"time"

	"github.com/goravel/framework/database/orm"
)

type Availability struct {
	orm.Model
	VendorID    uint      `json:"vendor_id" gorm:"not null"`
	Date        time.Time `json:"date" gorm:"not null"`
	StartTime   string    `json:"start_time"`
	EndTime     string    `json:"end_time"`
	IsAvailable bool      `json:"is_available" gorm:"default:true"`
	MaxBookings int       `json:"max_bookings" gorm:"default:1"`
	CurrentBookings int   `json:"current_bookings" gorm:"default:0"`
	
	// Relations
	Vendor VendorProfile `json:"vendor,omitempty" gorm:"foreignKey:VendorID"`
}
