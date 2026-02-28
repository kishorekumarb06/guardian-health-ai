import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Wifi, Volume2, Moon, ChevronRight, AlertTriangle, Bluetooth } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BottomNav } from "@/components/health/BottomNav";
import { toast } from "sonner";

const SettingsScreen = () => {
  const navigate = useNavigate();
  const [connectionType, setConnectionType] = useState<"Bluetooth" | "WiFi">("Bluetooth");

  const handleItemClick = (id: string) => {
    if (id === "connection") {
      const newType = connectionType === "Bluetooth" ? "WiFi" : "Bluetooth";
      setConnectionType(newType);
      toast.success(`Switched to ${newType} Connection`);
    }
  };

  const settingsItems = [
    {
      id: "connection",
      icon: connectionType === "Bluetooth" ? Bluetooth : Wifi,
      label: "Device Connection",
      sub: `${connectionType === "Bluetooth" ? "Bluetooth LE" : "WiFi"} Active`
    },
    { id: "privacy", icon: Shield, label: "Privacy & Security", sub: "End-to-end encryption" },
    { id: "sounds", icon: Volume2, label: "Alert Sounds", sub: "Custom tones" },
    { id: "sleep", icon: Moon, label: "Sleep Mode", sub: "Scheduled 10PM - 7AM" },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="sticky top-0 z-40 bg-background/90 backdrop-blur-lg px-5 pb-3 pt-[max(env(safe-area-inset-top),1rem)]">
        <h1 className="text-lg font-extrabold text-foreground">Settings</h1>
      </div>

      <div className="space-y-2 px-5">
        {settingsItems.map((item, i) => (
          <motion.button
            key={item.label}
            onClick={() => handleItemClick(item.id)}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            className="flex w-full items-center gap-3 rounded-lg bg-card p-4 medical-shadow"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent">
              <item.icon className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-semibold text-foreground">{item.label}</p>
              <p className="text-xs text-muted-foreground">{item.sub}</p>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </motion.button>
        ))}

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          onClick={() => navigate("/emergency-alert")}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 py-3.5 text-sm font-bold text-destructive transition-all active:scale-[0.98]"
        >
          <AlertTriangle className="h-4 w-4" />
          Test Emergency Alert
        </motion.button>
      </div>

      <BottomNav />
    </div>
  );
};

export default SettingsScreen;
