import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { fetchProjects } from "@/lib/api";

export default function Portfolio() {
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });

  return (
    <div className="pt-32 pb-24 container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-20 max-w-3xl"
      >
        <h1 className="text-6xl font-serif mb-8">أعمالي</h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          مجموعة مختارة من مشاريع الهوية البصرية والإخراج الفني والتجارب الرقمية التي أنجزتها خلال السنوات الثلاث الماضية.
        </p>
      </motion.div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 gap-x-12 gap-y-24">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[4/3] bg-secondary/50 mb-6" />
              <div className="h-8 bg-secondary/50 w-2/3 mb-2" />
              <div className="h-4 bg-secondary/50 w-1/3" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-x-12 gap-y-24">
          {projects.map((project, i) => (
            <motion.div 
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`group cursor-pointer ${i % 3 === 0 ? 'md:col-span-2' : ''}`}
              data-testid={`project-card-${project.id}`}
            >
              <div className={`aspect-[4/3] ${i % 3 === 0 ? 'aspect-[21/9]' : ''} overflow-hidden mb-6 bg-secondary/50`}>
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
  );
}
