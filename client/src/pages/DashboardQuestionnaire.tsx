import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Mail, MessageCircle, Instagram, Eye, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface QuestionnaireSubmission {
    id: number;
    name: string;
    serviceType: string;
    role: string;
    projectInfo?: string | null;
    socialMedia?: string | null;
    companySize: string;
    budget: string;
    contactMethod: string;
    email?: string | null;
    whatsapp?: string | null;
    instagram?: string | null;
    status: string;
    createdAt: string;
}

// خرائط ترجمة الأكواد إلى عربي (مطابقة لصفحة الاستبيان)
const serviceLabels: Record<string, string> = {
    identity: 'هويّة بصريّة',
    strategy: 'استراتيجيّة علامة',
    landing: 'صفحة هبوط',
};
const roleLabels: Record<string, string> = {
    owner: 'صاحب المشروع',
    government: 'هيئة حكومية',
    marketing: 'مدير تسويق',
    agency: 'وكالة/شركة تصميم',
    client_client: 'عميل لديه عميل',
    influencer: 'مؤثر/شخصية عامة',
    nonprofit: 'منظمة غير ربحية',
    other: 'أخرى',
};
const companySizeLabels: Record<string, string> = {
    solo: 'شخص واحد',
    small: 'صغيرة (٣-١٠)',
    medium: 'متوسّطة (١٠-٢٥)',
    large: 'كبيرة (٢٥+)',
};
const budgetLabels: Record<string, string> = {
    tier1: '٨٠٠ - ١,٠٠٠ $',
    tier2: '١,٠٠٠ - ٢,٥٠٠ $',
    tier3: '٢,٥٠٠ - ٥,٠٠٠ $',
    tier4: '٥,٠٠٠ $ وأكثر',
};

const t = (map: Record<string, string>, key: string) => map[key] || key || '-';

function ContactCell({ item }: { item: QuestionnaireSubmission }) {
    if (item.contactMethod === 'email' && item.email)
        return <span className="inline-flex items-center gap-1"><Mail className="w-4 h-4 text-primary" />{item.email}</span>;
    if (item.contactMethod === 'whatsapp' && item.whatsapp)
        return <span className="inline-flex items-center gap-1"><MessageCircle className="w-4 h-4 text-green-600" />{item.whatsapp}</span>;
    if (item.contactMethod === 'instagram' && item.instagram)
        return <span className="inline-flex items-center gap-1"><Instagram className="w-4 h-4 text-pink-600" />{item.instagram}</span>;
    return <span className="text-muted-foreground">-</span>;
}

const DashboardQuestionnaire: React.FC = () => {
    const [search, setSearch] = useState('');
    const [selected, setSelected] = useState<QuestionnaireSubmission | null>(null);

    const { data: submissions = [], isLoading } = useQuery<QuestionnaireSubmission[]>({
        queryKey: ['/api/admin/questionnaire-submissions'],
    });

    const filtered = submissions.filter((s) =>
        s.name?.toLowerCase().includes(search.toLowerCase()) ||
        s.email?.toLowerCase().includes(search.toLowerCase()) ||
        s.whatsapp?.includes(search) ||
        s.instagram?.toLowerCase().includes(search.toLowerCase())
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
                    <h1 className="text-2xl font-bold tracking-tight">طلبات العملاء (الاستبيان)</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        {submissions.length} طلب مُستلَم
                    </p>
                </div>
            </div>

            <div className="relative max-w-md">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input
                    type="text"
                    placeholder="بحث بالاسم أو وسيلة التواصل..."
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
                <p className="text-center text-muted-foreground py-12">لا توجد طلبات</p>
            ) : (
                <div className="overflow-x-auto bg-card rounded-xl border border-border">
                    <table className="w-full text-sm text-right">
                        <thead className="bg-muted/50 text-muted-foreground">
                            <tr>
                                <th className="px-4 py-3 font-medium">الاسم</th>
                                <th className="px-4 py-3 font-medium">الخدمة</th>
                                <th className="px-4 py-3 font-medium">الصفة</th>
                                <th className="px-4 py-3 font-medium">حجم الجهة</th>
                                <th className="px-4 py-3 font-medium">الميزانية</th>
                                <th className="px-4 py-3 font-medium">التواصل</th>
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
                                    <td className="px-4 py-3 font-medium">{item.name}</td>
                                    <td className="px-4 py-3">{t(serviceLabels, item.serviceType)}</td>
                                    <td className="px-4 py-3">{t(roleLabels, item.role)}</td>
                                    <td className="px-4 py-3">{t(companySizeLabels, item.companySize)}</td>
                                    <td className="px-4 py-3">{t(budgetLabels, item.budget)}</td>
                                    <td className="px-4 py-3"><ContactCell item={item} /></td>
                                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{formatDate(item.createdAt)}</td>
                                    <td className="px-4 py-3">
                                        <button
                                            onClick={() => setSelected(item)}
                                            className="p-2 text-muted-foreground hover:text-primary transition-colors"
                                            title="عرض التفاصيل"
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
                            <h2 className="text-xl font-bold">تفاصيل الطلب</h2>
                            <button onClick={() => setSelected(null)} className="p-1 text-muted-foreground hover:text-foreground">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <dl className="space-y-3 text-sm">
                            <Detail label="الاسم" value={selected.name} />
                            <Detail label="نوع الخدمة" value={t(serviceLabels, selected.serviceType)} />
                            <Detail label="الصفة" value={t(roleLabels, selected.role)} />
                            <Detail label="حجم الجهة" value={t(companySizeLabels, selected.companySize)} />
                            <Detail label="الميزانية" value={t(budgetLabels, selected.budget)} />
                            <Detail label="طريقة التواصل" value={selected.contactMethod} />
                            <Detail label="البريد" value={selected.email || '-'} />
                            <Detail label="واتساب" value={selected.whatsapp || '-'} />
                            <Detail label="إنستغرام" value={selected.instagram || '-'} />
                            <Detail label="معلومات المشروع" value={selected.projectInfo || '-'} />
                            <Detail label="حسابات التواصل" value={selected.socialMedia || '-'} />
                            <Detail label="التاريخ" value={formatDate(selected.createdAt)} />
                        </dl>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

function Detail({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex gap-3 border-b border-border pb-2">
            <dt className="font-medium text-muted-foreground min-w-[120px]">{label}</dt>
            <dd className="flex-1 break-words">{value}</dd>
        </div>
    );
}

export default DashboardQuestionnaire;
