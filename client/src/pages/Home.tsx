import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { projects, products } from "@/lib/data";

export default function Home() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/hero-texture.png" 
            alt="Background Texture" 
            className="w-full h-full object-cover opacity-20 dark:opacity-10"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-4xl"
          >
            <h1 className="text-6xl md:text-8xl font-serif font-medium leading-[0.9] tracking-tight mb-8">
              Visual identity<br />
              <span className="italic text-muted-foreground">for the bold.</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl leading-relaxed mb-10">
              I help ambitious brands define their visual language through strategic design and art direction.
            </p>
            
            <div className="flex gap-6">
              <Link href="/portfolio">
                <a className="group inline-flex items-center gap-2 text-lg font-medium border-b border-primary pb-1 hover:text-muted-foreground hover:border-muted-foreground transition-all">
                  View Work <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
              </Link>
              <Link href="/contact">
                <a className="group inline-flex items-center gap-2 text-lg font-medium border-b border-transparent pb-1 hover:border-primary transition-all">
                  Get in Touch
                </a>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Work */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-end mb-16">
            <h2 className="text-4xl font-serif">Selected Work</h2>
            <Link href="/portfolio">
              <a className="hidden md:inline-block text-sm border-b border-border pb-1 hover:border-primary transition-colors">See all projects</a>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-x-12 gap-y-20">
            {projects.slice(0, 2).map((project, i) => (
              <motion.div 
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="group cursor-pointer"
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
        </div>
      </section>

      {/* Shop Preview */}
      <section className="py-24 bg-secondary/20">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mb-16">
            <h2 className="text-4xl font-serif mb-6">Resources for Designers</h2>
            <p className="text-muted-foreground text-lg">
              Curated templates, contracts, and educational content to help you scale your creative business.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {products.map((product) => (
              <div key={product.id} className="group bg-background p-4 border border-border/50 hover:border-primary/20 transition-colors">
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
        </div>
      </section>
    </div>
  );
}
