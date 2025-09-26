package providers

import (
	"goravel/app/contracts/services"
	"goravel/app/http/controllers"

	"github.com/goravel/framework/contracts/foundation"
	"github.com/goravel/framework/facades"
)

type ControllerServiceProvider struct {
}

func (receiver *ControllerServiceProvider) Register(app foundation.Application) {
	// Register controllers with dependency injection
	facades.App().Bind("controllers.auth", func(app foundation.Application) (any, error) {
		authService, err := facades.App().Make("services.auth")
		if err != nil {
			return nil, err
		}
		return controllers.NewAuthController(authService.(services.AuthServiceInterface)), nil
	})

	// Register other controllers here when they are refactored
	// facades.App().Bind("controllers.user", func(app foundation.Application) (any, error) {
	//     userService, err := facades.App().Make("services.user")
	//     if err != nil {
	//         return nil, err
	//     }
	//     return controllers.NewUserController(userService.(services.UserServiceInterface)), nil
	// })
}

func (receiver *ControllerServiceProvider) Boot(app foundation.Application) {
	//
}
