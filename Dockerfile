# Dockerfile

# ---------- Build stage ----------
    FROM node:20-alpine AS builder
    WORKDIR /app
    
    # Copy package files first for better layer cache
    COPY package*.json ./
    RUN npm ci

    # Copy source and build TypeScript
    COPY . .
    RUN npm run build
    
    # ---------- Runtime stage ----------
    FROM node:20-alpine AS runner
    WORKDIR /app
    ENV NODE_ENV=production
    
    # Install only production dependencies
    COPY package*.json ./
    RUN npm ci --omit=dev
    
    # Copy built output from builder
    COPY --from=builder /app/dist ./dist
    
    EXPOSE 3000

    # Run as non-root for better security
    USER node

    CMD ["node", "dist/server.js"]