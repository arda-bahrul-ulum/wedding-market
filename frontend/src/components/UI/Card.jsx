import { forwardRef } from "react";
import clsx from "clsx";

const Card = forwardRef(
  (
    { children, className = "", hover = false, glow = false, ...props },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={clsx(
          "bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft border border-white/20 transition-all duration-300",
          hover && "hover:shadow-medium hover:-translate-y-1",
          glow && "shadow-glow hover:shadow-glow-lg",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

const CardHeader = forwardRef(
  ({ children, className = "", gradient = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(
          "px-8 py-6 border-b border-gray-100",
          gradient && "bg-gradient-to-r from-primary-50 to-accent-50",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardHeader.displayName = "CardHeader";

const CardBody = forwardRef(
  ({ children, className = "", padding = "default", ...props }, ref) => {
    const paddingClasses = {
      none: "",
      sm: "px-4 py-4",
      default: "px-8 py-6",
      lg: "px-10 py-8",
    };

    return (
      <div
        ref={ref}
        className={clsx(paddingClasses[padding], className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardBody.displayName = "CardBody";

const CardFooter = forwardRef(
  ({ children, className = "", gradient = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(
          "px-8 py-6 border-t border-gray-100 bg-gray-50/50 rounded-b-2xl",
          gradient && "bg-gradient-to-r from-gray-50 to-gray-100",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardFooter.displayName = "CardFooter";

const CardTitle = forwardRef(
  ({ children, className = "", size = "lg", ...props }, ref) => {
    const sizeClasses = {
      sm: "text-lg font-bold",
      md: "text-xl font-bold",
      lg: "text-2xl font-bold",
      xl: "text-3xl font-bold",
    };

    return (
      <h3
        ref={ref}
        className={clsx(
          "text-gray-900 font-bold tracking-tight",
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {children}
      </h3>
    );
  }
);

CardTitle.displayName = "CardTitle";

const CardDescription = forwardRef(
  ({ children, className = "", ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={clsx("text-gray-600 text-sm leading-relaxed", className)}
        {...props}
      >
        {children}
      </p>
    );
  }
);

CardDescription.displayName = "CardDescription";

export { Card, CardHeader, CardBody, CardFooter, CardTitle, CardDescription };
export default Card;
