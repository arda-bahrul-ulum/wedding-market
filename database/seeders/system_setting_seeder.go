package seeders

import (
	"goravel/app/models"

	"github.com/goravel/framework/facades"
)

type SystemSettingSeeder struct{}

// Signature The name and signature of the seeder.
func (s *SystemSettingSeeder) Signature() string {
	return "SystemSettingSeeder"
}

// Run executes the seeder logic.
func (s *SystemSettingSeeder) Run() error {
	settings := []models.SystemSetting{
		{
			Key:   "site_name",
			Value: "Wedding Commerce",
			Type:  "string",
		},
		{
			Key:   "site_description",
			Value: "Platform marketplace jasa pernikahan terlengkap di Indonesia",
			Type:  "string",
		},
		{
			Key:   "commission_rate",
			Value: "0.05",
			Type:  "number",
		},
		{
			Key:   "min_order_amount",
			Value: "100000",
			Type:  "number",
		},
		{
			Key:   "max_order_amount",
			Value: "100000000",
			Type:  "number",
		},
		{
			Key:   "escrow_duration_days",
			Value: "7",
			Type:  "number",
		},
		{
			Key:   "auto_approve_vendor",
			Value: "false",
			Type:  "boolean",
		},
		{
			Key:   "require_vendor_verification",
			Value: "true",
			Type:  "boolean",
		},
		{
			Key:   "max_upload_size_mb",
			Value: "10",
			Type:  "number",
		},
		{
			Key:   "allowed_file_types",
			Value: `["jpg", "jpeg", "png", "gif", "mp4", "mov", "pdf", "doc", "docx"]`,
			Type:  "json",
		},
		{
			Key:   "contact_email",
			Value: "support@weddingcommerce.com",
			Type:  "string",
		},
		{
			Key:   "contact_phone",
			Value: "+6281234567890",
			Type:  "string",
		},
		{
			Key:   "contact_address",
			Value: "Jakarta, Indonesia",
			Type:  "string",
		},
		{
			Key:   "social_media",
			Value: `{"instagram": "@weddingcommerce", "facebook": "WeddingCommerce", "twitter": "@weddingcommerce"}`,
			Type:  "json",
		},
		{
			Key:   "maintenance_mode",
			Value: "false",
			Type:  "boolean",
		},
		{
			Key:   "maintenance_message",
			Value: "Website sedang dalam perawatan. Mohon maaf atas ketidaknyamanan ini.",
			Type:  "string",
		},
	}

	for _, setting := range settings {
		var existingSetting models.SystemSetting
		if err := facades.Orm().Query().Where("key", setting.Key).First(&existingSetting); err != nil {
			if err := facades.Orm().Query().Create(&setting); err != nil {
				return err
			}
		}
	}

	return nil
}
