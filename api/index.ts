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

import type { VercelRequest, VercelResponse } from '@vercel/node';
import app, { initPromise } from '../server/index';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Ensure the app is fully initialized (DB connection, seeded data, routes registered)
    await initPromise;
    
    // Proxy the request to the Express app
    return app(req, res);
  } catch (error) {
    console.error('Vercel Entry Point Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error during initialization', 
      details: process.env.NODE_ENV === 'development' ? String(error) : undefined 
    });
  }
}
