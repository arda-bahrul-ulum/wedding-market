package seeders

import (
	"goravel/app/models"

	"github.com/goravel/framework/facades"
)

type VendorSeeder struct{}

// Signature The name and signature of the seeder.
func (s *VendorSeeder) Signature() string {
	return "VendorSeeder"
}

// Run executes the seeder logic.
func (s *VendorSeeder) Run() error {
	// Create sample users first
	users := []models.User{
		{
			Name:     "John Doe",
			Email:    "john@example.com",
			Password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password
			Role:     "vendor",
			IsActive: true,
		},
		{
			Name:     "Jane Smith",
			Email:    "jane@example.com",
			Password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password
			Role:     "vendor",
			IsActive: true,
		},
		{
			Name:     "Mike Johnson",
			Email:    "mike@example.com",
			Password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password
			Role:     "vendor",
			IsActive: true,
		},
		{
			Name:     "Sarah Wilson",
			Email:    "sarah@example.com",
			Password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password
			Role:     "vendor",
			IsActive: true,
		},
		{
			Name:     "David Brown",
			Email:    "david@example.com",
			Password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password
			Role:     "vendor",
			IsActive: true,
		},
	}

	// Create users
	for _, user := range users {
		var existingUser models.User
		if err := facades.Orm().Query().Where("email", user.Email).First(&existingUser); err != nil {
			if err := facades.Orm().Query().Create(&user); err != nil {
				facades.Log().Error("Failed to create user: " + err.Error())
				continue
			}
		}
	}

	// Get created users
	var createdUsers []models.User
	facades.Orm().Query().Where("role", "vendor").Get(&createdUsers)

	// Create vendor profiles
	vendorProfiles := []models.VendorProfile{
		{
			UserID:          createdUsers[0].ID,
			BusinessName:    "Wedding Dreams Studio",
			BusinessType:    "company",
			Description:     "Studio fotografi pernikahan profesional dengan pengalaman 10 tahun. Spesialisasi dalam foto pre-wedding, wedding day, dan post-wedding.",
			Address:         "Jl. Sudirman No. 123",
			City:            "Jakarta",
			Province:        "DKI Jakarta",
			PostalCode:      "12190",
			Latitude:        -6.2088,
			Longitude:       106.8456,
			Website:         "https://weddingdreams.com",
			Instagram:       "@weddingdreams",
			Whatsapp:        "08123456789",
			IsVerified:      true,
			IsActive:        true,
			SubscriptionPlan: "premium",
		},
		{
			UserID:          createdUsers[1].ID,
			BusinessName:    "Elegant Makeup Artistry",
			BusinessType:    "personal",
			Description:     "Makeup artist profesional dengan sertifikasi internasional. Spesialisasi dalam bridal makeup dan special event makeup.",
			Address:         "Jl. Thamrin No. 456",
			City:            "Jakarta",
			Province:        "DKI Jakarta",
			PostalCode:      "10350",
			Latitude:        -6.1944,
			Longitude:       106.8229,
			Website:         "https://elegantmakeup.com",
			Instagram:       "@elegantmakeup",
			Whatsapp:        "08123456790",
			IsVerified:      true,
			IsActive:        true,
			SubscriptionPlan: "free",
		},
		{
			UserID:          createdUsers[2].ID,
			BusinessName:    "Garden Wedding Venue",
			BusinessType:    "company",
			Description:     "Venue pernikahan outdoor dengan taman yang indah dan fasilitas lengkap. Kapasitas hingga 500 tamu.",
			Address:         "Jl. Raya Bogor No. 789",
			City:            "Depok",
			Province:        "Jawa Barat",
			PostalCode:      "16431",
			Latitude:        -6.4025,
			Longitude:       106.7942,
			Website:         "https://gardenwedding.com",
			Instagram:       "@gardenwedding",
			Whatsapp:        "08123456791",
			IsVerified:      true,
			IsActive:        true,
			SubscriptionPlan: "enterprise",
		},
		{
			UserID:          createdUsers[3].ID,
			BusinessName:    "Floral Decorations",
			BusinessType:    "personal",
			Description:     "Jasa dekorasi bunga dan dekorasi pernikahan dengan desain yang elegan dan modern. Menggunakan bunga segar berkualitas tinggi.",
			Address:         "Jl. Gatot Subroto No. 321",
			City:            "Bandung",
			Province:        "Jawa Barat",
			PostalCode:      "40112",
			Latitude:        -6.9175,
			Longitude:       107.6191,
			Website:         "https://floraldecor.com",
			Instagram:       "@floraldecor",
			Whatsapp:        "08123456792",
			IsVerified:      false,
			IsActive:        true,
			SubscriptionPlan: "free",
		},
		{
			UserID:          createdUsers[4].ID,
			BusinessName:    "Catering Delight",
			BusinessType:    "company",
			Description:     "Catering pernikahan dengan menu tradisional dan internasional. Melayani berbagai paket pernikahan dengan harga terjangkau.",
			Address:         "Jl. Pahlawan No. 654",
			City:            "Surabaya",
			Province:        "Jawa Timur",
			PostalCode:      "60275",
			Latitude:        -7.2575,
			Longitude:       112.7521,
			Website:         "https://cateringdelight.com",
			Instagram:       "@cateringdelight",
			Whatsapp:        "08123456793",
			IsVerified:      true,
			IsActive:        true,
			SubscriptionPlan: "premium",
		},
	}

	// Create vendor profiles
	for i, profile := range vendorProfiles {
		if i < len(createdUsers) {
			profile.UserID = createdUsers[i].ID
			var existingProfile models.VendorProfile
			if err := facades.Orm().Query().Where("user_id", profile.UserID).First(&existingProfile); err != nil {
				if err := facades.Orm().Query().Create(&profile); err != nil {
					facades.Log().Error("Failed to create vendor profile: " + err.Error())
				} else {
					facades.Log().Info("Created vendor profile for user: " + createdUsers[i].Email)
				}
			}
		}
	}

	return nil
}
