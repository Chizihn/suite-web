import React from "react";
import { Loader } from "lucide-react";

interface LoadingProps {
  message?: string;
  className?: string;
}

const Loading: React.FC<LoadingProps> = ({
  message = "Loading...",
  className = "",
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center min-h-[50vh] ${className}`}
    >
      <Loader size={32} className="animate-spin text-text-tertiary mb-4" />
      <p className="text-body2 text-text-secondary">{message}</p>
    </div>
  );
};

export default Loading;
