import React, { useState, useEffect } from 'react';
import { Bell, Search, Moon, Sun, Menu, ChevronDown, User, Key, LogOut, CheckCircle, Clock, Globe } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useTheme } from '@/hooks/use-theme';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';
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
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Notification {
    id: string;
    type: string;
    title: string;
    message: string;
    read: boolean;
    createdAt: string;
}

interface NavbarProps {
    toggleSidebar: () => void;
}

const DashboardNavbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);
    const { theme, setTheme } = useTheme();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);

    const displayName = user?.firstName || user?.name || 'مدير';
    const displayRole = user?.role === 'admin' ? 'مدير النظام' : user?.role || 'مستخدم';

    // Fetch notifications
    const { data: notifications = [] } = useQuery<Notification[]>({
        queryKey: ['/api/admin/notifications'],
        queryFn: async () => {
            const res = await fetch('/api/admin/notifications');
            if (!res.ok) throw new Error('Failed to fetch notifications');
            return res.json();
        },
        refetchInterval: 30000, // Poll every 30 seconds
    });

    const unreadCount = notifications.filter(n => !n.read).length;

    // Mutation to mark a single notification as read
    const markReadMutation = useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`/api/admin/notifications/${id}/read`, {
                method: 'PATCH',
            });
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['/api/admin/notifications'] });
        }
    });

    // Mutation to mark all as read
    const markAllReadMutation = useMutation({
        mutationFn: async () => {
            const res = await fetch('/api/admin/notifications/mark-all-read', {
                method: 'PATCH',
            });
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['/api/admin/notifications'] });
            toast.success('تم تحديد الكل كمقروء');
        }
    });

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
                        className="pr-10 pl-4 py-2 bg-accent border-transparent focus:bg-background focus:border-primary border rounded-md outline-none transition-all w-64 lg:w-96 font-tajawal text-sm"
                    />
                </div>
            </div>

            <div className="flex items-center space-x-4 space-x-reverse">
                <button
                    onClick={() => navigate('/')}
                    className="p-2 rounded-full hover:bg-accent text-muted-foreground transition-colors flex items-center gap-2 px-3"
                    title="العودة للموقع"
                >
                    <Globe size={20} />
                    <span className="hidden lg:inline text-xs font-bold">عرض الموقع</span>
                </button>

                <button
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className="p-2 rounded-full hover:bg-accent text-muted-foreground transition-colors"
                >
                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>

                <DropdownMenu dir="rtl">
                    <DropdownMenuTrigger asChild>
                        <button className="p-2 rounded-full hover:bg-accent text-muted-foreground relative transition-colors outline-none">
                            <Bell size={20} />
                            {unreadCount > 0 && (
                                <Badge className="absolute -top-1 -left-1 w-5 h-5 p-0 flex items-center justify-center bg-destructive text-destructive-foreground border-2 border-background animate-pulse">
                                    {unreadCount}
                                </Badge>
                            )}
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-80 font-tajawal p-0">
                        <div className="flex items-center justify-between p-4 border-b">
                            <DropdownMenuLabel className="font-bold p-0">الإشعارات</DropdownMenuLabel>
                            {unreadCount > 0 && (
                                <button 
                                    onClick={() => markAllReadMutation.mutate()}
                                    className="text-xs text-primary hover:underline"
                                >
                                    تحديد الكل كمقروء
                                </button>
                            )}
                        </div>
                        
                        <ScrollArea className="h-80">
                            {notifications.length > 0 ? (
                                <div className="flex flex-col">
                                    {notifications.map((notification) => (
                                        <div 
                                            key={notification.id} 
                                            onClick={() => !notification.read && markReadMutation.mutate(notification.id)}
                                            className={`
                                                flex flex-col gap-1 p-4 border-b last:border-0 cursor-pointer transition-colors
                                                ${notification.read ? 'bg-background' : 'bg-primary/5 hover:bg-primary/10 border-r-4 border-r-primary'}
                                            `}
                                        >
                                            <div className="flex items-start justify-between gap-2">
                                                <p className={`text-sm font-semibold leading-none ${notification.read ? 'text-foreground/70' : 'text-foreground'}`}>
                                                    {notification.title}
                                                </p>
                                                {!notification.read && <div className="w-2 h-2 rounded-full bg-primary mt-1" />}
                                            </div>
                                            <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                                                {notification.message}
                                            </p>
                                            <div className="flex items-center gap-2 mt-2 text-[10px] text-muted-foreground">
                                                <Clock size={10} />
                                                <span>{formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true, locale: ar })}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-12 text-center text-sm text-muted-foreground">
                                    <Bell className="w-8 h-8 mx-auto mb-3 opacity-20" />
                                    لا توجد إشعارات حتى الآن
                                </div>
                            )}
                        </ScrollArea>
                        
                        <DropdownMenuSeparator className="m-0" />
                        <div className="p-2">
                            <button className="w-full py-2 text-xs text-primary hover:bg-accent rounded transition-colors">
                                عرض جميع الإشعارات
                            </button>
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>

                <div className="h-8 w-px bg-border mx-2"></div>

                <DropdownMenu dir="rtl">
                    <DropdownMenuTrigger asChild>
                        <div className="flex items-center space-x-3 space-x-reverse cursor-pointer p-1 rounded-md hover:bg-accent transition-colors group px-2">
                            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold shrink-0">
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
                        <DropdownMenuLabel className="font-bold text-center py-2">{displayName}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer gap-2 justify-start py-2">
                            <User size={16} />
                            <span>الملف الشخصي</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="cursor-pointer gap-2 justify-start py-2"
                            onClick={() => setIsPasswordDialogOpen(true)}
                        >
                            <Key size={16} />
                            <span>تغيير كلمة المرور</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="cursor-pointer gap-2 justify-start text-destructive focus:text-destructive py-2"
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

