package seeders

import (
	"goravel/app/models"

	"github.com/goravel/framework/facades"
)

type ModuleSettingSeeder struct{}

// Signature The name and signature of the seeder.
func (s *ModuleSettingSeeder) Signature() string {
	return "ModuleSettingSeeder"
}

// Run executes the seeder logic.
func (s *ModuleSettingSeeder) Run() error {
	modules := []models.ModuleSetting{
		{
			ModuleName: "subscription_vendor",
			IsEnabled:  true,
			Settings:   `{"free_plan_limit": 5, "premium_plan_price": 500000, "enterprise_plan_price": 1500000}`,
		},
		{
			ModuleName: "vendor_collaboration",
			IsEnabled:  true,
			Settings:   `{"max_collaborators": 5, "commission_split": 0.1}`,
		},
		{
			ModuleName: "chat_system",
			IsEnabled:  true,
			Settings:   `{"max_message_length": 1000, "file_upload_limit": 10485760}`,
		},
		{
			ModuleName: "wishlist",
			IsEnabled:  true,
			Settings:   `{"max_items": 50}`,
		},
		{
			ModuleName: "down_payment",
			IsEnabled:  true,
			Settings:   `{"min_dp_percentage": 0.3, "max_installments": 12}`,
		},
		{
			ModuleName: "promo_voucher",
			IsEnabled:  true,
			Settings:   `{"max_discount_percentage": 0.5, "voucher_expiry_days": 30}`,
		},
		{
			ModuleName: "ai_chatbot",
			IsEnabled:  false,
			Settings:   `{"provider": "openai", "model": "gpt-3.5-turbo"}`,
		},
		{
			ModuleName: "blog_faq",
			IsEnabled:  true,
			Settings:   `{"max_articles_per_page": 10}`,
		},
		{
			ModuleName: "rating_review",
			IsEnabled:  true,
			Settings:   `{"min_rating": 1, "max_rating": 5, "require_review": false}`,
		},
		{
			ModuleName: "payment_xendit",
			IsEnabled:  false,
			Settings:   `{"api_key": "", "webhook_token": ""}`,
		},
		{
			ModuleName: "payment_midtrans",
			IsEnabled:  false,
			Settings:   `{"server_key": "", "client_key": "", "is_production": false}`,
		},
		{
			ModuleName: "payment_manual",
			IsEnabled:  true,
			Settings:   `{"bank_accounts": []}`,
		},
		{
			ModuleName: "payment_cod",
			IsEnabled:  false,
			Settings:   `{"max_amount": 5000000}`,
		},
		{
			ModuleName: "seo_basic",
			IsEnabled:  true,
			Settings:   `{"auto_generate_meta": true}`,
		},
		{
			ModuleName: "seo_advanced",
			IsEnabled:  false,
			Settings:   `{"google_analytics_id": "", "google_search_console": ""}`,
		},
		{
			ModuleName: "seo_automation",
			IsEnabled:  false,
			Settings:   `{"auto_internal_linking": true, "auto_sitemap": true}`,
		},
	}

	for _, module := range modules {
		var existingModule models.ModuleSetting
		if err := facades.Orm().Query().Where("module_name", module.ModuleName).First(&existingModule); err != nil {
			if err := facades.Orm().Query().Create(&module); err != nil {
				return err
			}
		}
	}

	return nil
}
