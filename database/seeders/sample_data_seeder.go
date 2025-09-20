package seeders

import (
	"time"

	"goravel/app/models"

	"github.com/goravel/framework/facades"
	"golang.org/x/crypto/bcrypt"
)

type SampleDataSeeder struct{}

// Signature The name and signature of the seeder.
func (s *SampleDataSeeder) Signature() string {
	return "SampleDataSeeder"
}

// Run executes the seeder logic.
func (s *SampleDataSeeder) Run() error {
	// Create sample users
	if err := s.createSampleUsers(); err != nil {
		return err
	}

	// Create sample vendors
	if err := s.createSampleVendors(); err != nil {
		return err
	}

	// Create sample services
	if err := s.createSampleServices(); err != nil {
		return err
	}

	// Create sample packages
	if err := s.createSamplePackages(); err != nil {
		return err
	}

	// Create sample orders
	if err := s.createSampleOrders(); err != nil {
		return err
	}

	// Create sample reviews
	if err := s.createSampleReviews(); err != nil {
		return err
	}

	// Create sample portfolios
	if err := s.createSamplePortfolios(); err != nil {
		return err
	}

	return nil
}

func (s *SampleDataSeeder) createSampleUsers() error {
	// Create sample customers
	customers := []models.User{
		{
			Name:     "John Doe",
			Email:    "john@example.com",
			Password: s.hashPassword("password123"),
			Phone:    "08123456789",
			Role:     "customer",
			IsActive: true,
		},
		{
			Name:     "Jane Smith",
			Email:    "jane@example.com",
			Password: s.hashPassword("password123"),
			Phone:    "08123456790",
			Role:     "customer",
			IsActive: true,
		},
		{
			Name:     "Mike Johnson",
			Email:    "mike@example.com",
			Password: s.hashPassword("password123"),
			Phone:    "08123456791",
			Role:     "customer",
			IsActive: true,
		},
	}

	for _, customer := range customers {
		var existingUser models.User
		if err := facades.Orm().Query().Where("email", customer.Email).First(&existingUser); err != nil {
			if err := facades.Orm().Query().Create(&customer); err != nil {
				return err
			}
		}
	}

	return nil
}

func (s *SampleDataSeeder) createSampleVendors() error {
	// Get first customer to use as vendor user
	var customer models.User
	if err := facades.Orm().Query().Where("role", "customer").First(&customer); err != nil {
		return err
	}

	// Update customer to vendor
	customer.Role = "vendor"
	if err := facades.Orm().Query().Save(&customer); err != nil {
		return err
	}

	// Create vendor profile
	vendorProfile := models.VendorProfile{
		UserID:          customer.ID,
		BusinessName:    "Elegant Wedding Services",
		BusinessType:    "wedding_organizer",
		Description:     "Penyedia jasa pernikahan lengkap dengan pengalaman 10 tahun",
		Address:         "Jl. Sudirman No. 123",
		City:            "Jakarta",
		Province:        "DKI Jakarta",
		PostalCode:      "12190",
		Latitude:        -6.2088,
		Longitude:       106.8456,
		Website:         "https://elegantwedding.com",
		Instagram:       "@elegantwedding",
		Whatsapp:        "08123456789",
		IsVerified:      true,
		IsActive:        true,
		SubscriptionPlan: "premium",
	}

	var existingVendor models.VendorProfile
	if err := facades.Orm().Query().Where("user_id", customer.ID).First(&existingVendor); err != nil {
		if err := facades.Orm().Query().Create(&vendorProfile); err != nil {
			return err
		}
	}

	// Create more sample vendors
	additionalVendors := []models.User{
		{
			Name:     "Sarah Makeup Artist",
			Email:    "sarah@makeup.com",
			Password: s.hashPassword("password123"),
			Phone:    "08123456792",
			Role:     "vendor",
			IsActive: true,
		},
		{
			Name:     "David Photographer",
			Email:    "david@photo.com",
			Password: s.hashPassword("password123"),
			Phone:    "08123456793",
			Role:     "vendor",
			IsActive: true,
		},
	}

	for _, vendor := range additionalVendors {
		var existingUser models.User
		if err := facades.Orm().Query().Where("email", vendor.Email).First(&existingUser); err != nil {
			if err := facades.Orm().Query().Create(&vendor); err != nil {
				return err
			}

			// Create vendor profile
			vendorProfile := models.VendorProfile{
				UserID:          vendor.ID,
				BusinessName:    vendor.Name + " Studio",
				BusinessType:    "personal",
				Description:     "Professional " + vendor.Name + " services",
				Address:         "Various locations in Jakarta",
				City:            "Jakarta",
				Province:        "DKI Jakarta",
				IsVerified:      true,
				IsActive:        true,
				SubscriptionPlan: "free",
			}

			if err := facades.Orm().Query().Create(&vendorProfile); err != nil {
				return err
			}
		}
	}

	return nil
}

func (s *SampleDataSeeder) createSampleServices() error {
	// Get categories
	var categories []models.Category
	if err := facades.Orm().Query().Get(&categories); err != nil {
		return err
	}

	// Get vendors
	var vendors []models.VendorProfile
	if err := facades.Orm().Query().Get(&vendors); err != nil {
		return err
	}

	if len(categories) == 0 || len(vendors) == 0 {
		return nil
	}

	services := []models.Service{
		{
			VendorID:    vendors[0].ID,
			CategoryID:  categories[0].ID, // Venue
			Name:        "Gedung Pernikahan Mewah",
			Description: "Gedung pernikahan dengan kapasitas 500 orang, dilengkapi AC, sound system, dan dekorasi dasar",
			Price:       15000000,
			PriceType:   "fixed",
			IsActive:    true,
			IsFeatured:  true,
			Images:      `["https://example.com/venue1.jpg", "https://example.com/venue2.jpg"]`,
			Tags:        `["gedung", "mewah", "kapasitas besar"]`,
		},
		{
			VendorID:    vendors[1].ID,
			CategoryID:  categories[1].ID, // MUA
			Name:        "Paket Make Up Pengantin",
			Description: "Make up lengkap untuk pengantin wanita dengan trial dan touch up",
			Price:       2500000,
			PriceType:   "fixed",
			IsActive:    true,
			IsFeatured:  true,
			Images:      `["https://example.com/mua1.jpg"]`,
			Tags:        `["makeup", "pengantin", "trial"]`,
		},
		{
			VendorID:    vendors[2].ID,
			CategoryID:  categories[3].ID, // Fotografer
			Name:        "Paket Foto Prewedding",
			Description: "Sesi foto prewedding 4 jam dengan 200 foto hasil edit",
			Price:       3500000,
			PriceType:   "fixed",
			IsActive:    true,
			IsFeatured:  false,
			Images:      `["https://example.com/photo1.jpg"]`,
			Tags:        `["foto", "prewedding", "edit"]`,
		},
	}

	for _, service := range services {
		var existingService models.Service
		if err := facades.Orm().Query().Where("name", service.Name).First(&existingService); err != nil {
			if err := facades.Orm().Query().Create(&service); err != nil {
				return err
			}
		}
	}

	return nil
}

func (s *SampleDataSeeder) createSamplePackages() error {
	// Get vendors
	var vendors []models.VendorProfile
	if err := facades.Orm().Query().Get(&vendors); err != nil {
		return err
	}

	if len(vendors) == 0 {
		return nil
	}

	packages := []models.Package{
		{
			VendorID:   vendors[0].ID,
			Name:       "Paket Pernikahan Lengkap",
			Description: "Paket pernikahan lengkap termasuk venue, catering, dekorasi, dan MC",
			Price:      50000000,
			IsActive:   true,
			IsFeatured: true,
			Images:     `["https://example.com/package1.jpg"]`,
			Tags:       `["lengkap", "paket", "all in one"]`,
		},
		{
			VendorID:   vendors[1].ID,
			Name:       "Paket Make Up & Hair",
			Description: "Paket make up dan hair styling untuk pengantin dan keluarga",
			Price:      5000000,
			IsActive:   true,
			IsFeatured: false,
			Images:     `["https://example.com/package2.jpg"]`,
			Tags:       `["makeup", "hair", "family"]`,
		},
	}

	for _, pkg := range packages {
		var existingPackage models.Package
		if err := facades.Orm().Query().Where("name", pkg.Name).First(&existingPackage); err != nil {
			if err := facades.Orm().Query().Create(&pkg); err != nil {
				return err
			}
		}
	}

	return nil
}

func (s *SampleDataSeeder) createSampleOrders() error {
	// Get customers and vendors
	var customers []models.User
	if err := facades.Orm().Query().Where("role", "customer").Get(&customers); err != nil {
		return err
	}

	var vendors []models.VendorProfile
	if err := facades.Orm().Query().Get(&vendors); err != nil {
		return err
	}

	if len(customers) == 0 || len(vendors) == 0 {
		return nil
	}

	// Create sample orders
	orders := []models.Order{
		{
			OrderNumber:   "WC20250101001",
			CustomerID:    customers[0].ID,
			VendorID:      vendors[0].ID,
			Status:        "completed",
			TotalAmount:   15000000,
			Commission:    750000,
			VendorAmount:  14250000,
			EventDate:     time.Now().AddDate(0, 1, 0),
			EventLocation: "Jakarta",
			Notes:         "Pernikahan di gedung mewah",
			PaymentStatus: "paid",
			PaymentMethod: "bank_transfer",
			IsEscrow:      true,
			EscrowReleased: true,
		},
		{
			OrderNumber:   "WC20250101002",
			CustomerID:    customers[1].ID,
			VendorID:      vendors[1].ID,
			Status:        "in_progress",
			TotalAmount:   2500000,
			Commission:    125000,
			VendorAmount:  2375000,
			EventDate:     time.Now().AddDate(0, 0, 15),
			EventLocation: "Bandung",
			Notes:         "Make up untuk prewedding",
			PaymentStatus: "paid",
			PaymentMethod: "credit_card",
			IsEscrow:      true,
			EscrowReleased: false,
		},
	}

	for _, order := range orders {
		var existingOrder models.Order
		if err := facades.Orm().Query().Where("order_number", order.OrderNumber).First(&existingOrder); err != nil {
			if err := facades.Orm().Query().Create(&order); err != nil {
				return err
			}
		}
	}

	return nil
}

func (s *SampleDataSeeder) createSampleReviews() error {
	// Get orders
	var orders []models.Order
	if err := facades.Orm().Query().Where("status", "completed").Get(&orders); err != nil {
		return err
	}

	if len(orders) == 0 {
		return nil
	}

	reviews := []models.Review{
		{
			OrderID:    orders[0].ID,
			CustomerID: orders[0].CustomerID,
			VendorID:   orders[0].VendorID,
			Rating:     5,
			Comment:    "Pelayanan sangat memuaskan, venue bagus dan staff ramah",
			Images:     `["https://example.com/review1.jpg"]`,
			IsHighlighted: true,
		},
	}

	for _, review := range reviews {
		var existingReview models.Review
		if err := facades.Orm().Query().Where("order_id", review.OrderID).First(&existingReview); err != nil {
			if err := facades.Orm().Query().Create(&review); err != nil {
				return err
			}
		}
	}

	return nil
}

func (s *SampleDataSeeder) createSamplePortfolios() error {
	// Get vendors
	var vendors []models.VendorProfile
	if err := facades.Orm().Query().Get(&vendors); err != nil {
		return err
	}

	if len(vendors) == 0 {
		return nil
	}

	portfolios := []models.Portfolio{
		{
			VendorID:    vendors[0].ID,
			Title:       "Pernikahan Mewah di Gedung Ballroom",
			Description: "Dekorasi pernikahan dengan tema klasik mewah",
			ImageURL:    "https://example.com/portfolio1.jpg",
			ImageType:   "image",
			IsFeatured:  true,
			SortOrder:   1,
		},
		{
			VendorID:    vendors[1].ID,
			Title:       "Make Up Natural untuk Pengantin",
			Description: "Look natural dan fresh untuk pengantin",
			ImageURL:    "https://example.com/portfolio2.jpg",
			ImageType:   "image",
			IsFeatured:  true,
			SortOrder:   1,
		},
	}

	for _, portfolio := range portfolios {
		var existingPortfolio models.Portfolio
		if err := facades.Orm().Query().Where("title", portfolio.Title).First(&existingPortfolio); err != nil {
			if err := facades.Orm().Query().Create(&portfolio); err != nil {
				return err
			}
		}
	}

	return nil
}

func (s *SampleDataSeeder) hashPassword(password string) string {
	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	return string(hashedPassword)
}
