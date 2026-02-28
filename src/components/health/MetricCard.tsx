import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  unit: string;
  trend?: "up" | "down" | "stable";
  delay?: number;
}

export const MetricCard = ({ icon: Icon, label, value, unit, delay = 0 }: MetricCardProps) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95, y: 16 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    transition={{ delay, type: "spring", stiffness: 300, damping: 20 }}
    className="flex-1 rounded-xl bg-gradient-to-br from-card to-muted p-4 medical-shadow cursor-pointer border border-border/50 group overflow-hidden relative"
  >
    {/* Background hover effect */}
    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

    <div className="mb-2 flex items-center gap-2 relative z-10">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent group-hover:scale-110 transition-transform">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
    </div>
    <div className="flex items-baseline gap-1 relative z-10">
      <span className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">{value}</span>
      <span className="text-sm font-medium text-muted-foreground">{unit}</span>
    </div>
  </motion.div>
);
