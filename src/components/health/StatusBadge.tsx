import { motion } from "framer-motion";

interface StatusBadgeProps {
  label: string;
  variant?: "success" | "warning" | "danger" | "info" | "live";
}

const variantClasses: Record<string, string> = {
  success: "bg-accent text-accent-foreground",
  warning: "bg-warning/10 text-warning",
  danger: "bg-destructive/10 text-destructive",
  info: "bg-info/10 text-info",
  live: "bg-destructive/10 text-destructive",
};

export const StatusBadge = ({ label, variant = "success" }: StatusBadgeProps) => (
  <motion.span
    initial={{ scale: 0.9, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${variantClasses[variant]}`}
  >
    {(variant === "success" || variant === "live") && (
      <span className={`h-2 w-2 rounded-full ${variant === "live" ? "bg-destructive animate-pulse-soft" : "bg-primary"}`} />
    )}
    {label}
  </motion.span>
);
