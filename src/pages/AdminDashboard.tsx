import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Users, LogOut, ArrowLeft, Loader2, Trash2 } from 'lucide-react';
import api, { logout } from '@/services/api';

interface UserData {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
}

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const { data } = await api.get('/admin/users');
            setUsers(data);
        } catch (err) {
            console.error("Failed to fetch users", err);
        } finally {
            setLoading(false);
        }
    };

    const deleteUser = async (id: string) => {
        if (!confirm("Are you sure you want to delete this user?")) return;
        try {
            await api.delete(`/admin/users/${id}`);
            setUsers(users.filter(u => u.id !== id));
        } catch (err) {
            console.error("Failed to delete user", err);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex flex-col justify-center items-center">
                <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
                <p className="text-sm text-muted-foreground font-medium animate-pulse">Loading Admin Panel...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Header */}
            <div className="sticky top-0 z-40 bg-zinc-950 px-5 pb-3 py-[max(env(safe-area-inset-top),1rem)] shadow-sm">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button onClick={() => navigate(-1)} className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-900 shadow-sm border border-zinc-800">
                            <ArrowLeft className="h-4 w-4 text-white" />
                        </button>
                        <h1 className="text-base font-extrabold text-white flex items-center gap-1.5">
                            <ShieldAlert className="h-4 w-4 text-rose-500" />
                            Admin Console
                        </h1>
                    </div>
                    <button onClick={logout} className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-colors">
                        <LogOut className="h-4 w-4" />
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-6">
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-10 w-10 bg-zinc-100 rounded-full flex items-center justify-center">
                            <Users className="h-5 w-5 text-zinc-900" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-foreground">Registered Users</h2>
                            <p className="text-xs text-muted-foreground">Total: {users.length}</p>
                        </div>
                    </div>

                    <div className="grid gap-3">
                        {users.map(user => (
                            <div key={user.id} className="bg-card border border-border rounded-xl p-4 flex items-center justify-between shadow-sm">
                                <div>
                                    <h3 className="text-sm font-bold text-foreground">{user.name}</h3>
                                    <p className="text-xs text-muted-foreground">{user.email}</p>
                                    <div className="mt-2 flex gap-2">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${user.role === 'ADMIN' ? 'bg-amber-500/10 text-amber-600' : 'bg-primary/10 text-primary'}`}>
                                            {user.role}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <button
                                        onClick={() => deleteUser(user.id)}
                                        disabled={user.role === 'ADMIN'} // Prevent self deletion for demo
                                        className="p-2 bg-rose-500/10 text-rose-500 rounded-lg disabled:opacity-30 transition-colors hover:bg-rose-500 hover:text-white"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                </motion.div>
            </div>
        </div>
    );
};

export default AdminDashboard;
