import { forwardRef } from "react";
import clsx from "clsx";

const Card = forwardRef(({ children, className = "", ...props }, ref) => {
  return (
    <div ref={ref} className={clsx("card", className)} {...props}>
      {children}
    </div>
  );
});

Card.displayName = "Card";

const CardHeader = forwardRef(({ children, className = "", ...props }, ref) => {
  return (
    <div ref={ref} className={clsx("card-header", className)} {...props}>
      {children}
    </div>
  );
});

CardHeader.displayName = "CardHeader";

const CardBody = forwardRef(({ children, className = "", ...props }, ref) => {
  return (
    <div ref={ref} className={clsx("card-body", className)} {...props}>
      {children}
    </div>
  );
});

CardBody.displayName = "CardBody";

const CardFooter = forwardRef(({ children, className = "", ...props }, ref) => {
  return (
    <div ref={ref} className={clsx("card-footer", className)} {...props}>
      {children}
    </div>
  );
});

CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardBody, CardFooter };
export default Card;
