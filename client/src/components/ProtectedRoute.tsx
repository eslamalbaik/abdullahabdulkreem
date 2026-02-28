import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute: React.FC = () => {
    const [status, setStatus] = useState<'loading' | 'authenticated' | 'unauthenticated' | 'forbidden'>('loading');

    useEffect(() => {
        // Check if the user has an active Passport session and get their role
        fetch('/api/auth/user', { credentials: 'include' })
            .then(async (res) => {
                if (res.ok) {
                    const user = await res.json();
                    if (user.role === 'admin') {
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
