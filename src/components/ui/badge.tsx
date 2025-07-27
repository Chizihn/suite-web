export interface BadgeProps {
  text: string;
  variant?: "default" | "primary" | "success" | "warning" | "error";
  outlined?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  text,
  variant = "default",
  outlined = false,
}) => {
  const base = "inline-block text-xs font-medium px-2.5 py-0.5 rounded";

  const variants = {
    default: outlined
      ? "text-gray-700 border border-gray-300"
      : "bg-gray-200 text-gray-700",
    primary: outlined
      ? "text-blue-700 border border-blue-300"
      : "bg-blue-100 text-blue-700",
    success: outlined
      ? "text-green-700 border border-green-300"
      : "bg-green-100 text-green-700",
    warning: outlined
      ? "text-yellow-800 border border-yellow-400"
      : "bg-yellow-100 text-yellow-800",
    error: outlined
      ? "text-red-700 border border-red-300"
      : "bg-red-100 text-red-700",
  };

  return <span className={`${base} ${variants[variant]}`}>{text}</span>;
};
