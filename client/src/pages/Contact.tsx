import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin, Send, Instagram, ChevronLeft } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

const contactSchema = z.object({
  name: z.string().min(2, "الاسم يجب أن يكون أكثر من حرفين"),
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  subject: z.string().min(5, "الموضوع يجب أن يكون أكثر من 5 أحرف"),
  message: z.string().min(10, "الرسالة يجب أن تكون أكثر من 10 أحرف"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function Contact() {
  const { toast } = useToast();
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    try {
      await apiRequest("POST", "/api/contact", {
        name: data.name,
        email: data.email,
        projectType: data.subject,
        message: data.message,
      });

      toast({
        title: "تم الإرسال بنجاح",
        description: "تم استلام رسالتك وسنتواصل معك قريباً.",
      });
      form.reset();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "حدث خطأ ما",
        description: "يرجى المحاولة مرة أخرى لاحقاً.",
      });
    }
  };

  return (
    <div className="pt-32 pb-24">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl font-serif mb-8">دعنا نتحدث.</h1>
            <p className="text-lg text-muted-foreground mb-12 leading-relaxed">
              سواء كنت ترغب في بدء مشروع جديد، أو لديك استفسار عن خدماتي، أو مجرد رغبة في التحية، يسعدني دائماً التواصل معك.
            </p>

            <div className="space-y-8 mb-12">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold mb-1">البريد الإلكتروني</h3>
                  <a href="mailto:Abdullah.slwmhgd@gmail.com" className="text-muted-foreground hover:text-primary transition-colors">
                    Abdullah.slwmhgd@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold mb-1">الجوال</h3>
                  <a href="tel:+966581258192" className="text-muted-foreground hover:text-primary transition-colors">
                    +966 58 125 8192
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold mb-1">الموقع</h3>
                  <p className="text-muted-foreground">السعودية - الرياض</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <a
                href="mailto:Abdullah.slwmhgd@gmail.com"
                className="w-10 h-10 border border-border rounded-full flex items-center justify-center hover:border-primary hover:text-primary transition-all group"
              >
                <Mail className="w-5 h-5" />
              </a>
              <a
                href="https://www.instagram.com/a21_des?igsh=ajBiM21yM2JoaDlp"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 border border-border rounded-full flex items-center justify-center hover:border-primary hover:text-primary transition-all group"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://api.whatsapp.com/message/QY65ISWC6GKDJ1"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 border border-border rounded-full text-sm font-medium hover:border-green-500 hover:text-green-500 transition-all group"
              >
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                تواصل عبر الواتساب
              </a>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-card border border-border p-8 rounded-3xl"
          >
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>الاسم الكامل</FormLabel>
                        <FormControl>
                          <Input placeholder="أدخل اسمك" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>البريد الإلكتروني</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="email@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>الموضوع</FormLabel>
                      <FormControl>
                        <Input placeholder="كيف يمكنني مساعدتك؟" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>الرسالة</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="اكتب تفاصيل مشروعك أو استفسارك هنا..."
                          className="min-h-[150px] resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full h-12 text-lg">
                  إرسال الرسالة
                  <Send className="w-4 h-4 mr-2 rotate-180" />
                </Button>
              </form>
            </Form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
