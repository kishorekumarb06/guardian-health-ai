import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Download, Upload, FileText, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/health/StatusBadge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

const records = [
  { id: "1", title: "General Checkup Report", date: "12 Jan 2026", doctor: "Dr. Arun Kumar", status: "Normal", variant: "success" as const },
  { id: "2", title: "Blood Test Report", date: "02 Feb 2026", doctor: "Dr. Meena Raj", status: "Slightly Elevated Sugar Level", variant: "warning" as const },
  { id: "3", title: "Cardiac Evaluation", date: "18 Feb 2026", doctor: "Dr. Suresh Kumar", status: "Under Observation", variant: "warning" as const },
];

const MedicalRecordsScreen = () => {
  const navigate = useNavigate();
  const [viewRecord, setViewRecord] = useState<typeof records[0] | null>(null);

  return (
    <div className="min-h-screen bg-background pb-10">
      <div className="px-5 pt-[max(env(safe-area-inset-top),1rem)]">
        {/* Header */}
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/profile")} className="flex h-9 w-9 items-center justify-center rounded-xl bg-card medical-shadow">
              <ArrowLeft className="h-4 w-4 text-foreground" />
            </button>
            <h1 className="text-lg font-extrabold text-foreground">Medical Records</h1>
          </div>
          <Button size="sm" className="rounded-xl gap-1.5" onClick={() => toast({ title: "Upload", description: "File upload dialog would open here." })}>
            <Upload className="h-4 w-4" /> Upload
          </Button>
        </motion.div>

        {/* Records */}
        <div className="space-y-3">
          {records.map((rec, i) => (
            <motion.div
              key={rec.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="rounded-2xl bg-card p-4 medical-shadow"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">{rec.title}</p>
                  <p className="text-xs text-muted-foreground">{rec.date} • {rec.doctor}</p>
                  <div className="mt-1.5">
                    <StatusBadge label={rec.status} variant={rec.variant} />
                  </div>
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 rounded-xl text-xs" onClick={() => setViewRecord(rec)}>
                  View Report
                </Button>
                <Button variant="outline" size="sm" className="flex-1 rounded-xl text-xs gap-1" onClick={() => toast({ title: "Downloading", description: `${rec.title} download started.` })}>
                  <Download className="h-3.5 w-3.5" /> Download
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* View Report Modal */}
      <Dialog open={!!viewRecord} onOpenChange={() => setViewRecord(null)}>
        <DialogContent className="rounded-2xl max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-base">{viewRecord?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 text-sm">
            <p><span className="font-medium text-muted-foreground">Date:</span> {viewRecord?.date}</p>
            <p><span className="font-medium text-muted-foreground">Doctor:</span> {viewRecord?.doctor}</p>
            <p><span className="font-medium text-muted-foreground">Status:</span> {viewRecord?.status}</p>
            <div className="mt-4 rounded-xl bg-muted/50 p-4 text-xs text-muted-foreground">
              This is a placeholder for the full medical report content. In a production app, the actual report PDF or detailed results would be displayed here.
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MedicalRecordsScreen;
