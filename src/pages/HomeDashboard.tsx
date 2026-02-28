import { motion } from "framer-motion";
import { Heart, Thermometer, Activity, Clock, Users, Shield } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { StatusBadge } from "@/components/health/StatusBadge";
import { MetricCard } from "@/components/health/MetricCard";
import { ActionRow } from "@/components/health/ActionRow";
import { SectionHeader } from "@/components/health/SectionHeader";
import { BottomNav } from "@/components/health/BottomNav";
import { fetchLatestVitals, fetchTelemetry, USER_ID } from "@/lib/api";

const HomeDashboard = () => {
  const { data: vitals, isLoading: vLoading } = useQuery({
    queryKey: ['vitals', USER_ID],
    queryFn: () => fetchLatestVitals(USER_ID)
  });

  useEffect(() => {
    fetch("http://localhost:3000/api/health")
      .then(res => res.json())
      .then(data => console.log("Backend Connected:", data))
      .catch(err => console.error("Backend Error:", err));
  }, []);

  const { data: telemetry, isLoading: tLoading } = useQuery({
    queryKey: ['telemetry', USER_ID],
    queryFn: () => fetchTelemetry(USER_ID)
  });

  if (vLoading || tLoading) {
    return <div className="min-h-screen bg-background flex justify-center items-center"><div className="animate-pulse flex space-x-4"><div className="rounded-full bg-slate-200 h-10 w-10"></div></div></div>;
  }


  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/90 backdrop-blur-lg px-5 pb-3 pt-[max(env(safe-area-inset-top),1rem)]">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-extrabold text-foreground">Health Guardian</h1>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-primary" />
              <span className="text-xs text-muted-foreground">Device Connected</span>
            </div>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent">
            <Shield className="h-4 w-4 text-primary" />
          </div>
        </div>
      </div>

      <div className="space-y-4 px-5">
        {/* Risk Level */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="rounded-xl bg-gradient-to-br from-card to-muted p-5 medical-shadow-lg border border-border/50 cursor-pointer overflow-hidden relative group"
        >
          {/* subtle background pulse */}
          <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl pointer-events-none" />

          <p className="mb-1 text-xs font-medium text-muted-foreground relative z-10">Current Risk Level</p>
          <div className="mb-1 flex items-center gap-2 relative z-10">
            <span className="text-2xl font-extrabold text-primary drop-shadow-sm transition-colors group-hover:text-primary/90">{vitals?.riskLevel || "UNKNOWN"} RISK</span>
            <StatusBadge label="Active" variant="success" />
          </div>
          <p className="text-xs text-muted-foreground relative z-10">Safety monitoring is active</p>
        </motion.div>

        {/* Vitals */}
        <SectionHeader title="Live Vitals" />
        <div className="flex gap-3">
          <MetricCard icon={Heart} label="Heart Rate" value={vitals?.heartRate || 0} unit="BPM" delay={0.1} />
          <MetricCard icon={Thermometer} label="Body Temp" value={vitals?.bodyTemp || 0} unit="°F" delay={0.2} />
        </div>

        {/* Stability */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-lg bg-card p-4 medical-shadow"
        >
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              <span className="text-sm font-bold text-foreground">Stability Status</span>
            </div>
            <StatusBadge label="Live Feed" variant="live" />
          </div>
          <p className="mb-1 text-sm font-semibold text-foreground">Posture: Stable Standing</p>
          <div className="mb-3 flex items-center gap-1.5">
            <Clock className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">No falls detected in 24 hours</span>
          </div>
          <button className="w-full rounded-lg border border-border py-2.5 text-xs font-semibold text-foreground transition-colors active:bg-muted">
            Calibrate
          </button>
        </motion.div>

        {/* Actions */}
        <SectionHeader title="Quick Actions" />
        <div className="space-y-2">
          <ActionRow icon={Clock} label="View Health History" subtitle="Last 30 days of vitals" to="/health-history" delay={0.4} />
          <ActionRow icon={Users} label="Emergency Contacts" subtitle="3 contacts configured" to="/emergency-contacts" delay={0.5} />
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default HomeDashboard;
