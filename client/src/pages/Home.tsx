import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchFeaturedProjects, fetchProducts } from "@/lib/api";

export default function Home() {
  const { data: projects = [], isLoading: projectsLoading } = useQuery({
    queryKey: ["featuredProjects"],
    queryFn: fetchFeaturedProjects,
  });

  const { data: allProducts = [], isLoading: productsLoading } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  const products = allProducts.slice(0, 3);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/hero-texture.png" 
            alt="خلفية" 
            className="w-full h-full object-cover opacity-20 dark:opacity-10"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="max-w-xl"
            >
              <h1 className="font-serif font-medium tracking-tight mb-8">
                <span className="block text-5xl md:text-7xl leading-[1.1]">نحوّل فكرتك</span>
                <span className="block text-3xl md:text-4xl leading-[1.2] mt-2">إلى نظام بصري واضح.</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl leading-relaxed mb-10">
                أساعد العلامات التجارية الطموحة في تحديد لغتها البصرية من خلال التصميم الاستراتيجي والإخراج الفني.
              </p>
              
              <div className="flex gap-6">
                <Link href="/portfolio" className="group inline-flex items-center gap-2 text-lg font-medium border-b border-primary pb-1 hover:text-muted-foreground hover:border-muted-foreground transition-all" data-testid="link-portfolio">
                  شاهد أعمالي <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                </Link>
                <Link href="/contact" className="group inline-flex items-center gap-2 text-lg font-medium border-b border-transparent pb-1 hover:border-primary transition-all" data-testid="link-contact">
                  تواصل معي
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: -3 }}
              animate={{ opacity: 1, scale: 1, rotate: -3 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className="hidden md:flex justify-center"
            >
              <div className="relative w-80 h-80 lg:w-96 lg:h-96">
                <div 
                  className="w-full h-full overflow-hidden shadow-2xl border-4 border-primary/20"
                  style={{ transform: "rotate(-3deg)" }}
                >
                  <img 
                    src="/profile.png" 
                    alt="صورتي"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Work */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-end mb-16">
            <h2 className="text-4xl font-serif">أعمال مختارة</h2>
            <Link href="/portfolio" className="hidden md:inline-block text-sm border-b border-border pb-1 hover:border-primary transition-colors">
              عرض جميع المشاريع
            </Link>
          </div>

          {projectsLoading ? (
            <div className="grid md:grid-cols-2 gap-x-12 gap-y-20">
              {[1, 2].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[4/3] bg-secondary/50 mb-6" />
                  <div className="h-8 bg-secondary/50 w-2/3 mb-2" />
                  <div className="h-4 bg-secondary/50 w-1/3" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-x-12 gap-y-20">
              {projects.slice(0, 2).map((project, i) => (
                <motion.div 
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                  className="group cursor-pointer"
                  data-testid={`project-${project.id}`}
                >
                  <div className="aspect-[4/3] overflow-hidden mb-6 bg-secondary/50">
                    <img 
                      src={project.image} 
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex justify-between items-start border-t border-border pt-4">
                    <div>
                      <h3 className="text-2xl font-serif mb-1 group-hover:underline decoration-1 underline-offset-4">{project.title}</h3>
                      <p className="text-muted-foreground">{project.category}</p>
                    </div>
                    <span className="text-muted-foreground font-mono text-sm">{project.year}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Shop Preview */}
      <section className="py-24 bg-secondary/20">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mb-16">
            <h2 className="text-4xl font-serif mb-6">موارد للمصممين</h2>
            <p className="text-muted-foreground text-lg">
              قوالب وعقود ومحتوى تعليمي مختار لمساعدتك في تطوير عملك الإبداعي.
            </p>
          </div>

          {productsLoading ? (
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-square bg-secondary mb-4" />
                  <div className="h-4 bg-secondary w-1/3 mb-2" />
                  <div className="h-6 bg-secondary w-2/3" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {products.map((product) => (
                <div key={product.id} className="group bg-background p-4 border border-border/50 hover:border-primary/20 transition-colors" data-testid={`product-${product.id}`}>
                  <div className="aspect-square overflow-hidden bg-secondary mb-4">
                    <img 
                      src={product.image} 
                      alt={product.title} 
                      className="w-full h-full object-cover mix-blend-multiply opacity-90 group-hover:opacity-100 transition-opacity" 
                    />
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1 block">{product.category}</span>
                      <h4 className="text-lg font-medium leading-snug">{product.title}</h4>
                    </div>
                    <span className="font-mono">${product.price}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
