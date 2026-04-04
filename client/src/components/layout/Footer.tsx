import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Instagram, ChevronLeft, ChevronRight, Star, Mail, CheckCircle } from "lucide-react";

interface Testimonial {
  id: number;
  text: string;
  author: string;
  role: string;
  rating: number;
}

const defaultTestimonials = [
  {
    id: 1,
    rating: 5,
    text: "تعاملت مع عبدالله في بناء هوية مشروعي وكانت النتيجة أكثر من رائعة. احترافية عالية وفهم عميق لاحتياجات العميل.",
    author: "محمد العتيبي",
    role: "مؤسس مقهى الفنجان"
  },
  {
    id: 2,
    rating: 5,
    text: "عبدالله مصمم مبدع ويهتم بأدق التفاصيل. الهوية البصرية اللي صممها لنا رفعت مستوى علامتنا التجارية بشكل ملحوظ.",
    author: "سارة الحربي",
    role: "مديرة شركة نمو"
  },
  {
    id: 3,
    rating: 5,
    text: "من أفضل المصممين اللي تعاملت معهم. يفهم رؤيتك ويحولها لهوية بصرية متكاملة تعكس جوهر العلامة.",
    author: "خالد الشمري",
    role: "مؤسس متجر أصيل"
  },
  {
    id: 4,
    rating: 5,
    text: "العمل مع عبدالله كان تجربة ممتازة. التزام بالمواعيد وجودة عالية في التصميم.",
    author: "نورة القحطاني",
    role: "صاحبة مشروع زهرة"
  },
  {
    id: 5,
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

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function StarRatingDisplay({ rating }: { rating: number }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars.push(<Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />);
    } else if (i - 0.5 <= rating) {
      stars.push(
        <div key={i} className="relative w-4 h-4">
          <Star className="absolute w-4 h-4 text-yellow-500" />
          <div className="absolute overflow-hidden w-1/2">
            <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
          </div>
        </div>
      );
    } else {
      stars.push(<Star key={i} className="w-4 h-4 text-gray-300" />);
    }
  }
  return <div className="flex gap-0.5">{stars}</div>;
}

export default function Footer() {
  const { pathname } = useLocation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { data: dbTestimonials = [] } = useQuery<Testimonial[]>({
    queryKey: ["/api/testimonials"],
  });

  const testimonials = dbTestimonials.length > 0 ? dbTestimonials : defaultTestimonials;

  const isHomePage = pathname === "/";

  const getVisibleTestimonials = () => {
    const len = testimonials.length;
    if (len === 0) return [];
    const prev = (currentIndex - 1 + len) % len;
    const next = (currentIndex + 1) % len;
    return [testimonials[prev], testimonials[currentIndex], testimonials[next]];
  };

  const visibleTestimonials = getVisibleTestimonials();

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
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
    try {
      await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      setIsSubscribed(true);
      setEmail("");
    } catch (error) {
      setEmailError("حدث خطأ. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <footer className="bg-secondary/30 pt-20 pb-10 border-t border-border mt-auto">
      <div className="container mx-auto px-6">
        {isHomePage && (
          <div className="mb-16">
            <h4 className="font-serif font-semibold text-xl mb-6 text-center">قالوا عن عبد الله عبد الكريم</h4>

            <div className="relative flex items-center">
              <button
                onClick={prevSlide}
                className="absolute right-0 md:-right-6 z-10 p-3 rounded-full border border-border bg-background hover:bg-primary hover:text-white transition-colors shadow-lg"
                data-testid="btn-prev-testimonial"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              <div className="flex items-center justify-center gap-4 mx-12 md:mx-16 flex-1">
                <AnimatePresence mode="popLayout">
                  {visibleTestimonials.map((testimonial, index) => {
                    const isCenter = index === 1;
                    return (
                      <motion.div
                        key={testimonial.author}
                        layout
                        initial={{ opacity: 0, scale: 0.8, x: index === 0 ? 100 : index === 2 ? -100 : 0 }}
                        animate={{
                          opacity: isCenter ? 1 : 0.6,
                          scale: isCenter ? 1.05 : 0.9,
                          x: 0,
                          filter: isCenter ? 'blur(0px)' : 'blur(2px)'
                        }}
                        exit={{ opacity: 0, scale: 0.8, x: index === 0 ? -100 : index === 2 ? 100 : 0 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        className={`bg-background/50 rounded-xl border border-border/50 ${isCenter
                          ? 'p-6 md:p-8 z-10 shadow-xl flex-1 max-w-md'
                          : 'p-4 md:p-5 hidden md:block flex-1 max-w-xs'
                          }`}
                      >
                        <div className="flex items-center gap-1 mb-3">
                          <StarRatingDisplay rating={testimonial.rating} />
                        </div>
                        <p className={`text-muted-foreground leading-relaxed mb-4 ${isCenter ? 'text-base md:text-lg' : 'text-sm'}`}>
                          "{testimonial.text}"
                        </p>
                        <p className={`text-foreground font-medium ${isCenter ? 'text-sm' : 'text-xs'}`}>— {testimonial.author}، {testimonial.role}</p>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
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
              <a href="https://www.instagram.com/a21_des?igsh=ajBiM21yM2JoaDlp" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="https://x.com/A21_Des" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                <XIcon className="w-6 h-6" />
              </a>
              <a href="https://www.behance.net/abdullahslwmh1" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                <BehanceIcon className="w-6 h-6" />
              </a>
              <a href="https://api.whatsapp.com/message/QY65ISWC6GKDJ1?autoload=1&app_absent=0" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                <WhatsAppIcon className="w-6 h-6" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-serif font-semibold text-lg mb-4">اشترك في النشرة البريدية</h4>
            {isSubscribed ? (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span>شكراً لاشتراكك!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-3">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="البريد الإلكتروني"
                    className="w-full px-4 py-3 pr-12 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    data-testid="input-newsletter-email"
                  />
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                </div>
                {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                  data-testid="button-subscribe"
                >
                  {isLoading ? "جاري الاشتراك..." : "اشترك"}
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-border/50 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} عبد الله عبد الكريم. جميع الحقوق محفوظة.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link to="/privacy" className="hover:text-foreground" data-testid="link-privacy">سياسة الخصوصية</Link>
            <Link to="/terms" className="hover:text-foreground" data-testid="link-terms">شروط الاستخدام</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
