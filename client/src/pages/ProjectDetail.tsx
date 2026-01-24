import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { ArrowRight } from "lucide-react";

interface Project {
  id: number;
  title: string;
  category: string;
  image: string;
  year: string;
  description?: string;
  featured: boolean;
}

export default function ProjectDetail() {
  const [, params] = useRoute("/portfolio/:id");
  const projectId = params?.id;

  const { data: project, isLoading } = useQuery<Project>({
    queryKey: ["project", projectId],
    queryFn: async () => {
      const response = await fetch(`/api/projects/${projectId}`);
      if (!response.ok) throw new Error("Project not found");
      return response.json();
    },
    enabled: !!projectId,
  });

  if (isLoading) {
    return (
      <div className="pt-32 pb-24 container mx-auto px-6">
        <div className="animate-pulse">
          <div className="h-8 bg-secondary/50 w-1/4 mb-4" />
          <div className="h-12 bg-secondary/50 w-2/3 mb-8" />
          <div className="aspect-video bg-secondary/50 mb-8" />
          <div className="h-6 bg-secondary/50 w-full mb-2" />
          <div className="h-6 bg-secondary/50 w-3/4" />
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="pt-32 pb-24 container mx-auto px-6 text-center">
        <h1 className="text-4xl font-serif mb-4">المشروع غير موجود</h1>
        <Link href="/portfolio" className="text-primary hover:underline">
          العودة للأعمال
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
            data-testid="link-back-portfolio"
          >
            <ArrowRight className="w-4 h-4" />
            العودة للأعمال
          </Link>

          <div className="flex items-center gap-4 mb-4">
            <span className="text-sm text-muted-foreground">{project.category}</span>
            <span className="text-sm text-muted-foreground">•</span>
            <span className="text-sm text-muted-foreground font-mono">{project.year}</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-serif mb-8">{project.title}</h1>

          <div className="aspect-video overflow-hidden bg-secondary/50 mb-12">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          </div>

          {project.description && (
            <div className="max-w-3xl">
              <h2 className="text-2xl font-serif mb-4">عن المشروع</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {project.description}
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
