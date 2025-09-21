package models

import (
	"time"
)

type CustomerProfile struct {
	ID         uint      `json:"id" orm:"id"`
	UserID     uint      `json:"user_id" orm:"user_id"`
	FullName   string    `json:"full_name" orm:"full_name"`
	Phone      *string   `json:"phone" orm:"phone"`
	Address    *string   `json:"address" orm:"address"`
	City       *string   `json:"city" orm:"city"`
	Province   *string   `json:"province" orm:"province"`
	PostalCode *string   `json:"postal_code" orm:"postal_code"`
	BirthDate  *time.Time `json:"birth_date" orm:"birth_date"`
	Gender     *string   `json:"gender" orm:"gender"`
	Bio        *string   `json:"bio" orm:"bio"`
	Avatar     *string   `json:"avatar" orm:"avatar"`
	IsActive   bool      `json:"is_active" orm:"is_active"`
	CreatedAt  time.Time `json:"created_at" orm:"created_at"`
	UpdatedAt  time.Time `json:"updated_at" orm:"updated_at"`

	// Relationships
	User *User `json:"user,omitempty" orm:"belongs_to:user_id"`
}

func (CustomerProfile) TableName() string {
	return "customer_profiles"
}

func (c *CustomerProfile) Fill() {
	c.IsActive = true
}
