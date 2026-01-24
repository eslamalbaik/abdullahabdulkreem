import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { eq, asc } from 'drizzle-orm';
import * as schema from '../shared/schema';

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

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
    if (path === '/projects' && method === 'GET') {
      const projects = await db.select().from(schema.projects).orderBy(schema.projects.createdAt);
      return res.json(projects);
    }

    if (path === '/projects/featured' && method === 'GET') {
      const projects = await db.select().from(schema.projects).where(eq(schema.projects.featured, true)).orderBy(schema.projects.createdAt);
      return res.json(projects);
    }

    if (path.startsWith('/projects/') && method === 'GET') {
      const id = parseInt(path.split('/')[2]);
      const [project] = await db.select().from(schema.projects).where(eq(schema.projects.id, id));
      if (!project) return res.status(404).json({ error: 'Project not found' });
      return res.json(project);
    }

    if (path === '/products' && method === 'GET') {
      const category = req.query.category as string | undefined;
      let products;
      if (category) {
        products = await db.select().from(schema.products).where(eq(schema.products.category, category)).orderBy(schema.products.createdAt);
      } else {
        products = await db.select().from(schema.products).orderBy(schema.products.createdAt);
      }
      return res.json(products);
    }

    if (path.startsWith('/products/') && method === 'GET') {
      const id = parseInt(path.split('/')[2]);
      const [product] = await db.select().from(schema.products).where(eq(schema.products.id, id));
      if (!product) return res.status(404).json({ error: 'Product not found' });
      return res.json(product);
    }

    if (path === '/articles' && method === 'GET') {
      const articles = await db.select().from(schema.articles).orderBy(schema.articles.createdAt);
      return res.json(articles);
    }

    if (path.startsWith('/articles/') && method === 'GET') {
      const slug = path.split('/')[2];
      const [article] = await db.select().from(schema.articles).where(eq(schema.articles.slug, slug));
      if (!article) return res.status(404).json({ error: 'Article not found' });
      return res.json(article);
    }

    if (path === '/identities' && method === 'GET') {
      const identities = await db.select().from(schema.identities).orderBy(schema.identities.createdAt);
      return res.json(identities);
    }

    if (path.startsWith('/identities/') && method === 'GET') {
      const id = parseInt(path.split('/')[2]);
      const [identity] = await db.select().from(schema.identities).where(eq(schema.identities.id, id));
      if (!identity) return res.status(404).json({ error: 'Identity not found' });
      return res.json(identity);
    }

    if (path === '/client-logos' && method === 'GET') {
      const logos = await db.select().from(schema.clientLogos).orderBy(asc(schema.clientLogos.order));
      return res.json(logos);
    }

    if (path === '/contact' && method === 'POST') {
      const result = schema.insertContactSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: 'Invalid contact data', details: result.error.issues });
      }
      const [contact] = await db.insert(schema.contacts).values(result.data).returning();
      return res.status(201).json(contact);
    }

    if (path === '/admin/projects' && method === 'POST') {
      const result = schema.insertProjectSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: 'Invalid project data', details: result.error.issues });
      }
      const [project] = await db.insert(schema.projects).values(result.data).returning();
      return res.status(201).json(project);
    }

    if (path.startsWith('/admin/projects/') && method === 'PUT') {
      const id = parseInt(path.split('/')[3]);
      const result = schema.insertProjectSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: 'Invalid project data', details: result.error.issues });
      }
      const [project] = await db.update(schema.projects).set(result.data).where(eq(schema.projects.id, id)).returning();
      return res.json(project);
    }

    if (path.startsWith('/admin/projects/') && method === 'DELETE') {
      const id = parseInt(path.split('/')[3]);
      await db.delete(schema.projects).where(eq(schema.projects.id, id));
      return res.json({ success: true });
    }

    if (path === '/admin/products' && method === 'POST') {
      const result = schema.insertProductSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: 'Invalid product data', details: result.error.issues });
      }
      const [product] = await db.insert(schema.products).values(result.data).returning();
      return res.status(201).json(product);
    }

    if (path.startsWith('/admin/products/') && method === 'PUT') {
      const id = parseInt(path.split('/')[3]);
      const result = schema.insertProductSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: 'Invalid product data', details: result.error.issues });
      }
      const [product] = await db.update(schema.products).set(result.data).where(eq(schema.products.id, id)).returning();
      return res.json(product);
    }

    if (path.startsWith('/admin/products/') && method === 'DELETE') {
      const id = parseInt(path.split('/')[3]);
      await db.delete(schema.products).where(eq(schema.products.id, id));
      return res.json({ success: true });
    }

    if (path === '/admin/identities' && method === 'POST') {
      const result = schema.insertIdentitySchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: 'Invalid identity data', details: result.error.issues });
      }
      const [identity] = await db.insert(schema.identities).values(result.data).returning();
      return res.status(201).json(identity);
    }

    if (path.startsWith('/admin/identities/') && method === 'PUT') {
      const id = parseInt(path.split('/')[3]);
      const result = schema.insertIdentitySchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: 'Invalid identity data', details: result.error.issues });
      }
      const [identity] = await db.update(schema.identities).set(result.data).where(eq(schema.identities.id, id)).returning();
      return res.json(identity);
    }

    if (path.startsWith('/admin/identities/') && method === 'DELETE') {
      const id = parseInt(path.split('/')[3]);
      await db.delete(schema.identities).where(eq(schema.identities.id, id));
      return res.json({ success: true });
    }

    if (path === '/admin/client-logos' && method === 'POST') {
      const result = schema.insertClientLogoSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: 'Invalid logo data', details: result.error.issues });
      }
      const [logo] = await db.insert(schema.clientLogos).values(result.data).returning();
      return res.status(201).json(logo);
    }

    if (path.startsWith('/admin/client-logos/') && method === 'PUT') {
      const id = parseInt(path.split('/')[3]);
      const result = schema.insertClientLogoSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: 'Invalid logo data', details: result.error.issues });
      }
      const [logo] = await db.update(schema.clientLogos).set(result.data).where(eq(schema.clientLogos.id, id)).returning();
      return res.json(logo);
    }

    if (path.startsWith('/admin/client-logos/') && method === 'DELETE') {
      const id = parseInt(path.split('/')[3]);
      await db.delete(schema.clientLogos).where(eq(schema.clientLogos.id, id));
      return res.json({ success: true });
    }

    return res.status(404).json({ error: 'Not found' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
