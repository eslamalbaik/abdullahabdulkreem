import React, { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, Search, Upload, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { apiRequest } from '@/lib/queryClient';
import { useUpload } from '@/hooks/use-upload';

interface Product {
    id: number;
    title: string;
    category: string;
    price: number;
    image: string;
    description?: string;
    featured: boolean;
}

function ImageUploadField({ label, value, onChange, testId }: {
    label: string; value: string; onChange: (url: string) => void; testId: string;
}) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { uploadFile, isUploading } = useUpload({
        onSuccess: (response) => onChange(response.objectPath),
    });
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) await uploadFile(file);
    };
    return (
        <div>
            <label className="block text-sm font-medium mb-2">{label}</label>
            <div className="space-y-2">
                {value && (
                    <div className="relative inline-block">
                        <img src={value} alt="صورة" className="w-24 h-24 object-cover rounded-lg border border-border" />
                        <button type="button" onClick={() => onChange("")}
                            className="absolute -top-2 -left-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                )}
                <div className="flex gap-2">
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" data-testid={testId} />
                    <button type="button" onClick={() => fileInputRef.current?.click()} disabled={isUploading}
                        className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors disabled:opacity-50">
                        <Upload className="w-4 h-4" />
                        {isUploading ? "جاري الرفع..." : "اختر صورة"}
                    </button>
                </div>
            </div>
        </div>
    );
}

const DashboardProducts: React.FC = () => {
    const queryClient = useQueryClient();
    const [search, setSearch] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingItem, setEditingItem] = useState<Product | null>(null);

    const { data: products = [], isLoading } = useQuery<Product[]>({
        queryKey: ['/api/products'],
        queryFn: async () => {
            const res = await fetch('/api/products', { credentials: 'include' });
            if (!res.ok) throw new Error('Failed');
            const data = await res.json();
            return Array.isArray(data) ? data : data.products || [];
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => apiRequest("DELETE", `/api/admin/products/${id}`),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['/api/products'] }),
    });

    const handleDelete = (id: number) => {
        if (confirm("هل أنت متأكد من حذف هذا المنتج؟")) {
            deleteMutation.mutate(id);
        }
    };

    const filtered = products.filter(p =>
        p.title?.toLowerCase().includes(search.toLowerCase()) ||
        p.category?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">إدارة المنتجات</h1>
                <button onClick={() => { setEditingItem(null); setShowForm(true); }}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
                    <Plus className="w-5 h-5" />
                    إضافة منتج
                </button>
            </div>

            <div className="relative max-w-md">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input type="text" placeholder="بحث في المنتجات..." value={search} onChange={(e) => setSearch(e.target.value)}
                    className="pr-10 pl-4 py-2 bg-accent border-transparent focus:bg-background focus:border-primary border rounded-md outline-none transition-all w-full" />
            </div>

            {isLoading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                </div>
            ) : filtered.length === 0 ? (
                <p className="text-center text-muted-foreground py-12">لا توجد منتجات</p>
            ) : (
                <div className="grid gap-4">
                    {filtered.map((product) => (
                        <motion.div key={product.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border">
                            {product.image ? (
                                <img src={product.image} alt={product.title} className="w-20 h-16 object-cover rounded-lg" />
                            ) : (
                                <div className="w-20 h-16 bg-muted rounded-lg flex items-center justify-center text-muted-foreground text-xs">بدون صورة</div>
                            )}
                            <div className="flex-1">
                                <h3 className="font-semibold">{product.title}</h3>
                                <p className="text-sm text-muted-foreground">{product.category} • {product.price} ر.س</p>
                            </div>
                            {product.featured && (
                                <span className="px-2 py-1 bg-yellow-500/10 text-yellow-600 rounded-full text-xs font-semibold">مميز</span>
                            )}
                            <div className="flex gap-2">
                                <button onClick={() => { setEditingItem(product); setShowForm(true); }}
                                    className="p-2 text-muted-foreground hover:text-foreground transition-colors">
                                    <Pencil className="w-5 h-5" />
                                </button>
                                <button onClick={() => handleDelete(product.id)}
                                    className="p-2 text-muted-foreground hover:text-destructive transition-colors">
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {showForm && (
                <ProductForm item={editingItem} onClose={() => { setShowForm(false); setEditingItem(null); }} />
            )}
        </div>
    );
};

function ProductForm({ item, onClose }: { item: Product | null; onClose: () => void }) {
    const queryClient = useQueryClient();
    const isEditing = !!item;
    const [formData, setFormData] = useState({
        title: item?.title || '',
        category: item?.category || '',
        price: item?.price || 0,
        image: item?.image || '',
        description: item?.description || '',
        featured: item?.featured || false,
    });

    const mutation = useMutation({
        mutationFn: async (data: any) => {
            const endpoint = `/api/admin/products${isEditing ? `/${item!.id}` : ''}`;
            return apiRequest(isEditing ? 'PUT' : 'POST', endpoint, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['/api/products'] });
            onClose();
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutation.mutate(formData);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="bg-background rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-bold mb-6">{isEditing ? 'تعديل' : 'إضافة'} منتج</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">العنوان</label>
                        <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">التصنيف</label>
                        <input type="text" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">السعر (ر.س)</label>
                        <input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
                            className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary" required />
                    </div>
                    <ImageUploadField label="الصورة الرئيسية" value={formData.image}
                        onChange={(url) => setFormData({ ...formData, image: url })} testId="input-product-image" />
                    <div>
                        <label className="block text-sm font-medium mb-2">الوصف</label>
                        <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary h-24" />
                    </div>
                    <div className="flex items-center gap-2">
                        <input type="checkbox" id="featured" checked={formData.featured}
                            onChange={(e) => setFormData({ ...formData, featured: e.target.checked })} className="w-4 h-4 rounded border-border" />
                        <label htmlFor="featured" className="text-sm font-medium">مميز (يظهر في الصفحة الرئيسية)</label>
                    </div>
                    <div className="flex gap-4 pt-4">
                        <button type="submit" disabled={mutation.isPending}
                            className="flex-1 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50">
                            {mutation.isPending ? "جاري الحفظ..." : "حفظ"}
                        </button>
                        <button type="button" onClick={onClose}
                            className="flex-1 py-3 border border-border rounded-lg font-semibold hover:bg-muted transition-colors">
                            إلغاء
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}

export default DashboardProducts;
