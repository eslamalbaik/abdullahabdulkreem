import multer from 'multer';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ensure uploads directory exists
const UPLOADS_DIR = path.resolve(__dirname, '..', '..', 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
    destination: function (_req, _file, cb) {
        cb(null, UPLOADS_DIR);
    },
    filename: function (_req, file, cb) {
        // Generate a unique filename using Date and random number
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, `${uniqueSuffix}${ext}`);
    }
});

// Create multer instance with 10MB limit
export const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});
