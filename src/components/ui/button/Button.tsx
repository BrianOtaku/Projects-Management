import Link from "next/link";
import React, { ReactNode, MouseEvent } from "react";

interface ButtonProps {
  children: ReactNode; // Button text or content
  size?: "sm" | "md"; // Button size
  variant?: "primary" | "outline" | "success" | "error" | "warning"; // Button variant
  startIcon?: ReactNode; // Icon before the text
  endIcon?: ReactNode; // Icon after the text
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void; // Click handler
  disabled?: boolean; // Disabled state
  className?: string; // Disabled state
  type?: "button" | "submit" | "reset"; // Button type
  path?: string; // Optional link for navigation
}

const Button: React.FC<ButtonProps> = ({
  children,
  size = "md",
  variant = "primary",
  startIcon,
  endIcon,
  onClick,
  className = "",
  disabled = false,
  type = "button",
  path,
}) => {
  // Size Classes
  const sizeClasses = {
    sm: "px-4 py-3 text-sm",
    md: "px-5 py-3.5 text-sm",
  };

  // Variant Classes
  const variantClasses = {
    primary:
      "ring-1 ring-inset bg-brand-50 text-brand-600 hover:bg-brand-200 dark:bg-brand-500/15 dark:text-brand-500 dark:hover:bg-brand-600 dark:hover:text-white disabled:bg-brand-300",
    success:
      "ring-1 ring-inset bg-success-50 text-success-600 hover:bg-success-200 dark:bg-success-500/15 dark:text-success-500 dark:hover:bg-success-600 dark:hover:text-white disabled:bg-success-300",
    error:
      "ring-1 ring-inset bg-error-50 text-error-600 hover:bg-error-200 dark:bg-error-500/15 dark:text-error-500 dark:hover:bg-error-600 dark:hover:text-white disabled:bg-error-300",
    warning:
      "ring-1 ring-inset bg-warning-50 text-warning-600 hover:bg-warning-200 dark:bg-warning-500/15 dark:text-orange-400 dark:hover:bg-warning-600 dark:hover:text-white disabled:bg-warning-300",
    outline:
      "bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300",
  };

  if (path) {
    return (
      <button
        className={`inline-flex items-center justify-center font-medium gap-2 rounded-lg transition ${className} ${sizeClasses[size]
          } ${variantClasses[variant]} ${disabled ? "cursor-not-allowed opacity-50" : ""
          }`}
      >
        <Link href={path}>
          {startIcon && <span className="flex items-center">{startIcon}</span>}
          {children}
          {endIcon && <span className="flex items-center">{endIcon}</span>}
        </Link>
      </button>
    );
  }

  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center font-medium gap-2 rounded-lg transition ${className} ${sizeClasses[size]
        } ${variantClasses[variant]} ${disabled ? "cursor-not-allowed opacity-50" : ""
        }`}
      onClick={onClick}
      disabled={disabled}
    >
      {startIcon && <span className="flex items-center">{startIcon}</span>}
      {children}
      {endIcon && <span className="flex items-center">{endIcon}</span>}
    </button>
  );
};

export default Button;
