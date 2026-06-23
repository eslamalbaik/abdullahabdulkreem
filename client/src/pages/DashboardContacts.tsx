import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Mail, Eye, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface Contact {
    id: number;
    name: string;
    email: string;
    projectType: string;
    message: string;
    createdAt: string;
}

const DashboardContacts: React.FC = () => {
    const [search, setSearch] = useState('');
    const [selected, setSelected] = useState<Contact | null>(null);

    const { data: contacts = [], isLoading } = useQuery<Contact[]>({
        queryKey: ['/api/admin/contacts'],
    });

    const filtered = contacts.filter((c) =>
        c.name?.toLowerCase().includes(search.toLowerCase()) ||
        c.email?.toLowerCase().includes(search.toLowerCase()) ||
        c.projectType?.toLowerCase().includes(search.toLowerCase())
    );

    const formatDate = (d: string) => {
        try {
            return new Date(d).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' });
        } catch {
            return d;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">رسائل التواصل</h1>
                    <p className="text-sm text-muted-foreground mt-1">{contacts.length} رسالة مُستلَمة</p>
                </div>
            </div>

            <div className="relative max-w-md">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input
                    type="text"
                    placeholder="بحث بالاسم أو البريد أو الموضوع..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pr-10 pl-4 py-2 bg-accent border-transparent focus:bg-background focus:border-primary border rounded-md outline-none transition-all w-full"
                />
            </div>

            {isLoading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                </div>
            ) : filtered.length === 0 ? (
                <p className="text-center text-muted-foreground py-12">لا توجد رسائل</p>
            ) : (
                <div className="overflow-x-auto bg-card rounded-xl border border-border">
                    <table className="w-full text-sm text-right">
                        <thead className="bg-muted/50 text-muted-foreground">
                            <tr>
                                <th className="px-4 py-3 font-medium">الاسم</th>
                                <th className="px-4 py-3 font-medium">البريد</th>
                                <th className="px-4 py-3 font-medium">الموضوع</th>
                                <th className="px-4 py-3 font-medium">الرسالة</th>
                                <th className="px-4 py-3 font-medium">التاريخ</th>
                                <th className="px-4 py-3 font-medium">عرض</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((item) => (
                                <motion.tr
                                    key={item.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="border-t border-border hover:bg-accent/40"
                                >
                                    <td className="px-4 py-3 font-medium whitespace-nowrap">{item.name}</td>
                                    <td className="px-4 py-3">
                                        <a href={`mailto:${item.email}`} className="inline-flex items-center gap-1 text-primary hover:underline">
                                            <Mail className="w-4 h-4" />{item.email}
                                        </a>
                                    </td>
                                    <td className="px-4 py-3">{item.projectType}</td>
                                    <td className="px-4 py-3 max-w-xs truncate text-muted-foreground">{item.message}</td>
                                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{formatDate(item.createdAt)}</td>
                                    <td className="px-4 py-3">
                                        <button
                                            onClick={() => setSelected(item)}
                                            className="p-2 text-muted-foreground hover:text-primary transition-colors"
                                            title="عرض الرسالة"
                                        >
                                            <Eye className="w-5 h-5" />
                                        </button>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {selected && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6" onClick={() => setSelected(null)}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-background rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold">تفاصيل الرسالة</h2>
                            <button onClick={() => setSelected(null)} className="p-1 text-muted-foreground hover:text-foreground">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <dl className="space-y-3 text-sm">
                            <Detail label="الاسم" value={selected.name} />
                            <Detail label="البريد" value={selected.email} />
                            <Detail label="الموضوع" value={selected.projectType} />
                            <Detail label="التاريخ" value={formatDate(selected.createdAt)} />
                            <div className="pt-2">
                                <dt className="font-medium text-muted-foreground mb-2">الرسالة</dt>
                                <dd className="bg-muted/40 rounded-lg p-4 whitespace-pre-wrap break-words leading-relaxed">{selected.message}</dd>
                            </div>
                        </dl>
                        <a
                            href={`mailto:${selected.email}?subject=رد: ${selected.projectType}`}
                            className="mt-6 inline-flex items-center justify-center gap-2 w-full py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                        >
                            <Mail className="w-4 h-4" />
                            الرد عبر البريد
                        </a>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

function Detail({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex gap-3 border-b border-border pb-2">
            <dt className="font-medium text-muted-foreground min-w-[100px]">{label}</dt>
            <dd className="flex-1 break-words">{value}</dd>
        </div>
    );
}

export default DashboardContacts;
