import { motion } from "framer-motion";

interface ContactCardProps {
  name: string;
  relationship: string;
  email: string;
  avatar: string;
  autoCall: boolean;
  sosSms: boolean;
  appAlerts: boolean;
  onToggle: (field: string, value: boolean) => void;
  delay?: number;
}

const Toggle = ({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) => (
  <button
    onClick={onToggle}
    className={`relative h-6 w-11 rounded-full transition-colors ${enabled ? "bg-primary" : "bg-muted"}`}
  >
    <span
      className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-card transition-transform shadow-sm ${enabled ? "translate-x-5" : "translate-x-0"
        }`}
    />
  </button>
);

export const ContactCard = ({
  name, relationship, email, avatar, autoCall, sosSms, appAlerts, onToggle, delay = 0,
}: ContactCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
    className="rounded-lg bg-card p-4 medical-shadow"
  >
    <div className="mb-4 flex items-center gap-3">
      <div className="flex h-12 w-12 items-center justify-center rounded-full medical-gradient text-sm font-bold text-primary-foreground">
        {avatar}
      </div>
      <div className="flex-1">
        <p className="text-sm font-bold text-foreground">{name}</p>
        <p className="text-xs text-muted-foreground">{relationship}</p>
        <p className="text-xs text-primary font-medium">{email}</p>
      </div>
    </div>
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">Auto Call on Emergency</span>
        <Toggle enabled={autoCall} onToggle={() => onToggle("autoCall", !autoCall)} />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">Send SOS SMS</span>
        <Toggle enabled={sosSms} onToggle={() => onToggle("sosSms", !sosSms)} />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">App Alerts</span>
        <Toggle enabled={appAlerts} onToggle={() => onToggle("appAlerts", !appAlerts)} />
      </div>
    </div>
  </motion.div>
);
