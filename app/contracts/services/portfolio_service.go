package services

type PortfolioServiceInterface interface {
	BaseServiceInterface

	// Portfolio operations
	GetPortfolios(vendorID uint, filters map[string]interface{}) (*ServiceResponse, error)
	GetPortfolioDetail(portfolioID uint) (*ServiceResponse, error)
	CreatePortfolio(vendorID uint, request *CreatePortfolioRequest) (*ServiceResponse, error)
	UpdatePortfolio(portfolioID uint, vendorID uint, request *UpdatePortfolioRequest) (*ServiceResponse, error)
	DeletePortfolio(portfolioID uint, vendorID uint) (*ServiceResponse, error)

	// Featured portfolio operations
	GetFeaturedPortfolios(vendorID uint) (*ServiceResponse, error)
	SetFeaturedPortfolio(portfolioID uint, vendorID uint, isFeatured bool) (*ServiceResponse, error)
}

type CreatePortfolioRequest struct {
	UserID      uint   `json:"user_id"`
	Title       string `json:"title" validate:"required"`
	Description string `json:"description"`
	ImageURL    string `json:"image_url" validate:"required"`
	ImageType   string `json:"image_type" validate:"required,oneof=image video"`
	IsFeatured  bool   `json:"is_featured"`
	SortOrder   int    `json:"sort_order"`
}

type UpdatePortfolioRequest struct {
	UserID      uint   `json:"user_id"`
	Title       string `json:"title" validate:"required"`
	Description string `json:"description"`
	ImageURL    string `json:"image_url" validate:"required"`
	ImageType   string `json:"image_type" validate:"required,oneof=image video"`
	IsFeatured  bool   `json:"is_featured"`
	SortOrder   int    `json:"sort_order"`
}
