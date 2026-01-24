import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { ArrowRight, ExternalLink, MapPin, Calendar, Briefcase, Package } from "lucide-react";

interface Project {
  id: number;
  title: string;
  category: string;
  image: string;
  images?: string[] | null;
  year: string;
  country?: string;
  field?: string;
  package?: string;
  description?: string;
  strategy?: string;
  behanceUrl?: string;
  featured: boolean;
}

function BehanceIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M22 7h-7V5h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14H15.97c.13 3.211 3.483 3.312 4.588 2.029h3.168zm-7.686-4h4.965c-.105-1.547-1.136-2.219-2.477-2.219-1.466 0-2.277.768-2.488 2.219zm-9.574 6.988H0V5.021h6.953c5.476.081 5.58 5.444 2.72 6.906 3.461 1.26 3.577 8.061-3.207 8.061zM3 11h3.584c2.508 0 2.906-3-.312-3H3v3zm3.391 3H3v3.016h3.341c3.055 0 2.868-3.016.05-3.016z" />
    </svg>
  );
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

          <h1 className="text-5xl md:text-6xl font-serif mb-8">{project.title}</h1>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 p-6 bg-secondary/20 rounded-xl">
            {project.country && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">الدولة</p>
                  <p className="font-medium">{project.country}</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">العام</p>
                <p className="font-medium">{project.year}</p>
              </div>
            </div>
            {project.field && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">المجال</p>
                  <p className="font-medium">{project.field}</p>
                </div>
              </div>
            )}
            {project.package && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Package className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">الباقة</p>
                  <p className="font-medium">{project.package}</p>
                </div>
              </div>
            )}
          </div>

          <div className="aspect-video overflow-hidden bg-secondary/50 mb-8">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-12 mb-16">
            {project.description && (
              <div>
                <h2 className="text-2xl font-serif mb-4">عن المشروع</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {project.description}
                </p>
              </div>
            )}

            {project.strategy && (
              <div>
                <h2 className="text-2xl font-serif mb-4">الاستراتيجية والرؤية</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {project.strategy}
                </p>
              </div>
            )}
          </div>

          {project.images && project.images.length > 0 && (
            <div className="mb-16 space-y-6 max-w-[60%] mx-auto">
              {project.images.map((img, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="w-full aspect-video overflow-hidden bg-secondary/50 rounded-3xl"
                >
                  <img
                    src={img}
                    alt={`${project.title} - صورة ${index + 1}`}
                    className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-500"
                  />
                </motion.div>
              ))}
            </div>
          )}

          {project.behanceUrl && (
            <div className="border-t border-border pt-12">
              <a
                href={project.behanceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                data-testid="link-behance"
              >
                <BehanceIcon className="w-6 h-6" />
                شاهد المشروع كاملاً على Behance
                <ExternalLink className="w-5 h-5" />
              </a>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
