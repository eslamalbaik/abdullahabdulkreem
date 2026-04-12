import "dotenv/config";
import express, { type Request, Response, NextFunction } from "express";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import fs from "fs";

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
import dynamicQuestionnaireRoutes from './routes/dynamicQuestionnaireRoutes.js';


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

// Validation
if (process.env.NODE_ENV === "production") {
  const envVars = ["MONGODB_URI", "JWT_SECRET"];
  const missing = envVars.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    console.error(`FATAL: Missing production environment variables: ${missing.join(", ")}`);
    process.exit(1);
  }
}

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
    if (!origin) return callback(null, true);
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
app.use(activityLogger);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === "production" ? 100 : 10000,
  message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use("/api", limiter);

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

// Setup function for all routes and logic
async function setupApp() {
  await connectDB();
  await seedRoles();
  await registerRoutes(httpServer, app);

  app.get('/api/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date() }));
  app.use('/api/auth', authRoutes);
  app.use('/api/products', productRoutes);
  app.use('/api/projects', projectRoutes);
  app.use('/api/dynamic-questionnaires', dynamicQuestionnaireRoutes);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
  app.use(errorMiddleware);

  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    const uploadsDir = path.resolve(process.cwd(), "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    app.use("/uploads", express.static(uploadsDir, {
      setHeaders: (res) => {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
      },
    }));
    app.use(express.static(path.resolve(__dirname, "..", "client/public")));
    const { setupVite } = await import("./vite.js");
    await setupVite(httpServer, app);
  }
}

// Global initialization
const initPromise = setupApp();

export default app;
export { httpServer, initPromise };

// Start server if run directly
if (process.env.NODE_ENV !== "test" && !process.env.VERCEL) {
  initPromise.then(() => {
    let port = parseInt(process.env.PORT || "5000", 10);
    
    function startServer(p: number) {
      httpServer.listen({ port: p, host: "0.0.0.0" }, () => {
        log(`serving on port ${p}`);
      });
    }

    httpServer.on("error", (err: any) => {
      if (err.code === "EADDRINUSE") {
        log(`Port ${port} is already in use, trying port ${port + 1}...`);
        port++;
        startServer(port);
      } else {
        console.error("Server error:", err);
        process.exit(1);
      }
    });

    startServer(port);
  });
}
