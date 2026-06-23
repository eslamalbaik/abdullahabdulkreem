import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import ActivityLog from '../models/ActivityLog.js';

export const activityLogger = async (req: Request, res: Response, next: NextFunction) => {
    const originalSend = res.send;

    res.send = function (body: any) {
        try {
            const userId = (req as any).user?.id;
            // نسجّل فقط إذا كان المستخدم معرّفاً بـ ObjectId صحيح (نتجاهل local-admin وغيره)
            if (
                userId &&
                req.method !== 'GET' &&
                mongoose.Types.ObjectId.isValid(userId) &&
                String(new mongoose.Types.ObjectId(userId)) === String(userId)
            ) {
                const log = new ActivityLog({
                    user: userId,
                    action: `${req.method} ${req.originalUrl}`,
                    method: req.method,
                    url: req.originalUrl,
                    ip: req.ip,
                    userAgent: req.get('User-Agent'),
                    details: req.body,
                });
                log.save().catch((err: Error) => console.error('Error saving activity log:', err));
            }
        } catch (err) {
            // لا نسمح لأي خطأ في التسجيل أن يفشل الطلب الأصلي
            console.error('activityLogger error (ignored):', (err as Error)?.message);
        }
        return originalSend.call(this, body);
    };

    next();
};
