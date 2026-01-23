import { motion } from "framer-motion";
import { products } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export default function Courses() {
  const courses = products.filter(p => p.category === "Courses");

  return (
    <div className="pt-32 pb-24 container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-20"
      >
        <span className="text-sm font-mono text-muted-foreground uppercase tracking-widest mb-4 block">Education</span>
        <h1 className="text-6xl font-serif mb-8 max-w-4xl">Master the art of <br/>visual storytelling.</h1>
      </motion.div>

      <div className="grid gap-12">
        {courses.map((course, i) => (
          <motion.div 
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="grid md:grid-cols-2 gap-12 border border-border p-8 md:p-12 hover:border-primary/20 transition-colors bg-card"
          >
            <div className="aspect-video bg-secondary overflow-hidden">
              <img 
                src={course.image} 
                alt={course.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col justify-center">
              <div className="mb-auto">
                <h2 className="text-3xl font-serif mb-4">{course.title}</h2>
                <p className="text-muted-foreground mb-8 leading-relaxed">
                  A comprehensive deep dive into advanced typography techniques, hierarchy, and layout systems for modern web and print design.
                </p>
                <ul className="space-y-3 mb-8">
                  {["12 Video Modules", "Project Files Included", "Certificate of Completion"].map((item) => (
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
                <Button size="lg" className="px-8">Enroll Now</Button>
                <span className="text-xl font-serif">${course.price}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
