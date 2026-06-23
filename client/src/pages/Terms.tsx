import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function Terms() {
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

        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-8" data-testid="heading-terms">
          شروط الاستخدام
        </h1>

        <div className="prose prose-lg max-w-none text-foreground">
          <p className="text-lg leading-relaxed mb-8">
            باستخدامك لموقع عبدالله عبدالكريم فإنك توافق على الشروط التالية:
          </p>

          <section className="mb-10">
            <h2 className="font-serif text-2xl font-semibold mb-4">1. الملكية الفكرية</h2>
            <p className="text-muted-foreground mb-4">
              جميع الأعمال المعروضة في الموقع (تصاميم، شعارات، هويات، صور، نصوص) هي ملك حصري لـ عبدالله عبدالكريم / تشكيل ستوديو ولا يجوز:
            </p>
            <ul className="list-disc pr-6 space-y-2 text-muted-foreground">
              <li>نسخها</li>
              <li>إعادة استخدامها</li>
              <li>تعديلها</li>
              <li>أو إعادة نشرها</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              بدون إذن خطي مسبق.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-serif text-2xl font-semibold mb-4">2. استخدام الموقع</h2>
            <p className="text-muted-foreground">
              يُمنع استخدام الموقع لأي أغراض غير قانونية أو مسيئة، أو محاولة اختراق أو تعطيل أي جزء من خدماته.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-serif text-2xl font-semibold mb-4">3. المنتجات والخدمات الرقمية</h2>
            <ul className="list-disc pr-6 space-y-2 text-muted-foreground">
              <li>جميع المنتجات الرقمية غير قابلة للاسترجاع بعد التسليم.</li>
              <li>لا يتم إعادة المبلغ بعد بدء العمل على أي مشروع مخصص.</li>
              <li>يتحمل العميل مسؤولية توضيح متطلباته بدقة قبل بدء التنفيذ.</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="font-serif text-2xl font-semibold mb-4">4. حدود المسؤولية</h2>
            <p className="text-muted-foreground mb-4">لا نتحمل أي مسؤولية عن:</p>
            <ul className="list-disc pr-6 space-y-2 text-muted-foreground">
              <li>خسائر ناتجة عن سوء استخدام التصاميم</li>
              <li>قرارات تجارية اتخذها العميل بناءً على التصاميم</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="font-serif text-2xl font-semibold mb-4">5. التعديلات</h2>
            <p className="text-muted-foreground">
              يحق لنا تعديل هذه الشروط في أي وقت دون إشعار مسبق، ويُعتبر استمرار استخدام الموقع موافقة على الشروط المحدثة.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-serif text-2xl font-semibold mb-4">6. القانون المعمول به</h2>
            <p className="text-muted-foreground">
              تخضع هذه الشروط وتُفسّر وفق قوانين الدولة التي يعمل منها الموقع.
            </p>
          </section>
        </div>
      </motion.div>
    </div>
  );
}
