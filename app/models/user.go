package models

import (
	"time"

	"github.com/goravel/framework/database/orm"
)

type User struct {
	orm.Model
	Name         string    `json:"name" gorm:"not null"`
	Email        string    `json:"email" gorm:"uniqueIndex;not null"`
	Password     string    `json:"-" gorm:"not null"`
	Phone        string    `json:"phone"`
	Avatar       string    `json:"avatar"`
	Role         string    `json:"role" gorm:"default:'customer';check:role IN ('customer', 'vendor', 'admin', 'super_user')"`
	IsActive     bool      `json:"is_active" gorm:"default:true"`
	EmailVerifiedAt *time.Time `json:"email_verified_at"`
	LastLoginAt  *time.Time `json:"last_login_at"`
	
	// Relations
	VendorProfile   *VendorProfile   `json:"vendor_profile,omitempty" gorm:"foreignKey:UserID"`
	CustomerProfile *CustomerProfile `json:"customer_profile,omitempty" gorm:"foreignKey:UserID"`
	Orders          []Order          `json:"orders,omitempty" gorm:"foreignKey:CustomerID"`
	Reviews         []Review         `json:"reviews,omitempty" gorm:"foreignKey:CustomerID"`
	Wishlists       []Wishlist       `json:"wishlists,omitempty" gorm:"foreignKey:CustomerID"`
	Chats           []Chat           `json:"chats,omitempty" gorm:"foreignKey:UserID"`
}

type VendorProfile struct {
	orm.Model
	UserID          uint   `json:"user_id" gorm:"not null;uniqueIndex"`
	BusinessName    string `json:"business_name" gorm:"not null"`
	BusinessType    string `json:"business_type" gorm:"not null;check:business_type IN ('personal', 'company', 'wedding_organizer')"`
	Description     string `json:"description"`
	Address         string `json:"address"`
	City            string `json:"city"`
	Province        string `json:"province"`
	PostalCode      string `json:"postal_code"`
	Latitude        float64 `json:"latitude"`
	Longitude       float64 `json:"longitude"`
	Website         string `json:"website"`
	Instagram       string `json:"instagram"`
	Whatsapp        string `json:"whatsapp"`
	IsVerified      bool   `json:"is_verified" gorm:"default:false"`
	IsActive        bool   `json:"is_active" gorm:"default:true"`
	SubscriptionPlan string `json:"subscription_plan" gorm:"default:'free';check:subscription_plan IN ('free', 'premium', 'enterprise')"`
	SubscriptionExpiresAt *time.Time `json:"subscription_expires_at"`
	
	// Relations
	User        User         `json:"user,omitempty" gorm:"foreignKey:UserID"`
	Services    []Service    `json:"services,omitempty" gorm:"foreignKey:VendorID"`
	Packages    []Package    `json:"packages,omitempty" gorm:"foreignKey:VendorID"`
	Orders      []Order      `json:"orders,omitempty" gorm:"foreignKey:VendorID"`
	Reviews     []Review     `json:"reviews,omitempty" gorm:"foreignKey:VendorID"`
	Portfolios  []Portfolio  `json:"portfolios,omitempty" gorm:"foreignKey:VendorID"`
	Availabilities []Availability `json:"availabilities,omitempty" gorm:"foreignKey:VendorID"`
}

type Service struct {
	orm.Model
	VendorID      uint    `json:"vendor_id" gorm:"not null"`
	CategoryID    uint    `json:"category_id" gorm:"not null"`
	Name          string  `json:"name" gorm:"not null"`
	Description   string  `json:"description"`
	Price         float64 `json:"price" gorm:"not null"`
	PriceType     string  `json:"price_type" gorm:"default:'fixed';check:price_type IN ('fixed', 'hourly', 'daily', 'custom')"`
	MinPrice      float64 `json:"min_price"`
	MaxPrice      float64 `json:"max_price"`
	IsActive      bool    `json:"is_active" gorm:"default:true"`
	IsFeatured    bool    `json:"is_featured" gorm:"default:false"`
	Images        string  `json:"images"` // JSON array of image URLs
	Tags          string  `json:"tags"`   // JSON array of tags
	
	// Relations
	Vendor        VendorProfile `json:"vendor,omitempty" gorm:"foreignKey:VendorID"`
	Category      Category      `json:"category,omitempty" gorm:"foreignKey:CategoryID"`
	OrderItems    []OrderItem   `json:"order_items,omitempty" gorm:"foreignKey:ServiceID"`
	PackageItems  []PackageItem `json:"package_items,omitempty" gorm:"foreignKey:ServiceID"`
}

type Category struct {
	orm.Model
	Name        string `json:"name" gorm:"not null;uniqueIndex"`
	Slug        string `json:"slug" gorm:"not null;uniqueIndex"`
	Description string `json:"description"`
	Icon        string `json:"icon"`
	IsActive    bool   `json:"is_active" gorm:"default:true"`
	SortOrder   int    `json:"sort_order" gorm:"default:0"`
	
	// Relations
	Services []Service `json:"services,omitempty" gorm:"foreignKey:CategoryID"`
}

type Package struct {
	orm.Model
	VendorID    uint    `json:"vendor_id" gorm:"not null"`
	Name        string  `json:"name" gorm:"not null"`
	Description string  `json:"description"`
	Price       float64 `json:"price" gorm:"not null"`
	IsActive    bool    `json:"is_active" gorm:"default:true"`
	IsFeatured  bool    `json:"is_featured" gorm:"default:false"`
	Images      string  `json:"images"` // JSON array of image URLs
	Tags        string  `json:"tags"`   // JSON array of tags
	
	// Relations
	Vendor      VendorProfile `json:"vendor,omitempty" gorm:"foreignKey:VendorID"`
	Items       []PackageItem `json:"items,omitempty" gorm:"foreignKey:PackageID"`
	OrderItems  []OrderItem   `json:"order_items,omitempty" gorm:"foreignKey:PackageID"`
}

type PackageItem struct {
	orm.Model
	PackageID uint    `json:"package_id" gorm:"not null"`
	ServiceID uint    `json:"service_id" gorm:"not null"`
	Quantity  int     `json:"quantity" gorm:"default:1"`
	Price     float64 `json:"price"` // Override price for this package
	
	// Relations
	Package Package `json:"package,omitempty" gorm:"foreignKey:PackageID"`
	Service Service `json:"service,omitempty" gorm:"foreignKey:ServiceID"`
}

type Order struct {
	orm.Model
	OrderNumber    string    `json:"order_number" gorm:"not null;uniqueIndex"`
	CustomerID     uint      `json:"customer_id" gorm:"not null"`
	VendorID       uint      `json:"vendor_id" gorm:"not null"`
	Status         string    `json:"status" gorm:"default:'pending';check:status IN ('pending', 'accepted', 'rejected', 'in_progress', 'completed', 'cancelled', 'refunded')"`
	TotalAmount    float64   `json:"total_amount" gorm:"not null"`
	Commission     float64   `json:"commission" gorm:"not null"`
	VendorAmount   float64   `json:"vendor_amount" gorm:"not null"`
	EventDate      time.Time `json:"event_date"`
	EventLocation  string    `json:"event_location"`
	Notes          string    `json:"notes"`
	PaymentStatus  string    `json:"payment_status" gorm:"default:'pending';check:payment_status IN ('pending', 'paid', 'partial', 'refunded')"`
	PaymentMethod  string    `json:"payment_method"`
	PaymentRef     string    `json:"payment_ref"`
	IsEscrow       bool      `json:"is_escrow" gorm:"default:true"`
	EscrowReleased bool      `json:"escrow_released" gorm:"default:false"`
	EscrowReleasedAt *time.Time `json:"escrow_released_at"`
	
	// Relations
	Customer   User        `json:"customer,omitempty" gorm:"foreignKey:CustomerID"`
	Vendor     VendorProfile `json:"vendor,omitempty" gorm:"foreignKey:VendorID"`
	Items      []OrderItem `json:"items,omitempty" gorm:"foreignKey:OrderID"`
	Payments   []Payment   `json:"payments,omitempty" gorm:"foreignKey:OrderID"`
	Reviews    []Review    `json:"reviews,omitempty" gorm:"foreignKey:OrderID"`
}

type OrderItem struct {
	orm.Model
	OrderID     uint    `json:"order_id" gorm:"not null"`
	ServiceID   *uint   `json:"service_id"`
	PackageID   *uint   `json:"package_id"`
	ItemType    string  `json:"item_type" gorm:"not null;check:item_type IN ('service', 'package')"`
	ItemName    string  `json:"item_name" gorm:"not null"`
	Quantity    int     `json:"quantity" gorm:"default:1"`
	Price       float64 `json:"price" gorm:"not null"`
	TotalPrice  float64 `json:"total_price" gorm:"not null"`
	
	// Relations
	Order   Order   `json:"order,omitempty" gorm:"foreignKey:OrderID"`
	Service *Service `json:"service,omitempty" gorm:"foreignKey:ServiceID"`
	Package *Package `json:"package,omitempty" gorm:"foreignKey:PackageID"`
}

type Payment struct {
	orm.Model
	OrderID         uint    `json:"order_id" gorm:"not null"`
	Amount          float64 `json:"amount" gorm:"not null"`
	PaymentMethod   string  `json:"payment_method" gorm:"not null"`
	PaymentGateway  string  `json:"payment_gateway"`
	TransactionID   string  `json:"transaction_id"`
	Status          string  `json:"status" gorm:"default:'pending';check:status IN ('pending', 'success', 'failed', 'cancelled', 'refunded')"`
	GatewayResponse string  `json:"gateway_response"` // JSON response from payment gateway
	PaidAt          *time.Time `json:"paid_at"`
	
	// Relations
	Order Order `json:"order,omitempty" gorm:"foreignKey:OrderID"`
}

type Review struct {
	orm.Model
	OrderID     uint    `json:"order_id" gorm:"not null"`
	CustomerID  uint    `json:"customer_id" gorm:"not null"`
	VendorID    uint    `json:"vendor_id" gorm:"not null"`
	Rating      int     `json:"rating" gorm:"not null;check:rating >= 1 AND rating <= 5"`
	Comment     string  `json:"comment"`
	Images      string  `json:"images"` // JSON array of image URLs
	IsHighlighted bool  `json:"is_highlighted" gorm:"default:false"`
	VendorReply string  `json:"vendor_reply"`
	RepliedAt   *time.Time `json:"replied_at"`
	
	// Relations
	Order    Order         `json:"order,omitempty" gorm:"foreignKey:OrderID"`
	Customer User          `json:"customer,omitempty" gorm:"foreignKey:CustomerID"`
	Vendor   VendorProfile `json:"vendor,omitempty" gorm:"foreignKey:VendorID"`
}

type Wishlist struct {
	orm.Model
	CustomerID uint `json:"customer_id" gorm:"not null"`
	ServiceID  *uint `json:"service_id"`
	PackageID  *uint `json:"package_id"`
	ItemType   string `json:"item_type" gorm:"not null;check:item_type IN ('service', 'package')"`
	
	// Relations
	Customer User     `json:"customer,omitempty" gorm:"foreignKey:CustomerID"`
	Service  *Service `json:"service,omitempty" gorm:"foreignKey:ServiceID"`
	Package  *Package `json:"package,omitempty" gorm:"foreignKey:PackageID"`
}

type Portfolio struct {
	orm.Model
	VendorID    uint   `json:"vendor_id" gorm:"not null"`
	Title       string `json:"title" gorm:"not null"`
	Description string `json:"description"`
	ImageURL    string `json:"image_url" gorm:"not null"`
	ImageType   string `json:"image_type" gorm:"default:'image';check:image_type IN ('image', 'video')"`
	IsFeatured  bool   `json:"is_featured" gorm:"default:false"`
	SortOrder   int    `json:"sort_order" gorm:"default:0"`
	
	// Relations
	Vendor VendorProfile `json:"vendor,omitempty" gorm:"foreignKey:VendorID"`
}

type Availability struct {
	orm.Model
	VendorID    uint      `json:"vendor_id" gorm:"not null"`
	Date        time.Time `json:"date" gorm:"not null"`
	StartTime   string    `json:"start_time"`
	EndTime     string    `json:"end_time"`
	IsAvailable bool      `json:"is_available" gorm:"default:true"`
	MaxBookings int       `json:"max_bookings" gorm:"default:1"`
	CurrentBookings int   `json:"current_bookings" gorm:"default:0"`
	
	// Relations
	Vendor VendorProfile `json:"vendor,omitempty" gorm:"foreignKey:VendorID"`
}

type Chat struct {
	orm.Model
	OrderID     uint   `json:"order_id" gorm:"not null"`
	UserID      uint   `json:"user_id" gorm:"not null"`
	Message     string `json:"message" gorm:"not null"`
	MessageType string `json:"message_type" gorm:"default:'text';check:message_type IN ('text', 'image', 'file')"`
	IsRead      bool   `json:"is_read" gorm:"default:false"`
	
	// Relations
	Order Order `json:"order,omitempty" gorm:"foreignKey:OrderID"`
	User  User  `json:"user,omitempty" gorm:"foreignKey:UserID"`
}

type ModuleSetting struct {
	orm.Model
	ModuleName string `json:"module_name" gorm:"not null;uniqueIndex"`
	IsEnabled  bool   `json:"is_enabled" gorm:"default:true"`
	Settings   string `json:"settings"` // JSON configuration
}

type SystemSetting struct {
	orm.Model
	Key   string `json:"key" gorm:"not null;uniqueIndex"`
	Value string `json:"value"`
	Type  string `json:"type" gorm:"default:'string';check:type IN ('string', 'number', 'boolean', 'json')"`
}
