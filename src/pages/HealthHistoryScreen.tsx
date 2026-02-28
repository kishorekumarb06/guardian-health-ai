import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchHealthHistory, USER_ID } from "@/lib/api";
import { BottomNav } from "@/components/health/BottomNav";

const HealthHistoryScreen = () => {
  const navigate = useNavigate();

  const { data: history, isLoading } = useQuery({
    queryKey: ['health-history', USER_ID],
    queryFn: () => fetchHealthHistory(USER_ID)
  });

  if (isLoading) {
    return <div className="min-h-screen bg-background flex justify-center items-center"><div className="animate-pulse rounded-full bg-slate-200 h-10 w-10"></div></div>;
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="sticky top-0 z-40 bg-background/90 backdrop-blur-lg px-5 pb-3 pt-[max(env(safe-area-inset-top),1rem)]">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="flex h-9 w-9 items-center justify-center rounded-full bg-card medical-shadow">
            <ArrowLeft className="h-4 w-4 text-foreground" />
          </button>
          <h1 className="text-base font-extrabold text-foreground">Health History</h1>
        </div>
      </div>

      <div className="space-y-2 px-5 mt-4">
        {history?.map((item: any, i: number) => (
          <motion.div
            key={item.id || i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="flex items-center gap-3 rounded-lg bg-card p-4 medical-shadow"
          >
            {item.status === "normal" ? (
              <CheckCircle className="h-5 w-5 shrink-0 text-primary" />
            ) : (
              <AlertCircle className="h-5 w-5 shrink-0 text-warning" />
            )}
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">{item.description}</p>
              <p className="text-xs text-muted-foreground">{new Date(item.date).toLocaleDateString()}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <BottomNav />
    </div>
  );
};

export default HealthHistoryScreen;
