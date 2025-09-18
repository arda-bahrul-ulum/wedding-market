import { forwardRef } from "react";
import clsx from "clsx";

const Card = forwardRef(({ children, className = "", ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={clsx("bg-white shadow rounded-lg", className)}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

const CardHeader = forwardRef(({ children, className = "", ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={clsx("px-4 py-5 sm:p-6 border-b border-gray-200", className)}
      {...props}
    >
      {children}
    </div>
  );
});

CardHeader.displayName = "CardHeader";

const CardBody = forwardRef(({ children, className = "", ...props }, ref) => {
  return (
    <div ref={ref} className={clsx("px-4 py-5 sm:p-6", className)} {...props}>
      {children}
    </div>
  );
});

CardBody.displayName = "CardBody";

const CardFooter = forwardRef(({ children, className = "", ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={clsx("px-4 py-4 sm:px-6 border-t border-gray-200", className)}
      {...props}
    >
      {children}
    </div>
  );
});

CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardBody, CardFooter };
export default Card;
