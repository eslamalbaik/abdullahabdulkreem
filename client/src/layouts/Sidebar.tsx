import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Package,
    Palette,
    LayoutGrid,
    MessageSquare,
    Settings,
    LogOut,
    ChevronRight,
    ChevronLeft,
    GraduationCap,
    ClipboardList,
    Star,
    ExternalLink,
    Globe
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/useAuthStore';

interface SidebarProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
    const location = useLocation();
    const logout = useAuthStore((state) => state.logout);

    const menuItems = [
        { name: 'لوحة التحكم', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
        { name: 'رسائل التواصل', icon: <MessageSquare size={20} />, path: '/dashboard/contacts' },
        { name: 'المنتجات', icon: <Package size={20} />, path: '/dashboard/products' },
        { name: 'الدورات', icon: <GraduationCap size={20} />, path: '/dashboard/courses' },
        { name: 'الهوية البصرية', icon: <Palette size={20} />, path: '/dashboard/identities' },
        { name: 'الأعمال', icon: <LayoutGrid size={20} />, path: '/dashboard/projects' },
        { name: 'شعارات العملاء', icon: <Palette size={20} />, path: '/dashboard/logos' },
        { name: 'التوصيات', icon: <MessageSquare size={20} />, path: '/dashboard/testimonials' },
        { name: 'الاستبيانات', icon: <ClipboardList size={20} />, path: '/dashboard/questionnaires' },
        { name: 'العروض', icon: <Star size={20} />, path: '/dashboard/discounts' },
        { name: 'الإعدادات', icon: <Settings size={20} />, path: '/dashboard/settings' },
    ];


    return (
        <aside
            dir="rtl"
            className={cn(
                "flex flex-col bg-card border-l transition-all duration-300 ease-in-out z-30",
                isOpen ? "w-64" : "w-20"
            )}
        >
            <div className="flex items-center justify-between h-16 px-4 border-b">
                {isOpen && <span className="text-xl font-bold text-primary">لوحة التحكم</span>}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-1 rounded-md hover:bg-accent text-muted-foreground"
                >
                    {isOpen ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                </button>
            </div>

            <nav className="flex-1 px-2 py-4 space-y-2 overflow-y-auto overflow-x-hidden">
                {menuItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={cn(
                            "flex items-center px-3 py-2 rounded-md transition-colors",
                            location.pathname === item.path
                                ? "bg-primary text-primary-foreground"
                                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        )}
                    >
                        <div className="min-w-[24px]">{item.icon}</div>
                        {isOpen && <span className="mr-3 font-medium truncate">{item.name}</span>}
                    </Link>
                ))}
            </nav>

            <div className="p-2 border-t space-y-2">
                <Link
                    to="/"
                    className={cn(
                        "flex items-center w-full px-3 py-2 text-primary hover:bg-primary/10 rounded-md transition-colors",
                        !isOpen && "justify-center"
                    )}
                >
                    <Globe size={20} />
                    {isOpen && <span className="mr-3 font-medium">عرض الموقع</span>}
                </Link>
                <button
                    onClick={logout}
                    className={cn(
                        "flex items-center w-full px-3 py-2 text-destructive hover:bg-destructive/10 rounded-md transition-colors",
                        !isOpen && "justify-center"
                    )}
                >
                    <LogOut size={20} />
                    {isOpen && <span className="mr-3 font-medium">تسجيل الخروج</span>}
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
