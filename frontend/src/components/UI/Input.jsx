import React, { forwardRef } from "react";
import clsx from "clsx";
import { Eye, EyeOff, Search, Mail, Lock, User } from "lucide-react";

const Input = forwardRef(
  (
    {
      label,
      error,
      helperText,
      className = "",
      icon,
      iconPosition = "left",
      type = "text",
      showPasswordToggle = false,
      required = false,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const [isFocused, setIsFocused] = React.useState(false);

    const getIcon = () => {
      if (icon) return icon;
      switch (type) {
        case "email":
          return <Mail className="w-5 h-5" />;
        case "password":
          return <Lock className="w-5 h-5" />;
        case "search":
          return <Search className="w-5 h-5" />;
        case "text":
        default:
          return <User className="w-5 h-5" />;
      }
    };

    const inputType = type === "password" && showPassword ? "text" : type;

    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-semibold text-gray-700">
            {label}
            {required && <span className="text-danger-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative group">
          {icon && iconPosition === "left" && (
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary-500 transition-colors duration-200">
              {getIcon()}
            </div>
          )}
          <input
            ref={ref}
            type={inputType}
            className={clsx(
              "block w-full rounded-xl border-gray-300 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 sm:text-sm transition-all duration-200 bg-white/80 backdrop-blur-sm",
              icon && iconPosition === "left" && "pl-12",
              icon && iconPosition === "right" && "pr-12",
              showPasswordToggle && type === "password" && "pr-12",
              error &&
                "border-danger-300 focus:ring-danger-500/20 focus:border-danger-500",
              isFocused && !error && "border-primary-300",
              className
            )}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          />
          {icon && iconPosition === "right" && (
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary-500 transition-colors duration-200">
              {getIcon()}
            </div>
          )}
          {showPasswordToggle && type === "password" && (
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          )}
        </div>
        {error && (
          <p className="text-sm text-danger-600 font-medium flex items-center">
            <span className="w-1 h-1 bg-danger-500 rounded-full mr-2"></span>
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="text-sm text-gray-500 font-medium">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
