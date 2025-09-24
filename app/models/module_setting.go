package models

import (
	"github.com/goravel/framework/database/orm"
)

type ModuleSetting struct {
	orm.Model
	ModuleName string `json:"module_name" gorm:"not null;uniqueIndex"`
	IsEnabled  bool   `json:"is_enabled" gorm:"default:true"`
	Settings   string `json:"settings"` // JSON configuration
}
