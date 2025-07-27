import type { LucideIcon } from "lucide-react";
import React from "react";

export interface ButtonProps {
  title?: string;
  children?: React.ReactNode;
  onClick: () => void;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  loading?: boolean;
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
  className?: string;
}

const sizeClasses = {
  small: "px-3 py-1.5 text-sm",
  medium: "px-4 py-2 text-base",
  large: "px-5 py-3 text-lg",
};

const variantClasses = {
  primary: "bg-blue-600 text-white hover:bg-blue-700",
  secondary: "bg-gray-600 text-white hover:bg-gray-700",
  outline: "border border-gray-300 text-gray-700 hover:bg-gray-100",
  ghost: "bg-transparent text-gray-700 hover:bg-gray-100",
  danger: "bg-red-600 text-white hover:bg-red-700",
};

export const Button: React.FC<ButtonProps> = ({
  title,
  children,
  onClick,
  variant = "primary",
  size = "medium",
  disabled = false,
  loading = false,
  icon: Icon,
  iconPosition = "left",
  fullWidth = false,
  className = "",
}) => {
  const classes = `
    inline-flex items-center justify-center font-semibold rounded-md
    ${sizeClasses[size]} 
    ${variantClasses[variant]} 
    ${fullWidth ? "w-full" : ""}
    ${disabled ? "opacity-50 cursor-not-allowed" : ""}
    ${className}
  `;

  return (
    <button
      className={classes}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? (
        <span className="loader border-white border-2 w-4 h-4 rounded-full animate-spin" />
      ) : (
        <>
          {Icon && iconPosition === "left" && <Icon className="mr-2" />}
          {title}
          {children}
          {Icon && iconPosition === "right" && <Icon className="ml-2" />}
        </>
      )}
    </button>
  );
};
