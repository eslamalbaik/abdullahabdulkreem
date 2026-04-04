import { randomUUID } from "crypto";
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import type { Response } from "express";

// ✅ مجلد uploads في جذر المشروع (خارج dist/)
// هذا يضمن بقاء الصور حتى بعد إعادة البناء
const UPLOADS_DIR = path.resolve(__dirname, "..", "uploads");

function ensureUploadsDir() {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    console.log(`[uploads] Created uploads directory: ${UPLOADS_DIR}`);
  }
}

function getExtension(contentType: string): string {
  const map: Record<string, string> = {
    "image/jpeg": ".jpg",
    "image/jpg": ".jpg",
    "image/png": ".png",
    "image/gif": ".gif",
    "image/webp": ".webp",
    "image/svg+xml": ".svg",
    "image/avif": ".avif",
  };
  return map[contentType] || ".bin";
}

export function isLocalStorageEnabled(): boolean {
  // دائماً نستخدم التخزين المحلي ما لم يكن هناك S3/Cloud provider
  return !process.env.PRIVATE_OBJECT_DIR && !process.env.S3_BUCKET;
}

export function getLocalUploadUrl(contentType: string): {
  uploadURL: string;
  objectPath: string;
} {
  ensureUploadsDir();
  const id = randomUUID();
  const ext = getExtension(contentType);
  const objectPath = `/uploads/${id}${ext}`;
  const uploadURL = `/api/uploads/local/${id}${ext}`;
  return { uploadURL, objectPath };
}

export function getLocalFilePath(objectPath: string): string | null {
  let fileName = "";
  if (objectPath.startsWith("/uploads/")) {
    fileName = objectPath.replace("/uploads/", "");
  } else if (objectPath.startsWith("/objects/uploads/")) {
    fileName = objectPath.replace("/objects/uploads/", "");
  } else if (objectPath.startsWith("/objects/")) {
    // دعم legacy paths
    fileName = objectPath.replace("/objects/", "");
  } else {
    return null;
  }
  
  if (!fileName) return null;
  
  const filePath = path.join(UPLOADS_DIR, fileName);
  return fs.existsSync(filePath) ? filePath : null;
}

export function saveLocalUpload(
  fileName: string,
  bodyBuffer: Buffer
): string {
  ensureUploadsDir();
  const filePath = path.join(UPLOADS_DIR, fileName);
  fs.writeFileSync(filePath, bodyBuffer);
  console.log(`[uploads] Saved file: ${filePath} (${bodyBuffer.length} bytes)`);
  return `/uploads/${fileName}`;
}

export function serveLocalFile(filePath: string, res: Response): void {
  const ext = path.extname(filePath).toLowerCase();
  const contentTypeMap: Record<string, string> = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".gif": "image/gif",
    ".webp": "image/webp",
    ".svg": "image/svg+xml",
    ".avif": "image/avif",
  };
  const contentType = contentTypeMap[ext] || "application/octet-stream";
  
  res.set({
    "Content-Type": contentType,
    // ✅ Cache لمدة 7 أيام + CORS headers لضمان ظهور الصور
    "Cache-Control": "public, max-age=604800, immutable",
    "Access-Control-Allow-Origin": "*",
    "Cross-Origin-Resource-Policy": "cross-origin",
  });
  
  fs.createReadStream(filePath).pipe(res);
}
