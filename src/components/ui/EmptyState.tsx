import React from "react";
import { Button } from "../components/ui/Button";

interface EmptyStateConfig {
  title: string;
  description: string;
  image?: string | null;
}

interface EmptyStateProps {
  config: EmptyStateConfig;
  onExplore: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ config, onExplore }) => {
  return (
    <div className="text-center px-6">
      {config.image && (
        <img
          src={config.image}
          alt="Empty"
          className="mx-auto mb-4 w-48 h-48 object-contain"
        />
      )}
      <h3 className="text-xl font-semibold mb-2">{config.title}</h3>
      <p className="text-gray-500 mb-4">{config.description}</p>
      <Button onClick={onExplore}>Explore Hotels</Button>
    </div>
  );
};

export default EmptyState;
