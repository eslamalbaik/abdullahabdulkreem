# Use Node.js 20 Alpine (lightweight)
FROM node:20-alpine

# Install necessary tools
RUN apk add --no-cache wget

# Set working directory
WORKDIR /app

# Copy package files first (for layer caching)
COPY package*.json ./

# Install all dependencies (needed for build)
RUN npm install

# Copy source code
COPY . .

# Build the application (frontend + backend)
RUN npm run build

# ✅ إنشاء مجلد uploads مع الصلاحيات الصحيحة
# هذا يضمن أن الـ volume يُركَّب في المكان الصحيح
RUN mkdir -p /app/uploads && chmod 755 /app/uploads

# Set production environment
ENV NODE_ENV=production
ENV PORT=5000

# Expose port
EXPOSE 5000

# ✅ Volume point - سيُستبدل بـ named volume من docker-compose
VOLUME ["/app/uploads"]

# Start the application
CMD ["node", "dist/index.js"]
