import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Check, GraduationCap } from "lucide-react";
import { Link } from "wouter";

interface Course {
  id: number;
  title: string;
  description?: string;
  image?: string;
  price: number;
  published: boolean;
}

export default function Courses() {
  const { data: courses = [], isLoading } = useQuery<Course[]>({
    queryKey: ["/api/courses"],
  });

  return (
    <div className="pt-32 pb-24 container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-20"
      >
        <span className="text-sm font-mono text-muted-foreground uppercase tracking-widest mb-4 block">التعليم</span>
        <h1 className="text-6xl font-serif mb-8 max-w-4xl">أتقن فن <br/>السرد البصري.</h1>
      </motion.div>

      {isLoading ? (
        <div className="grid gap-12">
          {[1].map((i) => (
            <div key={i} className="animate-pulse grid md:grid-cols-2 gap-12 border border-border p-8 md:p-12">
              <div className="aspect-video bg-secondary" />
              <div>
                <div className="h-8 bg-secondary/50 w-2/3 mb-4" />
                <div className="h-4 bg-secondary/50 w-full mb-2" />
                <div className="h-4 bg-secondary/50 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-20">
          <GraduationCap className="w-16 h-16 mx-auto text-muted-foreground mb-6" />
          <h2 className="text-2xl font-serif mb-4">قريباً</h2>
          <p className="text-muted-foreground">نعمل على إعداد دورات تعليمية مميزة. تابعنا للحصول على آخر التحديثات.</p>
        </div>
      ) : (
        <div className="grid gap-12">
          {courses.map((course, i) => (
            <motion.div 
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="grid md:grid-cols-2 gap-12 border border-border p-8 md:p-12 hover:border-primary/20 transition-colors bg-card"
              data-testid={`course-${course.id}`}
            >
              <div className="aspect-video bg-secondary overflow-hidden">
                {course.image ? (
                  <img 
                    src={course.image} 
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <GraduationCap className="w-20 h-20 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div className="flex flex-col justify-center">
                <div className="mb-auto">
                  <h2 className="text-3xl font-serif mb-4">{course.title}</h2>
                  <p className="text-muted-foreground mb-8 leading-relaxed">
                    {course.description || "دورة شاملة ومعمقة في تقنيات التصميم المتقدمة."}
                  </p>
                  <ul className="space-y-3 mb-8">
                    {["دروس فيديو متسلسلة", "ملفات المشروع مضمنة", "شهادة إتمام"].map((item) => (
                      <li key={item} className="flex items-center gap-3 text-sm">
                        <div className="w-5 h-5 rounded-full border border-primary/20 flex items-center justify-center">
                          <Check className="w-3 h-3" />
                        </div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex items-center gap-6 mt-6">
                  <Link href={`/courses/${course.id}`}>
                    <Button size="lg" className="px-8" data-testid={`button-view-course-${course.id}`}>
                      عرض الدورة
                    </Button>
                  </Link>
                  <span className="text-xl font-serif">{course.price} ر.س</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
