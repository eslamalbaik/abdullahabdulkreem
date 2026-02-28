import { randomUUID } from "crypto";
import fs from "fs";
import path from "path";
import type { Response } from "express";

const UPLOADS_DIR = path.resolve(process.cwd(), "uploads");

function ensureUploadsDir() {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
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
  };
  return map[contentType] || ".bin";
}

export function isLocalStorageEnabled(): boolean {
  return !process.env.PRIVATE_OBJECT_DIR;
}

export function getLocalUploadUrl(contentType: string): {
  uploadURL: string;
  objectPath: string;
} {
  ensureUploadsDir();
  const id = randomUUID();
  const ext = getExtension(contentType);
  const objectPath = `/objects/uploads/${id}${ext}`;
  const uploadURL = `/api/uploads/local/${id}${ext}`;
  return { uploadURL, objectPath };
}

export function getLocalFilePath(objectPath: string): string | null {
  if (!objectPath.startsWith("/objects/uploads/")) return null;
  const fileName = objectPath.replace("/objects/uploads/", "");
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
  return `/objects/uploads/${fileName}`;
}

export function serveLocalFile(filePath: string, res: Response): void {
  const ext = path.extname(filePath);
  const contentTypeMap: Record<string, string> = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".gif": "image/gif",
    ".webp": "image/webp",
    ".svg": "image/svg+xml",
  };
  const contentType = contentTypeMap[ext] || "application/octet-stream";
  res.set({
    "Content-Type": contentType,
    "Cache-Control": "public, max-age=3600",
  });
  fs.createReadStream(filePath).pipe(res);
}
