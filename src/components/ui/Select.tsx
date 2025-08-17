import type { SelectHTMLAttributes } from 'react';
import { forwardRef } from 'react';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
  placeholder?: string;
  error?: boolean;
  className?: string;
  wrapperClassName?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({
    options,
    placeholder = 'Select an option',
    error = false,
    className = '',
    wrapperClassName = '',
    ...props
  }, ref) => {
    return (
      <div className={`relative ${wrapperClassName}`}>
        <select
          ref={ref}
          className={`w-full px-4 py-2.5 rounded-lg border text-sm transition-colors
            bg-surface-primary border-border-primary text-text-primary
            focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? 'border-error focus:ring-error/20 focus:border-error' : ''}
            ${className}`}
          {...props}
        >
          <option value="" disabled hidden>
            {placeholder}
          </option>
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
              className="bg-surface-primary text-text-primary"
            >
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg
            className="h-4 w-4 text-text-tertiary"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
    );
  }
);

Select.displayName = 'Select';

export { Select };
