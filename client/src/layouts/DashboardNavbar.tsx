import React, { useState } from 'react';
import { Bell, Search, Moon, Sun, Menu, ChevronDown, User, Key, LogOut } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useTheme } from '@/hooks/use-theme';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChangePasswordDialog } from '@/components/ChangePasswordDialog';

interface NavbarProps {
    toggleSidebar: () => void;
}

const DashboardNavbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);
    const { theme, setTheme } = useTheme();
    const navigate = useNavigate();
    const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);

    const displayName = user?.firstName || user?.name || 'مدير';
    const displayRole = user?.role === 'admin' ? 'مدير النظام' : user?.role || 'مستخدم';

    const handleLogout = async () => {
        try {
            const response = await fetch('/api/logout');
            if (response.ok || response.redirected) {
                logout();
                toast.success('تم تسجيل الخروج بنجاح');
                navigate('/login');
            }
        } catch (error) {
            toast.error('حدث خطأ أثناء تسجيل الخروج');
        }
    };

    return (
        <header dir="rtl" className="h-16 bg-card border-b flex items-center justify-between px-6 sticky top-0 z-20">
            <div className="flex items-center">
                <button
                    onClick={toggleSidebar}
                    className="p-2 rounded-md hover:bg-accent text-muted-foreground ml-4 lg:hidden"
                >
                    <Menu size={20} />
                </button>
                <div className="relative group">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="بحث..."
                        className="pr-10 pl-4 py-2 bg-accent border-transparent focus:bg-background focus:border-primary border rounded-md outline-none transition-all w-64 lg:w-96 font-tajawal"
                    />
                </div>
            </div>

            <div className="flex items-center space-x-4 space-x-reverse">
                <button
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className="p-2 rounded-full hover:bg-accent text-muted-foreground transition-colors"
                >
                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>

                <button className="p-2 rounded-full hover:bg-accent text-muted-foreground relative transition-colors">
                    <Bell size={20} />
                    <span className="absolute top-2 left-2 w-2 h-2 bg-destructive rounded-full border border-background"></span>
                </button>

                <div className="h-8 w-px bg-border mx-2"></div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <div className="flex items-center space-x-3 space-x-reverse cursor-pointer p-1 rounded-md hover:bg-accent transition-colors group">
                            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                                {displayName.charAt(0)}
                            </div>
                            <div className="hidden sm:block text-right">
                                <p className="text-sm font-medium leading-none mb-1">{displayName}</p>
                                <p className="text-xs text-muted-foreground">{displayRole}</p>
                            </div>
                            <ChevronDown size={14} className="text-muted-foreground group-data-[state=open]:rotate-180 transition-transform" />
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 font-tajawal">
                        <DropdownMenuLabel className="font-bold">حسابي</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer gap-2 justify-start">
                            <User size={16} />
                            <span>الملف الشخصي</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="cursor-pointer gap-2 justify-start"
                            onClick={() => setIsPasswordDialogOpen(true)}
                        >
                            <Key size={16} />
                            <span>تغيير كلمة المرور</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="cursor-pointer gap-2 justify-start text-destructive focus:text-destructive"
                            onClick={handleLogout}
                        >
                            <LogOut size={16} />
                            <span>تسجيل الخروج</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <ChangePasswordDialog
                open={isPasswordDialogOpen}
                onOpenChange={setIsPasswordDialogOpen}
            />
        </header>
    );
};

export default DashboardNavbar;
