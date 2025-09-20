package seeders

import (
	"fmt"
	"time"

	"goravel/app/models"

	"github.com/goravel/framework/facades"
)

type OrderSampleSeeder struct{}

// Signature The name and signature of the seeder.
func (s *OrderSampleSeeder) Signature() string {
	return "OrderSampleSeeder"
}

// Run executes the seeder logic.
func (s *OrderSampleSeeder) Run() error {
	facades.Log().Info("Starting OrderSampleSeeder...")
	
	// Get existing customers
	var customers []models.User
	if err := facades.Orm().Query().Where("role", "customer").Get(&customers); err != nil {
		facades.Log().Error("Failed to get customers: " + err.Error())
		return err
	}
	facades.Log().Info(fmt.Sprintf("Found %d customers", len(customers)))

	// Get existing vendors
	var vendors []models.VendorProfile
	if err := facades.Orm().Query().Get(&vendors); err != nil {
		facades.Log().Error("Failed to get vendors: " + err.Error())
		return err
	}
	facades.Log().Info(fmt.Sprintf("Found %d vendors", len(vendors)))

	// Get existing services
	var services []models.Service
	if err := facades.Orm().Query().Get(&services); err != nil {
		facades.Log().Error("Failed to get services: " + err.Error())
		return err
	}
	facades.Log().Info(fmt.Sprintf("Found %d services", len(services)))

	// Get existing packages
	var packages []models.Package
	if err := facades.Orm().Query().Get(&packages); err != nil {
		facades.Log().Error("Failed to get packages: " + err.Error())
		return err
	}
	facades.Log().Info(fmt.Sprintf("Found %d packages", len(packages)))

	if len(customers) == 0 || len(vendors) == 0 {
		facades.Log().Info("No customers or vendors found, skipping order creation")
		return nil
	}

	// Create sample orders
	orders := []models.Order{
		{
			OrderNumber:    "WC20250101001",
			CustomerID:     customers[0].ID,
			VendorID:       vendors[0].ID,
			Status:         "completed",
			TotalAmount:    1500000,
			Commission:     75000,
			VendorAmount:   1425000,
			EventDate:      time.Now().AddDate(0, 1, 0),
			EventLocation:  "Jakarta",
			Notes:          "Pernikahan di gedung mewah dengan tema klasik",
			PaymentStatus:  "paid",
			PaymentMethod:  "bank_transfer",
			IsEscrow:       true,
			EscrowReleased: true,
			EscrowReleasedAt: timePtr(time.Now().AddDate(0, 0, -5)),
		},
		{
			OrderNumber:    "WC20250101002",
			CustomerID:     customers[0].ID,
			VendorID:       vendors[0].ID,
			Status:         "in_progress",
			TotalAmount:    250000,
			Commission:     12500,
			VendorAmount:   237500,
			EventDate:      time.Now().AddDate(0, 0, 15),
			EventLocation:  "Bandung",
			Notes:          "Make up untuk prewedding di Bandung",
			PaymentStatus:  "paid",
			PaymentMethod:  "credit_card",
			IsEscrow:       true,
			EscrowReleased: false,
		},
		{
			OrderNumber:    "WC20250101003",
			CustomerID:     customers[0].ID,
			VendorID:       vendors[0].ID,
			Status:         "pending",
			TotalAmount:    350000,
			Commission:     17500,
			VendorAmount:   332500,
			EventDate:      time.Now().AddDate(0, 0, 30),
			EventLocation:  "Surabaya",
			Notes:          "Sesi foto prewedding di Surabaya",
			PaymentStatus:  "pending",
			PaymentMethod:  "",
			IsEscrow:       true,
			EscrowReleased: false,
		},
		{
			OrderNumber:    "WC20250101004",
			CustomerID:     customers[0].ID,
			VendorID:       vendors[0].ID,
			Status:         "accepted",
			TotalAmount:    800000,
			Commission:     40000,
			VendorAmount:   760000,
			EventDate:      time.Now().AddDate(0, 0, 45),
			EventLocation:  "Yogyakarta",
			Notes:          "Paket pernikahan lengkap di Yogyakarta",
			PaymentStatus:  "paid",
			PaymentMethod:  "bank_transfer",
			IsEscrow:       true,
			EscrowReleased: false,
		},
		{
			OrderNumber:    "WC20250101005",
			CustomerID:     customers[0].ID,
			VendorID:       vendors[0].ID,
			Status:         "cancelled",
			TotalAmount:    120000,
			Commission:     6000,
			VendorAmount:   114000,
			EventDate:      time.Now().AddDate(0, 0, -10),
			EventLocation:  "Jakarta",
			Notes:          "Dibatalkan karena perubahan jadwal",
			PaymentStatus:  "refunded",
			PaymentMethod:  "credit_card",
			IsEscrow:       true,
			EscrowReleased: false,
		},
		{
			OrderNumber:    "WC20250101006",
			CustomerID:     customers[0].ID,
			VendorID:       vendors[0].ID,
			Status:         "completed",
			TotalAmount:    450000,
			Commission:     22500,
			VendorAmount:   427500,
			EventDate:      time.Now().AddDate(0, 0, -20),
			EventLocation:  "Bali",
			Notes:          "Foto prewedding di Bali dengan tema pantai",
			PaymentStatus:  "paid",
			PaymentMethod:  "bank_transfer",
			IsEscrow:       true,
			EscrowReleased: true,
			EscrowReleasedAt: timePtr(time.Now().AddDate(0, 0, -15)),
		},
		{
			OrderNumber:    "WC20250101007",
			CustomerID:     customers[0].ID,
			VendorID:       vendors[0].ID,
			Status:         "rejected",
			TotalAmount:    2000000,
			Commission:     100000,
			VendorAmount:   1900000,
			EventDate:      time.Now().AddDate(0, 0, 60),
			EventLocation:  "Jakarta",
			Notes:          "Ditolak karena konflik jadwal",
			PaymentStatus:  "refunded",
			PaymentMethod:  "bank_transfer",
			IsEscrow:       true,
			EscrowReleased: false,
		},
		{
			OrderNumber:    "WC20250101008",
			CustomerID:     customers[0].ID,
			VendorID:       vendors[0].ID,
			Status:         "in_progress",
			TotalAmount:    180000,
			Commission:     9000,
			VendorAmount:   171000,
			EventDate:      time.Now().AddDate(0, 0, 7),
			EventLocation:  "Jakarta",
			Notes:          "Make up untuk acara engagement",
			PaymentStatus:  "paid",
			PaymentMethod:  "credit_card",
			IsEscrow:       true,
			EscrowReleased: false,
		},
	}

	// Create orders
	for _, order := range orders {
		if err := facades.Orm().Query().Create(&order); err != nil {
			facades.Log().Error("Failed to create order: " + err.Error())
			continue
		}
		facades.Log().Info("Created order: " + order.OrderNumber)

		// Create order items for each order
		if err := s.createOrderItems(order.ID, services, packages); err != nil {
			facades.Log().Error("Failed to create order items: " + err.Error())
		}
	}

	return nil
}

func (s *OrderSampleSeeder) createOrderItems(orderID uint, services []models.Service, packages []models.Package) error {
	// Create order items based on order
	orderItems := []models.OrderItem{}

	// For order WC20250101001 (completed wedding organizer)
	if orderID == 1 && len(services) > 0 {
		orderItems = append(orderItems, models.OrderItem{
			OrderID:    orderID,
			ServiceID:  &services[0].ID,
			ItemType:   "service",
			ItemName:   services[0].Name,
			Quantity:   1,
			Price:      services[0].Price,
			TotalPrice: services[0].Price,
		})
	}

	// For order WC20250101002 (makeup service)
	if orderID == 2 && len(services) > 1 {
		orderItems = append(orderItems, models.OrderItem{
			OrderID:    orderID,
			ServiceID:  &services[1].ID,
			ItemType:   "service",
			ItemName:   services[1].Name,
			Quantity:   1,
			Price:      services[1].Price,
			TotalPrice: services[1].Price,
		})
	}

	// For order WC20250101003 (photography service)
	if orderID == 3 && len(services) > 2 {
		orderItems = append(orderItems, models.OrderItem{
			OrderID:    orderID,
			ServiceID:  &services[2].ID,
			ItemType:   "service",
			ItemName:   services[2].Name,
			Quantity:   1,
			Price:      services[2].Price,
			TotalPrice: services[2].Price,
		})
	}

	// For order WC20250101004 (package)
	if orderID == 4 && len(packages) > 0 {
		orderItems = append(orderItems, models.OrderItem{
			OrderID:    orderID,
			PackageID:  &packages[0].ID,
			ItemType:   "package",
			ItemName:   packages[0].Name,
			Quantity:   1,
			Price:      packages[0].Price,
			TotalPrice: packages[0].Price,
		})
	}

	// For order WC20250101005 (makeup service - cancelled)
	if orderID == 5 && len(services) > 1 {
		orderItems = append(orderItems, models.OrderItem{
			OrderID:    orderID,
			ServiceID:  &services[1].ID,
			ItemType:   "service",
			ItemName:   services[1].Name,
			Quantity:   1,
			Price:      services[1].Price,
			TotalPrice: services[1].Price,
		})
	}

	// For order WC20250101006 (photography service - completed)
	if orderID == 6 && len(services) > 2 {
		orderItems = append(orderItems, models.OrderItem{
			OrderID:    orderID,
			ServiceID:  &services[2].ID,
			ItemType:   "service",
			ItemName:   services[2].Name,
			Quantity:   1,
			Price:      services[2].Price,
			TotalPrice: services[2].Price,
		})
	}

	// For order WC20250101007 (package - rejected)
	if orderID == 7 && len(packages) > 0 {
		orderItems = append(orderItems, models.OrderItem{
			OrderID:    orderID,
			PackageID:  &packages[0].ID,
			ItemType:   "package",
			ItemName:   packages[0].Name,
			Quantity:   1,
			Price:      packages[0].Price,
			TotalPrice: packages[0].Price,
		})
	}

	// For order WC20250101008 (makeup service - in progress)
	if orderID == 8 && len(services) > 1 {
		orderItems = append(orderItems, models.OrderItem{
			OrderID:    orderID,
			ServiceID:  &services[1].ID,
			ItemType:   "service",
			ItemName:   services[1].Name,
			Quantity:   1,
			Price:      services[1].Price,
			TotalPrice: services[1].Price,
		})
	}

	// Create order items
	for _, item := range orderItems {
		if err := facades.Orm().Query().Create(&item); err != nil {
			facades.Log().Error("Failed to create order item: " + err.Error())
		}
	}

	return nil
}

func timePtr(t time.Time) *time.Time {
	return &t
}
