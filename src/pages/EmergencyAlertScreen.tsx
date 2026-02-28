import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Phone, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ProgressRing } from "@/components/health/ProgressRing";

const EmergencyAlertScreen = () => {
  const navigate = useNavigate();
  const [seconds, setSeconds] = useState(10);

  useEffect(() => {
    if (seconds <= 0) return;
    const timer = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(timer);
  }, [seconds]);

  const progress = (seconds / 10) * 100;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6">
      {/* Pulsing background */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute h-80 w-80 rounded-full bg-destructive"
      />

      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative z-10 flex flex-col items-center"
      >
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <AlertTriangle className="h-8 w-8 text-destructive" />
        </div>

        <h1 className="mb-6 text-2xl font-extrabold text-foreground">Fall Detected!</h1>

        <ProgressRing
          progress={progress}
          size={140}
          strokeWidth={8}
          label={`${seconds}s`}
          sublabel="remaining"
          variant="countdown"
        />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 max-w-xs text-center text-xs leading-relaxed text-muted-foreground"
        >
          If you don't respond, emergency contacts and local services will be notified automatically.
        </motion.p>

        <div className="mt-8 flex w-full max-w-xs flex-col gap-3">
          <button
            onClick={() => navigate("/home")}
            className="w-full rounded-lg medical-gradient py-3.5 text-sm font-bold text-primary-foreground transition-all active:scale-[0.98]"
          >
            Cancel Alert
          </button>
          <button
            onClick={() => navigate("/guardian-sync")}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-destructive py-3.5 text-sm font-bold text-destructive transition-all active:scale-[0.98]"
          >
            <Phone className="h-4 w-4" />
            Call Emergency Now
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6 flex items-center gap-1.5"
        >
          <MapPin className="h-3 w-3 text-muted-foreground" />
          <span className="text-[10px] text-muted-foreground">GPS: 37.7749° N, 122.4194° W</span>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default EmergencyAlertScreen;
