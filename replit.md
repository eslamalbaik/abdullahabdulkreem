# Abdullah Abdelkarim - Visual Identity Designer Portfolio

## Overview

This is a personal portfolio and e-commerce platform for visual identity designer Abdullah Abdelkarim (عبدالله عبدالكريم). The application features a portfolio showcase, digital product shop, online courses, and ready-made brand identity packages for sale. The interface is primarily in Arabic with right-to-left (RTL) layout support.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript, using Vite as the build tool
- **Routing**: Wouter for client-side routing (lightweight alternative to React Router)
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Styling**: Tailwind CSS with shadcn/ui component library (New York style variant)
- **Animations**: Framer Motion for page transitions and micro-interactions
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ESM modules
- **API Design**: RESTful endpoints under `/api/*` prefix
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Session Management**: Express sessions with PostgreSQL store (connect-pg-simple)

### Data Storage
- **Database**: PostgreSQL via Neon Serverless (@neondatabase/serverless)
- **Schema Location**: `shared/schema.ts` contains all table definitions
- **Main Entities**:
  - `projects` - Portfolio work items
  - `products` - Shop items (templates, courses)
  - `identities` - Ready-made brand identity packages
  - `articles` - Blog/content articles
  - `contacts` - Contact form submissions
  - `users` and `sessions` - Authentication tables

### Authentication
- **Provider**: Replit Auth via OpenID Connect
- **Implementation**: Passport.js with custom Replit OIDC strategy
- **Session Storage**: PostgreSQL-backed sessions
- **Protected Routes**: Admin panel requires authentication

### Code Organization
```
client/src/          # React frontend
  ├── components/    # UI components (shadcn/ui based)
  ├── pages/         # Route components
  ├── hooks/         # Custom React hooks
  └── lib/           # Utilities and API client

server/              # Express backend
  ├── routes.ts      # API route definitions
  ├── storage.ts     # Database access layer
  └── replit_integrations/  # Auth implementation

shared/              # Shared between client/server
  ├── schema.ts      # Drizzle database schema
  └── models/        # Type definitions
```

### Build System
- Development: Vite dev server with HMR
- Production: esbuild bundles server, Vite builds client
- Output: `dist/` directory with `public/` for static assets

## External Dependencies

### Database
- **Neon PostgreSQL**: Serverless PostgreSQL database
- **Connection**: Via `DATABASE_URL` environment variable
- **Migrations**: Drizzle Kit for schema push (`npm run db:push`)

### Authentication
- **Replit Auth**: OpenID Connect provider
- **Required Environment Variables**:
  - `ISSUER_URL` - Replit OIDC issuer
  - `REPL_ID` - Replit application identifier
  - `SESSION_SECRET` - Session encryption key
  - `DATABASE_URL` - PostgreSQL connection string

### UI Components
- **shadcn/ui**: Pre-built accessible React components
- **Radix UI**: Underlying primitive components
- **Lucide React**: Icon library

### Development Tools
- **Replit Plugins**: Cartographer, dev banner, runtime error overlay (development only)
- **Custom Vite Plugin**: Meta images plugin for OpenGraph tags

## Deployment

### Production Build
```bash
npm run build    # Builds frontend and backend
npm start        # Runs production server on port 5000
```

### Output Structure
- `dist/index.js` - Bundled Node.js server
- `dist/public/` - Static frontend assets

### Railway / VPS Deployment
See `DEPLOYMENT.md` for detailed instructions on deploying to:
- Railway
- VPS with PM2 or systemd
- Docker

### Required Environment Variables
```env
DATABASE_URL=postgresql://...
SESSION_SECRET=your-secret
PORT=5000
```