package models

import (
	"github.com/goravel/framework/database/orm"
)

type SystemSetting struct {
	orm.Model
	Key   string `json:"key" gorm:"not null;uniqueIndex"`
	Value string `json:"value"`
	Type  string `json:"type" gorm:"default:'string';check:type IN ('string', 'number', 'boolean', 'json')"`
}
