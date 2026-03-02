# Deployment Guide - Railway / VPS / Docker

This project is a full-stack Node.js application ready for deployment.

## Prerequisites

- Node.js 20+
- MongoDB database (Atlas recommended)
- npm or yarn

## Environment Variables

Create a `.env` file or set these variables on your hosting platform:

```env
# Database
MONGODB_URI=mongodb+srv://...

# Authentication
SESSION_SECRET=your-secure-random-session-secret
JWT_SECRET=your-secure-jwt-secret
JWT_REFRESH_SECRET=your-secure-refresh-secret

# App
PORT=5000
NODE_ENV=production
```

## Build & Run

### 1. Build the project
```bash
npm install
npm run build
```
This compiles the frontend (Vite) and backend (ESbuild) into the `dist/` directory.

### 2. Run database migrations
```bash
npm run db:push
```

### 3. Start the production server
```bash
npm start
```
Or explicitly:
```bash
NODE_ENV=production node dist/index.js
```

The server will run on port 5000 (or the PORT environment variable).

## Railway Deployment

1. Connect your GitHub repository to Railway
2. Set environment variables in Railway dashboard
3. Railway will automatically detect and run:
   - Build: `npm run build`
   - Start: `npm start`

### Railway Configuration (optional railway.json)
```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE"
  }
}
```

## VPS Deployment (Ubuntu/Debian)

### Using PM2 (recommended)
```bash
# Install PM2 globally
npm install -g pm2

# Build the project
npm run build

# Start with PM2
pm2 start dist/index.js --name "abdullah-portfolio"

# Save PM2 process list
pm2 save

# Setup startup script
pm2 startup
```

### Using systemd
Create `/etc/systemd/system/portfolio.service`:
```ini
[Unit]
Description=Abdullah Portfolio
After=network.target

[Service]
Type=simple
User=your-user
WorkingDirectory=/path/to/project
Environment=NODE_ENV=production
Environment=DATABASE_URL=your-database-url
Environment=SESSION_SECRET=your-secret
ExecStart=/usr/bin/node dist/index.js
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

Then:
```bash
sudo systemctl enable portfolio
sudo systemctl start portfolio
```

## Docker Deployment (optional)

Create a `Dockerfile`:
```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY dist ./dist

ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000

CMD ["node", "dist/index.js"]
```

Build and run:
```bash
# Build the project first
npm run build

# Build Docker image
docker build -t abdullah-portfolio .

# Run container
docker run -p 5000:5000 \
  -e DATABASE_URL=your-db-url \
  -e SESSION_SECRET=your-secret \
  abdullah-portfolio
```

## Health Check

The server responds on all routes. You can use the root path `/` as a health check endpoint.

## Notes

- The frontend is served statically from `dist/public/`
- All API routes are under `/api/*` (e.g., Auth is under `/api/auth/login`)
- The server handles SPA routing (returns index.html for non-API routes)
- Make sure your database is accessible from your hosting environment

### Common Issues

- **502 Bad Gateway**: Usually means the Node.js process is not running or is crashing. Check logs with `pm2 logs`.
- **404 Not Found on Login**: Ensure you are calling `/api/auth/login`, not `/api/login`.
