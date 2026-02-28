import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import { register } from '@/services/api';

const Register = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !email || !password) {
            setError('Please fill in all fields');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await register({ name, email, password });
            // Redirect to login after successful registration
            navigate('/login');
        } catch (err: any) {
            setError(err?.response?.data?.error || 'Failed to register. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col justify-center px-5 pb-[72px]">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-sm mx-auto"
            >
                <div className="flex justify-center mb-6">
                    <div className="h-16 w-16 rounded-2xl bg-primary flex items-center justify-center medical-shadow">
                        <ShieldCheck className="h-8 w-8 text-primary-foreground" />
                    </div>
                </div>

                <h1 className="text-2xl font-extrabold text-center text-foreground mb-2">Create Account</h1>
                <p className="text-sm text-center text-muted-foreground mb-8">Join Guardian Health to monitor your vitals securely.</p>

                {error && (
                    <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500 rounded-lg text-rose-500 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Full Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground transition-all placeholder:text-muted-foreground"
                            placeholder="John Doe"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground transition-all placeholder:text-muted-foreground"
                            placeholder="john@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground transition-all placeholder:text-muted-foreground"
                            placeholder="Create a strong password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl px-4 py-3.5 mt-2 transition-all disabled:opacity-70"
                    >
                        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                            <>
                                Create Account <ArrowRight className="h-4 w-4" />
                            </>
                        )}
                    </button>
                </form>

                <p className="mt-8 text-center text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary font-semibold hover:underline">
                        Sign In Here
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Register;
