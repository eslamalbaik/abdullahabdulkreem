import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Currency } from "@/components/ui/Currency";
import { PriceDisplay } from "@/components/PriceDisplay";

interface Identity {
  id: number;
  title: string;
  description: string;
  price: number;
  image: string;
  includes: string[];
}

export default function Identities() {
  const navigate = useNavigate();
  const { data: identities, isLoading } = useQuery<Identity[]>({
    queryKey: ["/api/identities"],
  });

  return (
    <div className="pt-32 pb-20">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6">هويات بصرية جاهزة</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            هويات بصرية احترافية معروضة للبيع، جاهزة للتخصيص والاستخدام الفوري لمشروعك
          </p>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-muted animate-pulse rounded-2xl h-[500px]" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {identities?.map((identity, index) => (
              <motion.div
                key={identity.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl cursor-pointer"
                onClick={() => navigate(`/identities/${identity.id}`)}
                data-testid={`card-identity-${identity.id}`}
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={identity.image}
                    alt={identity.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2" data-testid={`text-identity-title-${identity.id}`}>
                    {identity.title}
                  </h3>
                  <p className="text-muted-foreground mb-4 line-clamp-2">
                    {identity.description}
                  </p>

                  <div className="mb-4">
                    <h4 className="text-sm font-semibold mb-2 text-primary">تشمل الهوية:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {identity.includes.map((item, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border gap-4">
                    <PriceDisplay 
                      price={identity.price} 
                      itemId={identity.id} 
                      itemType="identity" 
                      size="lg" 
                    />
                    <button
                      onClick={() => navigate(`/checkout?type=identity&id=${identity.id}`)}
                      className="flex-1 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                    >
                      اطلب الآن
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {!isLoading && (!identities || identities.length === 0) && (
          <div className="text-center py-20">
            <p className="text-xl text-muted-foreground">
              لا توجد هويات بصرية متاحة حالياً
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
