package services

import (
	"goravel/app/contracts/repositories"
	"goravel/app/contracts/services"

	"github.com/goravel/framework/facades"
)

type UserService struct {
	userRepo     repositories.UserRepositoryInterface
	vendorRepo   repositories.VendorProfileRepositoryInterface
	customerRepo repositories.CustomerProfileRepositoryInterface
	orderRepo    repositories.OrderRepositoryInterface
}

func NewUserService(
	userRepo repositories.UserRepositoryInterface,
	vendorRepo repositories.VendorProfileRepositoryInterface,
	customerRepo repositories.CustomerProfileRepositoryInterface,
	orderRepo repositories.OrderRepositoryInterface,
) services.UserServiceInterface {
	return &UserService{
		userRepo:     userRepo,
		vendorRepo:   vendorRepo,
		customerRepo: customerRepo,
		orderRepo:    orderRepo,
	}
}

func (s *UserService) GetUser(userID uint) (*services.ServiceResponse, error) {
	user, err := s.userRepo.FindByID(userID)
	if err != nil {
		return &services.ServiceResponse{
			Success: false,
			Message: "User not found",
		}, nil
	}
	return &services.ServiceResponse{
		Success: true,
		Message: "User profile retrieved successfully",
		Data:    user,
	}, nil
}

func (s *UserService) UpdateProfile(userID uint, request *services.UpdateProfileRequest) (*services.ServiceResponse, error) {
	user, err := s.userRepo.FindByID(userID)
	if err != nil {
		return &services.ServiceResponse{
			Success: false,
			Message: "User not found",
		}, nil
	}

	// Update user data
	user.Name = request.Name
	user.Phone = request.Phone

	if err := s.userRepo.Update(user); err != nil {
		facades.Log().Error("Failed to update user profile: " + err.Error())
		return &services.ServiceResponse{
			Success: false,
			Message: "Failed to update user profile",
		}, err
	}

	return &services.ServiceResponse{
		Success: true,
		Message: "User profile updated successfully",
		Data:    user,
	}, nil
}

func (s *UserService) GetUserByEmail(email string) (*services.ServiceResponse, error) {
	user, err := s.userRepo.FindByEmail(email)
	if err != nil {
		return &services.ServiceResponse{
			Success: false,
			Message: "User not found",
		}, nil
	}
	return &services.ServiceResponse{
		Success: true,
		Message: "User retrieved successfully",
		Data:    user,
	}, nil
}

func (s *UserService) UpdateUser(userID uint, request *services.UpdateUserRequest) (*services.ServiceResponse, error) {
	user, err := s.userRepo.FindByID(userID)
	if err != nil {
		return &services.ServiceResponse{
			Success: false,
			Message: "User not found",
		}, nil
	}

	// Update user data
	if request.Name != "" {
		user.Name = request.Name
	}
	if request.Email != "" {
		user.Email = request.Email
	}
	if request.Phone != "" {
		user.Phone = request.Phone
	}
	if request.Avatar != "" {
		user.Avatar = request.Avatar
	}
	if request.IsActive != nil {
		user.IsActive = *request.IsActive
	}

	if err := s.userRepo.Update(user); err != nil {
		facades.Log().Error("Failed to update user: " + err.Error())
		return &services.ServiceResponse{
			Success: false,
			Message: "Failed to update user",
		}, err
	}

	return &services.ServiceResponse{
		Success: true,
		Message: "User updated successfully",
		Data:    user,
	}, nil
}

func (s *UserService) DeleteUser(userID uint) (*services.ServiceResponse, error) {
	user, err := s.userRepo.FindByID(userID)
	if err != nil {
		return &services.ServiceResponse{
			Success: false,
			Message: "User not found",
		}, nil
	}

	if err := s.userRepo.Delete(user); err != nil {
		facades.Log().Error("Failed to delete user: " + err.Error())
		return &services.ServiceResponse{
			Success: false,
			Message: "Failed to delete user",
		}, err
	}

	return &services.ServiceResponse{
		Success: true,
		Message: "User deleted successfully",
	}, nil
}

func (s *UserService) ActivateUser(userID uint) (*services.ServiceResponse, error) {
	user, err := s.userRepo.FindByID(userID)
	if err != nil {
		return &services.ServiceResponse{
			Success: false,
			Message: "User not found",
		}, nil
	}

	user.IsActive = true
	if err := s.userRepo.Update(user); err != nil {
		facades.Log().Error("Failed to activate user: " + err.Error())
		return &services.ServiceResponse{
			Success: false,
			Message: "Failed to activate user",
		}, err
	}

	return &services.ServiceResponse{
		Success: true,
		Message: "User activated successfully",
		Data:    user,
	}, nil
}

func (s *UserService) DeactivateUser(userID uint) (*services.ServiceResponse, error) {
	user, err := s.userRepo.FindByID(userID)
	if err != nil {
		return &services.ServiceResponse{
			Success: false,
			Message: "User not found",
		}, nil
	}

	user.IsActive = false
	if err := s.userRepo.Update(user); err != nil {
		facades.Log().Error("Failed to deactivate user: " + err.Error())
		return &services.ServiceResponse{
			Success: false,
			Message: "Failed to deactivate user",
		}, err
	}

	return &services.ServiceResponse{
		Success: true,
		Message: "User deactivated successfully",
		Data:    user,
	}, nil
}

func (s *UserService) GetUsers(filters *services.UserFilters, page, limit int) (*services.ServiceResponse, error) {
	// For now, return empty response
	// This would need to be implemented with proper filtering
	return &services.ServiceResponse{
		Success: true,
		Message: "Users retrieved successfully",
		Data:    []interface{}{},
	}, nil
}

func (s *UserService) SearchUsers(query string, role string, page, limit int) (*services.ServiceResponse, error) {
	users, total, err := s.userRepo.SearchUsers(query, role, page, limit)
	if err != nil {
		facades.Log().Error("Failed to search users: " + err.Error())
		return &services.ServiceResponse{
			Success: false,
			Message: "Failed to search users",
		}, err
	}

	return &services.ServiceResponse{
		Success: true,
		Message: "Users search completed successfully",
		Data:    users,
		Meta:    services.CalculatePaginationMeta(page, limit, total),
	}, nil
}

func (s *UserService) GetUserStatistics() (*services.ServiceResponse, error) {
	// For now, return empty response
	// This would need to be implemented
	return &services.ServiceResponse{
		Success: true,
		Message: "User statistics retrieved successfully",
		Data:    map[string]interface{}{},
	}, nil
}

func (s *UserService) GetUsersByRole(role string) (*services.ServiceResponse, error) {
	users, err := s.userRepo.FindByRole(role)
	if err != nil {
		facades.Log().Error("Failed to get users by role: " + err.Error())
		return &services.ServiceResponse{
			Success: false,
			Message: "Failed to get users by role",
		}, err
	}

	return &services.ServiceResponse{
		Success: true,
		Message: "Users retrieved successfully",
		Data:    users,
	}, nil
}

func (s *UserService) Initialize() error {
	// Initialize user service
	return nil
}

func (s *UserService) Cleanup() error {
	// Cleanup user service resources
	return nil
}