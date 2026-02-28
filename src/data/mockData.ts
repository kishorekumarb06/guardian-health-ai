export const mockContacts = [
  {
    id: "1",
    name: "Dr. Sarah Chen",
    relationship: "Primary Physician",
    phone: "+1 (555) 234-5678",
    avatar: "SC",
    autoCall: true,
    sosSms: true,
    appAlerts: true,
  },
  {
    id: "2",
    name: "James Mitchell",
    relationship: "Emergency Contact",
    phone: "+1 (555) 876-5432",
    avatar: "JM",
    autoCall: true,
    sosSms: false,
    appAlerts: true,
  },
  {
    id: "3",
    name: "Maria Rodriguez",
    relationship: "Spouse",
    phone: "+1 (555) 345-6789",
    avatar: "MR",
    autoCall: true,
    sosSms: true,
    appAlerts: true,
  },
];

export const mockVitals = {
  heartRate: 72,
  bodyTemp: 98.6,
  spO2: 98,
  bloodPressure: "120/80",
  steps: 4287,
  riskLevel: "LOW" as const,
};

export const mockHealthHistory = [
  { date: "Today", event: "Routine vitals check", status: "normal" },
  { date: "Yesterday", event: "Mild heart rate elevation", status: "warning" },
  { date: "2 days ago", event: "All vitals normal", status: "normal" },
  { date: "3 days ago", event: "SpO2 dip detected — resolved", status: "warning" },
  { date: "5 days ago", event: "Fall risk assessment passed", status: "normal" },
];

export const mockTelemetry = {
  transmission: 82,
  location: "37.7749° N, 122.4194° W",
  heartRate: 72,
  spO2: 98,
  ambientAudio: "Active — Monitoring",
};
