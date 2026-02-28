import { motion } from "framer-motion";
import { ArrowLeft, Lock, MapPin, Heart, Activity, Mic, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { AnimatedSignal } from "@/components/health/AnimatedSignal";
import { ProgressRing } from "@/components/health/ProgressRing";
import { StatusBadge } from "@/components/health/StatusBadge";
import { fetchTelemetry, USER_ID } from "@/lib/api";

const getTelemetryItems = (telemetry: any) => [
  { icon: MapPin, label: "Precise Location", value: telemetry?.location || 'Unknown' },
  { icon: Heart, label: "Heart Rate", value: `${telemetry?.heartRate || '--'} BPM` },
  { icon: Activity, label: "SpO2", value: `${telemetry?.spO2 || '--'}%` },
  { icon: Mic, label: "Ambient Audio", value: telemetry?.ambientAudio || 'Disabled' },
];

const GuardianSyncScreen = () => {
  const navigate = useNavigate();

  const { data: telemetry, isLoading } = useQuery({
    queryKey: ['telemetry', USER_ID],
    queryFn: () => fetchTelemetry(USER_ID)
  });

  const telemetryItems = getTelemetryItems(telemetry);

  if (isLoading) {
    return <div className="min-h-screen bg-background flex justify-center items-center"><div className="animate-pulse flex space-x-4"><div className="rounded-full bg-slate-200 h-10 w-10"></div></div></div>;
  }

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/90 backdrop-blur-lg px-5 pb-3 pt-[max(env(safe-area-inset-top),1rem)]">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="flex h-9 w-9 items-center justify-center rounded-full bg-card medical-shadow">
            <ArrowLeft className="h-4 w-4 text-foreground" />
          </button>
          <div className="text-center">
            <h1 className="text-base font-extrabold text-foreground">GuardianSync</h1>
            <StatusBadge label="Secure Connection Active" variant="success" />
          </div>
          <div className="w-9" />
        </div>
      </div>

      <div className="flex flex-col items-center px-5">
        {/* Animated Signal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="my-4"
        >
          <AnimatedSignal />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-4 text-xl font-extrabold text-foreground"
        >
          Silent Alert Sent
        </motion.h2>

        {/* Transmission Progress */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-4 w-full rounded-lg bg-card p-5 medical-shadow"
        >
          <div className="flex items-center gap-4">
            <ProgressRing progress={telemetry?.transmission || 0} size={80} strokeWidth={6} label={`${telemetry?.transmission || 0}%`} />
            <div>
              <p className="text-sm font-bold text-foreground">Data Transmission</p>
              <p className="text-xs text-muted-foreground">Encrypted tunnel established</p>
              <div className="mt-2 flex items-center gap-1">
                <Lock className="h-3 w-3 text-primary" />
                <span className="text-[10px] font-medium text-primary">AES-256 Encrypted</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Live Telemetry */}
        <div className="mb-4 w-full">
          <h3 className="mb-3 text-sm font-bold text-foreground">Live Telemetry</h3>
          <div className="space-y-2">
            {telemetryItems.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                className="flex items-center gap-3 rounded-lg bg-card p-3 medical-shadow"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
                  <item.icon className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] text-muted-foreground">{item.label}</p>
                  <p className="text-xs font-semibold text-foreground">{item.value}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Map placeholder */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mb-4 w-full overflow-hidden rounded-lg bg-muted medical-shadow"
        >
          <div className="flex h-40 items-center justify-center">
            <div className="text-center">
              <MapPin className="mx-auto mb-2 h-8 w-8 text-primary" />
              <p className="text-xs font-medium text-muted-foreground">Live Location Map</p>
              <p className="text-[10px] text-muted-foreground">37.7749° N, 122.4194° W</p>
            </div>
          </div>
        </motion.div>

        {/* Safe button */}
        <button
          onClick={() => navigate("/home")}
          className="mb-4 w-full rounded-lg border-2 border-primary py-3.5 text-sm font-bold text-primary transition-all active:scale-[0.98] active:bg-accent"
        >
          False Alarm? I'm Safe
        </button>

        {/* Footer */}
        <div className="flex items-center gap-2">
          <Shield className="h-3 w-3 text-muted-foreground" />
          <span className="text-[10px] text-muted-foreground">
            End-to-end encrypted • Silent mode enabled
          </span>
        </div>
      </div>
    </div>
  );
};

export default GuardianSyncScreen;
