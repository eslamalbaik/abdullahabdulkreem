import type { Express } from "express";
import { authStorage } from "./storage";
import { isAuthenticated } from "./replitAuth";

// Register auth-specific routes
export function registerAuthRoutes(app: Express): void {
  // Get current authenticated user
  app.get("/api/auth/user", isAuthenticated, async (req: any, res) => {
    try {
      if (req.user?.id === "local-admin") {
        // محاولة جلب بيانات أحدث من قاعدة البيانات — وإلا نرجع مستخدم الجلسة
        try {
          const user = await authStorage.getUserByEmail(req.user.email);
          return res.json(user || req.user);
        } catch {
          return res.json(req.user);
        }
      }
      const userId = req.user?.claims?.sub;
      if (!userId) return res.json(req.user);
      try {
        const user = await authStorage.getUser(userId);
        res.json(user || req.user);
      } catch {
        res.json(req.user);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      res.json(req.user);
    }
  });
}
