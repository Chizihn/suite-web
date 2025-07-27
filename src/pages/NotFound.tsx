import React from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import { Button } from "../components/ui/Button";

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background p-4 lg:p-6 flex items-center justify-center">
      <div className="flex flex-col items-center text-center">
        <div className="mb-4">
          <AlertTriangle size={48} className="text-error" />
        </div>
        <h2 className="text-2xl font-bold text-primary mb-2">Page Not Found</h2>
        <p className="text-sm text-secondary mb-6 max-w-md">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button
          variant="primary"
          onClick={() => navigate("/")}
          className="px-6 py-2"
        >
          Go to Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
