import React from "react";
import { AlertCircle } from "lucide-react";
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


     <div className={`bg-background-primary min-h-[50vh] flex items-center justify-center p-8 ${className} `}>
            <div className="text-center">
              <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
              <h3 className="mt-4 text-lg font-medium text-text-primary">Something went wrong</h3>
              <p className="mt-2 text-sm text-text-secondary">{message}</p>
              {onRetry && (
        <Button onClick={onRetry} className="mt-6">Try Again</Button>
      )}
            </div>
          </div>
  );
};

export default ErrorState;
