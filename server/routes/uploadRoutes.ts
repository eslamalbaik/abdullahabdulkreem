import { Express } from "express";
import {
    isLocalStorageEnabled,
    getLocalUploadUrl,
    saveLocalUpload,
    serveLocalFile,
    getLocalFilePath,
} from "../localStorage.js";

export function registerUploadRoutes(app: Express): void {
    const useLocal = isLocalStorageEnabled();

    app.post("/api/uploads/request-url", async (req, res) => {
        try {
            const { name, contentType } = req.body;
            if (!name) {
                return res.status(400).json({ error: "Missing required field: name" });
            }

            const ct = contentType || "application/octet-stream";

            if (useLocal) {
                const { uploadURL, objectPath } = getLocalUploadUrl(ct);
                return res.json({
                    uploadURL,
                    objectPath,
                    metadata: { name, contentType: ct },
                });
            }

            // If not local and no Replit, we might need another provider.
            // For now, we'll assume local is the fallback.
            const { uploadURL, objectPath } = getLocalUploadUrl(ct);
            res.json({
                uploadURL,
                objectPath,
                metadata: { name, contentType: ct },
            });
        } catch (error) {
            console.error("Error generating upload URL:", error);
            res.status(500).json({ error: "Failed to generate upload URL" });
        }
    });

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

    app.get(/^\/objects\/(.+)$/, async (req, res) => {
        try {
            const objectPath = req.path.startsWith("/") ? req.path : "/objects/" + req.path;
            const localPath = getLocalFilePath(objectPath);
            if (localPath) {
                return serveLocalFile(localPath, res);
            }
            return res.status(404).json({ error: "Object not found" });
        } catch (error) {
            console.error("Error serving object:", error);
            res.status(500).json({ error: "Failed to serve object" });
        }
    });
}
