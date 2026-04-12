import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Settings, Save, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface SiteConfig {
    key: string;
    value: string;
}

export default function DashboardSettings() {
    const { data: configs = [], isLoading } = useQuery<SiteConfig[]>({
        queryKey: ["/api/site-configs"],
    });

    const [settings, setSettings] = useState<Record<string, string>>({
        show_identities_section: "true",
        show_products_section: "true",
        identities_title: "هويات جاهزة للبيع",
        identities_description: "هويات بصرية متكاملة جاهزة للتخصيص والاستخدام الفوري",
        products_title: "منتجات للمصممين",
        products_description: "قوالب وعقود ومحتوى تعليمي لتطوير عملك الإبداعي",
        banner_enabled: "false",
        banner_title: "عرض جديد!",
        banner_message: "استخدم كود خصم خاص لفترة محدودة",
        banner_cta: "تسوق الآن",
        banner_link: "/shop",
        global_discount_percentage: "0"
    });

    useEffect(() => {
        if (configs.length > 0) {
            const configMap = configs.reduce((acc, config) => {
                acc[config.key] = config.value;
                return acc;
            }, {} as Record<string, string>);
            setSettings(configMap);
        }
    }, [configs]);

    const mutation = useMutation({
        mutationFn: async (newConfig: { key: string; value: string }) => {
            return apiRequest("POST", "/api/admin/site-configs", newConfig);
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["/api/site-configs"] });
            if (variables.key.includes("section")) {
                const isEnable = variables.value === "true";
                toast.success(`تم ${isEnable ? 'تفعيل' : 'تعطيل'} القسم بنجاح`);
            } else {
                toast.success("تم حفظ التعديلات بنجاح");
            }
        },
        onError: (error: Error) => {
            toast.error(`فشل الحفظ: ${error.message}`);
        }
    });

    const handleToggle = (key: string, enabled: boolean) => {
        const newValue = enabled ? "true" : "false";
        setSettings(prev => ({ ...prev, [key]: newValue }));
        mutation.mutate({ key, value: newValue });
    };

    const handleSaveText = (key: string) => {
        mutation.mutate({ key, value: settings[key] || "" });
    };

    if (isLoading) {
        return <div className="flex items-center justify-center min-h-[400px]">جاري التحميل...</div>;
    }

    return (
        <div className="p-6 max-w-4xl mx-auto" dir="rtl">
            <div className="flex items-center gap-3 mb-8">
                <Settings className="w-8 h-8 text-primary" />
                <h1 className="text-3xl font-tajawal font-bold">إعدادات الموقع</h1>
            </div>

            <div className="space-y-8">
                {/* Identities Section Control */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-card p-6 rounded-2xl border border-border"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-xl font-bold mb-1">قسم الهويات الجاهزة</h2>
                            <p className="text-sm text-muted-foreground">التحكم في ظهور قسم الهويات في الصفحة الرئيسية</p>
                        </div>
                        <div className="flex items-center gap-2">
                            {settings.show_identities_section === "false" ? <EyeOff className="w-5 h-5 text-muted-foreground" /> : <Eye className="w-5 h-5 text-primary" />}
                            <Switch
                                checked={settings.show_identities_section !== "false"}
                                onCheckedChange={(checked) => handleToggle("show_identities_section", checked)}
                            />
                        </div>
                    </div>

                    <div className="grid gap-4">
                        <div className="space-y-2">
                            <Label>العنوان</Label>
                            <div className="flex gap-2">
                                <Input
                                    value={settings.identities_title || "هويات جاهزة للبيع"}
                                    onChange={(e) => setSettings(prev => ({ ...prev, identities_title: e.target.value }))}
                                />
                                <Button size="icon" onClick={() => handleSaveText("identities_title")}>
                                    <Save className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>الوصف</Label>
                            <div className="flex gap-2">
                                <Textarea
                                    value={settings.identities_description || "هويات بصرية متكاملة جاهزة للتخصيص والاستخدام الفوري"}
                                    onChange={(e) => setSettings(prev => ({ ...prev, identities_description: e.target.value }))}
                                />
                                <Button size="icon" onClick={() => handleSaveText("identities_description")}>
                                    <Save className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Products Section Control */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-card p-6 rounded-2xl border border-border"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-xl font-bold mb-1">قسم منتجات المصممين</h2>
                            <p className="text-sm text-muted-foreground">التحكم في ظهور قسم المنتجات في الصفحة الرئيسية</p>
                        </div>
                        <div className="flex items-center gap-2">
                            {settings.show_products_section === "false" ? <EyeOff className="w-5 h-5 text-muted-foreground" /> : <Eye className="w-5 h-5 text-primary" />}
                            <Switch
                                checked={settings.show_products_section !== "false"}
                                onCheckedChange={(checked) => handleToggle("show_products_section", checked)}
                            />
                        </div>
                    </div>

                    <div className="grid gap-4">
                        <div className="space-y-2">
                            <Label>العنوان</Label>
                            <div className="flex gap-2">
                                <Input
                                    value={settings.products_title || "منتجات للمصممين"}
                                    onChange={(e) => setSettings(prev => ({ ...prev, products_title: e.target.value }))}
                                />
                                <Button size="icon" onClick={() => handleSaveText("products_title")}>
                                    <Save className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>الوصف</Label>
                            <div className="flex gap-2">
                                <Textarea
                                    value={settings.products_description || "قوالب وعقود ومحتوى تعليمي لتطوير عملك الإبداعي"}
                                    onChange={(e) => setSettings(prev => ({ ...prev, products_description: e.target.value }))}
                                />
                                <Button size="icon" onClick={() => handleSaveText("products_description")}>
                                    <Save className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Announcement Banner Control */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-card p-6 rounded-2xl border border-border border-primary/20 shadow-lg shadow-primary/5"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-xl font-bold mb-1 flex items-center gap-2">
                                <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                                شريط الإعلانات العلوي (Announcement Banner)
                            </h2>
                            <p className="text-sm text-muted-foreground">شريط يظهر في أعلى الموقع للإعلان عن عروض أو أخبار جديدة</p>
                        </div>
                        <div className="flex items-center gap-2">
                            {settings.banner_enabled === "false" ? <EyeOff className="w-5 h-5 text-muted-foreground" /> : <Eye className="w-5 h-5 text-primary" />}
                            <Switch
                                checked={settings.banner_enabled !== "false"}
                                onCheckedChange={(checked) => handleToggle("banner_enabled", checked)}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>عنوان الإعلان</Label>
                                <div className="flex gap-2">
                                    <Input
                                        value={settings.banner_title || ""}
                                        onChange={(e) => setSettings(prev => ({ ...prev, banner_title: e.target.value }))}
                                    />
                                    <Button size="icon" onClick={() => handleSaveText("banner_title")}>
                                        <Save className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>نص الرسالة</Label>
                                <div className="flex gap-2">
                                    <Textarea
                                        value={settings.banner_message || ""}
                                        onChange={(e) => setSettings(prev => ({ ...prev, banner_message: e.target.value }))}
                                        rows={2}
                                    />
                                    <Button size="icon" onClick={() => handleSaveText("banner_message")}>
                                        <Save className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>نص زر الانتقال (CTA)</Label>
                                <div className="flex gap-2">
                                    <Input
                                        value={settings.banner_cta || ""}
                                        onChange={(e) => setSettings(prev => ({ ...prev, banner_cta: e.target.value }))}
                                    />
                                    <Button size="icon" onClick={() => handleSaveText("banner_cta")}>
                                        <Save className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>رابط الانتقال (Link)</Label>
                                <div className="flex gap-2">
                                    <Input
                                        value={settings.banner_link || ""}
                                        onChange={(e) => setSettings(prev => ({ ...prev, banner_link: e.target.value }))}
                                        dir="ltr"
                                    />
                                    <Button size="icon" onClick={() => handleSaveText("banner_link")}>
                                        <Save className="w-4 h-4" />
                                    </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
            </div>
        </div>
    );
}
