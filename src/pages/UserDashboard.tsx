import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, ArrowLeft, Loader2, Save } from 'lucide-react';
import api, { logout } from '@/services/api';
import { BottomNav } from '@/components/health/BottomNav';
import { useToast } from "@/components/ui/use-toast";

interface ProfileData {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    bloodType: string | null;
    allergies: string | null;
    emergencyNotes: string | null;
    role: string;
}

const UserDashboard = () => {
    const navigate = useNavigate();
    const { toast } = useToast();

    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const { data } = await api.get('/profile');
            setProfile(data);
        } catch (err) {
            toast({ title: 'Failed to load profile', variant: 'destructive' });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (!profile) return;
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        if (!profile) return;
        setSaving(true);
        try {
            await api.put('/profile', {
                name: profile.name,
                phone: profile.phone,
                bloodType: profile.bloodType,
                allergies: profile.allergies,
                emergencyNotes: profile.emergencyNotes
            });
            toast({ title: 'Profile updated successfully', variant: 'default' });
        } catch (err) {
            toast({ title: 'Failed to update profile', variant: 'destructive' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex flex-col justify-center items-center">
                <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
                <p className="text-sm text-muted-foreground font-medium animate-pulse">Loading Profile...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex flex-col pb-[72px]">
            {/* Header */}
            <div className="sticky top-0 z-40 bg-background/90 backdrop-blur-lg px-5 pb-3 py-[max(env(safe-area-inset-top),1rem)] medical-gradient-blue shadow-sm">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button onClick={() => navigate(-1)} className="flex h-9 w-9 items-center justify-center rounded-full bg-card shadow-sm">
                            <ArrowLeft className="h-4 w-4 text-foreground" />
                        </button>
                        <h1 className="text-base font-extrabold text-foreground flex items-center gap-1.5">
                            Dashboard
                        </h1>
                    </div>
                    <button onClick={logout} className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-colors">
                        <LogOut className="h-4 w-4" />
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-6">
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

                    <div className="flex items-center gap-4 bg-card p-5 rounded-2xl border border-border shadow-sm">
                        <div className="h-14 w-14 rounded-full bg-primary/10 flex justify-center items-center text-primary font-bold text-xl">
                            {profile?.name?.charAt(0) || <User />}
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-foreground">{profile?.name}</h2>
                            <p className="text-xs font-medium text-muted-foreground">{profile?.email}</p>
                            <div className="mt-1 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-accent text-accent-foreground">
                                ROLE: {profile?.role}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-sm font-extrabold text-muted-foreground uppercase tracking-wider pl-1">Medical Details</h3>

                        <div>
                            <label className="block text-xs font-bold text-foreground mb-1.5 pl-1">Full Name</label>
                            <input name="name" value={profile?.name || ''} onChange={handleChange} className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground transition-all" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-foreground mb-1.5 pl-1">Blood Type</label>
                                <input name="bloodType" value={profile?.bloodType || ''} onChange={handleChange} placeholder="e.g. O+" className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground transition-all" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-foreground mb-1.5 pl-1">Phone</label>
                                <input name="phone" value={profile?.phone || ''} onChange={handleChange} placeholder="+1..." className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground transition-all" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-foreground mb-1.5 pl-1">Allergies</label>
                            <input name="allergies" value={profile?.allergies || ''} onChange={handleChange} placeholder="Peanuts, Penicillin..." className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground transition-all" />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-foreground mb-1.5 pl-1">Emergency Notes</label>
                            <textarea name="emergencyNotes" value={profile?.emergencyNotes || ''} onChange={handleChange} rows={3} placeholder="Important medical conditions..." className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground transition-all resize-none" />
                        </div>

                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="w-full mt-2 flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl px-4 py-3.5 transition-all disabled:opacity-70"
                        >
                            {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Save className="h-4 w-4" /> Save Profile</>}
                        </button>
                    </div>
                </motion.div>
            </div>

            <BottomNav />
        </div>
    );
};

export default UserDashboard;
