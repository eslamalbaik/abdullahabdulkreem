import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt.js';

export const protect = (req: Request, res: Response, next: NextFunction) => {
    // 1. Fallback to JWT token
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    // Handle string "null"/"undefined" from frontend localStorage
    if (!token || token === 'null' || token === 'undefined') {
        return res.status(401).json({ message: 'غير مصرح لك، يرجى تسجيل الدخول' });
    }

    try {
        const decoded = verifyAccessToken(token);
        (req as any).user = decoded;
        next();
    } catch (error: any) {
        return res.status(401).json({ message: 'غير مصرح لك، الرمز غير صالح', error: error.message });
    }
};

export const isAuthenticated = protect;

export const authorize = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!(req as any).user || !roles.includes((req as any).user.role)) {
            return res.status(403).json({
                message: `الدور ${(req as any).user?.role || 'مجهول'} غير مصرح له بالوصول إلى هذا المسار`,
            });
        }
        next();
    };
};
