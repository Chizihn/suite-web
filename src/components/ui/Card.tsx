export interface CardProps {
  children: React.ReactNode;
  variant?: "default" | "elevated" | "outlined";
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = "default",
  className = "",
}) => {
  const base = "rounded-xl p-6 transition-all";
  const variants = {
    default: "bg-surface-primary border border-border-primary/20",
    elevated: "bg-surface-primary shadow-lg shadow-background-primary/10 border border-border-primary/20 hover:shadow-xl hover:shadow-background-primary/20",
    outlined: "bg-transparent border border-border-primary/30 hover:border-primary/30",
  };

  return (
    <div className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </div>
  );
};
