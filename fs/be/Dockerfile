#  Stage 1: Build 
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files first for better layer caching
COPY package.json package-lock.json ./

# Install all dependencies (including devDependencies for build/migration)
RUN npm ci

# Copy source code
COPY . .

#  Stage 2: Production 
FROM node:22-alpine AS production

WORKDIR /app

# Add non-root user for security
RUN addgroup -g 1001 -S appgroup && \
    adduser -S appuser -u 1001 -G appgroup

# Copy package files
COPY package.json package-lock.json ./

# Install production dependencies only
RUN npm ci --omit=dev && npm cache clean --force

# Copy source code from builder
COPY --from=builder /app/src ./src
COPY --from=builder /app/migrations ./migrations

# node-pg-migrate needs to be available for runtime migrations
RUN npm install node-pg-migrate

# Change ownership to non-root user
RUN chown -R appuser:appgroup /app

USER appuser

# Expose the application port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:5000/api || exit 1

# Run migrations then start server
CMD ["sh", "-c", "npx node-pg-migrate up --envPath /dev/null && node ./src/server.js"]
