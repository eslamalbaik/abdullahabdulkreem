import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema, insertProjectSchema, insertProductSchema, insertIdentitySchema, insertClientLogoSchema } from "@shared/schema";
import { setupAuth, registerAuthRoutes, isAuthenticated } from "./replit_integrations/auth";
import { registerObjectStorageRoutes } from "./replit_integrations/object_storage";

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
      res.status(201).json(contact);
    } catch (error) {
      res.status(500).json({ error: "Failed to submit contact form" });
    }
  });

  // Admin routes (protected)
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

  return httpServer;
}
