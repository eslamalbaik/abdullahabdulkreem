import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams, Link } from "react-router-dom";
import { ArrowRight, ShoppingBag, Send, CheckCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { calculateFinalPrice } from "@/lib/discounts";
import { Button } from "@/components/ui/button";
import { Currency } from "@/components/ui/Currency";
import { useCart } from "@/contexts/CartContext";
import { Confetti } from "@/components/ui/Confetti";

export default function Checkout() {
  const [searchParams] = useSearchParams();
  const directType = searchParams.get('type') as 'product' | 'identity' | null;
  const directId = searchParams.get('id');

  const { items, totalPrice: cartTotalPrice, clearCart } = useCart();
  const [isOrdered, setIsOrdered] = useState(false);

  const { data: activeDiscounts = [] } = useQuery<any[]>({
    queryKey: ['/api/discounts/active'],
  });

  const { data: configs = [] } = useQuery<any[]>({
    queryKey: ["/api/site-configs"],
  });

  const globalPercentage = parseFloat(configs.find(c => c.key === 'global_discount_percentage')?.value || '0');

  // Fetch direct item if present
  const { data: directItem } = useQuery<any>({
    queryKey: [directType === 'product' ? `/api/products/${directId}` : `/api/identities/${directId}`],
    enabled: !!directId && !!directType,
  });

  const [displayItems, setDisplayItems] = useState<any[]>([]);
  const [displayTotal, setDisplayTotal] = useState(0);

  useEffect(() => {
    if (directItem && directId && directType) {
      const { finalPrice } = calculateFinalPrice(
        directItem.price,
        directId,
        directType,
        activeDiscounts,
        globalPercentage
      );
      setDisplayItems([{
        ...directItem,
        type: directType,
        quantity: 1,
        price: finalPrice
      }]);
      setDisplayTotal(finalPrice);
    } else {
      setDisplayItems(items);
      setDisplayTotal(cartTotalPrice);
    }
  }, [items, cartTotalPrice, directItem, directId, directType, activeDiscounts, globalPercentage]);

  const handleCheckout = () => {
    if (displayItems.length === 0) return;

    const itemsList = displayItems.map(item => `- ${item.title} (الكمية: ${item.quantity})`).join('\n');
    const message = `مرحباً، أود إتمام طلب الشراء للمنتجات التالية:\n\n${itemsList}\n\nالإجمالي: ${displayTotal} ر.س`;
    
    setIsOrdered(true);

    // Notify admin about checkout attempt
    try {
      fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'checkout',
          title: 'طلب شراء جديد',
          message: `طلب شراء عبر الواتساب بقيمة ${displayTotal} ر.س`,
          data: { items: displayItems, total: displayTotal }
        })
      });
    } catch (err) {
      console.error('Error sending checkout notification:', err);
    }
    
    const whatsappUrl = `https://wa.me/966581258192?text=${encodeURIComponent(message)}`;
    
    setTimeout(() => {
      clearCart();
      window.location.href = whatsappUrl;
    }, 3000);
  };

  if (isOrdered) {
    return (
      <div className="pt-32 pb-24 container mx-auto px-6 overflow-hidden min-h-[60vh] flex items-center justify-center">
        <Confetti count={150} />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md mx-auto"
        >
          <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border-4 border-green-500/20">
            <CheckCircle className="w-12 h-12 text-green-500 animate-bounce" />
          </div>
          <h1 className="text-4xl font-serif mb-4">تم تجهيز طلبك!</h1>
          <p className="text-xl text-muted-foreground mb-8">جاري تحويلك إلى الواتساب لإكمال الدفع...</p>
          <div className="w-full bg-secondary/30 h-1.5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 3, ease: "linear" }}
              className="h-full bg-green-500"
            />
          </div>
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
          <ShoppingBag className="w-16 h-16 mx-auto mb-6 text-muted-foreground" />
          <h1 className="text-3xl font-serif mb-4">السلة فارغة</h1>
          <p className="text-muted-foreground mb-8">أضف منتجات للسلة أولاً</p>
          <Link to="/shop">
            <Button>تصفح المتجر</Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto"
      >
        <Link to="/cart" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8" data-testid="link-back-cart">
          <ArrowRight className="w-4 h-4 rotate-180" />
          العودة للسلة
        </Link>

        <h1 className="text-4xl font-serif mb-8 text-center">إتمام الشراء</h1>

        <div className="bg-secondary/30 rounded-xl p-8 border border-border/50 backdrop-blur-sm">
          <h2 className="text-2xl font-serif mb-6 text-center">ملخص الطلب</h2>

          <div className="space-y-4 mb-8">
            {displayItems.map((item) => (
              <div key={`${item.type}-${item.id}`} className="flex justify-between items-center text-lg p-4 bg-background/50 rounded-lg border border-border">
                <span className="font-medium">
                  {item.title} <span className="text-muted-foreground text-sm mx-2">× {item.quantity}</span>
                </span>
                <span className="font-bold">
                  <Currency amount={item.price * item.quantity} />
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-border pt-6 mb-8">
            <div className="flex justify-between items-center text-2xl font-bold">
              <span>الإجمالي</span>
              <span className="text-red-600 font-bold">
                <Currency amount={displayTotal} logoClassName="text-red-600" />
              </span>
            </div>
          </div>

          <Button
            onClick={handleCheckout}
            className="w-full h-14 text-lg bg-[#25D366] hover:bg-[#128C7E] text-white transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
            size="lg"
            data-testid="button-submit-order"
          >
            <Send className="w-5 h-5 ml-2 mr-0" />
            <span className="mr-2">إتمام الشراء عبر الواتساب</span>
          </Button>

          <p className="text-sm text-muted-foreground text-center mt-6">
            سيتم تحويلك إلى الواتساب لإكمال الطلب مباشرة والتواصل مع فريقنا
          </p>
        </div>
      </motion.div>
    </div>
  );
}
