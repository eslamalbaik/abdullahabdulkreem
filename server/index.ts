import "dotenv/config";
import express, { type Request, Response, NextFunction } from "express";
import session from "express-session";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { registerRoutes } from "./routes.js";
import { serveStatic } from "./static.js";
import { createServer } from "http";
import connectDB from './config/db.js';
import seedRoles from './services/seedService.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import projectRoutes from './routes/projectRoutes.js';

import errorMiddleware from './middlewares/errorMiddleware.js';
import { activityLogger } from './middlewares/activityLogger.js';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import swaggerUi from 'swagger-ui-express';
import swaggerSpecs from './config/swagger.js';

const app = express();
const httpServer = createServer(app);

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

// Basic Middlewares
app.use(express.json({
  verify: (req, _res, buf) => {
    req.rawBody = buf;
  },
}));
app.use(express.urlencoded({ extended: false }));

// Security Middlewares
app.use(
  helmet({
    contentSecurityPolicy: process.env.NODE_ENV === "production" ? undefined : false,
    crossOriginEmbedderPolicy: false,
  })
);
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    // Be permissive in development but follow the rules
    callback(null, true);
  },
  credentials: true
}));

// Fix for Express 5 compatibility with mongoSanitize
app.use((req, _res, next) => {
  ['query', 'body', 'params'].forEach((key) => {
    const request = req as any;
    if (request[key]) {
      Object.defineProperty(req, key, {
        value: { ...request[key] },
        writable: true,
        enumerable: true,
        configurable: true
      });
    }
  });
  next();
});

app.use(mongoSanitize());

// Rate limiting - only for API routes and increased limit for development
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === "production" ? 100 : 10000,
  message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use("/api", limiter);

app.use(activityLogger);

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      log(logLine);
    }
  });

  next();
});

// Production Env Validation
if (process.env.NODE_ENV === "production") {
  const envVars = ["MONGODB_URI", "JWT_SECRET"];
  const missing = envVars.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    console.error(`FATAL: Missing production environment variables: ${missing.join(", ")}`);
    process.exit(1);
  }
}

(async () => {
  // Connect to Database
  await connectDB();
  // Seed Roles
  await seedRoles();

  // MongoDB connection and seeding already handled above

  await registerRoutes(httpServer, app);

  // Health check
  app.get('/api/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date() }));

  // New Auth Routes
  app.use('/api/auth', authRoutes);
  // Product Routes
  app.use('/api/products', productRoutes);
  app.use('/api/projects', projectRoutes);


  // API Documentation
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

  // Centralized Error Handling
  app.use(errorMiddleware);

  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    app.use(express.static(path.resolve(__dirname, "..", "client/public")));
    const { setupVite } = await import("./vite.js");
    await setupVite(httpServer, app);
  }

  const port = parseInt(process.env.PORT || "5000", 10);
  httpServer.listen(
    {
      port,
      host: "0.0.0.0",
    },
    () => {
      log(`serving on port ${port}`);
      log(`environment: ${process.env.NODE_ENV || 'development'}`);
      log(`CSP: ${process.env.NODE_ENV === "production" ? 'enabled' : 'disabled'}`);
    },
  );
})();
