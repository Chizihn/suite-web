import React from "react";

export interface InputProps {
  value: string;
  onChange: (text: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  type?: "text" | "password" | "email" | "number";
  disabled?: boolean;
  className?: string;
  icon?: React.ReactNode; // 👈 New prop
}

const Input: React.FC<InputProps> = ({
  value,
  onChange,
  placeholder,
  label,
  error,
  type = "text",
  disabled = false,
  className = "",
  icon,
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label className="block text-sm font-medium mb-1">{label}</label>
      )}

      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}

        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full px-4 py-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-500 ${
            error ? "border-red-500" : "border-gray-300"
          } ${icon ? "pl-10" : ""}`} // 👈 Extra left padding if icon exists
        />
      </div>

      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </div>
  );
};

export default Input;
