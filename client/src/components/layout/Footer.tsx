import { useState } from "react";
import { useLocation } from "wouter";
import { Instagram, ChevronLeft, ChevronRight, Mail, CheckCircle } from "lucide-react";

const testimonials = [
  {
    rating: 5,
    text: "تعاملت مع عبدالله في بناء هوية مشروعي وكانت النتيجة أكثر من رائعة. احترافية عالية وفهم عميق لاحتياجات العميل.",
    author: "محمد العتيبي",
    role: "مؤسس مقهى الفنجان"
  },
  {
    rating: 5,
    text: "عبدالله مصمم مبدع ويهتم بأدق التفاصيل. الهوية البصرية اللي صممها لنا رفعت مستوى علامتنا التجارية بشكل ملحوظ.",
    author: "سارة الحربي",
    role: "مديرة شركة نمو"
  },
  {
    rating: 5,
    text: "من أفضل المصممين اللي تعاملت معهم. يفهم رؤيتك ويحولها لهوية بصرية متكاملة تعكس جوهر العلامة.",
    author: "خالد الشمري",
    role: "مؤسس متجر أصيل"
  },
  {
    rating: 5,
    text: "العمل مع عبدالله كان تجربة ممتازة. التزام بالمواعيد وجودة عالية في التصميم.",
    author: "نورة القحطاني",
    role: "صاحبة مشروع زهرة"
  },
  {
    rating: 5,
    text: "أنصح بشدة بالتعامل مع عبدالله. هوية علامتنا التجارية الآن أقوى وأوضح بفضل عمله المميز.",
    author: "فهد المالكي",
    role: "مدير شركة تقنية"
  }
];

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
  const [location] = useLocation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const isHomePage = location === "/";
  
  const visibleTestimonials = testimonials.slice(currentIndex, currentIndex + 3);
  
  const nextSlide = () => {
    if (currentIndex + 3 < testimonials.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };
  
  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(testimonials.length - 3);
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError("");
    
    if (!email.trim()) {
      setEmailError("يرجى إدخال البريد الإلكتروني");
      return;
    }
    
    if (!validateEmail(email)) {
      setEmailError("يرجى إدخال بريد إلكتروني صحيح");
      return;
    }
    
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    setIsSubscribed(true);
    setEmail("");
  };

  return (
    <footer className="bg-secondary/30 pt-20 pb-10 border-t border-border mt-auto">
      <div className="container mx-auto px-6">
        {isHomePage && (
          <div className="mb-16">
            <h4 className="font-serif font-semibold text-xl mb-6 text-center">قالوا عن عبدالله</h4>
            
            <div className="relative flex items-center">
              <button 
                onClick={prevSlide}
                className="absolute right-0 md:-right-6 z-10 p-3 rounded-full border border-border bg-background hover:bg-primary hover:text-white transition-colors shadow-lg"
                data-testid="btn-prev-testimonial"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
              
              <div className="grid md:grid-cols-3 gap-4 mx-12 md:mx-16 flex-1">
                {visibleTestimonials.map((testimonial, index) => (
                  <div key={currentIndex + index} className="bg-background/50 p-5 rounded-lg border border-border/50">
                    <div className="flex items-center gap-1 mb-3">
                      <span className="text-yellow-500">{"★".repeat(testimonial.rating)}</span>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                      "{testimonial.text}"
                    </p>
                    <p className="text-xs text-foreground font-medium">— {testimonial.author}، {testimonial.role}</p>
                  </div>
                ))}
              </div>
              
              <button 
                onClick={nextSlide}
                className="absolute left-0 md:-left-6 z-10 p-3 rounded-full border border-border bg-background hover:bg-primary hover:text-white transition-colors shadow-lg"
                data-testid="btn-next-testimonial"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div>
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
            <h4 className="font-serif font-semibold text-xl mb-4">اشترك في النشرة البريدية</h4>
            <p className="text-muted-foreground mb-6">
              احصل على نصائح في التصميم والهوية البصرية مباشرة في بريدك الإلكتروني.
            </p>
            
            {isSubscribed ? (
              <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <p className="text-green-600">شكراً لاشتراكك! سنتواصل معك قريباً.</p>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-3">
                <div className="relative">
                  <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="email"
                    placeholder="بريدك الإلكتروني"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setEmailError("");
                    }}
                    className={`w-full pr-10 pl-4 py-3 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${
                      emailError ? "border-red-500" : "border-border"
                    }`}
                    data-testid="input-newsletter-email"
                  />
                </div>
                {emailError && (
                  <p className="text-red-500 text-sm">{emailError}</p>
                )}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  data-testid="btn-subscribe-newsletter"
                >
                  {isLoading ? "جاري الاشتراك..." : "اشترك الآن"}
                </button>
              </form>
            )}
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
