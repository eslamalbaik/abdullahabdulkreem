import type { Project, Product, Article, InsertContact } from "@shared/schema";

const API_BASE = "/api";

export async function fetchProjects(): Promise<Project[]> {
  const response = await fetch(`${API_BASE}/projects`);
  if (!response.ok) throw new Error("Failed to fetch projects");
  return response.json();
}

export async function fetchFeaturedProjects(): Promise<Project[]> {
  const response = await fetch(`${API_BASE}/projects/featured`);
  if (!response.ok) throw new Error("Failed to fetch featured projects");
  return response.json();
}

export async function fetchProducts(): Promise<Product[]> {
  const response = await fetch(`${API_BASE}/products`);
  if (!response.ok) throw new Error("Failed to fetch products");
  return response.json();
}

export async function fetchProductsByCategory(category: string): Promise<Product[]> {
  const response = await fetch(`${API_BASE}/products?category=${encodeURIComponent(category)}`);
  if (!response.ok) throw new Error("Failed to fetch products");
  return response.json();
}

export async function fetchArticles(): Promise<Article[]> {
  const response = await fetch(`${API_BASE}/articles`);
  if (!response.ok) throw new Error("Failed to fetch articles");
  return response.json();
}

export async function submitContact(data: InsertContact): Promise<void> {
  const response = await fetch(`${API_BASE}/contact`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to submit contact form");
}
