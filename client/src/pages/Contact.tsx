import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { submitContact } from "@/lib/api";
import { insertContactSchema } from "@shared/schema";

const formSchema = insertContactSchema;

export default function Contact() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      projectType: "",
      message: "",
    },
  });

  const mutation = useMutation({
    mutationFn: submitContact,
    onSuccess: () => {
      toast({
        title: "تم إرسال الاستفسار",
        description: "شكراً لتواصلك. سنرد عليك خلال ٤٨ ساعة.",
      });
      form.reset();
    },
    onError: () => {
      toast({
        title: "خطأ",
        description: "فشل إرسال الاستفسار. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutate(values);
  }

  return (
    <div className="pt-32 pb-24 container mx-auto px-6">
      <div className="grid md:grid-cols-2 gap-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-6xl font-serif mb-8">لنتحدث.</h1>
          <p className="text-xl text-muted-foreground leading-relaxed mb-12">
            أقبل حالياً مشاريع الهوية البصرية والإخراج الفني للربع الثاني من ٢٠٢٦.
          </p>
          
          <div className="space-y-8">
            <div>
              <h3 className="font-serif text-lg mb-2">البريد الإلكتروني</h3>
              <a href="mailto:hello@elenagrid.com" className="text-muted-foreground hover:text-primary transition-colors">hello@elenagrid.com</a>
            </div>
            <div>
              <h3 className="font-serif text-lg mb-2">الاستوديو</h3>
              <p className="text-muted-foreground">
                شارع غوثرسغيد ١٢<br />
                ١١٢٣ كوبنهاغن<br />
                الدنمارك
              </p>
            </div>
            <a 
              href="https://api.whatsapp.com/message/QY65ISWC6GKDJ1?autoload=1&app_absent=0"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/30 rounded-xl hover:bg-green-500/20 transition-colors group"
              data-testid="link-whatsapp"
            >
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </div>
              <div>
                <p className="font-semibold text-green-600 group-hover:text-green-700">تواصل عبر الواتساب</p>
                <p className="text-sm text-muted-foreground">رد سريع خلال ساعات العمل</p>
              </div>
            </a>
          </div>
        </motion.div>

        <motion.div
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ duration: 0.6, delay: 0.2 }}
           className="bg-secondary/20 p-8 md:p-10 border border-border"
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs tracking-wider font-medium text-muted-foreground">الاسم</FormLabel>
                    <FormControl>
                      <Input placeholder="محمد أحمد" {...field} className="bg-background border-border/50 focus:border-primary transition-colors h-12" data-testid="input-name" />
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
                    <FormLabel className="uppercase text-xs tracking-wider font-medium text-muted-foreground">البريد الإلكتروني</FormLabel>
                    <FormControl>
                      <Input placeholder="mohammed@example.com" {...field} className="bg-background border-border/50 focus:border-primary transition-colors h-12" data-testid="input-email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="projectType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs tracking-wider font-medium text-muted-foreground">نوع المشروع</FormLabel>
                    <FormControl>
                      <Input placeholder="هوية بصرية، تصميم ويب، إلخ." {...field} className="bg-background border-border/50 focus:border-primary transition-colors h-12" data-testid="input-project-type" />
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
                    <FormLabel className="uppercase text-xs tracking-wider font-medium text-muted-foreground">الرسالة</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="أخبرنا عن جدولك الزمني وأهداف مشروعك..." 
                        {...field} 
                        className="bg-background border-border/50 focus:border-primary transition-colors min-h-[150px] resize-none p-4" 
                        data-testid="textarea-message"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" size="lg" className="w-full" disabled={mutation.isPending} data-testid="button-submit">
                {mutation.isPending ? "جارٍ الإرسال..." : "إرسال الرسالة"}
              </Button>
            </form>
          </Form>
        </motion.div>
      </div>
    </div>
  );
}
