import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Product } from "@shared/schema";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();

  const { data: product, isLoading, error } = useQuery<Product>({
    queryKey: [`/api/products/${id}`],
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="pt-32 pb-24 container mx-auto px-6">
        <div className="animate-pulse">
          <div className="h-8 w-32 bg-secondary/50 mb-8" />
          <div className="grid md:grid-cols-2 gap-12">
            <div className="aspect-square bg-secondary/50" />
            <div className="space-y-4">
              <div className="h-10 w-3/4 bg-secondary/50" />
              <div className="h-6 w-1/4 bg-secondary/50" />
              <div className="h-24 w-full bg-secondary/50" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="pt-32 pb-24 container mx-auto px-6 text-center">
        <h1 className="text-3xl font-serif mb-4">المنتج غير موجود</h1>
        <p className="text-muted-foreground mb-8">عذراً، لم نتمكن من العثور على هذا المنتج</p>
        <Link href="/shop">
          <Button variant="outline">العودة للمتجر</Button>
        </Link>
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
        <Link href="/shop" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowRight className="w-4 h-4" />
          العودة للمتجر
        </Link>

        <div className="grid md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="aspect-square bg-secondary overflow-hidden rounded-2xl"
          >
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col"
          >
            <span className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-2">
              {product.category}
            </span>
            <h1 className="text-4xl font-serif mb-4">{product.title}</h1>
            <p className="text-3xl font-bold text-primary mb-6">${product.price}</p>
            
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              {product.description}
            </p>

            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Check className="w-5 h-5 text-green-500" />
                <span>تحميل فوري بعد الشراء</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Check className="w-5 h-5 text-green-500" />
                <span>دعم فني مجاني</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Check className="w-5 h-5 text-green-500" />
                <span>تحديثات مجانية مدى الحياة</span>
              </div>
            </div>

            <Button 
              size="lg" 
              className="w-full md:w-auto"
              data-testid="button-buy-product"
            >
              اشتري الآن — ${product.price}
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
