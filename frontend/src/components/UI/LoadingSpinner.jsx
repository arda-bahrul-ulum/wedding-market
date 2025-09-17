import { Loader2 } from "lucide-react";

function LoadingSpinner({ size = "md", className = "" }) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
  };

  return (
    <Loader2
      className={`animate-spin text-primary-600 ${sizeClasses[size]} ${className}`}
    />
  );
}

export default LoadingSpinner;

