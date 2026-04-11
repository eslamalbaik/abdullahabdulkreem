import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, ShoppingBag, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart();

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

  const handleCheckout = () => {
    const itemsList = items.map(item => `- ${item.title} (الكمية: ${item.quantity})`).join('\n');
    const message = `مرحباً، أود إتمام طلب الشراء للمنتجات التالية:\n\n${itemsList}\n\nالإجمالي: ${totalPrice} ر.س`;
    
    clearCart();
    
    const whatsappUrl = `https://wa.me/966581258192?text=${encodeURIComponent(message)}`;
    window.location.href = whatsappUrl;
  };

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

        <div className="bg-secondary/30 rounded-xl p-8">
          <h2 className="text-2xl font-serif mb-6 text-center">ملخص الطلب</h2>

          <div className="space-y-4 mb-8">
            {items.map((item) => (
              <div key={`${item.type}-${item.id}`} className="flex justify-between items-center text-lg p-4 bg-background rounded-lg border border-border">
                <span className="font-medium">
                  {item.title} <span className="text-muted-foreground text-sm mx-2">× {item.quantity}</span>
                </span>
                <span className="font-bold">{item.price * item.quantity} ر.س</span>
              </div>
            ))}
          </div>

          <div className="border-t border-border pt-6 mb-8">
            <div className="flex justify-between items-center text-2xl font-bold">
              <span>الإجمالي</span>
              <span className="text-primary">{totalPrice} ر.س</span>
            </div>
          </div>

          <Button
            onClick={handleCheckout}
            className="w-full h-14 text-lg bg-[#25D366] hover:bg-[#128C7E] text-white transition-colors"
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
