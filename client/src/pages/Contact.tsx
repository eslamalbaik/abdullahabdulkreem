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
