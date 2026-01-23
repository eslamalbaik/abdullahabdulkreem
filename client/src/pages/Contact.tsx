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
        title: "Inquiry Sent",
        description: "Thank you for reaching out. We'll get back to you within 48 hours.",
      });
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send inquiry. Please try again.",
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
          <h1 className="text-6xl font-serif mb-8">Let's talk.</h1>
          <p className="text-xl text-muted-foreground leading-relaxed mb-12">
            Currently accepting new brand identity and art direction projects for Q2 2026.
          </p>
          
          <div className="space-y-8">
            <div>
              <h3 className="font-serif text-lg mb-2">Email</h3>
              <a href="mailto:hello@elenagrid.com" className="text-muted-foreground hover:text-primary transition-colors">hello@elenagrid.com</a>
            </div>
            <div>
              <h3 className="font-serif text-lg mb-2">Studio</h3>
              <p className="text-muted-foreground">
                Gothersgade 12<br />
                1123 Copenhagen<br />
                Denmark
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
           initial={{ opacity: 0, x: 20 }}
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
                    <FormLabel className="uppercase text-xs tracking-wider font-medium text-muted-foreground">Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Jane Doe" {...field} className="bg-background border-border/50 focus:border-primary transition-colors h-12" data-testid="input-name" />
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
                    <FormLabel className="uppercase text-xs tracking-wider font-medium text-muted-foreground">Email</FormLabel>
                    <FormControl>
                      <Input placeholder="jane@example.com" {...field} className="bg-background border-border/50 focus:border-primary transition-colors h-12" data-testid="input-email" />
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
                    <FormLabel className="uppercase text-xs tracking-wider font-medium text-muted-foreground">Inquiry Type</FormLabel>
                    <FormControl>
                      <Input placeholder="Brand Identity, Web Design, etc." {...field} className="bg-background border-border/50 focus:border-primary transition-colors h-12" data-testid="input-project-type" />
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
                    <FormLabel className="uppercase text-xs tracking-wider font-medium text-muted-foreground">Message</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Tell us about your project timeline and goals..." 
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
                {mutation.isPending ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </Form>
        </motion.div>
      </div>
    </div>
  );
}
