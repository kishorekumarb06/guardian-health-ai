import { useLocalStorage } from "@/hooks/useLocalStorage";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SectionHeader } from "@/components/health/SectionHeader";
import { toast } from "@/hooks/use-toast";

const PersonalInfoScreen = () => {
  const navigate = useNavigate();
  const [form, setForm] = useLocalStorage("hg_personal_info", {
    fullName: "John Doe",
    age: "45",
    gender: "male",
    height: "175",
    weight: "78",
    bloodGroup: "O+",
    systolic: "120",
    diastolic: "80",
    diabetes: false,
    thyroid: false,
    heartCondition: false,
    emergencyName1: "Maria Rodriguez",
    emergencyPhone1: "+1 (555) 345-6789",
    emergencyName2: "James Mitchell",
    emergencyPhone2: "+1 (555) 876-5432",
  });

  const update = (key: string, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSave = () => {
    toast({
      title: "✅ Profile Saved",
      description: "Your information is saved and will persist across sessions.",
    });
    navigate("/profile");
  };

  return (
    <div className="min-h-screen bg-background pb-10">
      <div className="px-5 pt-[max(env(safe-area-inset-top),1rem)]">
        {/* Header */}
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3 py-4">
          <button onClick={() => navigate("/profile")} className="flex h-9 w-9 items-center justify-center rounded-xl bg-card medical-shadow">
            <ArrowLeft className="h-4 w-4 text-foreground" />
          </button>
          <h1 className="text-lg font-extrabold text-foreground">Personal Information</h1>
        </motion.div>

        {/* Basic Details */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="mb-4 rounded-2xl bg-card p-4 medical-shadow space-y-4">
          <SectionHeader title="Basic Details" />

          <div className="space-y-3">
            <Field label="Full Name">
              <Input value={form.fullName} onChange={(e) => update("fullName", e.target.value)} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Age">
                <Input type="number" value={form.age} onChange={(e) => update("age", e.target.value)} />
              </Field>
              <Field label="Gender">
                <Select value={form.gender} onValueChange={(v) => update("gender", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Height (cm)">
                <Input type="number" value={form.height} onChange={(e) => update("height", e.target.value)} />
              </Field>
              <Field label="Weight (kg)">
                <Input type="number" value={form.weight} onChange={(e) => update("weight", e.target.value)} />
              </Field>
            </div>
            <Field label="Blood Group">
              <Select value={form.bloodGroup} onValueChange={(v) => update("bloodGroup", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                    <SelectItem key={bg} value={bg}>{bg}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>
        </motion.div>

        {/* Health Parameters */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-4 rounded-2xl bg-card p-4 medical-shadow space-y-4">
          <SectionHeader title="Health Parameters" />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Systolic (mmHg)">
              <Input type="number" value={form.systolic} onChange={(e) => update("systolic", e.target.value)} />
            </Field>
            <Field label="Diastolic (mmHg)">
              <Input type="number" value={form.diastolic} onChange={(e) => update("diastolic", e.target.value)} />
            </Field>
          </div>
          <ToggleRow label="Diabetes" checked={form.diabetes} onChange={(v) => update("diabetes", v)} />
          <ToggleRow label="Thyroid" checked={form.thyroid} onChange={(v) => update("thyroid", v)} />
          <ToggleRow label="Heart Condition" checked={form.heartCondition} onChange={(v) => update("heartCondition", v)} />
        </motion.div>

        {/* Emergency Details */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mb-6 rounded-2xl bg-card p-4 medical-shadow space-y-4">
          <SectionHeader title="Emergency Details" />
          <p className="text-xs font-semibold text-muted-foreground">Primary Contact</p>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Name">
              <Input value={form.emergencyName1} onChange={(e) => update("emergencyName1", e.target.value)} />
            </Field>
            <Field label="Phone">
              <Input value={form.emergencyPhone1} onChange={(e) => update("emergencyPhone1", e.target.value)} />
            </Field>
          </div>
          <p className="text-xs font-semibold text-muted-foreground">Secondary Contact</p>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Name">
              <Input value={form.emergencyName2} onChange={(e) => update("emergencyName2", e.target.value)} />
            </Field>
            <Field label="Phone">
              <Input value={form.emergencyPhone2} onChange={(e) => update("emergencyPhone2", e.target.value)} />
            </Field>
          </div>
        </motion.div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1 rounded-xl" onClick={() => navigate("/profile")}>Cancel</Button>
          <Button className="flex-1 rounded-xl" onClick={handleSave}>Save Changes</Button>
        </div>
      </div>
    </div>
  );
};

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="space-y-1">
    <Label className="text-xs text-muted-foreground">{label}</Label>
    {children}
  </div>
);

const ToggleRow = ({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) => (
  <div className="flex items-center justify-between">
    <span className="text-sm font-medium text-foreground">{label}</span>
    <Switch checked={checked} onCheckedChange={onChange} />
  </div>
);

export default PersonalInfoScreen;
