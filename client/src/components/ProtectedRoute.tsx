import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute: React.FC = () => {
    const [status, setStatus] = useState<'loading' | 'authenticated' | 'unauthenticated' | 'forbidden'>('loading');

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            setStatus('unauthenticated');
            return;
        }

        // Check if the user has an active JWT session and get their role
        fetch('/api/auth/user', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(async (res) => {
                if (res.ok) {
                    const user = await res.json();
                    if (user.role === 'Admin' || user.role === 'Editor') {
                        setStatus('authenticated');
                    } else {
                        setStatus('forbidden');
                    }
                } else {
                    setStatus('unauthenticated');
                }
            })
            .catch(() => setStatus('unauthenticated'));
    }, []);

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <p className="text-muted-foreground font-tajawal">جاري التحميل...</p>
            </div>
        );
    }

    if (status === 'unauthenticated') {
        return <Navigate to="/login" replace />;
    }

    if (status === 'forbidden') {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
