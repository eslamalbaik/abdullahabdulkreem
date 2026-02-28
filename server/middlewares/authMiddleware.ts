import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt.js';

export const protect = (req: Request, res: Response, next: NextFunction) => {
    // Debug Logs
    console.log(`[authMiddleware] Path: ${req.path}`);
    console.log(`[authMiddleware] IsAuthenticated: ${(req as any).isAuthenticated?.()}`);
    console.log(`[authMiddleware] SessionID: ${(req as any).sessionID}`);
    console.log(`[authMiddleware] Cookie Header: ${req.headers.cookie || 'NONE'}`);

    // 1. Check for Passport session (Replit Auth / Local Login)
    if (typeof (req as any).isAuthenticated === 'function' && (req as any).isAuthenticated()) {
        console.log(`[authMiddleware] Authorized via Session: ${(req as any).user?.id || (req as any).user?.email}`);
        return next();
    }

    // 2. Fallback to JWT token
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    // Handle string "null"/"undefined" from frontend localStorage
    if (!token || token === 'null' || token === 'undefined') {
        console.warn(`[authMiddleware] Unauthorized: No valid token or session. Token found: ${token}`);
        return res.status(401).json({ message: 'Not authorized, please login' });
    }

    try {
        const decoded = verifyAccessToken(token);
        (req as any).user = decoded;
        console.log(`[authMiddleware] Authorized via JWT: ${(decoded as any).id}`);
        next();
    } catch (error: any) {
        console.error(`[authMiddleware] JWT Verification Failed: ${error.message}`);
        return res.status(401).json({ message: 'Not authorized, token failed', error: error.message });
    }
};

export const authorize = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!roles.includes((req as any).user.role)) {
            return res.status(403).json({
                message: `User role ${(req as any).user.role} is not authorized to access this route`,
            });
        }
        next();
    };
};
