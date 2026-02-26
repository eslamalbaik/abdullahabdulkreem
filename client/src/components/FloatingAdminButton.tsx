import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { motion } from 'framer-motion';

const FloatingAdminButton: React.FC = () => {
    const { user } = useAuth();

    if (user?.role !== 'admin') return null;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed bottom-6 right-6 z-[60]"
        >
            <Link
                to="/dashboard"
                className="flex items-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-full shadow-2xl hover:bg-primary/90 transition-all font-tajawal font-bold border-2 border-primary-foreground/20"
            >
                <LayoutDashboard className="w-5 h-5" />
                <span>العودة للوحة التحكم</span>
            </Link>
        </motion.div>
    );
};

export default FloatingAdminButton;
