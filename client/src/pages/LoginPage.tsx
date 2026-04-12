import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { 
  Loader2, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  Mail, 
  Lock, 
  ArrowRight,
  ChevronLeft
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('accessToken');
            if (!token) return;

            try {
                const res = await fetch('/api/auth/user', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    navigate('/dashboard');
                }
            } catch (err) {
                console.error('Auth check failed', err);
            }
        };
        checkAuth();
    }, [navigate]);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem('accessToken', data.accessToken);
                toast.success('تم تسجيل الدخول بنجاح');
                navigate('/dashboard');
            } else {
                // Security-aware: Generic error message
                toast.error('بيانات الدخول غير صحيحة. يرجى التأكد من البريد الإلكتروني وكلمة المرور.');
            }
        } catch (err: any) {
            toast.error('خطأ في الاتصال — يرجى التحقق من اتصالك بالإنترنت');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background p-4 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full max-w-md z-10"
            >
                <div className="flex justify-center mb-8">
                    <Link to="/" className="flex flex-col items-center gap-2 group">
                        <motion.img 
                            src="/logo.png" 
                            alt="Visual Identity Hub" 
                            className="h-28 w-auto transition-transform duration-300 group-hover:scale-105"
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring" }}
                        />
                    </Link>
                </div>

                <Card className="border-border/50 shadow-2xl backdrop-blur-sm bg-card/95 overflow-hidden">
                    <CardHeader className="space-y-1 pb-6 text-center">
                        <CardTitle className="text-2xl font-serif font-bold tracking-tight">
                            تسجيل الدخول
                        </CardTitle>
                        <CardDescription className="text-muted-foreground">
                            مرحباً بك مجدداً! أدخل بياناتك للوصول إلى حسابك
                        </CardDescription>
                    </CardHeader>
                    
                    <CardContent>
                        <form onSubmit={onSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-muted-foreground" />
                                    <span>البريد الإلكتروني</span>
                                </Label>
                                <div className="relative group">
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="name@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        disabled={loading}
                                        className="h-11 transition-all focus:ring-2 focus:ring-primary/20"
                                        dir="ltr"
                                    />
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-sm font-medium leading-none flex items-center gap-2">
                                    <Lock className="w-4 h-4 text-muted-foreground" />
                                    <span>كلمة المرور</span>
                                </Label>
                                <div className="relative group">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        disabled={loading}
                                        className="h-11 transition-all focus:ring-2 focus:ring-primary/20 pe-10"
                                        dir="ltr"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pe-3 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                                        aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-4 h-4" />
                                        ) : (
                                            <Eye className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center space-x-2 space-x-reverse">
                                <Checkbox 
                                    id="remember" 
                                    checked={rememberMe}
                                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                                    disabled={loading}
                                />
                                <Label 
                                    htmlFor="remember" 
                                    className="text-sm font-medium leading-none cursor-pointer"
                                >
                                    تذكرني على هذا الجهاز
                                </Label>
                            </div>

                            <Button 
                                type="submit" 
                                className="w-full h-11 text-base font-medium transition-all active:scale-[0.98]"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        جاري التحقق...
                                    </>
                                ) : (
                                    <span className="flex items-center justify-center gap-2">
                                        دخول
                                        <ChevronLeft className="w-4 h-4" />
                                    </span>
                                )}
                            </Button>
                        </form>
                    </CardContent>

                    <CardFooter className="flex flex-col space-y-4 border-t border-border/50 bg-muted/20 pt-6">
                    </CardFooter>
                </Card>

                <div className="mt-8 text-center">
                    <Link 
                        to="/" 
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
                    >
                        <motion.span whileHover={{ x: 5 }}>
                            <ArrowRight className="w-4 h-4" />
                        </motion.span>
                        العودة للرئيسية
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;

