import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { apiRequest } from '@/lib/queryClient';
import { toast } from 'sonner';

interface Testimonial {
    id: number;
    text: string;
    author: string;
    role: string;
    rating: number;
}

function StarRatingDisplay({ rating }: { rating: number }) {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars.push(<Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />);
        } else if (i - 0.5 <= rating) {
            stars.push(
                <div key={i} className="relative w-4 h-4">
                    <Star className="absolute w-4 h-4 text-yellow-500" />
                    <div className="absolute overflow-hidden w-1/2">
                        <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                    </div>
                </div>
            );
        } else {
            stars.push(<Star key={i} className="w-4 h-4 text-gray-300" />);
        }
    }
    return <div className="flex gap-0.5">{stars}</div>;
}

function StarRatingInput({ value, onChange }: { value: number; onChange: (rating: number) => void }) {
    const [hoverValue, setHoverValue] = useState<number | null>(null);
    const displayValue = hoverValue ?? value;

    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((starIndex) => (
                <div key={starIndex} className="relative w-8 h-8 cursor-pointer" onMouseLeave={() => setHoverValue(null)}>
                    <div className="absolute inset-0 w-1/2 z-10"
                        onMouseEnter={() => setHoverValue(starIndex - 0.5)}
                        onClick={() => onChange(starIndex - 0.5)} />
                    <div className="absolute inset-0 right-0 w-1/2 mr-4 z-10"
                        onMouseEnter={() => setHoverValue(starIndex)}
                        onClick={() => onChange(starIndex)} />
                    {starIndex <= displayValue ? (
                        <Star className="w-8 h-8 fill-yellow-500 text-yellow-500" />
                    ) : starIndex - 0.5 <= displayValue ? (
                        <div className="relative w-8 h-8">
                            <Star className="absolute w-8 h-8 text-yellow-500" />
                            <div className="absolute overflow-hidden w-1/2">
                                <Star className="w-8 h-8 fill-yellow-500 text-yellow-500" />
                            </div>
                        </div>
                    ) : (
                        <Star className="w-8 h-8 text-gray-300 hover:text-yellow-300" />
                    )}
                </div>
            ))}
            <span className="text-sm text-muted-foreground mr-2 self-center">({value})</span>
        </div>
    );
}

const DashboardTestimonials: React.FC = () => {
    const queryClient = useQueryClient();
    const [showForm, setShowForm] = useState(false);
    const [editingItem, setEditingItem] = useState<Testimonial | null>(null);

    const { data: testimonials = [], isLoading } = useQuery<Testimonial[]>({
        queryKey: ['/api/testimonials'],
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => apiRequest("DELETE", `/api/admin/testimonials/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['/api/testimonials'] });
            toast.success("تم حذف التوصية بنجاح");
        },
        onError: (error: Error) => {
            toast.error(`فشل حذف التوصية: ${error.message}`);
        }
    });

    const handleDelete = (id: number) => {
        if (confirm("هل أنت متأكد من حذف هذا التعليق؟")) {
            deleteMutation.mutate(id);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">إدارة التوصيات</h1>
                <button onClick={() => { setEditingItem(null); setShowForm(true); }}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
                    <Plus className="w-5 h-5" />
                    إضافة توصية
                </button>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                </div>
            ) : testimonials.length === 0 ? (
                <p className="text-center text-muted-foreground py-12">
                    لا توجد توصيات. أضف توصيات العملاء لتظهر في الموقع.
                </p>
            ) : (
                <div className="space-y-4">
                    {testimonials.map((testimonial) => (
                        <motion.div key={testimonial.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                            className="p-4 bg-card rounded-xl border border-border">
                            <div className="flex items-start gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <StarRatingDisplay rating={testimonial.rating} />
                                        <span className="text-sm text-muted-foreground">({testimonial.rating})</span>
                                    </div>
                                    <p className="text-foreground mb-2">"{testimonial.text}"</p>
                                    <p className="text-sm text-muted-foreground">
                                        — {testimonial.author}، {testimonial.role}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => { setEditingItem(testimonial); setShowForm(true); }}
                                        className="p-2 text-muted-foreground hover:text-foreground transition-colors">
                                        <Pencil className="w-5 h-5" />
                                    </button>
                                    <button onClick={() => handleDelete(testimonial.id)}
                                        className="p-2 text-muted-foreground hover:text-destructive transition-colors">
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {showForm && (
                <TestimonialForm item={editingItem} onClose={() => { setShowForm(false); setEditingItem(null); }} />
            )}
        </div>
    );
};

function TestimonialForm({ item, onClose }: { item: Testimonial | null; onClose: () => void }) {
    const queryClient = useQueryClient();
    const isEditing = !!item;
    const [formData, setFormData] = useState({
        text: item?.text || '',
        author: item?.author || '',
        role: item?.role || '',
        rating: item?.rating || 5,
    });

    const mutation = useMutation({
        mutationFn: async (data: any) => {
            const endpoint = `/api/admin/testimonials${isEditing ? `/${item!.id}` : ''}`;
            return apiRequest(isEditing ? 'PUT' : 'POST', endpoint, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['/api/testimonials'] });
            toast.success(isEditing ? "تم تحديث التوصية" : "تم إضافة التوصية");
            onClose();
        },
        onError: (error: Error) => {
            toast.error(`فشل الحفظ: ${error.message}`);
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutation.mutate(formData);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="bg-background rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-bold mb-6">{isEditing ? 'تعديل' : 'إضافة'} توصية</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">نص التوصية</label>
                        <textarea value={formData.text} onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary h-24" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">اسم العميل</label>
                        <input type="text" value={formData.author} onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">المسمى الوظيفي</label>
                        <input type="text" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">التقييم</label>
                        <StarRatingInput value={formData.rating} onChange={(rating) => setFormData({ ...formData, rating })} />
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

export default DashboardTestimonials;
