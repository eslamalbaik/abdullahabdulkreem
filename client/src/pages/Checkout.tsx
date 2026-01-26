import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "wouter";
import { ArrowRight, Check, CreditCard, Smartphone, Building2, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

interface PaymentMethod {
  id: string;
  name: string;
  nameAr: string;
  image: string;
  icon: React.ReactNode;
}

const paymentMethods: PaymentMethod[] = [
  {
    id: "mada",
    name: "Mada",
    nameAr: "مدى",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Mada_Logo.svg/512px-Mada_Logo.svg.png",
    icon: <CreditCard className="w-6 h-6" />,
  },
  {
    id: "visa",
    name: "Visa",
    nameAr: "فيزا",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/512px-Visa_Inc._logo.svg.png",
    icon: <CreditCard className="w-6 h-6" />,
  },
  {
    id: "mastercard",
    name: "Mastercard",
    nameAr: "ماستركارد",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/512px-Mastercard-logo.svg.png",
    icon: <CreditCard className="w-6 h-6" />,
  },
  {
    id: "applepay",
    name: "Apple Pay",
    nameAr: "أبل باي",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Apple_Pay_logo.svg/512px-Apple_Pay_logo.svg.png",
    icon: <Smartphone className="w-6 h-6" />,
  },
  {
    id: "stcpay",
    name: "STC Pay",
    nameAr: "STC Pay",
    image: "https://stcpay.com.sa/assets/images/stcpay-logo.svg",
    icon: <Smartphone className="w-6 h-6" />,
  },
  {
    id: "tabby",
    name: "Tabby",
    nameAr: "تابي",
    image: "https://tabby.ai/images/tabby-logo-green.png",
    icon: <Building2 className="w-6 h-6" />,
  },
  {
    id: "tamara",
    name: "Tamara",
    nameAr: "تمارا",
    image: "https://cdn.tamara.co/assets/svg/tamara-logo-badge-en.svg",
    icon: <Building2 className="w-6 h-6" />,
  },
  {
    id: "bank",
    name: "Bank Transfer",
    nameAr: "تحويل بنكي",
    image: "",
    icon: <Building2 className="w-6 h-6" />,
  },
];

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const [selectedPayment, setSelectedPayment] = useState<string>("");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user, isLoading, isAuthenticated } = useAuth();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.firstName && user.lastName 
          ? `${user.firstName} ${user.lastName}` 
          : user.firstName || prev.name,
        email: user.email || prev.email,
      }));
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="pt-32 pb-24 container mx-auto px-6">
        <div className="flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="pt-32 pb-24 container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-auto"
        >
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <LogIn className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-serif mb-4">سجل دخولك أولاً</h1>
          <p className="text-muted-foreground mb-8">
            يجب تسجيل الدخول لإتمام عملية الشراء
          </p>
          <a href="/api/login" data-testid="link-login-checkout">
            <Button size="lg">
              <LogIn className="w-5 h-5 me-2" />
              تسجيل الدخول
            </Button>
          </a>
        </motion.div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="pt-32 pb-24 container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-auto"
        >
          <h1 className="text-3xl font-serif mb-4">السلة فارغة</h1>
          <p className="text-muted-foreground mb-8">أضف منتجات للسلة أولاً</p>
          <Link href="/shop">
            <Button>تصفح المتجر</Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPayment) {
      toast({
        title: "اختر طريقة الدفع",
        description: "يرجى اختيار طريقة دفع للمتابعة",
        variant: "destructive",
      });
      return;
    }

    if (!formData.name || !formData.email || !formData.phone) {
      toast({
        title: "أكمل البيانات",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "تم استلام طلبك!",
      description: "سيتم التواصل معك قريباً لإتمام عملية الدفع",
    });
    
    clearCart();
    setLocation("/");
  };

  return (
    <div className="pt-32 pb-24 container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Link href="/cart" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8" data-testid="link-back-cart">
          <ArrowRight className="w-4 h-4 rotate-180" />
          العودة للسلة
        </Link>

        <h1 className="text-4xl font-serif mb-8">إتمام الشراء</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-secondary/30 rounded-xl p-6">
                <h2 className="text-xl font-serif mb-6">بيانات التواصل</h2>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">الاسم الكامل *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="أدخل اسمك الكامل"
                      required
                      data-testid="input-name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">البريد الإلكتروني *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="example@email.com"
                      required
                      data-testid="input-email"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="phone">رقم الجوال *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="05xxxxxxxx"
                      required
                      data-testid="input-phone"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-secondary/30 rounded-xl p-6">
                <h2 className="text-xl font-serif mb-6">طريقة الدفع</h2>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setSelectedPayment(method.id)}
                      className={`relative p-4 rounded-xl border-2 transition-all ${
                        selectedPayment === method.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                      data-testid={`payment-${method.id}`}
                      aria-pressed={selectedPayment === method.id}
                    >
                      {selectedPayment === method.id && (
                        <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                      
                      <div className="flex flex-col items-center gap-2">
                        {method.image ? (
                          <img
                            src={method.image}
                            alt={method.name}
                            className="h-8 object-contain"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                        ) : (
                          method.icon
                        )}
                        <span className={`hidden text-muted-foreground ${!method.image && '!block'}`}>
                          {method.icon}
                        </span>
                        <span className="text-sm font-medium">{method.nameAr}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-secondary/30 rounded-xl p-6 sticky top-28">
                <h2 className="text-xl font-serif mb-6">ملخص الطلب</h2>
                
                <div className="space-y-3 mb-6">
                  {items.map((item) => (
                    <div key={`${item.type}-${item.id}`} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {item.title} × {item.quantity}
                      </span>
                      <span>{item.price * item.quantity} ر.س</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border pt-4 mb-6">
                  <div className="flex justify-between text-lg font-bold">
                    <span>الإجمالي</span>
                    <span className="text-primary">{totalPrice} ر.س</span>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  size="lg"
                  disabled={!selectedPayment}
                  data-testid="button-submit-order"
                >
                  تأكيد الطلب
                </Button>

                <p className="text-xs text-muted-foreground text-center mt-4">
                  بالضغط على "تأكيد الطلب" أنت توافق على شروط الخدمة
                </p>
              </div>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
