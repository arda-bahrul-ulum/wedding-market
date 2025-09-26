package models

import (
	"time"

	"github.com/goravel/framework/database/orm"
)

const (
	GenderMale   = "male"
	GenderFemale = "female"
	GenderOther  = "other"
)

type CustomerProfile struct {
	orm.Model
	UserID     uint       `json:"user_id" gorm:"not null;uniqueIndex"`
	FullName   string     `json:"full_name" gorm:"not null;size:255"`
	Phone      *string    `json:"phone" gorm:"size:20"`
	Address    *string    `json:"address" gorm:"type:text"`
	City       *string    `json:"city" gorm:"size:100"`
	Province   *string    `json:"province" gorm:"size:100"`
	PostalCode *string    `json:"postal_code" gorm:"size:20"`
	BirthDate  *time.Time `json:"birth_date"`
	Gender     *string    `json:"gender" gorm:"size:10;check:gender IN ('male', 'female', 'other')"`
	Bio        *string    `json:"bio" gorm:"type:text"`
	Avatar     *string    `json:"avatar" gorm:"size:500"`
	IsActive   bool       `json:"is_active" gorm:"default:true"`

	// Relations
	User User `json:"user,omitempty" gorm:"foreignKey:UserID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
}

// TableName returns the table name for CustomerProfile model
func (CustomerProfile) TableName() string {
	return "customer_profiles"
}

// IsMale checks if customer is male
func (c *CustomerProfile) IsMale() bool {
	return c.Gender != nil && *c.Gender == GenderMale
}

// IsFemale checks if customer is female
func (c *CustomerProfile) IsFemale() bool {
	return c.Gender != nil && *c.Gender == GenderFemale
}

// GetAge calculates and returns customer's age
func (c *CustomerProfile) GetAge() int {
	if c.BirthDate == nil {
		return 0
	}
	now := time.Now()
	age := now.Year() - c.BirthDate.Year()
	if now.Month() < c.BirthDate.Month() || (now.Month() == c.BirthDate.Month() && now.Day() < c.BirthDate.Day()) {
		age--
	}
	return age
}

// HasCompleteProfile checks if customer has completed their profile
func (c *CustomerProfile) HasCompleteProfile() bool {
	return c.Phone != nil && c.Address != nil && c.City != nil && c.Province != nil && c.BirthDate != nil
}
