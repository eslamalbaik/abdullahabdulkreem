import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchFeaturedProjects, fetchProducts } from "@/lib/api";
import { apiRequest } from "@/lib/queryClient";
import type { Identity, SiteConfig, User } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { Currency } from "@/components/ui/Currency";
import { PriceDisplay } from "@/components/PriceDisplay";
import { getImageUrl } from "@/lib/image-utils";

interface ClientLogo {
  id: number;
  name: string;
  image: string;
  order: number;
}

export default function Home() {
  const { user } = useAuth();
  const { data: projects = [], isLoading: projectsLoading } = useQuery({
    queryKey: ["featuredProjects"],
    queryFn: fetchFeaturedProjects,
  });

  const { data: allProducts = [], isLoading: productsLoading } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  const { data: identities = [], isLoading: identitiesLoading } = useQuery<Identity[]>({
    queryKey: ["/api/identities"],
  });

  const { data: clientLogos = [] } = useQuery<ClientLogo[]>({
    queryKey: ["/api/client-logos"],
  });

  const { data: configs = [] } = useQuery<SiteConfig[]>({
    queryKey: ["/api/site-configs"],
    staleTime: 1000 * 60, // 1 minute
  });

  const configMap = configs.reduce((acc, config) => {
    acc[config.key] = config.value;
    return acc;
  }, {} as Record<string, string>);

  const isSectionVisible = (key: string) => configMap[key] !== "false";
  const getSectionTitle = (key: string, defaultValue: string) => configMap[key] || defaultValue;
  const getSectionDesc = (key: string, defaultValue: string) => configMap[key] || defaultValue;

  const products = ((Array.isArray(allProducts) ? allProducts : (allProducts as any)?.products || []) as any[]).slice(0, 3);
  const featuredIdentities = ((Array.isArray(identities) ? identities : (identities as any)?.identities || []) as Identity[]).slice(0, 3);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-20 bg-background">

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="max-w-xl"
            >
              <h1 className="font-serif font-medium tracking-tight mb-4">
                <span className="block text-6xl md:text-8xl leading-[1.1]">نحوّل فكرتك</span>
                <span className="block text-5xl md:text-6xl leading-[1.2] mt-2">إلى نظام بصري واضح.</span>
              </h1>
              <p className="text-base md:text-lg text-muted-foreground max-w-xl leading-relaxed mb-10">
                أساعد العلامات التجارية الطموحة في تحديد لغتها البصرية<br />
                من خلال التصميم الاستراتيجي والإخراج الفني.
              </p>

              <div className="flex items-center gap-6">
                <Link
                  to="/questionnaire"
                  className="group inline-flex items-center gap-2 text-lg font-medium border-b border-primary pb-1 hover:text-muted-foreground hover:border-muted-foreground transition-all"
                  data-testid="link-brand-questionnaire"
                >
                  لديك علامة تجارية؟ <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                </Link>

                <div className="flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                  </span>
                  <span className="text-sm font-medium text-muted-foreground">متاح لمشاريع مختارة</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className="hidden md:flex justify-center"
            >
              <div className="w-80 h-80 lg:w-96 lg:h-96 overflow-hidden shadow-2xl border-4 border-primary/20 rounded-3xl">
                <img
                  src="/profile.png"
                  alt="صورتي"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Logo Marquee */}
      {(clientLogos.length > 0 || (user && user.role === "admin")) && (
        <section className="py-12 bg-primary/5 overflow-hidden border-y border-primary/10">
          {clientLogos.length > 0 ? (
            <div className="relative flex w-max animate-marquee-rtl">
              {[...Array(8)].map((_, i) => (
                <div key={`set-${i}`} className="flex shrink-0 gap-4 pe-4">
                  {clientLogos.map((logo) => (
                    <div key={`${i}-${logo.id}`} className="px-4 py-2 flex items-center justify-center h-20 w-48 shrink-0">
                      <img
                        src={getImageUrl(logo.image)}
                        alt={logo.name}
                        className="max-h-16 max-w-full opacity-90 brightness-200 grayscale transition-all hover:grayscale-0 hover:opacity-100 hover:brightness-100 object-contain"
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ) : user && user.role === "admin" ? (
            <div className="container mx-auto px-6 text-center py-4">
              <p className="text-muted-foreground mb-4">لا توجد شعارات عملاء حالياً.</p>
              <Link
                to="/admin"
                className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
              >
                إضافة شعارات من لوحة التحكم <ArrowLeft className="w-4 h-4" />
              </Link>
            </div>
          ) : null}
        </section>
      )}

      {/* Featured Work */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-end mb-10">
            <h2 className="text-3xl font-serif">أعمال مختارة</h2>
            <Link to="/portfolio" className="hidden md:inline-block text-sm border-b border-border pb-1 hover:border-primary transition-colors">
              عرض جميع المشاريع
            </Link>
          </div>

          {projectsLoading ? (
            <div className="grid md:grid-cols-2 gap-6">
              {[1, 2].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[4/3] bg-secondary/50 mb-4" />
                  <div className="h-6 bg-secondary/50 w-2/3 mb-2" />
                  <div className="h-4 bg-secondary/50 w-1/3" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {(Array.isArray(projects) ? projects : []).slice(0, 2).map((project: any, i: number) => (
                <Link key={project.id} to={`/portfolio/${project.id}`}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.2 }}
                    className="group cursor-pointer"
                    data-testid={`project-${project.id}`}
                  >
                    <div className="aspect-[4/3] overflow-hidden mb-4 bg-secondary/50 rounded-2xl">
                      <img
                        src={getImageUrl(project.image)}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <div className="flex justify-between items-start border-t border-border pt-3">
                      <div>
                        <h3 className="text-xl font-serif mb-1 group-hover:underline decoration-1 underline-offset-4">{project.title}</h3>
                        <p className="text-sm text-muted-foreground">{project.category}</p>
                      </div>
                      <span className="text-muted-foreground font-mono text-sm">{project.year}</span>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Identities for Sale */}
      {isSectionVisible("show_identities_section") && (
        <section className="py-16 bg-primary/5">
          <div className="container mx-auto px-6">
            <div className="flex justify-between items-end mb-10">
              <div>
                <h2 className="text-3xl font-serif mb-2">{getSectionTitle("identities_title", "هويات جاهزة للبيع")}</h2>
                <p className="text-muted-foreground">{getSectionDesc("identities_description", "هويات بصرية متكاملة جاهزة للتخصيص والاستخدام الفوري")}</p>
              </div>
              <Link to="/identities" className="hidden md:inline-block text-sm border-b border-border pb-1 hover:border-primary transition-colors">
                عرض جميع الهويات
              </Link>
            </div>

            {identitiesLoading ? (
              <div className="grid md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-[4/3] bg-secondary/50 mb-4" />
                    <div className="h-5 bg-secondary/50 w-2/3 mb-2" />
                    <div className="h-4 bg-secondary/50 w-1/3" />
                  </div>
                ))}
              </div>
            ) : featuredIdentities.length > 0 ? (
              <div className="grid md:grid-cols-3 gap-6">
                {featuredIdentities.map((identity: Identity, i: number) => (
                  <Link key={identity.id} to={`/identities/${identity.id}`}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="group cursor-pointer bg-background rounded-2xl overflow-hidden border border-border/50 hover:border-primary/30 transition-colors"
                      data-testid={`identity-${identity.id}`}
                    >
                      <div className="aspect-[4/3] overflow-hidden">
                        <img
                          src={getImageUrl(identity.image)}
                          alt={identity.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-medium mb-1 group-hover:text-primary transition-colors">{identity.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{identity.description}</p>
                        <div className="flex justify-between items-center">
                          <PriceDisplay 
                            price={identity.price} 
                            itemId={identity.id} 
                            itemType="identity" 
                            size="md" 
                          />
                          {identity.featured && <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded">مميز</span>}
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-background/50 rounded-2xl border border-dashed border-border/50">
                <p className="text-muted-foreground">لا توجد هويات متاحة حالياً</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Shop Preview */}
      {isSectionVisible("show_products_section") && (
        <section className="py-16 bg-secondary/20">
          <div className="container mx-auto px-6">
            <div className="flex justify-between items-end mb-10">
              <div>
                <h2 className="text-3xl font-serif mb-2">{getSectionTitle("products_title", "منتجات للمصممين")}</h2>
                <p className="text-muted-foreground">{getSectionDesc("products_description", "قوالب وعقود ومحتوى تعليمي لتطوير عملك الإبداعي")}</p>
              </div>
              <Link to="/shop" className="hidden md:inline-block text-sm border-b border-border pb-1 hover:border-primary transition-colors">
                عرض جميع المنتجات
              </Link>
            </div>

            {productsLoading ? (
              <div className="grid md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-square bg-secondary mb-3" />
                    <div className="h-4 bg-secondary w-1/3 mb-2" />
                    <div className="h-5 bg-secondary w-2/3" />
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="grid md:grid-cols-3 gap-6">
                {products.map((product: any) => (
                  <Link key={product.id} to={`/shop/${product.id}`}>
                    <div className="group bg-background p-3 border border-border/50 hover:border-primary/20 transition-colors rounded-xl cursor-pointer" data-testid={`product-${product.id}`}>
                      <div className="aspect-[4/3] overflow-hidden bg-muted mb-3 rounded-lg">
                        <img
                          src={getImageUrl(product.image)}
                          alt={product.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1 block">{product.category}</span>
                          <h4 className="text-base font-medium leading-snug group-hover:text-primary transition-colors">{product.title}</h4>
                        </div>
                        <PriceDisplay 
                          price={product.price} 
                          itemId={product.id} 
                          itemType="product" 
                          size="sm" 
                          showBadge={false}
                        />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-background/50 rounded-2xl border border-dashed border-border/50">
                <p className="text-muted-foreground">لا توجد منتجات متاحة حالياً</p>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
