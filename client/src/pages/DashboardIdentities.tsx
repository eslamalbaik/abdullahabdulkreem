import React, { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, Search, Upload, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { apiRequest } from '@/lib/queryClient';
import { useUpload } from '@/hooks/use-upload';
import { Currency } from '@/components/ui/Currency';
import { calculateFinalPrice } from '@/lib/discounts';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { AlertCircle } from 'lucide-react';
import { getImageUrl } from '@/lib/image-utils';

interface Identity {
    id: number;
    title: string;
    description: string;
    price: number;
    image: string;
    images?: string[];
    includes: string[];
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
                        <img src={getImageUrl(value)} alt="صورة" className="w-24 h-24 object-cover rounded-lg border border-border" />
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

function MultiImageUploadField({ label, values, onAddUrls, onRemove, testId }: {
    label: string;
    values: string[];
    onAddUrls: (newUrls: string[]) => void;
    onRemove: (index: number) => void;
    testId: string;
}) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { uploadFile, isUploading } = useUpload();
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;
        const newUrls: string[] = [];
        for (let i = 0; i < files.length; i++) {
            const res = await uploadFile(files[i]);
            if (res?.objectPath) newUrls.push(res.objectPath);
        }
        if (newUrls.length > 0) onAddUrls(newUrls);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };
    return (
        <div>
            <label className="block text-sm font-medium mb-2">{label}</label>
            <div className="space-y-2">
                {values.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {values.map((url, i) => (
                            <div key={i} className="relative inline-block">
                                <img src={getImageUrl(url)} alt="صورة إضافية" className="w-16 h-16 object-cover rounded-lg border border-border" />
                                <button type="button" onClick={() => onRemove(i)}
                                    className="absolute -top-2 -right-2 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center">
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
                <div className="flex gap-2">
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" multiple className="hidden" data-testid={testId} />
                    <button type="button" onClick={() => fileInputRef.current?.click()} disabled={isUploading}
                        className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors disabled:opacity-50">
                        <Upload className="w-4 h-4" />
                        {isUploading ? "جاري الرفع..." : "إضافة صور"}
                    </button>
                </div>
            </div>
        </div>
    );
}

const DashboardIdentities: React.FC = () => {
    const queryClient = useQueryClient();
    const [search, setSearch] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingItem, setEditingItem] = useState<Identity | null>(null);

    const { data: identities = [], isLoading } = useQuery<Identity[]>({
        queryKey: ['/api/identities'],
    });

    const { data: activeDiscounts = [] } = useQuery<any[]>({
        queryKey: ['/api/discounts/active'],
    });

    const { data: configs = [] } = useQuery<any[]>({
        queryKey: ["/api/site-configs"],
    });

    const globalPercentage = parseFloat(configs.find(c => c.key === 'global_discount_percentage')?.value || '0');

    const deleteMutation = useMutation({
        mutationFn: (id: number) => apiRequest("DELETE", `/api/admin/identities/${id}`),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['/api/identities'] }),
    });

    const handleDelete = (id: number) => {
        if (confirm("هل أنت متأكد من حذف هذه الهوية؟")) {
            deleteMutation.mutate(id);
        }
    };

    const filtered = identities.filter(i =>
        i.title?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">إدارة الهويات البصرية</h1>
                <button onClick={() => { setEditingItem(null); setShowForm(true); }}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
                    <Plus className="w-5 h-5" />
                    إضافة هوية
                </button>
            </div>

            <div className="relative max-w-md">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input type="text" placeholder="بحث في الهويات..." value={search} onChange={(e) => setSearch(e.target.value)}
                    className="pr-10 pl-4 py-2 bg-accent border-transparent focus:bg-background focus:border-primary border rounded-md outline-none transition-all w-full" />
            </div>

            {isLoading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                </div>
            ) : filtered.length === 0 ? (
                <p className="text-center text-muted-foreground py-12">لا توجد هويات بصرية</p>
            ) : (
                <div className="grid gap-4">
                    {filtered.map((identity) => (
                        <motion.div key={identity.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border">
                            {identity.image ? (
                                <img src={getImageUrl(identity.image)} alt={identity.title} className="w-20 h-16 object-cover rounded-lg" />
                            ) : (
                                <div className="w-20 h-16 bg-muted rounded-lg flex items-center justify-center text-muted-foreground text-xs">بدون صورة</div>
                            )}
                            <div className="flex-1">
                                <h3 className="font-semibold">{identity.title}</h3>
                                <p className="text-sm text-muted-foreground"><Currency amount={identity.price} size="sm" /></p>
                                {(() => {
                                    const { discountValue, discountName } = calculateFinalPrice(
                                        identity.price,
                                        identity.id,
                                        'identity',
                                        activeDiscounts,
                                        globalPercentage
                                    );
                                    if (discountValue > 0) {
                                        return (
                                            <div className="flex items-center gap-2 mt-1">
                                                <Badge variant="secondary" className="bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-500/20 text-[10px] py-0">
                                                    خصم نشط: {discountName}
                                                </Badge>
                                            </div>
                                        );
                                    }
                                    return null;
                                })()}
                                {identity.includes && identity.includes.length > 0 && (
                                    <p className="text-xs text-muted-foreground mt-1">
                                        يشمل: {identity.includes.slice(0, 3).join('، ')}
                                        {identity.includes.length > 3 && ` و${identity.includes.length - 3} آخر`}
                                    </p>
                                )}
                            </div>
                            {identity.featured && (
                                <span className="px-2 py-1 bg-yellow-500/10 text-yellow-600 rounded-full text-xs font-semibold">مميز</span>
                            )}
                            <div className="flex gap-2">
                                <button onClick={() => { setEditingItem(identity); setShowForm(true); }}
                                    className="p-2 text-muted-foreground hover:text-foreground transition-colors">
                                    <Pencil className="w-5 h-5" />
                                </button>
                                <button onClick={() => handleDelete(identity.id)}
                                    className="p-2 text-muted-foreground hover:text-destructive transition-colors">
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {showForm && (
                <IdentityForm item={editingItem} onClose={() => { setShowForm(false); setEditingItem(null); }} />
            )}
        </div>
    );
};

function IdentityForm({ item, onClose }: { item: Identity | null; onClose: () => void }) {
    const queryClient = useQueryClient();
    const isEditing = !!item;
    const [formData, setFormData] = useState({
        title: item?.title || '',
        description: item?.description || '',
        price: item?.price || 0,
        image: item?.image || '',
        images: item?.images || [],
        includes: item?.includes?.join('\n') || '',
        featured: item?.featured || false,
    });

    const mutation = useMutation({
        mutationFn: async (data: any) => {
            const endpoint = `/api/admin/identities${isEditing ? `/${item!.id}` : ''}`;
            return apiRequest(isEditing ? 'PUT' : 'POST', endpoint, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['/api/identities'] });
            onClose();
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const submitData = {
            ...formData,
            includes: formData.includes.split('\n').filter((s: string) => s.trim()),
        };
        mutation.mutate(submitData);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="bg-background rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-bold mb-6">{isEditing ? 'تعديل' : 'إضافة'} هوية بصرية</h2>
                
                <div className="mb-6 p-3 bg-primary/5 border border-primary/20 rounded-xl flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div className="text-xs text-muted-foreground leading-relaxed">
                        <p className="font-bold text-primary mb-1">إدارة الخصومات</p>
                        <p>يتم تطبيق الخصومات على هذه الهوية من خلال إدارة <Link to="/dashboard/discounts" className="text-primary hover:underline font-bold">العروض والخصومات</Link>. يمكنك اختيار هذه الهوية هناك لتطبيق خصم خاص عليها.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">العنوان</label>
                        <input type="text" value={formData.title} onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                            className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">السعر (ر.س)</label>
                        <input type="number" value={formData.price} onChange={(e) => setFormData(prev => ({ ...prev, price: parseInt(e.target.value) }))}
                            className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">محتويات الهوية (كل عنصر في سطر)</label>
                        <textarea value={formData.includes} onChange={(e) => setFormData(prev => ({ ...prev, includes: e.target.value }))}
                            className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary h-32"
                            placeholder={"الشعار الأساسي\nالبطاقات الشخصية\nدليل الهوية"} required />
                    </div>
                    <ImageUploadField label="الصورة الرئيسية" value={formData.image}
                        onChange={(url) => setFormData(prev => ({ ...prev, image: url }))} testId="input-identity-image" />
                    <MultiImageUploadField
                        label="صور إضافية (اختياري)"
                        values={formData.images}
                        onAddUrls={(newUrls) => setFormData(prev => ({ ...prev, images: [...prev.images, ...newUrls] }))}
                        onRemove={(idx) => setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }))}
                        testId="input-identity-images" />
                    <div>
                        <label className="block text-sm font-medium mb-2">الوصف</label>
                        <textarea value={formData.description} onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary h-24" />
                    </div>
                    <div className="flex items-center gap-2">
                        <input type="checkbox" id="featured" checked={formData.featured}
                            onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))} className="w-4 h-4 rounded border-border" />
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

export default DashboardIdentities;
