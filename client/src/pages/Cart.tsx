import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";

export default function Cart() {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCart();

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
          <p className="text-muted-foreground mb-8">لم تضف أي منتجات للسلة بعد</p>
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
      >
        <h1 className="text-4xl font-serif mb-8">سلة التسوق</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, index) => (
              <motion.div
                key={`${item.type}-${item.id}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-4 p-4 bg-secondary/30 rounded-xl"
                data-testid={`cart-item-${item.id}`}
              >
                <div className="w-24 h-24 bg-secondary rounded-lg overflow-hidden shrink-0">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1">
                  <h3 className="font-medium mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {item.type === "product" ? "منتج" : "هوية بصرية"}
                  </p>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateQuantity(item.id, item.type, item.quantity - 1)}
                      className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
                      data-testid={`button-decrease-${item.id}`}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-medium w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.type, item.quantity + 1)}
                      className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
                      data-testid={`button-increase-${item.id}`}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col items-end justify-between">
                  <button
                    onClick={() => removeItem(item.id, item.type)}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                    data-testid={`button-remove-${item.id}`}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <span className="font-bold text-lg">{item.price * item.quantity} ر.س</span>
                </div>
              </motion.div>
            ))}

            <button
              onClick={clearCart}
              className="text-sm text-muted-foreground hover:text-destructive transition-colors"
              data-testid="button-clear-cart"
            >
              إفراغ السلة
            </button>
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

              <Link to="/checkout">
                <Button className="w-full" size="lg" data-testid="button-checkout">
                  إتمام الشراء
                  <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
