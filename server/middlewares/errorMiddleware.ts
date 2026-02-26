import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
    statusCode?: number;
}

const errorMiddleware = (err: AppError, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Server Error';

    console.error(`[Error] ${req.method} ${req.url}: ${message}`);
    if (err.stack) {
        console.error(err.stack);
    }

    res.status(statusCode).json({
        message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

export default errorMiddleware;
