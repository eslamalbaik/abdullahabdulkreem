import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { ArrowRight, BarChart3, Clock, User, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Response {
    id: string;
    answers: Record<string, any>;
    submittedAt: string;
}

interface Question {
    id: string;
    label: string;
}

interface Questionnaire {
    id: string;
    title: string;
    questions: Question[];
}

export default function QuestionnaireResponses() {
    const { id } = useParams<{ id: string }>();

    const { data: questionnaire } = useQuery<Questionnaire>({
        queryKey: [`/api/dynamic-questionnaires/${id}`],
    });

    const { data: responses = [], isLoading } = useQuery<Response[]>({
        queryKey: [`/api/dynamic-questionnaires/${id}/responses`],
    });

    if (isLoading) return <div className="p-8 text-center">جاري التحميل...</div>;
    if (!questionnaire) return <div className="p-8 text-center text-destructive">الاستبيان غير موجود</div>;

    return (
        <div className="pt-28 pb-20 min-h-screen bg-background">
            <div className="container mx-auto px-6">
                <div className="flex items-center gap-4 mb-8">
                    <Button variant="ghost" size="icon" asChild>
                        <Link to="/admin">
                            <ArrowRight className="h-5 w-5" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold">نتائج الاستبيان</h1>
                        <p className="text-muted-foreground">{questionnaire.title}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">إجمالي الردود</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-bold">{responses.length}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">آخر رد</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-xl font-medium">
                                {responses.length > 0 
                                    ? new Date(responses[0].submittedAt).toLocaleDateString("ar-SA")
                                    : "لا يوجد"}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">عدد الأسئلة</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-bold">{questionnaire.questions.length}</div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MessageCircle className="h-5 w-5 text-primary" />
                            جميع الردود
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-48">وقت الإرسال</TableHead>
                                        {questionnaire.questions.map((q) => (
                                            <TableHead key={q.id} className="min-w-[200px]">{q.label}</TableHead>
                                        ))}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {responses.map((resp) => (
                                        <TableRow key={resp.id}>
                                            <TableCell className="font-medium whitespace-nowrap">
                                                <div className="flex flex-col">
                                                    <span>{new Date(resp.submittedAt).toLocaleDateString("ar-SA")}</span>
                                                    <span className="text-xs text-muted-foreground">
                                                        {new Date(resp.submittedAt).toLocaleTimeString("ar-SA")}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            {questionnaire.questions.map((q) => (
                                                <TableCell key={q.id}>
                                                    {Array.isArray(resp.answers[q.id]) 
                                                        ? resp.answers[q.id].join(", ") 
                                                        : resp.answers[q.id] || "-"}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))}
                                    {responses.length === 0 && (
                                        <TableRow>
                                            <TableCell 
                                                colSpan={questionnaire.questions.length + 1} 
                                                className="h-32 text-center text-muted-foreground"
                                            >
                                                لا توجد ردود بعد.
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
