import type React from "react"
import { Search } from "lucide-react"

interface SearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  variant?: "default" | "filled"
  inputSize?: "sm" | "md" | "lg"
  fullWidth?: boolean
  containerClassName?: string
  inputClassName?: string
}

const SearchInput: React.FC<SearchInputProps> = ({
  variant = "default",
  inputSize = "md",
  fullWidth = true,
  containerClassName = "",
  inputClassName = "",
  className,
  ...props
}) => {
  const sizeStyles = {
    sm: "h-9 px-3 text-sm pl-10",
    md: "h-11 px-4 text-sm pl-11",
    lg: "h-12 px-5 text-base pl-12",
  }

  const iconSizes = {
    sm: 16,
    md: 18,
    lg: 20,
  }

  const iconPositions = {
    sm: "left-3",
    md: "left-3.5",
    lg: "left-4",
  }

  const variantStyles = {
    default: "bg-surface-primary border border-gray-700 ",
    filled: "bg-surface-secondary border border-transparent ",
  }

  return (
    <div className={`relative ${fullWidth ? "w-full" : "w-auto"} ${containerClassName}`}>
      <Search
        size={iconSizes[inputSize]}
        className={`absolute ${iconPositions[inputSize]} top-1/2 transform -translate-y-1/2 text-text-tertiary pointer-events-none`}
      />
      <input
        type="text"
        className={`
          w-full rounded-md py-6 text-text-primary placeholder-text-tertiary 
          focus:outline-none  transition-all
          ${variantStyles[variant]} ${sizeStyles[inputSize]} ${inputClassName}
        `}
        {...props}
      />
    </div>
  )
}

export default SearchInput
