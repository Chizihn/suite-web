import React from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "./ui/Button";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  className?: string;
}

const ErrorState: React.FC<ErrorStateProps> = ({
  message = "Something went wrong. Please try again.",
  onRetry,
  className = "",
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center min-h-[50vh] ${className}`}
    >
      <div className="mb-4">
        <AlertTriangle size={48} className="text-error" />
      </div>
      <p className="text-sm text-secondary mb-4 max-w-md text-center">
        {message}
      </p>
      {onRetry && (
        <Button
          title="Retry"
          onClick={onRetry}
          className="bg-primary text-text-inverse px-6 py-2 rounded-sm"
        />
      )}
    </div>
  );
};

export default ErrorState;
