import { Express } from "express";
import { upload } from "../middlewares/uploadMiddleware.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";
import { serveLocalFile, getLocalFilePath } from "../localStorage.js";

export function registerUploadRoutes(app: Express): void {
    // ✅ Upload endpoint using Multer
    // Returns the relative path to be stored in the DB (e.g. /uploads/162343242-logo.png)
    app.post("/api/uploads", isAuthenticated, upload.single("file"), (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ error: "No file uploaded" });
            }

            // Multer saves the file safely. The path should look like /uploads/filename.ext
            const objectPath = `/uploads/${req.file.filename}`;
            
            res.status(200).json({
                ok: true,
                objectPath,
                uploadURL: objectPath, // Frontend may expect this based on old behavior
                metadata: {
                    name: req.file.originalname,
                    contentType: req.file.mimetype,
                    size: req.file.size
                }
            });
        } catch (error) {
            console.error("Upload error:", error);
            res.status(500).json({ error: "Failed to upload file" });
        }
    });

    // Provide legacy backward compatibility for files uploaded under /objects/
    // or when static middleware doesn't catch the request
    app.get(/^\/(objects|uploads)\/(.+)$/, async (req, res) => {
        try {
            const objectPath = req.path;
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
