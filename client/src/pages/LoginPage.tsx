import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Check if user is already authenticated
        const checkAuth = async () => {
            const token = localStorage.getItem('accessToken');
            if (!token) return;

            try {
                const res = await fetch('/api/auth/user', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
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
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem('accessToken', data.accessToken);
                toast.success('تم تسجيل الدخول بنجاح');
                navigate('/dashboard');
            } else {
                toast.error(data.message || 'فشل تسجيل الدخول');
            }
        } catch (err: any) {
            toast.error('خطأ في الاتصال — هل الخادم يعمل؟');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md border border-gray-200">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-bold text-gray-900">تسجيل الدخول</h2>
                    <p className="mt-2 text-sm text-gray-600">تسوق واستكشف الدورات والمزيد</p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={onSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني</label>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="email@example.com"
                                required
                                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">كلمة المرور</label>
                            <input
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
                        >
                            {loading ? 'جاري الدخول...' : 'دخول'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
