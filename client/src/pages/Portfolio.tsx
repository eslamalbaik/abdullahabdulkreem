import { motion } from "framer-motion";
import { projects } from "@/lib/data";

export default function Portfolio() {
  return (
    <div className="pt-32 pb-24 container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-20 max-w-3xl"
      >
        <h1 className="text-6xl font-serif mb-8">Work</h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          A selection of brand identity projects, art direction, and digital experiences created over the last three years.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-x-12 gap-y-24">
        {projects.map((project, i) => (
          <motion.div 
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className={`group cursor-pointer ${i % 3 === 0 ? 'md:col-span-2' : ''}`}
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
    </div>
  );
}
