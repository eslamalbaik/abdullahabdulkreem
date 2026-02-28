import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
    LayoutGrid,
    Package,
    Palette,
    MessageSquare,
    TrendingUp,
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

const StatsCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; color: string }> = ({
    title, value, icon, color
}) => (
    <div className="bg-card p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg ${color}`}>
                {icon}
            </div>
            <TrendingUp size={16} className="text-green-500" />
        </div>
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <p className="text-3xl font-bold mt-1">{value}</p>
    </div>
);

const DashboardHome: React.FC = () => {
    const { data: projects = [] } = useQuery<any[]>({
        queryKey: ['/api/projects'],
        queryFn: async () => {
            const res = await fetch('/api/projects', { credentials: 'include' });
            if (!res.ok) throw new Error('Failed');
            return res.json();
        },
    });

    const { data: products = [] } = useQuery<any[]>({
        queryKey: ['/api/products'],
        queryFn: async () => {
            const res = await fetch('/api/products', { credentials: 'include' });
            if (!res.ok) throw new Error('Failed');
            const data = await res.json();
            return Array.isArray(data) ? data : data.products || [];
        },
    });

    const { data: identities = [] } = useQuery<any[]>({
        queryKey: ['/api/identities'],
        queryFn: async () => {
            const res = await fetch('/api/identities', { credentials: 'include' });
            if (!res.ok) throw new Error('Failed');
            return res.json();
        },
    });

    const { data: testimonials = [] } = useQuery<any[]>({
        queryKey: ['/api/testimonials'],
        queryFn: async () => {
            const res = await fetch('/api/testimonials', { credentials: 'include' });
            if (!res.ok) throw new Error('Failed');
            return res.json();
        },
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">نظرة عامة</h1>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="الأعمال"
                    value={projects.length}
                    icon={<LayoutGrid size={24} className="text-blue-600" />}
                    color="bg-blue-500/10"
                />
                <StatsCard
                    title="المنتجات"
                    value={products.length}
                    icon={<Package size={24} className="text-purple-600" />}
                    color="bg-purple-500/10"
                />
                <StatsCard
                    title="الهويات البصرية"
                    value={identities.length}
                    icon={<Palette size={24} className="text-green-600" />}
                    color="bg-green-500/10"
                />
                <StatsCard
                    title="التوصيات"
                    value={testimonials.length}
                    icon={<MessageSquare size={24} className="text-orange-600" />}
                    color="bg-orange-500/10"
                />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="bg-card p-6 rounded-xl border shadow-sm">
                    <h3 className="text-lg font-semibold mb-4">آخر الأعمال</h3>
                    {projects.length === 0 ? (
                        <p className="text-muted-foreground text-center py-8">لا توجد أعمال بعد</p>
                    ) : (
                        <div className="space-y-3">
                            {projects.slice(0, 5).map((p: any) => (
                                <div key={p.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50 transition-colors">
                                    {p.image ? (
                                        <img src={p.image} alt={p.title} className="w-10 h-10 rounded-lg object-cover" />
                                    ) : (
                                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                                            <LayoutGrid size={16} className="text-muted-foreground" />
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">{p.title}</p>
                                        <p className="text-xs text-muted-foreground">{p.category}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className="bg-card p-6 rounded-xl border shadow-sm">
                    <h3 className="text-lg font-semibold mb-4">آخر التوصيات</h3>
                    {testimonials.length === 0 ? (
                        <p className="text-muted-foreground text-center py-8">لا توجد توصيات بعد</p>
                    ) : (
                        <div className="space-y-3">
                            {testimonials.slice(0, 5).map((t: any) => (
                                <div key={t.id} className="p-3 rounded-lg hover:bg-accent/50 transition-colors">
                                    <p className="text-sm text-foreground line-clamp-2">"{t.text}"</p>
                                    <p className="text-xs text-muted-foreground mt-1">— {t.author}، {t.role}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;
