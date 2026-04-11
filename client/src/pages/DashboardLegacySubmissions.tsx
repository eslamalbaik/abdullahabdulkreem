import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { ArrowRight, ClipboardList, Clock, User, Mail, MessageCircle, Phone } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface LegacySubmission {
    id: string;
    name: string;
    serviceType: string;
    role: string;
    projectInfo: string;
    socialMedia: string;
    companySize: string;
    budget: string;
    contactMethod: string;
    email?: string;
    whatsapp?: string;
    instagram?: string;
    createdAt: string;
}

const serviceLabels: Record<string, string> = {
    identity: "هويّة بصريّة",
    strategy: "استراتيجيّة علامة",
    landing: "صفحة هبوط",
};

export default function DashboardLegacySubmissions() {
    const { data: submissions = [], isLoading } = useQuery<LegacySubmission[]>({
        queryKey: ["/api/admin/questionnaire-submissions"],
    });

    if (isLoading) return <div className="p-8 text-center">جاري التحميل...</div>;

    return (
        <div className="pt-8 pb-20">
            <div className="container mx-auto px-6">
                <div className="flex items-center gap-4 mb-8">
                    <Button variant="ghost" size="icon" asChild>
                        <Link to="/dashboard/questionnaires">
                            <ArrowRight className="h-5 w-5" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold">الاستبيانات السابقة (Legacy)</h1>
                        <p className="text-muted-foreground">هذه الردود تم إرسالها عبر النموذج القديم في الصفحة الرئيسية.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">إجمالي الردود القديمة</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-bold">{submissions.length}</div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ClipboardList className="h-5 w-5 text-primary" />
                            جميع الردود السابقة
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>التاريخ</TableHead>
                                        <TableHead>الاسم</TableHead>
                                        <TableHead>الخدمة</TableHead>
                                        <TableHead>الميزانية</TableHead>
                                        <TableHead>التواصل</TableHead>
                                        <TableHead>معلومات المشروع</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {submissions.map((sub) => (
                                        <TableRow key={sub.id}>
                                            <TableCell className="whitespace-nowrap">
                                                <div className="flex flex-col">
                                                    <span>{new Date(sub.createdAt).toLocaleDateString("ar-SA")}</span>
                                                    <span className="text-xs text-muted-foreground">
                                                        {new Date(sub.createdAt).toLocaleTimeString("ar-SA")}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-medium">{sub.name}</TableCell>
                                            <TableCell>{serviceLabels[sub.serviceType] || sub.serviceType}</TableCell>
                                            <TableCell>{sub.budget}</TableCell>
                                            <TableCell>
                                                <div className="flex flex-col gap-1">
                                                    {sub.email && (
                                                        <div className="flex items-center gap-1 text-xs">
                                                            <Mail className="h-3 w-3" /> {sub.email}
                                                        </div>
                                                    )}
                                                    {sub.whatsapp && (
                                                        <div className="flex items-center gap-1 text-xs">
                                                            <Phone className="h-3 w-3" /> {sub.whatsapp}
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="max-w-xs">
                                                <p className="text-sm truncate" title={sub.projectInfo}>
                                                    {sub.projectInfo}
                                                </p>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {submissions.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                                                لا توجد ردود قديمة.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
