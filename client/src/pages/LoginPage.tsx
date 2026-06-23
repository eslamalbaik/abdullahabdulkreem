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
                toast.success('تم تسجيل الدخول بنجاح');
                // Passport redirects to "/" on success — navigate to dashboard
                navigate('/dashboard');
            } else {
                const text = await res.text();
                const isFailMsg = text.includes('فشل') || text.includes('غير صحيحة');
                toast.error(isFailMsg ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة' : `فشل تسجيل الدخول (${res.status})`);
            }
        } catch (err: any) {
            toast.error('تعذّر الاتصال بالخادم — تأكد من أن الخادم يعمل');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div dir="rtl" className="min-h-screen flex items-center justify-center bg-background px-4">
            <div className="max-w-md w-full space-y-8 p-10 bg-card rounded-2xl shadow-lg border">
                <div className="text-center">
                    <img
                        src="/logo.png"
                        alt="الشعار"
                        className="mx-auto h-16 w-auto object-contain mb-4"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                    <h2 className="text-2xl font-extrabold text-foreground">تسجيل الدخول</h2>
                    <p className="mt-2 text-sm text-muted-foreground">الدخول إلى لوحة التحكم</p>
                </div>
                <form className="mt-8 space-y-5" onSubmit={onSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium mb-1.5">البريد الإلكتروني</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="username"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="admin@example.com"
                                required
                                className="appearance-none relative block w-full px-3 py-2.5 border border-input bg-background placeholder-muted-foreground text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium mb-1.5">كلمة المرور</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                className="appearance-none relative block w-full px-3 py-2.5 border border-input bg-background placeholder-muted-foreground text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-semibold rounded-lg text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors disabled:opacity-60"
                        >
                            {loading ? 'جاري الدخول…' : 'دخول إلى لوحة التحكم'}
                        </button>
                    </div>

                    <p className="text-center text-xs text-muted-foreground">
                        الوصول مقيّد للمسؤولين المصرّح لهم فقط
                    </p>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
