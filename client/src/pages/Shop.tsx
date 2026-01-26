import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { fetchProductsByCategory } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@shared/schema";

export default function Shop() {
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products", "Templates"],
    queryFn: () => fetchProductsByCategory("Templates"),
  });
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      type: "product",
    });
    toast({
      title: "تمت الإضافة للسلة",
      description: `تم إضافة "${product.title}" إلى سلة التسوق`,
    });
  };

  return (
    <div className="pt-32 pb-24 container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-16 text-center max-w-2xl mx-auto"
      >
        <h1 className="text-5xl font-serif mb-6">المتجر</h1>
        <p className="text-lg text-muted-foreground">
          أدوات وقوالب رقمية لمساعدتك في تبسيط عملية التصميم والارتقاء بمخرجاتك للعملاء.
        </p>
      </motion.div>

      {isLoading ? (
        <div className="grid md:grid-cols-3 gap-10">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[4/5] bg-secondary mb-6" />
              <div className="h-6 bg-secondary/50 w-2/3 mb-2" />
              <div className="h-4 bg-secondary/50 w-1/3" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-10">
          {products.map((product, i) => (
            <motion.div 
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group flex flex-col"
              data-testid={`product-card-${product.id}`}
            >
              <div className="aspect-[4/5] bg-secondary mb-6 relative overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.title}
                  className="w-full h-full object-cover mix-blend-multiply opacity-90 group-hover:opacity-100 transition-opacity"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                <div className="absolute bottom-4 left-4 right-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <Button 
                    className="w-full bg-white text-black hover:bg-white/90 border-none shadow-lg" 
                    data-testid={`button-add-cart-${product.id}`}
                    onClick={() => handleAddToCart(product)}
                  >
                    أضف للسلة — {product.price} ر.س
                  </Button>
                </div>
              </div>
              <h3 className="text-xl font-serif mb-1">{product.title}</h3>
              <p className="text-muted-foreground text-sm mb-3">قالب احترافي</p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
