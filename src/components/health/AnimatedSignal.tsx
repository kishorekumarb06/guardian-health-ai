import { motion } from "framer-motion";

export const AnimatedSignal = () => (
  <div className="relative flex items-center justify-center" style={{ width: 200, height: 200 }}>
    {[0, 1, 2].map((i) => (
      <motion.div
        key={i}
        className="absolute rounded-full border-2 border-primary/30"
        initial={{ width: 60, height: 60, opacity: 0.8 }}
        animate={{
          width: [60 + i * 40, 100 + i * 50],
          height: [60 + i * 40, 100 + i * 50],
          opacity: [0.6 - i * 0.15, 0],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          delay: i * 0.6,
          ease: "easeOut",
        }}
      />
    ))}
    <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full medical-gradient glow-green">
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="h-8 w-8 rounded-full bg-primary-foreground/30"
      />
    </div>
  </div>
);
