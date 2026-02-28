import { Request, Response, NextFunction } from 'express';
import ActivityLog from '../models/ActivityLog.js';

export const activityLogger = async (req: Request, res: Response, next: NextFunction) => {
    const originalSend = res.send;

    res.send = function (body: any) {
        if ((req as any).user && req.method !== 'GET') {
            const log = new ActivityLog({
                user: (req as any).user.id,
                action: `${req.method} ${req.originalUrl}`,
                method: req.method,
                url: req.originalUrl,
                ip: req.ip,
                userAgent: req.get('User-Agent'),
                details: req.body,
            });
            log.save().catch((err: Error) => console.error('Error saving activity log:', err));
        }
        return originalSend.call(this, body);
    };

    next();
};
