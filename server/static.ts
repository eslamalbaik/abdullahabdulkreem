import express, { type Express } from "express";
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  // ✅ تقديم مجلد uploads/ كـ static route منفصل
  // هذا يحل مشكلة عدم ظهور الصور المرفوعة في الإنتاج
  const uploadsPath = path.resolve(process.cwd(), "uploads");
  if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath, { recursive: true });
    console.log(`[static] Created uploads directory: ${uploadsPath}`);
  }

  app.use("/uploads", express.static(uploadsPath, {
    maxAge: "7d",          // cache للصور أسبوع
    etag: true,
    lastModified: true,
    setHeaders: (res, filePath) => {
      // CORS header لتمكين عرض الصور من أي domain
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    },
  }));
  console.log(`[static] Serving uploads from: ${uploadsPath}`);

  // تقديم ملفات الـ frontend
  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist (SPA routing)
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
