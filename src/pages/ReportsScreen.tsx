import { motion } from "framer-motion";
import { Heart, Thermometer, Droplets, Activity } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { BottomNav } from "@/components/health/BottomNav";
import { MetricCard } from "@/components/health/MetricCard";
import { fetchLatestVitals, USER_ID } from "@/lib/api";

const ReportsScreen = () => {
  const { data: vitals, isLoading } = useQuery({
    queryKey: ['vitals', USER_ID],
    queryFn: () => fetchLatestVitals(USER_ID)
  });

  if (isLoading) {
    return <div className="min-h-screen bg-background flex justify-center items-center"><div className="animate-pulse flex space-x-4"><div className="rounded-full bg-slate-200 h-10 w-10"></div></div></div>;
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="sticky top-0 z-40 bg-background/90 backdrop-blur-lg px-5 pb-3 pt-[max(env(safe-area-inset-top),1rem)]">
        <h1 className="text-lg font-extrabold text-foreground">Reports</h1>
        <p className="text-xs text-muted-foreground">Weekly health summary</p>
      </div>

      <div className="space-y-4 px-5">
        <div className="flex gap-3">
          <MetricCard icon={Heart} label="Avg Heart Rate" value={vitals?.heartRate || 72} unit="BPM" />
          <MetricCard icon={Thermometer} label="Avg Temp" value={vitals?.bodyTemp || 98.6} unit="°F" delay={0.1} />
        </div>
        <div className="flex gap-3">
          <MetricCard icon={Droplets} label="SpO2" value={vitals?.spO2 || 98} unit="%" delay={0.2} />
          <MetricCard icon={Activity} label="Steps" value={vitals?.steps?.toLocaleString() || "8,432"} unit="today" delay={0.3} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-lg bg-card p-5 medical-shadow"
        >
          <h3 className="mb-3 text-sm font-bold text-foreground">7-Day Trend</h3>
          {/* Simple bar chart */}
          <div className="flex items-end gap-2">
            {[65, 72, 68, 75, 71, 73, 72].map((val, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: val }}
                transition={{ delay: 0.5 + i * 0.05, duration: 0.4 }}
                className="flex-1 rounded-t-md medical-gradient"
                style={{ minHeight: 4 }}
              />
            ))}
          </div>
          <div className="mt-2 flex justify-between">
            {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
              <span key={i} className="flex-1 text-center text-[10px] text-muted-foreground">{d}</span>
            ))}
          </div>
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
};

export default ReportsScreen;
