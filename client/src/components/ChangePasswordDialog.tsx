import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { changePasswordSchema, type ChangePassword } from '@shared/schema';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';
import { KeyRound, Loader2 } from 'lucide-react';

import { apiRequest } from '@/lib/queryClient';

interface ChangePasswordDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const ChangePasswordDialog: React.FC<ChangePasswordDialogProps> = ({ open, onOpenChange }) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<ChangePassword>({
        resolver: zodResolver(changePasswordSchema)
    });

    const onSubmit = async (data: ChangePassword) => {
        try {
            const response = await apiRequest('POST', '/api/auth/change-password', data);
            const result = await response.json();

            toast.success(result.message || 'تم تغيير كلمة المرور بنجاح');
            reset();
            onOpenChange(false);
        } catch (error: any) {
            console.error('Password change error details:', error);

            let errorMessage = 'حدث خطأ في الاتصال بالسيرفر';
            if (error.message) {
                // Handle common error formats (e.g., "401: Unauthorized")
                const match = error.message.match(/^\d+: (.*)/);
                if (match) {
                    try {
                        const jsonError = JSON.parse(match[1]);
                        errorMessage = jsonError.message || errorMessage;
                    } catch {
                        errorMessage = match[1];
                    }
                } else {
                    errorMessage = error.message;
                }
            }

            toast.error(errorMessage);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] font-tajawal" dir="rtl">
                <DialogHeader>
                    <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                        <KeyRound className="w-6 h-6 text-primary" />
                    </div>
                    <DialogTitle className="text-center text-xl font-bold">تغيير كلمة المرور</DialogTitle>
                    <DialogDescription className="text-center">
                        يرجى إدخال كلمة المرور الحالية والجديدة لتحديث بياناتك.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="currentPassword">كلمة المرور الحالية</Label>
                        <Input
                            id="currentPassword"
                            type="password"
                            placeholder="••••••••"
                            {...register('currentPassword')}
                            className={errors.currentPassword ? 'border-destructive' : ''}
                        />
                        {errors.currentPassword && (
                            <p className="text-xs text-destructive">{errors.currentPassword.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="newPassword">كلمة المرور الجديدة</Label>
                        <Input
                            id="newPassword"
                            type="password"
                            placeholder="••••••••"
                            {...register('newPassword')}
                            className={errors.newPassword ? 'border-destructive' : ''}
                        />
                        {errors.newPassword && (
                            <p className="text-xs text-destructive">{errors.newPassword.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">تأكيد كلمة المرور الجديدة</Label>
                        <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="••••••••"
                            {...register('confirmPassword')}
                            className={errors.confirmPassword ? 'border-destructive' : ''}
                        />
                        {errors.confirmPassword && (
                            <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
                        )}
                    </div>

                    <DialogFooter className="mt-6 flex-row-reverse gap-2">
                        <Button type="submit" disabled={isSubmitting} className="flex-1">
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                                    جاري الحفظ...
                                </>
                            ) : (
                                'تحديث كلمة المرور'
                            )}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            className="flex-1"
                        >
                            إلغاء
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
