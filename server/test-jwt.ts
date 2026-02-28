import {
    JWT_SECRET,
    JWT_REFRESH_SECRET,
    JWT_EXPIRE,
    JWT_REFRESH_EXPIRE,
    generateAccessToken,
    generateRefreshToken
} from './utils/jwt.ts';

console.log("--- القيم المستدعاة من .env ---");
console.log("JWT_SECRET:", JWT_SECRET);
console.log("JWT_REFRESH_SECRET:", JWT_REFRESH_SECRET);
console.log("JWT_EXPIRE:", JWT_EXPIRE);
console.log("JWT_REFRESH_EXPIRE:", JWT_REFRESH_EXPIRE);
console.log("-------------------------------\n");

// إنشاء Token
const token = generateAccessToken({ userId: 1 });
console.log("Token:", token);

// إنشاء Refresh Token
const refreshToken = generateRefreshToken({ userId: 1 });
console.log("Refresh Token:", refreshToken);

console.log("\nبذه الطريقة تم جلب كل القيم من .env واستخدامها لتوليد JWT بنجاح.");
