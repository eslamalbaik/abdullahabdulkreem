import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, ShoppingCart, ArrowRight } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { Currency } from "@/components/ui/Currency";
import { CartSuccessAnimation } from "@/components/ui/CartSuccessAnimation";
import { PriceDisplay } from "@/components/PriceDisplay";
import { calculateFinalPrice } from "@/lib/discounts";

interface Identity {
  id: number;
  title: string;
  description: string;
  price: number;
  image: string;
  images?: string[];
  includes: string[];
}

export default function IdentityDetail() {
  const { id } = useParams<{ id: string }>();
  const { addItem } = useCart();
  const { toast } = useToast();
  
  const { data: identity, isLoading } = useQuery<Identity>({
    queryKey: [`/api/identities/${id}`],
  });

  const { data: activeDiscounts = [] } = useQuery<any[]>({
    queryKey: ['/api/discounts/active'],
  });

  const { data: configs = [] } = useQuery<any[]>({
    queryKey: ["/api/site-configs"],
  });

  const globalPercentage = parseFloat(configs.find(c => c.key === 'global_discount_percentage')?.value || '0');

  const handleAddToCart = () => {
    if (!identity || !id) return;
    const { finalPrice } = calculateFinalPrice(
      identity.price,
      id,
      'identity',
      activeDiscounts,
      globalPercentage
    );

    addItem({
      id: identity.id,
      title: identity.title,
      price: finalPrice,
      originalPrice: identity.price,
      image: identity.image,
      type: "identity",
    });
  };

  if (isLoading) {
    return (
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-6">
          <div className="animate-pulse">
            <div className="h-8 w-32 bg-muted rounded mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="aspect-[4/3] bg-muted rounded-2xl" />
              <div className="space-y-4">
                <div className="h-10 bg-muted rounded w-3/4" />
                <div className="h-6 bg-muted rounded w-1/2" />
                <div className="h-32 bg-muted rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!identity) {
    return (
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-3xl font-bold mb-4">الهوية غير موجودة</h1>
          <Link to="/identities" className="text-primary hover:underline">
            العودة للهويات البصرية
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link 
            to="/identities" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
            data-testid="link-back-identities"
          >
            <ArrowRight className="w-4 h-4" />
            العودة للهويات البصرية
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              <div className="aspect-[4/3] rounded-2xl overflow-hidden">
                <img
                  src={identity.image}
                  alt={identity.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {identity.images && identity.images.length > 0 && (
                <div className="grid grid-cols-2 gap-4">
                  {identity.images.map((img, index) => (
                    <div key={index} className="aspect-square rounded-xl overflow-hidden bg-muted">
                      <img
                        src={img}
                        alt={`${identity.title} - معاينة ${index + 1}`}
                        className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                      />
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-8"
            >
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-identity-title">
                  {identity.title}
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  {identity.description}
                </p>
              </div>

              <div className="bg-card border border-border rounded-2xl p-6">
                <h2 className="text-lg font-semibold mb-4 text-primary">ماذا تشمل الهوية؟</h2>
                <ul className="space-y-3">
                  {identity.includes.map((item, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Check className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-foreground">{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              <div className="bg-gradient-to-br from-primary/5 to-secondary/20 border border-primary/20 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-muted-foreground">السعر</span>
                  <PriceDisplay 
                    price={identity.price} 
                    itemId={identity.id} 
                    itemType="identity" 
                    size="lg" 
                  />
                </div>
                
                <button 
                  className="w-full py-4 bg-primary text-primary-foreground rounded-xl text-lg font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                  onClick={handleAddToCart}
                  data-testid="button-add-to-cart"
                >
                  <ShoppingCart className="w-5 h-5" />
                  أضف للسلة
                </button>
                
                <p className="text-center text-sm text-muted-foreground mt-4">
                  ستحصل على جميع الملفات بصيغ قابلة للتعديل
                </p>
              </div>

              <div className="border-t border-border pt-6">
                <h3 className="font-semibold mb-3">ملاحظات مهمة:</h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• الهوية جاهزة للتخصيص حسب اسم مشروعك</li>
                  <li>• يمكنك طلب تعديلات بسيطة على الألوان</li>
                  <li>• الملفات المصدرية بصيغة AI و PSD</li>
                  <li>• دعم فني لمدة 30 يوم بعد الشراء</li>
                </ul>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
