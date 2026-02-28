import * as client from "openid-client";
import { Strategy, type VerifyFunction } from "openid-client/passport";
import { Strategy as LocalStrategy } from "passport-local";

import passport from "passport";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import memoize from "memoizee";
import createMemoryStore from "memorystore";
import { authStorage } from "./storage";

const getOidcConfig = memoize(
  async () => {
    return await client.discovery(
      new URL(process.env.ISSUER_URL ?? "https://replit.com/oidc"),
      process.env.REPL_ID!
    );
  },
  { maxAge: 3600 * 1000 }
);

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const MemoryStore = createMemoryStore(session);
  const sessionStore = new MemoryStore({
    checkPeriod: 86400000, // prune expired entries every 24h
  });
  return session({
    secret: process.env.SESSION_SECRET!,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: sessionTtl,
    },
  });
}

function updateUserSession(
  user: any,
  tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers
) {
  user.claims = tokens.claims();
  user.access_token = tokens.access_token;
  user.refresh_token = tokens.refresh_token;
  user.expires_at = user.claims?.exp;
}

async function upsertUser(claims: any) {
  await authStorage.upsertUser({
    id: claims["sub"],
    email: claims["email"],
    firstName: claims["first_name"],
    lastName: claims["last_name"],
    profileImageUrl: claims["profile_image_url"],
    role: "user",
  } as any);
}

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  if (!process.env.REPL_ID) {
    const email = process.env.LOCAL_ADMIN_EMAIL || "admin@local.dev";
    const password = process.env.LOCAL_ADMIN_PASSWORD;
    if (!password) {
      console.warn("[auth] LOCAL_ADMIN_PASSWORD not set. Add to .env for admin access.");
    }
    passport.use(
      new LocalStrategy({ usernameField: "email" }, async (u, p, cb) => {
        try {
          // 1. Check database first (for changed passwords)
          const dbUser = await authStorage.getUserByEmail(u);
          if (dbUser && dbUser.password) {
            const bcrypt = await import("bcryptjs");
            const isValid = await bcrypt.default.compare(p, dbUser.password);
            if (isValid) {
              return cb(null, dbUser);
            }
          }

          // 2. Fallback to .env (initial login)
          if (password && u === email && p === password) {
            // Upsert the admin user into DB if they don't exist yet
            const adminUser = {
              id: "local-admin",
              email,
              firstName: "Admin",
              lastName: "Local",
              role: "admin",
            };
            await authStorage.upsertUser(adminUser as any);
            return cb(null, adminUser);
          }

          return cb(null, false, { message: "البريد الإلكتروني أو كلمة المرور غير صحيحة" });
        } catch (error) {
          return cb(error);
        }
      })
    );
    passport.serializeUser((user: Express.User, cb) => cb(null, user));
    passport.deserializeUser((user: Express.User, cb) => cb(null, user));

    const loginForm = `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>تسجيل الدخول · لوحة التحكم</title>
<link rel="preload" href="/fonts/TheYearofHandicrafts-Regular.otf" as="font" type="font/otf" crossorigin="anonymous">
<link rel="preload" href="/fonts/TheYearofHandicrafts-Bold.otf" as="font" type="font/otf" crossorigin="anonymous">
<style>
@font-face {
  font-family: 'Handicrafts';
  src: url('/fonts/TheYearofHandicrafts-Regular.otf') format('opentype');
  font-weight: 400; font-style: normal; font-display: swap;
}
@font-face {
  font-family: 'Handicrafts';
  src: url('/fonts/TheYearofHandicrafts-Bold.otf') format('opentype');
  font-weight: 700; font-style: normal; font-display: swap;
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: 'Handicrafts', 'Georgia', ui-serif, serif;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0020a5;
  background-image:
    radial-gradient(ellipse 80% 60% at 20% 10%, rgba(150,181,243,0.35) 0%, transparent 60%),
    radial-gradient(ellipse 60% 80% at 85% 90%, rgba(0,12,80,0.7) 0%, transparent 60%);
  overflow: hidden;
  position: relative;
}

/* Decorative geometric shapes */
.geo {
  position: fixed;
  pointer-events: none;
}
.geo-1 {
  width: 420px; height: 420px;
  border: 1.5px solid rgba(150,181,243,0.18);
  border-radius: 50%;
  top: -120px; left: -120px;
  animation: spin 40s linear infinite;
}
.geo-2 {
  width: 260px; height: 260px;
  border: 1px solid rgba(150,181,243,0.12);
  border-radius: 50%;
  top: -60px; left: -60px;
  animation: spin 28s linear infinite reverse;
}
.geo-3 {
  width: 500px; height: 500px;
  border: 1px solid rgba(150,181,243,0.08);
  bottom: -180px; right: -160px;
  border-radius: 50%;
  animation: spin 55s linear infinite;
}
.geo-4 {
  width: 80px; height: 80px;
  background: rgba(150,181,243,0.08);
  border-radius: 12px;
  bottom: 15%; right: 8%;
  transform: rotate(20deg);
  animation: float 7s ease-in-out infinite;
}
.geo-5 {
  width: 44px; height: 44px;
  background: rgba(150,181,243,0.12);
  border-radius: 8px;
  top: 18%; left: 9%;
  transform: rotate(-15deg);
  animation: float 9s ease-in-out infinite 2s;
}
.geo-6 {
  width: 6px; height: 6px;
  background: rgba(150,181,243,0.5);
  border-radius: 50%;
  top: 35%; right: 14%;
  animation: twinkle 3s ease-in-out infinite;
}
.geo-7 {
  width: 4px; height: 4px;
  background: rgba(150,181,243,0.4);
  border-radius: 50%;
  bottom: 30%; left: 16%;
  animation: twinkle 4s ease-in-out infinite 1s;
}

@keyframes spin { to { transform: rotate(360deg); } }
@keyframes float {
  0%, 100% { transform: rotate(20deg) translateY(0); }
  50% { transform: rotate(20deg) translateY(-16px); }
}
@keyframes twinkle {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.6); }
}

/* Brand mark top */
.brand-top {
  text-align: center;
  margin-bottom: 28px;
}
.brand-logo-img {
  height: 72px;
  width: auto;
  object-fit: contain;
  margin-bottom: 14px;
  filter: drop-shadow(0 4px 16px rgba(0,32,165,0.35)) brightness(0) invert(1);
}
.brand-name {
  font-family: 'Handicrafts', ui-serif, serif;
  font-weight: 700;
  font-size: 1.35rem;
  color: #fff;
  letter-spacing: 0.01em;
  line-height: 1.2;
}
.brand-sub {
  font-size: 0.78rem;
  color: rgba(150,181,243,0.8);
  margin-top: 4px;
  letter-spacing: 0.04em;
}

/* Card */
.card {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 420px;
  padding: 20px;
}

.card-inner {
  background: rgba(255,255,255,0.06);
  backdrop-filter: blur(20px) saturate(1.4);
  -webkit-backdrop-filter: blur(20px) saturate(1.4);
  border: 1px solid rgba(150,181,243,0.22);
  border-radius: 24px;
  padding: 40px 36px 36px;
  box-shadow:
    0 32px 64px rgba(0,0,0,0.35),
    0 0 0 1px rgba(150,181,243,0.06) inset,
    0 1px 0 rgba(255,255,255,0.12) inset;
  animation: cardIn 0.6s cubic-bezier(0.16,1,0.3,1) both;
}

@keyframes cardIn {
  from { opacity: 0; transform: translateY(28px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0)    scale(1);    }
}

/* Divider */
.divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(150,181,243,0.25), transparent);
  margin: 20px 0 28px;
}

/* Labels */
.field { margin-bottom: 18px; }
label {
  display: block;
  font-size: 0.78rem;
  font-weight: 700;
  color: rgba(150,181,243,0.9);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  margin-bottom: 8px;
}

/* Inputs */
.input-wrap { position: relative; }
.input-icon {
  position: absolute;
  top: 50%; right: 14px;
  transform: translateY(-50%);
  pointer-events: none;
  color: rgba(150,181,243,0.5);
  width: 18px; height: 18px;
}
input[type=email], input[type=password] {
  width: 100%;
  padding: 13px 44px 13px 16px;
  background: rgba(0,12,80,0.4);
  border: 1px solid rgba(150,181,243,0.2);
  border-radius: 12px;
  color: #fff;
  font-family: 'Handicrafts', ui-serif, serif;
  font-size: 0.97rem;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
  -webkit-appearance: none;
}
input[type=email]::placeholder,
input[type=password]::placeholder {
  color: rgba(150,181,243,0.35);
}
input[type=email]:focus,
input[type=password]:focus {
  border-color: rgba(150,181,243,0.6);
  background: rgba(0,12,80,0.6);
  box-shadow: 0 0 0 3px rgba(150,181,243,0.12);
}

/* Button */
button[type=submit] {
  width: 100%;
  padding: 14px;
  margin-top: 8px;
  background: linear-gradient(135deg, #96b5f3 0%, #0020a5 100%);
  color: #fff;
  border: none;
  border-radius: 12px;
  font-family: 'Handicrafts', ui-serif, serif;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  letter-spacing: 0.03em;
  box-shadow: 0 8px 24px rgba(0,32,165,0.45), 0 1px 0 rgba(255,255,255,0.15) inset;
  transition: transform 0.15s, box-shadow 0.15s, filter 0.15s;
  position: relative;
  overflow: hidden;
}
button[type=submit]::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%);
  border-radius: inherit;
  pointer-events: none;
}
button[type=submit]:hover {
  filter: brightness(1.1);
  box-shadow: 0 12px 32px rgba(0,32,165,0.55), 0 1px 0 rgba(255,255,255,0.15) inset;
  transform: translateY(-1px);
}
button[type=submit]:active {
  transform: translateY(0);
  filter: brightness(0.97);
}

/* Footer note */
.footer-note {
  text-align: center;
  font-size: 0.73rem;
  color: rgba(150,181,243,0.45);
  margin-top: 22px;
  letter-spacing: 0.02em;
}
</style>
</head>
<body>

<!-- Decorative -->
<div class="geo geo-1"></div>
<div class="geo geo-2"></div>
<div class="geo geo-3"></div>
<div class="geo geo-4"></div>
<div class="geo geo-5"></div>
<div class="geo geo-6"></div>
<div class="geo geo-7"></div>

<div class="card">
  <div class="brand-top">
    <img src="/logo.png" alt="الشعار" class="brand-logo-img">
    <div class="brand-sub">لوحة التحكم</div>
  </div>

  <div class="card-inner">
    <div class="divider"></div>

    <form method="post" action="/api/login">
      <div class="field">
        <label for="email">البريد الإلكتروني</label>
        <div class="input-wrap">
          <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
          </svg>
          <input type="email" id="email" name="email" placeholder="admin@example.com" required value="${email}">
        </div>
      </div>

      <div class="field">
        <label for="password">كلمة المرور</label>
        <div class="input-wrap">
          <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          <input type="password" id="password" name="password" placeholder="••••••••" required>
        </div>
      </div>

      <button type="submit">دخول إلى لوحة التحكم</button>
    </form>

    <p class="footer-note">الوصول مقيد للمسؤولين المصرّح لهم فقط</p>
  </div>
</div>

</body>
</html>`;

    app.get("/api/login", (_req, res) => {
      if (!password) {
        return res.status(503).send(
          "<html dir='rtl'><body style='font-family:system-ui;padding:40px'><h1>إعداد مطلوب</h1><p>أضف LOCAL_ADMIN_PASSWORD إلى ملف .env للسماح بتسجيل الدخول محلياً.</p></body></html>"
        );
      }
      res.type("html").send(loginForm);
    });
    app.post("/api/login", (req, res, next) => {
      passport.authenticate("local", (err: any, user: any) => {
        if (err) return next(err);
        if (!user) {
          return res.type("html").status(401).send(
            "<html dir='rtl'><body style='font-family:system-ui;padding:40px'><h1>فشل تسجيل الدخول</h1><p>البريد أو كلمة المرور غير صحيحة.</p><a href='/api/login'>المحاولة مرة أخرى</a></body></html>"
          );
        }
        req.login(user, (e) => {
          if (e) return next(e);
          res.redirect("/");
        });
      })(req, res, next);
    });
    app.get("/api/callback", (_req, res) => res.redirect("/api/login"));
    app.get("/api/logout", (req, res) => {
      req.logout(() => res.redirect("/"));
    });
    return;
  }

  const config = await getOidcConfig();

  const verify: VerifyFunction = async (
    tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers,
    verified: passport.AuthenticateCallback
  ) => {
    const user = {};
    updateUserSession(user, tokens);
    await upsertUser(tokens.claims());
    verified(null, user);
  };

  // Keep track of registered strategies
  const registeredStrategies = new Set<string>();

  // Helper function to ensure strategy exists for a domain
  const ensureStrategy = (domain: string) => {
    const strategyName = `replitauth:${domain}`;
    if (!registeredStrategies.has(strategyName)) {
      const strategy = new Strategy(
        {
          name: strategyName,
          config,
          scope: "openid email profile offline_access",
          callbackURL: `https://${domain}/api/callback`,
        },
        verify
      );
      passport.use(strategy);
      registeredStrategies.add(strategyName);
    }
  };

  passport.serializeUser((user: Express.User, cb) => cb(null, user));
  passport.deserializeUser((user: Express.User, cb) => cb(null, user));

  app.get("/api/login", (req, res, next) => {
    ensureStrategy(req.hostname);
    passport.authenticate(`replitauth:${req.hostname}`, {
      prompt: "login consent",
      scope: ["openid", "email", "profile", "offline_access"],
    })(req, res, next);
  });

  app.get("/api/callback", (req, res, next) => {
    ensureStrategy(req.hostname);
    passport.authenticate(`replitauth:${req.hostname}`, {
      successReturnToOrRedirect: "/",
      failureRedirect: "/api/login",
    })(req, res, next);
  });

  app.get("/api/logout", (req, res) => {
    req.logout(() => {
      res.redirect(
        client.buildEndSessionUrl(config, {
          client_id: process.env.REPL_ID!,
          post_logout_redirect_uri: `${req.protocol}://${req.hostname}`,
        }).href
      );
    });
  });
}

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  const user = req.user as any;

  // Debug logs
  console.log(`[authMiddleware] Path: ${req.path}`);
  console.log(`[authMiddleware] Authenticated: ${req.isAuthenticated()}`);
  console.log(`[authMiddleware] User ID: ${user?.id || 'none'}`);
  console.log(`[authMiddleware] Session: ${req.sessionID || 'none'}`);

  if (!req.isAuthenticated()) {
    console.warn(`[authMiddleware] Unauthorized access attempt to ${req.path}`);
    return res.status(401).json({ message: "Unauthorized", debug: "Not authenticated" });
  }

  if (!user.expires_at) {
    return next();
  }

  const now = Math.floor(Date.now() / 1000);
  if (now <= user.expires_at) {
    return next();
  }

  const refreshToken = user.refresh_token;
  if (!refreshToken) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const config = await getOidcConfig();
    const tokenResponse = await client.refreshTokenGrant(config, refreshToken);
    updateUserSession(user, tokenResponse);
    return next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
};
