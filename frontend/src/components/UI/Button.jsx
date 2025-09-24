import React, { forwardRef } from "react";
import { Loader2 } from "lucide-react";
import clsx from "clsx";

const Button = forwardRef(
  (
    {
      children,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled = false,
      className = "",
      icon,
      iconPosition = "left",
      gradient = false,
      glow = false,
      ...props
    },
    ref
  ) => {
    const baseClasses =
      "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95";

    const variants = {
      primary:
        "bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-500 shadow-lg hover:shadow-xl",
      secondary:
        "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400 focus:ring-gray-500 shadow-sm hover:shadow-md",
      outline:
        "border-2 border-primary-500 bg-transparent text-primary-600 hover:bg-primary-500 hover:text-white focus:ring-primary-500",
      danger:
        "bg-danger-500 text-white hover:bg-danger-600 focus:ring-danger-500 shadow-lg hover:shadow-xl",
      success:
        "bg-success-500 text-white hover:bg-success-600 focus:ring-success-500 shadow-lg hover:shadow-xl",
      warning:
        "bg-warning-500 text-white hover:bg-warning-600 focus:ring-warning-500 shadow-lg hover:shadow-xl",
      ghost: "text-gray-700 hover:bg-gray-100 focus:ring-gray-500",
      link: "text-primary-600 hover:text-primary-700 underline-offset-4 hover:underline focus:ring-primary-500",
    };

    const sizes = {
      xs: "px-3 py-1.5 text-xs rounded-lg",
      sm: "px-4 py-2 text-xs rounded-lg",
      md: "px-6 py-3 text-sm rounded-xl",
      lg: "px-8 py-4 text-base rounded-2xl",
      xl: "px-10 py-5 text-lg rounded-2xl",
    };

    const glowClasses = glow ? "shadow-glow hover:shadow-glow-lg" : "";

    return (
      <button
        ref={ref}
        className={clsx(
          baseClasses,
          variants[variant],
          sizes[size],
          glowClasses,
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
        {!isLoading && icon && iconPosition === "left" && (
          <div className="mr-2">{icon}</div>
        )}
        {children}
        {!isLoading && icon && iconPosition === "right" && (
          <div className="ml-2">{icon}</div>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
