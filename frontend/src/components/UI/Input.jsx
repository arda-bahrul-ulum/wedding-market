import { forwardRef } from "react";
import clsx from "clsx";

const Input = forwardRef(
  ({ label, error, helperText, className = "", ...props }, ref) => {
    return (
      <div className="space-y-1">
        {label && <label className="label">{label}</label>}
        <input
          ref={ref}
          className={clsx("input", error && "input-error", className)}
          {...props}
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        {helperText && !error && (
          <p className="text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;

