# نشر المشروع على Vercel

## متطلبات النشر

### 1. المتغيرات البيئية المطلوبة

أضف هذه المتغيرات في Vercel Dashboard > Settings > Environment Variables:

| المتغير | الوصف |
|---------|-------|
| `MONGODB_URI` | رابط اتصال MongoDB (Atlas أو أي مزود آخر) |

### 2. خطوات النشر

#### الطريقة الأولى: من GitHub

1. **ارفع المشروع إلى GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

2. **في Vercel:**
   - اذهب إلى [vercel.com](https://vercel.com)
   - اضغط "New Project"
   - اختر المستودع من GitHub
   - أضف المتغيرات البيئية
   - اضغط "Deploy"

#### الطريقة الثانية: باستخدام Vercel CLI

1. **ثبّت Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **سجل الدخول:**
   ```bash
   vercel login
   ```

3. **انشر المشروع:**
   ```bash
   vercel
   ```

4. **للنشر الإنتاجي:**
   ```bash
   vercel --prod
   ```

### 3. إعداد قاعدة البيانات

#### باستخدام MongoDB Atlas (موصى به):

1. أنشئ حساب على [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. أنشئ Cluster جديد
3. انسخ Connection String
4. أضفه كمتغير `MONGODB_URI` في Vercel

#### ملاحظة:
لا حاجة لتهجير (Migration) قاعدة البيانات يدوياً في MongoDB، حيث يتم إنشاء المجموعات (Collections) تلقائياً.

### 4. هيكل المشروع للنشر

```
├── api/
│   └── index.ts          # Serverless API handler
├── client/
│   └── src/              # React frontend
├── shared/
│   └── schema.ts         # Database schema
├── vercel.json           # Vercel configuration
└── dist/                 # Built frontend (after build)
```

### 5. ملاحظات مهمة

- **API Routes:** جميع الـ API endpoints تعمل كـ Serverless Functions في `/api/*`
- **Frontend:** يُبنى باستخدام Vite ويُخدم من `/`
- **Database:** يجب استخدام Neon Serverless أو مزود متوافق مع Serverless
- **Authentication:** نظام المصادقة الأصلي (Replit Auth) لن يعمل على Vercel - يحتاج لاستبداله بنظام بديل

### 6. استكشاف الأخطاء

#### خطأ: Cannot connect to database
- تأكد من إضافة `DATABASE_URL` في Vercel Environment Variables
- تأكد من أن الرابط يبدأ بـ `postgresql://` أو `postgres://`

#### خطأ: Build failed
- تأكد من تثبيت جميع الحزم: `npm install`
- جرب البناء محلياً: `npm run build`

#### خطأ: API returns 500
- افحص Vercel Function Logs في Dashboard
- تأكد من صحة المتغيرات البيئية

### 7. الفروقات عن Replit

| الميزة | Replit | Vercel |
|--------|--------|--------|
| Authentication | Replit Auth (OIDC) | يحتاج بديل (NextAuth, Clerk, etc.) |
| Database | PostgreSQL مدمج | خارجي (Neon, Supabase) |
| Serverless | Express Server | Edge Functions |
| Build | Custom build script | Vite build |

---

## للمساعدة

إذا واجهت مشاكل، راجع:
- [Vercel Documentation](https://vercel.com/docs)
- [Neon Documentation](https://neon.tech/docs)
