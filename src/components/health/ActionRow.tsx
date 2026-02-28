import { motion } from "framer-motion";
import { LucideIcon, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ActionRowProps {
  icon: LucideIcon;
  label: string;
  subtitle?: string;
  to: string;
  delay?: number;
}

export const ActionRow = ({ icon: Icon, label, subtitle, to, delay = 0 }: ActionRowProps) => {
  const navigate = useNavigate();

  return (
    <motion.button
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ scale: 1.02, x: 4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ delay, type: "spring", stiffness: 400, damping: 25 }}
      onClick={() => navigate(to)}
      className="flex w-full items-center gap-3 rounded-xl bg-card p-4 medical-shadow border border-border/40 group relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent group-hover:scale-110 transition-transform relative z-10">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div className="flex-1 text-left relative z-10">
        <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{label}</p>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </div>
      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all relative z-10" />
    </motion.button>
  );
};
