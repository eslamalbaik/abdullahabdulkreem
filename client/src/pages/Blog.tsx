import { motion } from "framer-motion";
import { articles } from "@/lib/data";
import { Link } from "wouter";

export default function Blog() {
  return (
    <div className="pt-32 pb-24 container mx-auto px-6">
       <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-20 max-w-3xl"
      >
        <h1 className="text-6xl font-serif mb-8">Journal</h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          Thoughts on design, process, and the business of creativity.
        </p>
      </motion.div>

      <div className="max-w-4xl">
        {articles.map((article, i) => (
          <motion.div
            key={article.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group border-t border-border py-12"
          >
            <Link href={`/blog/${article.id}`}>
              <a className="grid md:grid-cols-4 gap-8">
                <div className="md:col-span-1 text-muted-foreground font-mono text-sm pt-1">
                  {article.date}
                </div>
                <div className="md:col-span-3">
                  <h2 className="text-3xl font-serif mb-4 group-hover:underline decoration-1 underline-offset-4 transition-all">
                    {article.title}
                  </h2>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {article.excerpt}
                  </p>
                  <span className="text-sm font-medium underline underline-offset-4 decoration-primary/30 group-hover:decoration-primary transition-all">Read Article</span>
                </div>
              </a>
            </Link>
          </motion.div>
        ))}
        <div className="border-t border-border" />
      </div>
    </div>
  );
}
