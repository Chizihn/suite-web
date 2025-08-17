import React from 'react';
import { cn } from '../../utils/cn';

export interface InputProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void; // Added onBlur prop
  placeholder?: string;
  label?: string;
  error?: string;
  type?: 'text' | 'password' | 'email' | 'number' | 'tel' | 'date';
  disabled?: boolean;
  className?: string;
  wrapperClassName?: string;
  icon?: React.ReactNode;
  id?: string;
  'aria-describedby'?: string;
  min?: string | number; // Added min prop for number and date inputs
}

const Input: React.FC<InputProps> = ({
  value,
  onChange,
  onBlur, // Added onBlur to destructuring
  placeholder,
  label,
  error,
  type = 'text',
  disabled = false,
  className = '',
  wrapperClassName = '',
  icon,
  id = `input-${Math.random().toString(36).substr(2, 9)}`,
  'aria-describedby': ariaDescribedBy,
  min,
}) => {
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className={cn('mb-4', wrapperClassName)}>
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-text-primary mb-1"
        >
          {label}
        </label>
      )}

      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-tertiary flex items-center">
            {icon}
          </div>
        )}

        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur} // Added onBlur handler
          placeholder={placeholder}
          disabled={disabled}
          min={min} // Pass min prop to input element
          className={cn(
            'w-full px-4 py-4 border rounded-md outline-none ',
            icon ? 'pl-10' : '',
            error ? 'border-red-500 focus:ring-red-500' : 'border-border-primary focus:ring-primary',
            disabled ? 'bg-var(--surface-secondary) cursor-not-allowed text-text-tertiary' : 'bg-surface-primary text-text-primary',
            className
          )}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? errorId : ariaDescribedBy}
        />

        {error && (
          <p id={errorId} className="text-sm text-red-600 mt-1" role="alert">
            {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default Input;