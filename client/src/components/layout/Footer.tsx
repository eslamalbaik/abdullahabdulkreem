import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-secondary/30 pt-20 pb-10 border-t border-border mt-auto">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-2">
            <h3 className="text-2xl font-serif font-bold mb-6">إيلينا غريد</h3>
            <p className="text-muted-foreground max-w-sm leading-relaxed">
              أصمم هويات بصرية مميزة للعلامات التجارية التي تجرؤ على الاختلاف.
              مقرّي في كوبنهاغن، وأعمل مع عملاء حول العالم.
            </p>
          </div>
          
          <div>
            <h4 className="font-serif font-semibold mb-4">خريطة الموقع</h4>
            <ul className="space-y-3">
              <li><Link href="/portfolio" className="text-muted-foreground hover:text-foreground transition-colors">أعمالي</Link></li>
              <li><Link href="/shop" className="text-muted-foreground hover:text-foreground transition-colors">المتجر</Link></li>
              <li><Link href="/courses" className="text-muted-foreground hover:text-foreground transition-colors">الدورات</Link></li>
              <li><Link href="/blog" className="text-muted-foreground hover:text-foreground transition-colors">المدونة</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif font-semibold mb-4">تابعني</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">انستغرام</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">تويتر</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">لينكدإن</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">بيهانس</a></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-border/50 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} إيلينا غريد. جميع الحقوق محفوظة.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-foreground">سياسة الخصوصية</a>
            <a href="#" className="hover:text-foreground">شروط الاستخدام</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
