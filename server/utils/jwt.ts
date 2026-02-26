import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config(); // يقرا ملف .env

// جلب القيم
const JWT_SECRET = process.env.JWT_SECRET || 'fallbacksecret';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'fallbackrefreshsecret';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '15m';
const JWT_REFRESH_EXPIRE = process.env.JWT_REFRESH_EXPIRE || '7d';

// تصدير القيم للاستخدام الخارجي أو الفحص
export { JWT_SECRET, JWT_REFRESH_SECRET, JWT_EXPIRE, JWT_REFRESH_EXPIRE };

export const generateAccessToken = (payload: object) => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRE });
};

export const generateRefreshToken = (payload: object) => {
    return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRE });
};

export const verifyAccessToken = (token: string) => {
    return jwt.verify(token, JWT_SECRET);
};

export const verifyRefreshToken = (token: string) => {
    return jwt.verify(token, JWT_REFRESH_SECRET);
};
