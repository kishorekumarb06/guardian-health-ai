import { motion } from "framer-motion";
import { User, Shield, Bell, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BottomNav } from "@/components/health/BottomNav";
import { StatusBadge } from "@/components/health/StatusBadge";

const ProfileScreen = () => {
  const navigate = useNavigate();

  const items = [
    { icon: User, label: "Personal Information", sub: "Name, DOB, blood type", path: "/profile/personal-info" },
    { icon: Shield, label: "Medical Records", sub: "Allergies, conditions", path: "/profile/medical-records" },
    { icon: Bell, label: "Notification Preferences", sub: "Alerts & sounds", path: "/profile/notifications" },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="px-5 pt-[max(env(safe-area-inset-top),1rem)]">
        <div className="flex flex-col items-center py-6">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mb-3 flex h-20 w-20 items-center justify-center rounded-full medical-gradient text-2xl font-bold text-primary-foreground"
          >
            JD
          </motion.div>
          <h2 className="text-lg font-extrabold text-foreground">John Doe</h2>
          <p className="text-xs text-muted-foreground">Patient ID: SHG-2024-0847</p>
          <div className="mt-2">
            <StatusBadge label="Premium Plan" variant="success" />
          </div>
        </div>

        <div className="space-y-2">
          {items.map((item, i) => (
            <motion.button
              key={item.label}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => navigate(item.path)}
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
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default ProfileScreen;
