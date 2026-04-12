import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, Search, Calendar, Tag, Check, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { apiRequest } from '@/lib/queryClient';
import { Currency } from '@/components/ui/Currency';
import { format } from 'date-fns';

interface Discount {
    id: string | number;
    name: string;
    type: 'percentage' | 'fixed';
    value: number;
    startDate: string;
    endDate: string;
    scope: 'product' | 'identity' | 'both';
    applicableItems: string[];
    active: boolean;
    isGlobal: boolean;
}

const DashboardDiscounts: React.FC = () => {
    const queryClient = useQueryClient();
    const [search, setSearch] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingItem, setEditingItem] = useState<Discount | null>(null);

    const { data: discounts = [], isLoading } = useQuery<Discount[]>({
        queryKey: ['/api/admin/discounts'],
        queryFn: async () => {
            const res = await apiRequest('GET', '/api/admin/discounts');
            return res.json();
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string | number) => apiRequest("DELETE", `/api/admin/discounts/${id}`),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['/api/admin/discounts'] }),
    });

    const handleDelete = (id: string | number) => {
        if (confirm("هل أنت متأكد من حذف هذا الخصم؟")) {
            deleteMutation.mutate(id);
        }
    };

    const filtered = discounts.filter(d =>
        d.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">إدارة العروض والخصومات</h1>
                <button onClick={() => { setEditingItem(null); setShowForm(true); }}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
                    <Plus className="w-5 h-5" />
                    إضافة عرض جديد
                </button>
            </div>

            <div className="relative max-w-md">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input type="text" placeholder="بحث في العروض..." value={search} onChange={(e) => setSearch(e.target.value)}
                    className="pr-10 pl-4 py-2 bg-accent border-transparent focus:bg-background focus:border-primary border rounded-md outline-none transition-all w-full" />
            </div>

            {isLoading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                </div>
            ) : filtered.length === 0 ? (
                <p className="text-center text-muted-foreground py-12">لا توجد عروض حالياً</p>
            ) : (
                <div className="grid gap-4">
                    {filtered.map((discount) => (
                        <motion.div key={discount.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border">
                            <div className={`p-3 rounded-lg ${discount.active ? 'bg-green-500/10 text-green-600' : 'bg-muted text-muted-foreground'}`}>
                                <Tag className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-semibold">{discount.name}</h3>
                                    {discount.isGlobal && (
                                        <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-[10px] uppercase font-bold">عام (Global)</span>
                                    )}
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    {discount.type === 'percentage' ? `${discount.value}% خصم` : <span>خصم <Currency amount={discount.value} size="sm" /></span>}
                                    {' • '}
                                    {discount.scope === 'both' ? 'كامل المتجر' : (discount.scope === 'product' ? 'المنتجات فقط' : 'الهويات فقط')}
                                </p>
                                <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        من: {format(new Date(discount.startDate), 'yyyy/MM/dd')}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        إلى: {format(new Date(discount.endDate), 'yyyy/MM/dd')}
                                    </span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => { setEditingItem(discount); setShowForm(true); }}
                                    className="p-2 text-muted-foreground hover:text-foreground transition-colors">
                                    <Pencil className="w-5 h-5" />
                                </button>
                                <button onClick={() => handleDelete(discount.id)}
                                    className="p-2 text-muted-foreground hover:text-destructive transition-colors">
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {showForm && (
                <DiscountForm item={editingItem} onClose={() => { setShowForm(false); setEditingItem(null); }} />
            )}
        </div>
    );
};

function DiscountForm({ item, onClose }: { item: Discount | null; onClose: () => void }) {
    const queryClient = useQueryClient();
    const isEditing = !!item;

    const [formData, setFormData] = useState({
        name: item?.name || '',
        type: item?.type || 'percentage',
        value: item?.value || 0,
        startDate: item?.startDate ? format(new Date(item.startDate), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
        endDate: item?.endDate ? format(new Date(item.endDate), 'yyyy-MM-dd') : format(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
        scope: item?.scope || 'both',
        active: item?.active ?? true,
        isGlobal: item?.isGlobal ?? false,
        applicableItems: item?.applicableItems || [] as string[],
    });

    const { data: products = [] } = useQuery<any[]>({ queryKey: ['/api/products'] });
    const { data: identities = [] } = useQuery<any[]>({ queryKey: ['/api/identities'] });

    const mutation = useMutation({
        mutationFn: async (data: any) => {
            const endpoint = `/api/admin/discounts${isEditing ? `/${item!.id}` : ''}`;
            return apiRequest(isEditing ? 'PATCH' : 'POST', endpoint, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['/api/admin/discounts'] });
            onClose();
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutation.mutate({
            ...formData,
            startDate: new Date(formData.startDate).toISOString(),
            endDate: new Date(formData.endDate).toISOString(),
        });
    };

    const toggleItem = (itemId: string) => {
        setFormData(prev => ({
            ...prev,
            applicableItems: prev.applicableItems.includes(itemId)
                ? prev.applicableItems.filter(id => id !== itemId)
                : [...prev.applicableItems, itemId]
        }));
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="bg-background rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                <h2 className="text-2xl font-bold mb-6">{isEditing ? 'تعديل' : 'إنشاء'} الخصم</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">اسم العرض</label>
                                <input type="text" value={formData.name} onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary h-12" placeholder="مثلاً: تخفيضات رمضان" required />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">نوع الخصم</label>
                                    <select value={formData.type} onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                                        className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary h-12">
                                        <option value="percentage">نسبة مئوية (%)</option>
                                        <option value="fixed">مبلغ ثابت (SAR)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">القيمة</label>
                                    <input type="number" value={formData.value} onChange={(e) => setFormData(prev => ({ ...prev, value: parseFloat(e.target.value) }))}
                                        className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary h-12" required />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">تاريخ البدء</label>
                                    <input type="date" value={formData.startDate} onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                                        className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary h-12" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">تاريخ الانتهاء</label>
                                    <input type="date" value={formData.endDate} onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                                        className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary h-12" required />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">نطاق الخصم</label>
                                <select value={formData.scope} onChange={(e) => setFormData(prev => ({ ...prev, scope: e.target.value as any, applicableItems: [] }))}
                                    className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary h-12">
                                    <option value="both">كامل المتجر (أو اختر عناصر محددة)</option>
                                    <option value="product">المنتجات فقط</option>
                                    <option value="identity">الهويات فقط</option>
                                </select>
                            </div>

                            <div className="flex flex-col gap-3 p-4 bg-accent/50 rounded-xl">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input type="checkbox" checked={formData.isGlobal} onChange={(e) => setFormData(prev => ({ ...prev, isGlobal: e.target.checked }))} className="w-5 h-5 rounded border-primary text-primary focus:ring-primary" />
                                    <span className="font-medium text-sm">خصم شامل (يطبق تلقائياً على كل العناصر في النطاق)</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input type="checkbox" checked={formData.active} onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.checked }))} className="w-5 h-5 rounded border-primary text-primary focus:ring-primary" />
                                    <span className="font-medium text-sm">نشط حالياً</span>
                                </label>
                            </div>
                        </div>

                        <div className="flex flex-col border border-border rounded-xl overflow-hidden">
                            <div className="p-3 bg-muted font-bold text-sm border-b border-border">اختيار العناصر (اختياري إذا فعلت الخصم الشامل)</div>
                            <div className="flex-1 overflow-y-auto p-4 space-y-2 max-h-[400px]">
                                {(formData.scope === 'both' || formData.scope === 'product') && products.map(p => (
                                    <div key={p.id} onClick={() => toggleItem(p.id)} className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${formData.applicableItems.includes(p.id) ? 'bg-primary/10 border border-primary/20' : 'hover:bg-accent'}`}>
                                        <div className={`w-5 h-5 rounded border flex items-center justify-center ${formData.applicableItems.includes(p.id) ? 'bg-primary border-primary text-white' : 'border-input'}`}>
                                            {formData.applicableItems.includes(p.id) && <Check className="w-3 h-3" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">{p.title}</p>
                                            <p className="text-[10px] text-muted-foreground uppercase">منتج</p>
                                        </div>
                                    </div>
                                ))}
                                {(formData.scope === 'both' || formData.scope === 'identity') && identities.map(i => (
                                    <div key={i.id} onClick={() => toggleItem(i.id)} className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${formData.applicableItems.includes(i.id) ? 'bg-primary/10 border border-primary/20' : 'hover:bg-accent'}`}>
                                        <div className={`w-5 h-5 rounded border flex items-center justify-center ${formData.applicableItems.includes(i.id) ? 'bg-primary border-primary text-white' : 'border-input'}`}>
                                            {formData.applicableItems.includes(i.id) && <Check className="w-3 h-3" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">{i.title}</p>
                                            <p className="text-[10px] text-muted-foreground uppercase">هوية</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 pt-6 border-t border-border">
                        <button type="submit" disabled={mutation.isPending}
                            className="flex-1 py-4 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary/90 transition-all transform active:scale-[0.98] disabled:opacity-50">
                            {mutation.isPending ? "جاري الحفظ..." : "حفظ التغييرات"}
                        </button>
                        <button type="button" onClick={onClose}
                            className="flex-1 py-4 border border-border rounded-xl font-bold hover:bg-muted transition-all">
                            إلغاء
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}

export default DashboardDiscounts;
