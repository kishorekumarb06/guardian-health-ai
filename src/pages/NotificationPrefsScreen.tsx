import { useLocalStorage } from "@/hooks/useLocalStorage";
import { motion } from "framer-motion";
import { ArrowLeft, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SectionHeader } from "@/components/health/SectionHeader";
import { toast } from "@/hooks/use-toast";

const NotificationPrefsScreen = () => {
  const navigate = useNavigate();

  const [alerts, setAlerts] = useLocalStorage("hg_alert_prefs", {
    emergency: true,
    fallDetection: true,
    heartRisk: true,
    silentMode: false,
  });

  const [sound, setSound] = useLocalStorage("hg_alert_sound", "default");

  const [recipients, setRecipients] = useLocalStorage("hg_alert_recipients", {
    user: true,
    family: true,
    doctor: false,
    emergencyServices: false,
  });

  const toggleAlert = (key: keyof typeof alerts) =>
    setAlerts((p) => ({ ...p, [key]: !p[key] }));

  const toggleRecipient = (key: keyof typeof recipients) =>
    setRecipients((p) => ({ ...p, [key]: !p[key] }));

  const handleSave = () => {
    toast({
      title: "✅ Preferences Saved",
      description: "Notification settings saved and will persist across sessions.",
    });
  };

  const handleTest = () => {
    toast({ title: "Test Notification", description: `Playing sound: ${sound.replace("-", " ")}` });
  };

  return (
    <div className="min-h-screen bg-background pb-10">
      <div className="px-5 pt-[max(env(safe-area-inset-top),1rem)]">
        {/* Header */}
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3 py-4">
          <button onClick={() => navigate("/profile")} className="flex h-9 w-9 items-center justify-center rounded-xl bg-card medical-shadow">
            <ArrowLeft className="h-4 w-4 text-foreground" />
          </button>
          <h1 className="text-lg font-extrabold text-foreground">Notification Preferences</h1>
        </motion.div>

        {/* Alert Toggles */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="mb-4 rounded-2xl bg-card p-4 medical-shadow space-y-4">
          <SectionHeader title="Alert Toggles" />
          <ToggleRow label="Emergency Alerts" checked={alerts.emergency} onChange={() => toggleAlert("emergency")} />
          <ToggleRow label="Fall Detection Alerts" checked={alerts.fallDetection} onChange={() => toggleAlert("fallDetection")} />
          <ToggleRow label="Heart Risk Alerts" checked={alerts.heartRisk} onChange={() => toggleAlert("heartRisk")} />
          <ToggleRow label="Silent Mode" checked={alerts.silentMode} onChange={() => toggleAlert("silentMode")} />
        </motion.div>

        {/* Sound Selection */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-4 rounded-2xl bg-card p-4 medical-shadow space-y-3">
          <SectionHeader title="Notification Sound" />
          <Select value={sound} onValueChange={setSound}>
            <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="soft-beep">Soft Beep</SelectItem>
              <SelectItem value="emergency-siren">Emergency Siren</SelectItem>
              <SelectItem value="calm-tone">Calm Tone</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="w-full rounded-xl gap-1.5" onClick={handleTest}>
            <Bell className="h-4 w-4" /> Test Notification
          </Button>
        </motion.div>

        {/* Recipients */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mb-6 rounded-2xl bg-card p-4 medical-shadow space-y-4">
          <SectionHeader title="Who Should Receive Alerts" />
          <ToggleRow label="User Only" checked={recipients.user} onChange={() => toggleRecipient("user")} />
          <ToggleRow label="Family Members" checked={recipients.family} onChange={() => toggleRecipient("family")} />
          <ToggleRow label="Doctor" checked={recipients.doctor} onChange={() => toggleRecipient("doctor")} />
          <ToggleRow label="Emergency Services" checked={recipients.emergencyServices} onChange={() => toggleRecipient("emergencyServices")} />
        </motion.div>

        <Button className="w-full rounded-xl" onClick={handleSave}>Save Settings</Button>
      </div>
    </div>
  );
};

const ToggleRow = ({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) => (
  <div className="flex items-center justify-between">
    <span className="text-sm font-medium text-foreground">{label}</span>
    <Switch checked={checked} onCheckedChange={onChange} />
  </div>
);

export default NotificationPrefsScreen;
