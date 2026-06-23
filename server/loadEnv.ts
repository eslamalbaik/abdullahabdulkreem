import dotenv from "dotenv";

// نحمّل .env مع override حتى تطغى قيمه على أي متغيرات بيئة قديمة عالقة
// (يحل مشكلة "injecting env (0)" حيث pm2/النظام يحتفظ بقيم قديمة)
dotenv.config({ override: true });
