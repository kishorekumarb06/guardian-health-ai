import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Shield, Lock } from "lucide-react";

const SplashScreen = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => navigate("/home"), 400);
          return 100;
        }
        return prev + 2;
      });
    }, 60);
    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden medical-gradient">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full border border-primary-foreground/20"
            style={{
              width: 100 + i * 120,
              height: 100 + i * 120,
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center"
      >
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary-foreground/20 backdrop-blur-sm">
          <Shield className="h-10 w-10 text-primary-foreground" />
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-1 text-center text-3xl font-extrabold text-primary-foreground"
        >
          Silent Health
        </motion.h1>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-2 text-center text-2xl font-bold text-primary-foreground/90"
        >
          Guardian
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mb-10 text-sm text-primary-foreground/70"
        >
          Protecting You Before It&apos;s Critical
        </motion.p>

        {/* Progress bar */}
        <motion.div
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: 240 }}
          transition={{ delay: 0.8 }}
          className="mb-3"
        >
          <div className="mb-1 flex items-center justify-between">
            <span className="text-[10px] font-medium text-primary-foreground/60">System Load</span>
            <span className="text-[10px] font-bold text-primary-foreground/80">{progress}%</span>
          </div>
          <div className="h-1.5 w-60 overflow-hidden rounded-full bg-primary-foreground/20">
            <motion.div
              className="h-full rounded-full bg-primary-foreground"
              style={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-xs text-primary-foreground/50"
        >
          Initializing secure monitoring...
        </motion.p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 flex items-center gap-1.5"
      >
        <Lock className="h-3 w-3 text-primary-foreground/40" />
        <span className="text-[10px] text-primary-foreground/40">
          Encrypted Medical-Grade Security
        </span>
      </motion.div>
    </div>
  );
};

export default SplashScreen;
