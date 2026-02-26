import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('admin@local.dev');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Check if user is already authenticated
        const checkAuth = async () => {
            try {
                const res = await fetch('/api/auth/user', { credentials: 'include' });
                if (res.ok) {
                    navigate('/dashboard');
                }
            } catch (err) {
                console.error('Auth check failed', err);
            }
        };
        checkAuth();
    }, [navigate]);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({ email, password }),
                redirect: 'follow',
                credentials: 'include',
            });

            if (res.ok || res.redirected) {
                toast.success('Login successful');
                // Passport redirects to "/" on success — navigate to dashboard
                navigate('/dashboard');
            } else {
                const text = await res.text();
                const isFailMsg = text.includes('فشل') || text.includes('غير صحيحة');
                toast.error(isFailMsg ? 'Invalid email or password' : `Login failed (${res.status})`);
            }
        } catch (err: any) {
            toast.error('Network error — is the server running?');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <div className="max-w-md w-full space-y-8 p-10 bg-card rounded-xl shadow-lg border">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-extrabold text-foreground">Sign in to your account</h2>
                    <p className="mt-2 text-sm text-muted-foreground">Admin Dashboard Access</p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={onSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="Email address"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-input bg-background placeholder-muted-foreground text-foreground rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                            />
                        </div>
                        <div className="mt-4">
                            <input
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="Password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-input bg-background placeholder-muted-foreground text-foreground rounded-b-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors disabled:opacity-60"
                        >
                            {loading ? 'Signing in…' : 'Sign in'}
                        </button>
                    </div>

                    <p className="text-center text-xs text-muted-foreground">
                        Default: <code>admin@local.dev</code> / password from <code>.env</code>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
