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
		// General Settings
		{
			Key:   "site_name",
			Value: "Wedding Dream",
			Type:  "string",
		},
		{
			Key:   "site_description",
			Value: "Platform pernikahan terpercaya",
			Type:  "string",
		},
		{
			Key:   "site_url",
			Value: "https://weddingcommerce.com",
			Type:  "string",
		},
		{
			Key:   "admin_email",
			Value: "admin@weddingcommerce.com",
			Type:  "string",
		},
		{
			Key:   "support_email",
			Value: "support@weddingcommerce.com",
			Type:  "string",
		},
		
		// Commission Settings
		{
			Key:   "commission_rate",
			Value: "5.00",
			Type:  "number",
		},
		{
			Key:   "minimum_commission",
			Value: "10000",
			Type:  "number",
		},
		{
			Key:   "maximum_commission",
			Value: "1000000",
			Type:  "number",
		},
		
		// Payment Settings
		{
			Key:   "payment_timeout",
			Value: "24",
			Type:  "number",
		},
		{
			Key:   "refund_period",
			Value: "7",
			Type:  "number",
		},
		{
			Key:   "escrow_period",
			Value: "3",
			Type:  "number",
		},
		
		// Subscription Settings
		{
			Key:   "free_plan_limit",
			Value: "5",
			Type:  "number",
		},
		{
			Key:   "premium_plan_price",
			Value: "500000",
			Type:  "number",
		},
		{
			Key:   "enterprise_plan_price",
			Value: "1500000",
			Type:  "number",
		},
		
		// Email Settings
		{
			Key:   "smtp_host",
			Value: "",
			Type:  "string",
		},
		{
			Key:   "smtp_port",
			Value: "587",
			Type:  "number",
		},
		{
			Key:   "smtp_username",
			Value: "",
			Type:  "string",
		},
		{
			Key:   "smtp_password",
			Value: "",
			Type:  "string",
		},
		{
			Key:   "smtp_encryption",
			Value: "tls",
			Type:  "string",
		},
		
		// SEO Settings
		{
			Key:   "meta_title",
			Value: "Wedding Dream - Platform Pernikahan Terpercaya",
			Type:  "string",
		},
		{
			Key:   "meta_description",
			Value: "Temukan vendor pernikahan terbaik dengan harga terjangkau",
			Type:  "string",
		},
		{
			Key:   "meta_keywords",
			Value: "wedding, pernikahan, vendor, venue, fotografer, makeup",
			Type:  "string",
		},
		
		// Security Settings
		{
			Key:   "max_login_attempts",
			Value: "5",
			Type:  "number",
		},
		{
			Key:   "lockout_duration",
			Value: "30",
			Type:  "number",
		},
		{
			Key:   "session_timeout",
			Value: "120",
			Type:  "number",
		},
		{
			Key:   "require_email_verification",
			Value: "true",
			Type:  "boolean",
		},
		
		// Notification Settings
		{
			Key:   "email_notifications",
			Value: "true",
			Type:  "boolean",
		},
		{
			Key:   "sms_notifications",
			Value: "false",
			Type:  "boolean",
		},
		{
			Key:   "push_notifications",
			Value: "true",
			Type:  "boolean",
		},
		
		// Feature Flags
		{
			Key:   "enable_registration",
			Value: "true",
			Type:  "boolean",
		},
		{
			Key:   "enable_vendor_registration",
			Value: "true",
			Type:  "boolean",
		},
		{
			Key:   "enable_reviews",
			Value: "true",
			Type:  "boolean",
		},
		{
			Key:   "enable_wishlist",
			Value: "true",
			Type:  "boolean",
		},
		{
			Key:   "enable_chat",
			Value: "true",
			Type:  "boolean",
		},
		{
			Key:   "enable_blog",
			Value: "true",
			Type:  "boolean",
		},
		{
			Key:   "enable_faq",
			Value: "true",
			Type:  "boolean",
		},
		{
			Key:   "enable_ai_chatbot",
			Value: "false",
			Type:  "boolean",
		},
		{
			Key:   "enable_vendor_collaboration",
			Value: "false",
			Type:  "boolean",
		},
		{
			Key:   "enable_dp_cicilan",
			Value: "false",
			Type:  "boolean",
		},
		{
			Key:   "enable_promo_voucher",
			Value: "false",
			Type:  "boolean",
		},
		
		// Payment Gateways
		{
			Key:   "enable_xendit",
			Value: "true",
			Type:  "boolean",
		},
		{
			Key:   "enable_midtrans",
			Value: "false",
			Type:  "boolean",
		},
		{
			Key:   "enable_manual_transfer",
			Value: "true",
			Type:  "boolean",
		},
		{
			Key:   "enable_cod",
			Value: "false",
			Type:  "boolean",
		},
		
		// SEO Modules
		{
			Key:   "enable_seo_basic",
			Value: "true",
			Type:  "boolean",
		},
		{
			Key:   "enable_seo_advanced",
			Value: "false",
			Type:  "boolean",
		},
		{
			Key:   "enable_seo_automation",
			Value: "false",
			Type:  "boolean",
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
