import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Plus, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ContactCard } from "@/components/health/ContactCard";
import { fetchContacts, USER_ID } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

const EmergencyContactsScreen = () => {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState<any[]>([]);

  const { data, isLoading } = useQuery({
    queryKey: ['contacts', USER_ID],
    queryFn: () => fetchContacts(USER_ID)
  });

  useEffect(() => {
    if (data) setContacts(data);
  }, [data]);

  const handleToggle = (contactId: string, field: string, value: boolean) => {
    setContacts((prev) =>
      prev.map((c) => (c.id === contactId ? { ...c, [field]: value } : c))
    );
  };

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
          <h1 className="text-base font-extrabold text-foreground">Emergency Contacts</h1>
          <div className="flex gap-2">
            <button
              onClick={() => {
                toast({ title: "✅ Contacts Saved", description: "Contact preferences saved to device." });
              }}
              className="flex h-9 items-center justify-center rounded-full bg-primary px-3 text-[11px] font-bold text-primary-foreground medical-shadow"
            >
              Save
            </button>
            <button className="flex h-9 w-9 items-center justify-center rounded-full medical-gradient">
              <Plus className="h-4 w-4 text-primary-foreground" />
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-3 px-5">
        {contacts.map((contact, i) => (
          <ContactCard
            key={contact.id}
            {...contact}
            onToggle={(field, value) => handleToggle(contact.id, field, value)}
            delay={i * 0.1}
          />
        ))}

        {/* Info card */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex gap-3 rounded-lg bg-accent p-4"
        >
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <p className="text-xs leading-relaxed text-accent-foreground">
            When a fall or emergency is detected, contacts marked with Auto Call will be dialed immediately.
            SOS SMS sends your GPS location. App Alerts push real-time notifications.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default EmergencyContactsScreen;
