import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="pt-32 pb-24 container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
          data-testid="link-back-home"
        >
          <ArrowRight className="w-4 h-4 rotate-180" />
          العودة للرئيسية
        </Link>

        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-8" data-testid="heading-privacy">
          سياسة الخصوصية
        </h1>

        <p className="text-muted-foreground mb-8">
          آخر تحديث: 20/1/2026
        </p>

        <div className="prose prose-lg max-w-none text-foreground">
          <p className="text-lg leading-relaxed mb-8">
            نحن في موقع عبدالله عبدالكريم نحترم خصوصية الزوار والعملاء، ونلتزم بحماية أي بيانات شخصية يتم جمعها واستخدامها وفقاً لهذه السياسة.
          </p>

          <section className="mb-10">
            <h2 className="font-serif text-2xl font-semibold mb-4">1. المعلومات التي نقوم بجمعها</h2>
            <p className="text-muted-foreground mb-4">قد نقوم بجمع المعلومات التالية عند استخدامك للموقع:</p>
            <ul className="list-disc pr-6 space-y-2 text-muted-foreground">
              <li>الاسم</li>
              <li>البريد الإلكتروني</li>
              <li>رقم الهاتف</li>
              <li>بيانات الدفع (عبر بوابات دفع خارجية آمنة)</li>
              <li>أي معلومات ترسلها طوعاً عبر نماذج التواصل أو طلب الخدمات</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="font-serif text-2xl font-semibold mb-4">2. كيفية استخدام المعلومات</h2>
            <p className="text-muted-foreground mb-4">نستخدم البيانات للأغراض التالية:</p>
            <ul className="list-disc pr-6 space-y-2 text-muted-foreground">
              <li>معالجة الطلبات وتنفيذ الخدمات</li>
              <li>التواصل مع العميل بخصوص المشاريع أو الطلبات</li>
              <li>تحسين تجربة المستخدم وجودة الخدمات</li>
              <li>إرسال تحديثات أو عروض (إذا وافق المستخدم)</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="font-serif text-2xl font-semibold mb-4">3. حماية المعلومات</h2>
            <p className="text-muted-foreground">
              نلتزم باتخاذ الإجراءات التقنية والتنظيمية المناسبة لحماية بيانات المستخدم من الوصول غير المصرح به أو التعديل أو الإفصاح.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-serif text-2xl font-semibold mb-4">4. مشاركة المعلومات</h2>
            <p className="text-muted-foreground mb-4">
              لا نقوم ببيع أو مشاركة بيانات المستخدم مع أي طرف ثالث، باستثناء:
            </p>
            <ul className="list-disc pr-6 space-y-2 text-muted-foreground">
              <li>بوابات الدفع</li>
              <li>خدمات الاستضافة والتحليل</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              وذلك فقط بالقدر اللازم لتشغيل الموقع.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-serif text-2xl font-semibold mb-4">5. ملفات تعريف الارتباط (Cookies)</h2>
            <p className="text-muted-foreground">
              قد يستخدم الموقع ملفات تعريف الارتباط لتحسين الأداء وتحليل الاستخدام، ويمكن للمستخدم تعطيلها من إعدادات المتصفح.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-serif text-2xl font-semibold mb-4">6. حقوق المستخدم</h2>
            <p className="text-muted-foreground mb-4">يحق للمستخدم:</p>
            <ul className="list-disc pr-6 space-y-2 text-muted-foreground">
              <li>طلب معرفة البيانات المخزنة عنه</li>
              <li>طلب تعديل أو حذف بياناته</li>
              <li>سحب الموافقة على التواصل في أي وقت</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="font-serif text-2xl font-semibold mb-4">7. التعديلات على السياسة</h2>
            <p className="text-muted-foreground">
              يحق لنا تعديل سياسة الخصوصية في أي وقت، ويتم نشر التحديثات في هذه الصفحة.
            </p>
          </section>
        </div>
      </motion.div>
    </div>
  );
}
