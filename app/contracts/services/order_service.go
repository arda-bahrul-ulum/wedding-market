package services

import (
	"time"
)

type OrderServiceInterface interface {
	BaseServiceInterface
	
	// Order operations
	Create(customerID uint, request *CreateOrderRequest) (*ServiceResponse, error)
	GetOrders(filters map[string]interface{}) (*ServiceResponse, error)
	GetDetail(customerID uint, orderID uint) (*ServiceResponse, error)
	Update(customerID uint, orderID uint, request *UpdateOrderRequest) (*ServiceResponse, error)
	Cancel(customerID uint, orderID uint) (*ServiceResponse, error)
	Delete(customerID uint, orderID uint) (*ServiceResponse, error)
	
	// Vendor order operations
	GetVendorOrders(vendorID uint, filters map[string]interface{}) (*ServiceResponse, error)
	UpdateOrderStatus(orderID uint, vendorID uint, request *UpdateOrderStatusRequest) (*ServiceResponse, error)
	GetOrderStatistics(filters map[string]interface{}) (*ServiceResponse, error)
	
	// Admin order operations
	GetAdminOrders(filters map[string]interface{}) (*ServiceResponse, error)
	GetAdminOrderDetail(orderID uint) (*ServiceResponse, error)
	UpdateAdminOrderStatus(orderID uint, request *UpdateOrderStatusRequest) (*ServiceResponse, error)
	GetAdminOrderStatistics(startDate, endDate *time.Time) (*ServiceResponse, error)
	BulkUpdateOrderStatus(request *BulkUpdateOrderStatusRequest) (*ServiceResponse, error)
	BulkDeleteOrders(request *BulkDeleteOrdersRequest) (*ServiceResponse, error)
	ExportOrders(filters map[string]interface{}) (*ServiceResponse, error)
	ProcessRefund(orderID uint, request *ProcessRefundRequest) (*ServiceResponse, error)
}

type CreateOrderRequest struct {
	VendorID      uint                    `json:"vendor_id" validate:"required"`
	EventDate     time.Time               `json:"event_date" validate:"required"`
	EventLocation string                  `json:"event_location" validate:"required"`
	Notes         string                  `json:"notes"`
	Items         []OrderItemRequest      `json:"items" validate:"required,min=1"`
}

type OrderItemRequest struct {
	ItemType   string  `json:"item_type" validate:"required,oneof=service package"`
	ItemID     uint    `json:"item_id" validate:"required"`
	Quantity   int     `json:"quantity" validate:"required,min=1"`
	CustomPrice *float64 `json:"custom_price"`
}

type UpdateOrderRequest struct {
	CustomerID    uint                `json:"customer_id"`
	EventDate     *time.Time          `json:"event_date"`
	EventLocation *string             `json:"event_location"`
	Notes         *string             `json:"notes"`
	Items         []OrderItemRequest  `json:"items"`
}

type UpdateOrderStatusRequest struct {
	UserID uint   `json:"user_id"`
	Status string `json:"status" validate:"required"`
	Notes  string `json:"notes"`
}

type BulkUpdateOrderStatusRequest struct {
	OrderIDs []uint  `json:"order_ids" validate:"required,min=1"`
	Status   string  `json:"status" validate:"required"`
	Notes    string  `json:"notes"`
}

type BulkDeleteOrdersRequest struct {
	OrderIDs []uint `json:"order_ids" validate:"required,min=1"`
}

type ProcessRefundRequest struct {
	Reason string   `json:"reason" validate:"required"`
	Amount *float64 `json:"amount"`
}
