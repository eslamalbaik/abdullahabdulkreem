import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema, insertProjectSchema, insertProductSchema, insertIdentitySchema, insertClientLogoSchema, insertTestimonialSchema, insertQuestionnaireSchema, insertCourseSchema, insertLessonSchema } from "@shared/schema";
import { setupAuth, registerAuthRoutes, isAuthenticated } from "./replit_integrations/auth";
import { registerObjectStorageRoutes } from "./replit_integrations/object_storage";
import { sendQuestionnaireNotification, sendContactNotification, sendNewsletterNotification } from "./resend";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  await setupAuth(app);
  registerAuthRoutes(app);
  registerObjectStorageRoutes(app);

  app.get("/api/projects", async (_req, res) => {
    try {
      const projects = await storage.getProjects();
      res.json(projects);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  });

  app.get("/api/projects/featured", async (_req, res) => {
    try {
      const projects = await storage.getFeaturedProjects();
      res.json(projects);
    } catch (error) {
      console.error("Error fetching featured projects:", error);
      res.status(500).json({ error: "Failed to fetch featured projects" });
    }
  });

  app.get("/api/projects/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const project = await storage.getProjectById(id);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch project" });
    }
  });

  app.get("/api/products", async (req, res) => {
    try {
      const category = req.query.category as string | undefined;
      const products = category 
        ? await storage.getProductsByCategory(category)
        : await storage.getProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getProductById(id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch product" });
    }
  });

  app.get("/api/articles", async (_req, res) => {
    try {
      const articles = await storage.getArticles();
      res.json(articles);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch articles" });
    }
  });

  app.get("/api/articles/:slug", async (req, res) => {
    try {
      const article = await storage.getArticleBySlug(req.params.slug);
      if (!article) {
        return res.status(404).json({ error: "Article not found" });
      }
      res.json(article);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch article" });
    }
  });

  app.get("/api/identities", async (_req, res) => {
    try {
      const identities = await storage.getIdentities();
      res.json(identities);
    } catch (error) {
      console.error("Error fetching identities:", error);
      res.status(500).json({ error: "Failed to fetch identities" });
    }
  });

  app.get("/api/identities/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const identity = await storage.getIdentityById(id);
      if (!identity) {
        return res.status(404).json({ error: "Identity not found" });
      }
      res.json(identity);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch identity" });
    }
  });

  app.post("/api/contact", async (req, res) => {
    try {
      const result = insertContactSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid contact data", details: result.error.issues });
      }
      const contact = await storage.createContact(result.data);
      
      try {
        await sendContactNotification(result.data);
      } catch (emailError) {
        console.error("Error sending contact email notification:", emailError);
      }
      
      res.status(201).json(contact);
    } catch (error) {
      res.status(500).json({ error: "Failed to submit contact form" });
    }
  });

  app.post("/api/questionnaire", async (req, res) => {
    try {
      const result = insertQuestionnaireSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid questionnaire data", details: result.error.issues });
      }
      const submission = await storage.createQuestionnaireSubmission(result.data);
      
      try {
        await sendQuestionnaireNotification({
          name: result.data.name,
          serviceType: result.data.serviceType,
          role: result.data.role,
          projectInfo: result.data.projectInfo || '',
          socialMedia: result.data.socialMedia || '',
          companySize: result.data.companySize,
          budget: result.data.budget,
          contactMethod: result.data.contactMethod,
          email: result.data.email || undefined,
          whatsapp: result.data.whatsapp || undefined,
          instagram: result.data.instagram || undefined
        });
      } catch (emailError) {
        console.error("Error sending questionnaire email notification:", emailError);
      }
      
      res.status(201).json(submission);
    } catch (error) {
      console.error("Error submitting questionnaire:", error);
      res.status(500).json({ error: "Failed to submit questionnaire" });
    }
  });

  app.post("/api/newsletter", async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }
      
      try {
        await sendNewsletterNotification(email);
      } catch (emailError) {
        console.error("Error sending newsletter notification:", emailError);
      }
      
      res.status(201).json({ success: true });
    } catch (error) {
      console.error("Error subscribing to newsletter:", error);
      res.status(500).json({ error: "Failed to subscribe to newsletter" });
    }
  });

  // Admin routes (protected)
  app.get("/api/admin/questionnaire-submissions", isAuthenticated, async (_req, res) => {
    try {
      const submissions = await storage.getQuestionnaireSubmissions();
      res.json(submissions);
    } catch (error) {
      console.error("Error fetching questionnaire submissions:", error);
      res.status(500).json({ error: "Failed to fetch questionnaire submissions" });
    }
  });

  app.get("/api/admin/contacts", isAuthenticated, async (_req, res) => {
    try {
      const contacts = await storage.getContacts();
      res.json(contacts);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      res.status(500).json({ error: "Failed to fetch contacts" });
    }
  });

  app.post("/api/admin/projects", isAuthenticated, async (req, res) => {
    try {
      const result = insertProjectSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid project data", details: result.error.issues });
      }
      const project = await storage.createProject(result.data);
      res.status(201).json(project);
    } catch (error) {
      console.error("Error creating project:", error);
      res.status(500).json({ error: "Failed to create project" });
    }
  });

  app.put("/api/admin/projects/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id as string);
      const result = insertProjectSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid project data", details: result.error.issues });
      }
      const project = await storage.updateProject(id, result.data);
      res.json(project);
    } catch (error) {
      console.error("Error updating project:", error);
      res.status(500).json({ error: "Failed to update project" });
    }
  });

  app.delete("/api/admin/projects/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id as string);
      await storage.deleteProject(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting project:", error);
      res.status(500).json({ error: "Failed to delete project" });
    }
  });

  app.post("/api/admin/products", isAuthenticated, async (req, res) => {
    try {
      const result = insertProductSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid product data", details: result.error.issues });
      }
      const product = await storage.createProduct(result.data);
      res.status(201).json(product);
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(500).json({ error: "Failed to create product" });
    }
  });

  app.put("/api/admin/products/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id as string);
      const result = insertProductSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid product data", details: result.error.issues });
      }
      const product = await storage.updateProduct(id, result.data);
      res.json(product);
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ error: "Failed to update product" });
    }
  });

  app.delete("/api/admin/products/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id as string);
      await storage.deleteProduct(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ error: "Failed to delete product" });
    }
  });

  app.post("/api/admin/identities", isAuthenticated, async (req, res) => {
    try {
      const result = insertIdentitySchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid identity data", details: result.error.issues });
      }
      const identity = await storage.createIdentity(result.data);
      res.status(201).json(identity);
    } catch (error) {
      console.error("Error creating identity:", error);
      res.status(500).json({ error: "Failed to create identity" });
    }
  });

  app.put("/api/admin/identities/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id as string);
      const result = insertIdentitySchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid identity data", details: result.error.issues });
      }
      const identity = await storage.updateIdentity(id, result.data);
      res.json(identity);
    } catch (error) {
      console.error("Error updating identity:", error);
      res.status(500).json({ error: "Failed to update identity" });
    }
  });

  app.delete("/api/admin/identities/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id as string);
      await storage.deleteIdentity(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting identity:", error);
      res.status(500).json({ error: "Failed to delete identity" });
    }
  });

  // Client Logos routes
  app.get("/api/client-logos", async (_req, res) => {
    try {
      const logos = await storage.getClientLogos();
      res.json(logos);
    } catch (error) {
      console.error("Error fetching client logos:", error);
      res.status(500).json({ error: "Failed to fetch client logos" });
    }
  });

  app.post("/api/admin/client-logos", isAuthenticated, async (req, res) => {
    try {
      const result = insertClientLogoSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid logo data", details: result.error.issues });
      }
      const logo = await storage.createClientLogo(result.data);
      res.status(201).json(logo);
    } catch (error) {
      console.error("Error creating client logo:", error);
      res.status(500).json({ error: "Failed to create client logo" });
    }
  });

  app.put("/api/admin/client-logos/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id as string);
      const result = insertClientLogoSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid logo data", details: result.error.issues });
      }
      const logo = await storage.updateClientLogo(id, result.data);
      res.json(logo);
    } catch (error) {
      console.error("Error updating client logo:", error);
      res.status(500).json({ error: "Failed to update client logo" });
    }
  });

  app.delete("/api/admin/client-logos/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id as string);
      await storage.deleteClientLogo(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting client logo:", error);
      res.status(500).json({ error: "Failed to delete client logo" });
    }
  });

  // Testimonials routes
  app.get("/api/testimonials", async (_req, res) => {
    try {
      const testimonials = await storage.getTestimonials();
      res.json(testimonials);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      res.status(500).json({ error: "Failed to fetch testimonials" });
    }
  });

  app.post("/api/admin/testimonials", isAuthenticated, async (req, res) => {
    try {
      const result = insertTestimonialSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid testimonial data", details: result.error.issues });
      }
      const testimonial = await storage.createTestimonial(result.data);
      res.json(testimonial);
    } catch (error) {
      console.error("Error creating testimonial:", error);
      res.status(500).json({ error: "Failed to create testimonial" });
    }
  });

  app.put("/api/admin/testimonials/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id as string);
      const result = insertTestimonialSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid testimonial data", details: result.error.issues });
      }
      const testimonial = await storage.updateTestimonial(id, result.data);
      res.json(testimonial);
    } catch (error) {
      console.error("Error updating testimonial:", error);
      res.status(500).json({ error: "Failed to update testimonial" });
    }
  });

  app.delete("/api/admin/testimonials/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id as string);
      await storage.deleteTestimonial(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting testimonial:", error);
      res.status(500).json({ error: "Failed to delete testimonial" });
    }
  });

  // Courses routes (public)
  app.get("/api/courses", async (_req, res) => {
    try {
      const courses = await storage.getCourses();
      const publishedCourses = courses.filter(c => c.published);
      res.json(publishedCourses);
    } catch (error) {
      console.error("Error fetching courses:", error);
      res.status(500).json({ error: "Failed to fetch courses" });
    }
  });

  app.get("/api/courses/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const course = await storage.getCourseById(id);
      if (!course) {
        return res.status(404).json({ error: "Course not found" });
      }
      res.json(course);
    } catch (error) {
      console.error("Error fetching course:", error);
      res.status(500).json({ error: "Failed to fetch course" });
    }
  });

  app.get("/api/courses/:id/lessons", async (req, res) => {
    try {
      const courseId = parseInt(req.params.id);
      const lessons = await storage.getLessonsByCourseId(courseId);
      res.json(lessons);
    } catch (error) {
      console.error("Error fetching lessons:", error);
      res.status(500).json({ error: "Failed to fetch lessons" });
    }
  });

  app.get("/api/courses/:id/testimonials", async (req, res) => {
    try {
      const courseId = parseInt(req.params.id);
      const testimonials = await storage.getCourseTestimonials(courseId);
      res.json(testimonials);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      res.status(500).json({ error: "Failed to fetch testimonials" });
    }
  });

  // Lesson progress routes (authenticated)
  app.get("/api/courses/:courseId/progress", isAuthenticated, async (req, res) => {
    try {
      const courseId = parseInt(req.params.courseId as string);
      const userId = (req.user as any).id;
      const progress = await storage.getUserCourseProgress(courseId, userId);
      res.json(progress);
    } catch (error) {
      console.error("Error fetching course progress:", error);
      res.status(500).json({ error: "Failed to fetch progress" });
    }
  });

  app.post("/api/lessons/:lessonId/progress", isAuthenticated, async (req, res) => {
    try {
      const lessonId = parseInt(req.params.lessonId as string);
      const userId = (req.user as any).id;
      const { completed, watchedSeconds } = req.body;
      
      const progress = await storage.upsertLessonProgress({
        lessonId,
        userId,
        completed: completed ?? false,
        watchedSeconds: watchedSeconds ?? 0
      });
      res.json(progress);
    } catch (error) {
      console.error("Error updating lesson progress:", error);
      res.status(500).json({ error: "Failed to update progress" });
    }
  });

  // Admin courses routes
  app.get("/api/admin/courses", isAuthenticated, async (_req, res) => {
    try {
      const courses = await storage.getCourses();
      res.json(courses);
    } catch (error) {
      console.error("Error fetching courses:", error);
      res.status(500).json({ error: "Failed to fetch courses" });
    }
  });

  app.post("/api/admin/courses", isAuthenticated, async (req, res) => {
    try {
      const result = insertCourseSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid course data", details: result.error.issues });
      }
      const course = await storage.createCourse(result.data);
      res.status(201).json(course);
    } catch (error) {
      console.error("Error creating course:", error);
      res.status(500).json({ error: "Failed to create course" });
    }
  });

  app.put("/api/admin/courses/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id as string);
      const result = insertCourseSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid course data", details: result.error.issues });
      }
      const course = await storage.updateCourse(id, result.data);
      res.json(course);
    } catch (error) {
      console.error("Error updating course:", error);
      res.status(500).json({ error: "Failed to update course" });
    }
  });

  app.delete("/api/admin/courses/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id as string);
      await storage.deleteCourse(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting course:", error);
      res.status(500).json({ error: "Failed to delete course" });
    }
  });

  // Admin lessons routes
  app.get("/api/admin/courses/:courseId/lessons", isAuthenticated, async (req, res) => {
    try {
      const courseId = parseInt(req.params.courseId as string);
      const lessons = await storage.getLessonsByCourseId(courseId);
      res.json(lessons);
    } catch (error) {
      console.error("Error fetching lessons:", error);
      res.status(500).json({ error: "Failed to fetch lessons" });
    }
  });

  app.post("/api/admin/lessons", isAuthenticated, async (req, res) => {
    try {
      const result = insertLessonSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid lesson data", details: result.error.issues });
      }
      const lesson = await storage.createLesson(result.data);
      res.status(201).json(lesson);
    } catch (error) {
      console.error("Error creating lesson:", error);
      res.status(500).json({ error: "Failed to create lesson" });
    }
  });

  app.put("/api/admin/lessons/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id as string);
      const result = insertLessonSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid lesson data", details: result.error.issues });
      }
      const lesson = await storage.updateLesson(id, result.data);
      res.json(lesson);
    } catch (error) {
      console.error("Error updating lesson:", error);
      res.status(500).json({ error: "Failed to update lesson" });
    }
  });

  app.delete("/api/admin/lessons/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id as string);
      await storage.deleteLesson(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting lesson:", error);
      res.status(500).json({ error: "Failed to delete lesson" });
    }
  });

  return httpServer;
}
