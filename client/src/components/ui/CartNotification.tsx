import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, ShoppingBag, ArrowRightCircle } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Button } from "./button";
import { Currency } from "./Currency";

export function CartNotification() {
  const { isNotificationOpen, lastAddedItem, closeNotification } = useCart();
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (isNotificationOpen) {
      setProgress(100);
      const startTime = Date.now();
      const duration = 5000;

      const timer = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
        setProgress(remaining);

        if (remaining === 0) {
          clearInterval(timer);
          closeNotification();
        }
      }, 10);

      return () => clearInterval(timer);
    }
  }, [isNotificationOpen, closeNotification]);

  if (!lastAddedItem) return null;

  return (
    <AnimatePresence>
      {isNotificationOpen && (
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          className="fixed top-24 left-6 z-[100] w-full max-w-sm overflow-hidden rounded-xl bg-white shadow-2xl border border-gray-100"
          dir="rtl"
        >
          {/* Progress Bar */}
          <div className="absolute top-0 right-0 h-1 bg-gray-100 w-full">
            <motion.div 
              className="h-full bg-green-500"
              initial={{ width: "100%" }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: "linear" }}
            />
          </div>

          <div className="p-4 pt-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 mt-2">
              <button 
                onClick={closeNotification}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-900">تمت الإضافة إلى سلة التسوق</span>
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              </div>
            </div>

            <hr className="border-gray-100 mb-4" />

            {/* Product Info */}
            <div className="flex gap-4 mb-6">
              <div className="flex-1 text-right">
                <h3 className="font-bold text-gray-900 mb-2">{lastAddedItem.title}</h3>
                <div className="flex flex-col items-start gap-1">
                   <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-red-600">
                        <Currency amount={lastAddedItem.price} logoClassName="text-red-600" />
                      </span>
                      {lastAddedItem.originalPrice && lastAddedItem.originalPrice > lastAddedItem.price && (
                        <div className="relative text-sm text-gray-400 font-normal px-0.5">
                           <Currency amount={lastAddedItem.originalPrice} size="sm" logoClassName="text-gray-400" />
                           <div className="absolute top-[55%] left-0 right-0 h-[1px] bg-gray-400 rounded-full" />
                        </div>
                      )}
                   </div>
                </div>
              </div>
              <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-100">
                <img 
                  src={lastAddedItem.image} 
                  alt={lastAddedItem.title} 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3">
              <Link to="/checkout" className="w-full" onClick={closeNotification}>
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center gap-2">
                  <ArrowRightCircle className="w-4 h-4" />
                  <span>اتمام الطلب</span>
                </Button>
              </Link>
              <Link to="/cart" className="w-full" onClick={closeNotification}>
                <Button variant="outline" className="w-full border-primary/20 text-primary flex items-center justify-center gap-2 hover:bg-primary/5 transition-colors">
                  <ShoppingBag className="w-4 h-4" />
                  <span>عرض السلة</span>
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
