import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";


interface Question {
    id: string;
    type: "text" | "paragraph" | "number" | "select" | "checkbox" | "radio";
    label: string;
    description?: string;
    required: boolean;
    options?: string[];
}

interface Questionnaire {
    id: string;
    title: string;
    description?: string;
    questions: Question[];
}

export default function PublicQuestionnaire() {
    const { slug } = useParams<{ slug: string }>();
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [isSubmitted, setIsSubmitted] = useState(false);

    const { data: questionnaire, isLoading, error } = useQuery<Questionnaire>({
        queryKey: [`/api/dynamic-questionnaires/public/${slug}`],
    });

    const submitMutation = useMutation({
        mutationFn: (data: Record<string, any>) => 
            apiRequest("POST", `/api/dynamic-questionnaires/public/${slug}/submit`, data),
        onSuccess: () => setIsSubmitted(true),
    });

    const handleAnswerChange = (questionId: string, value: any) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }));
    };

    const handleCheckboxChange = (questionId: string, option: string, checked: boolean) => {
        const current = (answers[questionId] as string[]) || [];
        if (checked) {
            handleAnswerChange(questionId, [...current, option]);
        } else {
            handleAnswerChange(questionId, current.filter(o => o !== option));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        submitMutation.mutate(answers);
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground">جاري تحميل الاستبيان...</p>
            </div>
        );
    }

    if (error || !questionnaire) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen text-center px-6">
                <h1 className="text-2xl font-bold mb-2">عذراً، الاستبيان غير متوفر</h1>
                <p className="text-muted-foreground">ربما تم حذف الاستبيان أو أن الرابط غير صحيح.</p>
                <Button className="mt-6" asChild>
                    <a href="/">العودة للرئيسية</a>
                </Button>
            </div>
        );
    }

    if (isSubmitted) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen text-center px-6">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6"
                >
                    <Check className="h-10 w-10 text-white" />
                </motion.div>
                <h1 className="text-3xl font-bold mb-4">شكراً لك!</h1>
                <p className="text-xl text-muted-foreground max-w-md">تم استلام إجاباتك بنجاح. سنقوم بمراجعتها والتواصل معك إذا لزم الأمر.</p>
                <Button className="mt-8" asChild variant="outline">
                    <a href="/">العودة للرئيسية</a>
                </Button>
            </div>
        );
    }

    return (
        <div className="pt-32 pb-20 min-h-screen bg-background">
            <div className="container mx-auto px-6 max-w-2xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl font-bold mb-4">{questionnaire.title}</h1>
                    {questionnaire.description && (
                        <p className="text-lg text-muted-foreground">{questionnaire.description}</p>
                    )}
                </motion.div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {questionnaire.questions.map((q) => (
                        <Card key={q.id} className="border-border">
                            <CardHeader>
                                <Label className="text-lg font-semibold flex items-center gap-2">
                                    {q.label}
                                    {q.required && <span className="text-destructive">*</span>}
                                </Label>
                                {q.description && (
                                    <p className="text-sm text-muted-foreground">{q.description}</p>
                                )}
                            </CardHeader>
                            <CardContent>
                                {/* Text Input */}
                                {q.type === "text" && (
                                    <Input
                                        required={q.required}
                                        value={answers[q.id] || ""}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleAnswerChange(q.id, e.target.value)}
                                        placeholder="إجابتك هنا..."
                                    />
                                )}

                                {/* Paragraph/Textarea */}
                                {q.type === "paragraph" && (
                                    <Textarea
                                        required={q.required}
                                        value={answers[q.id] || ""}
                                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleAnswerChange(q.id, e.target.value)}
                                        placeholder="اكتب تفاصيل أكثر..."
                                        className="min-h-[120px]"
                                    />
                                )}

                                {/* Number Input */}
                                {q.type === "number" && (
                                    <Input
                                        type="number"
                                        required={q.required}
                                        value={answers[q.id] || ""}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleAnswerChange(q.id, e.target.value)}
                                    />
                                )}

                                {/* Select Group */}
                                {q.type === "select" && (
                                    <Select 
                                        required={q.required}
                                        onValueChange={(val: string) => handleAnswerChange(q.id, val)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="اختر من القائمة..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {q.options?.map((opt) => (
                                                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}

                                {/* Radio Group */}
                                {q.type === "radio" && (
                                    <RadioGroup
                                        required={q.required}
                                        onValueChange={(val: string) => handleAnswerChange(q.id, val)}
                                        className="flex flex-col gap-3"
                                    >
                                        {q.options?.map((opt) => (
                                            <div key={opt} className="flex items-center space-x-2 space-x-reverse">
                                                <RadioGroupItem value={opt} id={`${q.id}-${opt}`} />
                                                <Label htmlFor={`${q.id}-${opt}`} className="cursor-pointer font-normal">{opt}</Label>
                                            </div>
                                        ))}
                                    </RadioGroup>
                                )}

                                {/* Checkbox Group */}
                                {q.type === "checkbox" && (
                                    <div className="flex flex-col gap-3">
                                        {q.options?.map((opt) => (
                                            <div key={opt} className="flex items-center space-x-2 space-x-reverse">
                                                <Checkbox
                                                    id={`${q.id}-${opt}`}
                                                    checked={(answers[q.id] as string[])?.includes(opt)}
                                                    onCheckedChange={(checked: boolean) => handleCheckboxChange(q.id, opt, !!checked)}
                                                />
                                                <Label htmlFor={`${q.id}-${opt}`} className="cursor-pointer font-normal">
                                                    {opt}
                                                </Label>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}

                    <Button 
                        type="submit" 
                        size="lg" 
                        className="w-full text-lg h-14"
                        disabled={submitMutation.isPending}
                    >
                        {submitMutation.isPending ? (
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        ) : "إرسال الإجابات"}
                    </Button>
                </form>
            </div>
        </div>
    );
}

