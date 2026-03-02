import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../server/storage';
import connectDB from '../server/config/db';
import * as schema from '../shared/schema';

// Helper to ensure DB is connected
let cachedDb: any = null;
async function ensureDb() {
  if (cachedDb) return cachedDb;
  await connectDB();
  cachedDb = true;
  return cachedDb;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { method, url } = req;
  const path = url?.replace('/api', '') || '';

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    await ensureDb();

    if (path === '/projects' && method === 'GET') {
      const projects = await storage.getProjects();
      return res.json(projects);
    }

    if (path === '/projects/featured' && method === 'GET') {
      const projects = await storage.getFeaturedProjects();
      return res.json(projects);
    }

    if (path.startsWith('/projects/') && method === 'GET') {
      const id = path.split('/')[2];
      const project = await storage.getProjectById(id);
      if (!project) return res.status(404).json({ error: 'Project not found' });
      return res.json(project);
    }

    if (path === '/products' && method === 'GET') {
      const category = req.query.category as string | undefined;
      let products;
      if (category) {
        products = await storage.getProductsByCategory(category);
      } else {
        products = await storage.getProducts();
      }
      return res.json(products);
    }

    if (path.startsWith('/products/') && method === 'GET') {
      const id = path.split('/')[2];
      const product = await storage.getProductById(id);
      if (!product) return res.status(404).json({ error: 'Product not found' });
      return res.json(product);
    }

    if (path === '/articles' && method === 'GET') {
      const articles = await storage.getArticles();
      return res.json(articles);
    }

    if (path.startsWith('/articles/') && method === 'GET') {
      const slug = path.split('/')[2];
      const article = await storage.getArticleBySlug(slug);
      if (!article) return res.status(404).json({ error: 'Article not found' });
      return res.json(article);
    }

    if (path === '/identities' && method === 'GET') {
      const identities = await storage.getIdentities();
      return res.json(identities);
    }

    if (path.startsWith('/identities/') && method === 'GET') {
      const id = path.split('/')[2];
      const identity = await storage.getIdentityById(id);
      if (!identity) return res.status(404).json({ error: 'Identity not found' });
      return res.json(identity);
    }

    if (path === '/client-logos' && method === 'GET') {
      const logos = await storage.getClientLogos();
      return res.json(logos);
    }

    if (path === '/contact' && method === 'POST') {
      const result = schema.insertContactSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: 'Invalid contact data', details: result.error.issues });
      }
      const contact = await storage.createContact(result.data);
      return res.status(201).json(contact);
    }

    if (path === '/admin/projects' && method === 'POST') {
      const result = schema.insertProjectSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: 'Invalid project data', details: result.error.issues });
      }
      const project = await storage.createProject(result.data);
      return res.status(201).json(project);
    }

    if (path.startsWith('/admin/projects/') && method === 'PUT') {
      const id = path.split('/')[3];
      const result = schema.insertProjectSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: 'Invalid project data', details: result.error.issues });
      }
      const project = await storage.updateProject(id, result.data);
      return res.json(project);
    }

    if (path.startsWith('/admin/projects/') && method === 'DELETE') {
      const id = path.split('/')[3];
      await storage.deleteProject(id);
      return res.json({ success: true });
    }

    if (path === '/admin/products' && method === 'POST') {
      const result = schema.insertProductSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: 'Invalid product data', details: result.error.issues });
      }
      const product = await storage.createProduct(result.data);
      return res.status(201).json(product);
    }

    if (path.startsWith('/admin/products/') && method === 'PUT') {
      const id = path.split('/')[3];
      const result = schema.insertProductSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: 'Invalid product data', details: result.error.issues });
      }
      const product = await storage.updateProduct(id, result.data);
      return res.json(product);
    }

    if (path.startsWith('/admin/products/') && method === 'DELETE') {
      const id = path.split('/')[3];
      await storage.deleteProduct(id);
      return res.json({ success: true });
    }

    if (path === '/admin/identities' && method === 'POST') {
      const result = schema.insertIdentitySchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: 'Invalid identity data', details: result.error.issues });
      }
      const identity = await storage.createIdentity(result.data);
      return res.status(201).json(identity);
    }

    if (path.startsWith('/admin/identities/') && method === 'PUT') {
      const id = path.split('/')[3];
      const result = schema.insertIdentitySchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: 'Invalid identity data', details: result.error.issues });
      }
      const identity = await storage.updateIdentity(id, result.data);
      return res.json(identity);
    }

    if (path.startsWith('/admin/identities/') && method === 'DELETE') {
      const id = path.split('/')[3];
      await storage.deleteIdentity(id);
      return res.json({ success: true });
    }

    if (path === '/admin/client-logos' && method === 'POST') {
      const result = schema.insertClientLogoSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: 'Invalid logo data', details: result.error.issues });
      }
      const logo = await storage.createClientLogo(result.data);
      return res.status(201).json(logo);
    }

    if (path.startsWith('/admin/client-logos/') && method === 'PUT') {
      const id = path.split('/')[3];
      const result = schema.insertClientLogoSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: 'Invalid logo data', details: result.error.issues });
      }
      const logo = await storage.updateClientLogo(id, result.data);
      return res.json(logo);
    }

    if (path.startsWith('/admin/client-logos/') && method === 'DELETE') {
      const id = path.split('/')[3];
      await storage.deleteClientLogo(id);
      return res.json({ success: true });
    }

    return res.status(404).json({ error: 'Not found' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
