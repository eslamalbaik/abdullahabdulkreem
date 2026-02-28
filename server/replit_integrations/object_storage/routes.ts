import type { Express } from "express";
import { ObjectStorageService, ObjectNotFoundError } from "./objectStorage";
import {
  isLocalStorageEnabled,
  getLocalUploadUrl,
  getLocalFilePath,
  saveLocalUpload,
  serveLocalFile,
} from "../../localStorage";

/**
 * Register object storage routes for file uploads.
 *
 * When PRIVATE_OBJECT_DIR is not set (local dev), uses local file storage.
 * Otherwise uses Replit Object Storage.
 */
export function registerObjectStorageRoutes(app: Express): void {
  const objectStorageService = new ObjectStorageService();
  const useLocal = isLocalStorageEnabled();

  if (useLocal) {
    console.log("[uploads] Using local file storage (uploads/ folder)");
  }

  app.post("/api/uploads/request-url", async (req, res) => {
    try {
      const { name, size, contentType } = req.body;

      if (!name) {
        return res.status(400).json({
          error: "Missing required field: name",
        });
      }

      const ct = contentType || "application/octet-stream";

      if (useLocal) {
        const { uploadURL, objectPath } = getLocalUploadUrl(ct);
        return res.json({
          uploadURL,
          objectPath,
          metadata: { name, size, contentType: ct },
        });
      }

      const uploadURL = await objectStorageService.getObjectEntityUploadURL();
      const objectPath = objectStorageService.normalizeObjectEntityPath(uploadURL);

      res.json({
        uploadURL,
        objectPath,
        metadata: { name, size, contentType: ct },
      });
    } catch (error) {
      console.error("Error generating upload URL:", error);
      res.status(500).json({ error: "Failed to generate upload URL" });
    }
  });

  if (useLocal) {
    app.put(/^\/api\/uploads\/local\/(.+)$/, (req, res) => {
      const match = req.path.match(/^\/api\/uploads\/local\/(.+)$/);
      const pathSegments = match?.[1] ?? "";
      if (!pathSegments) {
        return res.status(400).json({ error: "Invalid path" });
      }

      const chunks: Buffer[] = [];
      req.on("data", (chunk: Buffer) => chunks.push(chunk));
      req.on("end", () => {
        try {
          const buffer = Buffer.concat(chunks);
          saveLocalUpload(pathSegments, buffer);
          res.status(200).json({ ok: true });
        } catch (err) {
          console.error("Local upload save error:", err);
          res.status(500).json({ error: "Failed to save file" });
        }
      });
      req.on("error", (err) => {
        console.error("Local upload stream error:", err);
        res.status(500).json({ error: "Upload failed" });
      });
    });
  }

  app.get(/^\/objects\/(.+)$/, async (req, res) => {
    try {
      if (useLocal) {
        const objectPath = req.path.startsWith("/") ? req.path : "/objects/" + req.path;
        const localPath = getLocalFilePath(objectPath);
        if (localPath) {
          return serveLocalFile(localPath, res);
        }
        return res.status(404).json({ error: "Object not found" });
      }

      const objectFile = await objectStorageService.getObjectEntityFile(req.path);
      await objectStorageService.downloadObject(objectFile, res);
    } catch (error) {
      console.error("Error serving object:", error);
      if (error instanceof ObjectNotFoundError) {
        return res.status(404).json({ error: "Object not found" });
      }
      return res.status(500).json({ error: "Failed to serve object" });
    }
  });
}

