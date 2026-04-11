import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { ArrowRight, Plus, Pencil, Trash2, GripVertical, Check, X, Save } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Question {
    id: string;
    type: string;
    label: string;
    description?: string;
    required: boolean;
    options?: string[];
    order: number;
}

interface Questionnaire {
    id: string;
    title: string;
    description?: string;
    slug: string;
    isPublished: boolean;
    questions: Question[];
}

export default function QuestionnaireBuilder() {
    const { id } = useParams<{ id: string }>();
    const queryClient = useQueryClient();
    const [isEditingMeta, setIsEditingMeta] = useState(false);

    const { data: questionnaire, isLoading } = useQuery<Questionnaire>({
        queryKey: [`/api/dynamic-questionnaires/${id}`],
    });

    const updateMetaMutation = useMutation({
        mutationFn: (data: Partial<Questionnaire>) => apiRequest("PATCH", `/api/dynamic-questionnaires/${id}`, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`/api/dynamic-questionnaires/${id}`] });
            setIsEditingMeta(false);
            toast.success("تم تحديث البيانات بنجاح");
        },
    });

    const addQuestionMutation = useMutation({
        mutationFn: (data: Partial<Question>) => apiRequest("POST", `/api/dynamic-questionnaires/${id}/questions`, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`/api/dynamic-questionnaires/${id}`] });
            toast.success("تمت إضافة السؤال");
        },
    });

    const deleteQuestionMutation = useMutation({
        mutationFn: (qId: string) => apiRequest("DELETE", `/api/dynamic-questionnaires/${id}/questions/${qId}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`/api/dynamic-questionnaires/${id}`] });
            toast.success("تم حذف السؤال");
        },
    });

    const [newQuestion, setNewQuestion] = useState<Partial<Question>>({
        type: "text",
        label: "",
        required: false,
        options: [],
    });

    const handleAddQuestion = () => {
        if (!newQuestion.label) return toast.error("يرجى إدخال نص السؤال");
        addQuestionMutation.mutate(newQuestion);
        setNewQuestion({ type: "text", label: "", required: false, options: [] });
    };

    if (isLoading) return <div className="p-8 text-center">جاري التحميل...</div>;
    if (!questionnaire) return <div className="p-8 text-center text-destructive">الاستبيان غير موجود</div>;

    return (
        <div className="pt-28 pb-20 min-h-screen bg-background">
            <div className="container mx-auto px-6 max-w-4xl">
                <div className="flex items-center gap-4 mb-8">
                    <Button variant="ghost" size="icon" asChild>
                        <Link to="/admin">
                            <ArrowRight className="h-5 w-5" />
                        </Link>
                    </Button>
                    <h1 className="text-3xl font-bold">بناء الاستبيان</h1>
                </div>

                {/* Metadata Section */}
                <Card className="mb-8 overflow-hidden">
                    <CardHeader className="bg-muted/30 border-b flex flex-row items-center justify-between">
                        <CardTitle className="text-xl">معلومات الاستبيان</CardTitle>
                        {!isEditingMeta && (
                            <Button variant="outline" size="sm" onClick={() => setIsEditingMeta(true)}>
                                <Pencil className="h-4 w-4 mr-2" />
                                تعديل
                            </Button>
                        )}
                    </CardHeader>
                    <CardContent className="p-6">
                        {isEditingMeta ? (
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>العنوان</Label>
                                        <Input
                                            value={questionnaire.title}
                                            onChange={(e) => updateMetaMutation.mutate({ title: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>الرابط المختصر (Slug)</Label>
                                        <Input
                                            value={questionnaire.slug}
                                            onChange={(e) => updateMetaMutation.mutate({ slug: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2 space-x-reverse">
                                    <Switch
                                        checked={questionnaire.isPublished}
                                        onCheckedChange={(checked) => updateMetaMutation.mutate({ isPublished: checked })}
                                    />
                                    <Label>نشر الاستبيان</Label>
                                </div>
                                <div className="pt-4 flex justify-end gap-2">
                                    <Button onClick={() => setIsEditingMeta(false)}>إغلاق</Button>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-8">
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">العنوان</p>
                                    <p className="font-medium text-lg">{questionnaire.title}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">الحالة</p>
                                    <Badge variant={questionnaire.isPublished ? "default" : "secondary"}>
                                        {questionnaire.isPublished ? "منشور" : "مسودة"}
                                    </Badge>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-sm text-muted-foreground mb-1">الرابط العام</p>
                                    <code className="bg-muted px-2 py-1 rounded text-primary">
                                        /questionnaire/{questionnaire.slug}
                                    </code>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Questions List */}
                <div className="space-y-6 mb-8">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        الأسئلة
                        <Badge variant="outline">{questionnaire.questions.length}</Badge>
                    </h2>
                    
                    <AnimatePresence>
                        {questionnaire.questions.map((q, index) => (
                            <motion.div
                                key={q.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                            >
                                <Card className="group">
                                    <CardContent className="p-4 flex items-center gap-4">
                                        <div className="text-muted-foreground cursor-grab">
                                            <GripVertical className="h-5 w-5" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-xs font-bold bg-primary/10 text-primary w-6 h-6 rounded-full flex items-center justify-center">
                                                    {index + 1}
                                                </span>
                                                <h4 className="font-semibold">{q.label}</h4>
                                                {q.required && <span className="text-destructive">*</span>}
                                            </div>
                                            <p className="text-xs text-muted-foreground px-8 capitalize">
                                                النوع: {q.type === 'text' ? 'نص قصير' : q.type === 'paragraph' ? 'نص طويل' : q.type}
                                            </p>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => deleteQuestionMutation.mutate(q.id)}
                                            className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Add Question Form */}
                <Card className="border-primary/20 bg-primary/5">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2 text-primary">
                            <Plus className="h-5 w-5" />
                            إضافة سؤال جديد
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>نص السؤال</Label>
                                <Input
                                    placeholder="مثلاً: ما هي ميزانيتك المتوقعة؟"
                                    value={newQuestion.label}
                                    onChange={(e) => setNewQuestion({ ...newQuestion, label: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>نوع الحقل</Label>
                                <Select
                                    value={newQuestion.type}
                                    onValueChange={(val) => setNewQuestion({ ...newQuestion, type: val })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="text">نص قصير</SelectItem>
                                        <SelectItem value="paragraph">نص طويل</SelectItem>
                                        <SelectItem value="number">رقم</SelectItem>
                                        <SelectItem value="select">قائمة منسدلة</SelectItem>
                                        <SelectItem value="radio">اختيار واحد</SelectItem>
                                        <SelectItem value="checkbox">اختيارات متعددة</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {(newQuestion.type === 'select' || newQuestion.type === 'radio' || newQuestion.type === 'checkbox') && (
                            <div className="space-y-2">
                                <Label>الخيارات (افصل بينها بفاصلة)</Label>
                                <Input
                                    placeholder="خيار 1, خيار 2, خيار 3"
                                    onChange={(e) => setNewQuestion({ 
                                        ...newQuestion, 
                                        options: e.target.value.split(',').map(s => s.trim()).filter(Boolean) 
                                    })}
                                />
                            </div>
                        )}

                        <div className="flex items-center space-x-2 space-x-reverse">
                            <Switch
                                checked={newQuestion.required}
                                onCheckedChange={(checked) => setNewQuestion({ ...newQuestion, required: checked })}
                            />
                            <Label>حقل إلزامي</Label>
                        </div>

                        <Button className="w-full" onClick={handleAddQuestion}>
                            <Plus className="h-4 w-4 mr-2" />
                            تأكيد إضافة السؤال
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
