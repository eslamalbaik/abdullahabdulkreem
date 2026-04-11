import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { ClipboardList, Mail, Phone, Clock, User } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";

interface LegacySubmission {
    id: string;
    name: string;
    serviceType: string;
    budget: string;
    projectInfo: string;
    email?: string;
    whatsapp?: string;
    createdAt: string;
    role?: string;
    companySize?: string;
    contactMethod?: string;
    socialMedia?: string;
    instagram?: string;
}

const serviceLabels: Record<string, string> = {
    identity: "هويّة بصريّة",
    strategy: "استراتيجيّة علامة",
    landing: "صفحة هبوط",
};

export default function DashboardQuestionnaires() {
    const [selectedSubmission, setSelectedSubmission] = useState<LegacySubmission | null>(null);

    const { data: submissions = [], isLoading } = useQuery<LegacySubmission[]>({
        queryKey: ["/api/admin/questionnaire-submissions"],
    });

    if (isLoading) {
        return <div className="p-8 text-center">جاري التحميل...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">ردود الاستبيان</h1>
                    <p className="text-muted-foreground mt-1 text-sm">عرض جميع الردود الواردة من خلال الاستبيان في الصفحة الرئيسية.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="px-3 py-1 text-sm bg-primary/5 border-primary/20 text-primary">
                        إجمالي الردود: {submissions.length}
                    </Badge>
                </div>
            </div>

            <Card className="border-border bg-card">
                <CardHeader className="pb-2 border-b">
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <ClipboardList className="h-5 w-5 text-primary" />
                        قائمة الردود الواردة
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="w-[180px]">التاريخ</TableHead>
                                    <TableHead className="w-[180px]">الاسم</TableHead>
                                    <TableHead>الخدمة المطلوبة</TableHead>
                                    <TableHead>معلومات التواصل</TableHead>
                                    <TableHead className="max-w-[300px]">عن المشروع</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {submissions.map((sub) => (
                                    <TableRow 
                                        key={sub.id} 
                                        className="group transition-colors cursor-pointer hover:bg-muted/50"
                                        onClick={() => setSelectedSubmission(sub)}
                                    >
                                        <TableCell>
                                            <div className="flex items-center gap-2 text-sm">
                                                <Clock className="h-3 w-3 text-muted-foreground" />
                                                <div className="flex flex-col">
                                                    <span>{new Date(sub.createdAt).toLocaleDateString("ar-SA")}</span>
                                                    <span className="text-[10px] text-muted-foreground">
                                                        {new Date(sub.createdAt).toLocaleTimeString("ar-SA")}
                                                    </span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-2">
                                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                                                    {sub.name.charAt(0)}
                                                </div>
                                                {sub.name}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className="font-normal">
                                                {serviceLabels[sub.serviceType] || sub.serviceType}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-1.5">
                                                {sub.email && (
                                                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors">
                                                        <Mail className="h-3 w-3" />
                                                        <a href={`mailto:${sub.email}`}>{sub.email}</a>
                                                    </div>
                                                )}
                                                {sub.whatsapp && (
                                                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-green-600 transition-colors">
                                                        <Phone className="h-3 w-3" />
                                                        <a href={`https://wa.me/${sub.whatsapp}`} target="_blank" rel="noreferrer">{sub.whatsapp}</a>
                                                    </div>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm line-clamp-2 text-muted-foreground group-hover:text-foreground transition-colors" title={sub.projectInfo}>
                                                {sub.projectInfo}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {submissions.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                                            <div className="flex flex-col items-center gap-2 py-8">
                                                <ClipboardList className="h-10 w-10 opacity-20" />
                                                <p>لا توجد ردود مسجلة بعد.</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <Dialog open={!!selectedSubmission} onOpenChange={(open) => !open && setSelectedSubmission(null)}>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto" dir="rtl">
                    <DialogHeader>
                        <DialogTitle className="text-xl border-b pb-4">تفاصيل الاستبيان</DialogTitle>
                    </DialogHeader>
                    {selectedSubmission && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                            <div className="space-y-1">
                                <span className="text-sm text-muted-foreground">الاسم</span>
                                <p className="font-medium">{selectedSubmission.name}</p>
                            </div>
                            <div className="space-y-1">
                                <span className="text-sm text-muted-foreground">وقت الإرسال</span>
                                <p className="font-medium">{new Date(selectedSubmission.createdAt).toLocaleString("ar-SA")}</p>
                            </div>
                            
                            <div className="space-y-1">
                                <span className="text-sm text-muted-foreground">الخدمة المطلوبة</span>
                                <p className="font-medium">
                                    <Badge variant="secondary">
                                        {serviceLabels[selectedSubmission.serviceType] || selectedSubmission.serviceType}
                                    </Badge>
                                </p>
                            </div>
                            <div className="space-y-1">
                                <span className="text-sm text-muted-foreground">الميزانية المقترحة</span>
                                <p className="font-medium">{selectedSubmission.budget || "-"}</p>
                            </div>

                            <div className="space-y-1">
                                <span className="text-sm text-muted-foreground">الصفة الوظيفية</span>
                                <p className="font-medium">{selectedSubmission.role || "-"}</p>
                            </div>
                            <div className="space-y-1">
                                <span className="text-sm text-muted-foreground">حجم الشركة/المشروع</span>
                                <p className="font-medium">{selectedSubmission.companySize || "-"}</p>
                            </div>

                            <div className="space-y-1 md:col-span-2">
                                <span className="text-sm text-muted-foreground">طريقة التواصل المفضلة</span>
                                <p className="font-medium">{selectedSubmission.contactMethod || "-"}</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:col-span-2 p-4 bg-muted/30 rounded-lg">
                                <div className="space-y-1">
                                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                                        <Mail className="w-4 h-4" /> البريد الإلكتروني
                                    </span>
                                    <p className="font-medium break-words text-sm mt-1">{selectedSubmission.email || "-"}</p>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                                        <Phone className="w-4 h-4" /> رقم الواتساب
                                    </span>
                                    <p className="font-medium mt-1">{selectedSubmission.whatsapp || "-"}</p>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                                        <User className="w-4 h-4" /> حساب إنستغرام
                                    </span>
                                    <p className="font-medium mt-1">{selectedSubmission.instagram || "-"}</p>
                                </div>
                            </div>

                            <div className="space-y-1 md:col-span-2">
                                <span className="text-sm text-muted-foreground">نبذة عن المشروع</span>
                                <div className="p-4 bg-muted/30 rounded-lg text-sm leading-relaxed whitespace-pre-wrap">
                                    {selectedSubmission.projectInfo || "-"}
                                </div>
                            </div>

                            <div className="space-y-1 md:col-span-2">
                                <span className="text-sm text-muted-foreground">روابط حسابات التواصل الاجتماعي للمشروع</span>
                                <p className="font-medium break-words text-sm">{selectedSubmission.socialMedia || "-"}</p>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
