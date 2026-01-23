import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { fetchArticles } from "@/lib/api";
import { Link } from "wouter";

export default function Blog() {
  const { data: articles = [], isLoading } = useQuery({
    queryKey: ["articles"],
    queryFn: fetchArticles,
  });

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
        {isLoading ? (
          <>
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse border-t border-border py-12">
                <div className="grid md:grid-cols-4 gap-8">
                  <div className="h-4 bg-secondary/50 w-20" />
                  <div className="md:col-span-3">
                    <div className="h-8 bg-secondary/50 w-3/4 mb-4" />
                    <div className="h-4 bg-secondary/50 w-full mb-2" />
                    <div className="h-4 bg-secondary/50 w-2/3" />
                  </div>
                </div>
              </div>
            ))}
          </>
        ) : (
          <>
            {articles.map((article, i) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group border-t border-border py-12"
                data-testid={`article-${article.id}`}
              >
                <Link href={`/blog/${article.slug}`}>
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
          </>
        )}
      </div>
    </div>
  );
}
