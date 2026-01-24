// shared/schema.ts
import { z } from "zod";

// ===== Projects =====
export const projectSchema = z.object({
  id: z.number(),
  title: z.string(),
  category: z.string(),
  image: z.string(),
  year: z.string(),
  description: z.string().optional(),
  featured: z.boolean().default(false),
  createdAt: z.string(),
});

export type Project = z.infer<typeof projectSchema>;
export type InsertProject = Omit<Project, "id" | "createdAt">;

// ===== Products =====
export const productSchema = z.object({
  id: z.number(),
  title: z.string(),
  category: z.string(),
  price: z.number(),
  image: z.string(),
  description: z.string().optional(),
  featured: z.boolean().default(false),
  stripeProductId: z.string().optional(),
  stripePriceId: z.string().optional(),
  createdAt: z.string(),
});

export type Product = z.infer<typeof productSchema>;
export type InsertProduct = Omit<Product, "id" | "createdAt">;

// ===== Articles =====
export const articleSchema = z.object({
  id: z.number(),
  title: z.string(),
  slug: z.string(),
  excerpt: z.string(),
  content: z.string().optional(),
  date: z.string(),
  readTime: z.string(),
  published: z.boolean().default(false),
  createdAt: z.string(),
});

export type Article = z.infer<typeof articleSchema>;
export type InsertArticle = Omit<Article, "id" | "createdAt">;

// ===== Identities =====
export const identitySchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  price: z.number(),
  image: z.string(),
  includes: z.array(z.string()),
  featured: z.boolean().default(false),
  createdAt: z.string(),
});

export type Identity = z.infer<typeof identitySchema>;
export type InsertIdentity = Omit<Identity, "id" | "createdAt">;

// ===== Contacts =====
export const contactSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  projectType: z.string(),
  message: z.string(),
  createdAt: z.string(),
});

export type Contact = z.infer<typeof contactSchema>;
export type InsertContact = Omit<Contact, "id" | "createdAt">;
