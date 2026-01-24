import { Link } from "wouter";
import { Instagram } from "lucide-react";

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function BehanceIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M22 7h-7V5h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14H15.97c.13 3.211 3.483 3.312 4.588 2.029h3.168zm-7.686-4h4.965c-.105-1.547-1.136-2.219-2.477-2.219-1.466 0-2.277.768-2.488 2.219zm-9.574 6.988H0V5.021h6.953c5.476.081 5.58 5.444 2.72 6.906 3.461 1.26 3.577 8.061-3.207 8.061zM3 11h3.584c2.508 0 2.906-3-.312-3H3v3zm3.391 3H3v3.016h3.341c3.055 0 2.868-3.016.05-3.016z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="bg-secondary/30 pt-20 pb-10 border-t border-border mt-auto">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-2">
            <img src="/logo.png" alt="الشعار" className="h-24 mb-6" />
            <p className="text-muted-foreground max-w-sm leading-relaxed">
              مصمم هويات بصرية مختص في بناء وتطوير العلامات التجارية، أعمل على تحويل الأفكار إلى أنظمة بصرية واضحة تخدم أهداف العمل وتعكس جوهر العلامة. أركّز على التحليل والاستراتيجية قبل التصميم لضمان هوية قابلة للتطبيق والنمو.
            </p>
            <div className="flex gap-4 mt-6">
              <a href="https://www.instagram.com/a21_des/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="https://x.com/A21_Des" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                <XIcon className="w-6 h-6" />
              </a>
              <a href="https://www.behance.net/abdullahslwmh1" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                <BehanceIcon className="w-6 h-6" />
              </a>
            </div>
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
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-border/50 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} عبدالله عبدالكريم. جميع الحقوق محفوظة.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-foreground">سياسة الخصوصية</a>
            <a href="#" className="hover:text-foreground">شروط الاستخدام</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
