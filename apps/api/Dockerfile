# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./
COPY packages/shared-kernel/package.json ./packages/shared-kernel/
COPY packages/shared-types/package.json ./packages/shared-types/
COPY packages/data-access/package.json ./packages/data-access/
COPY apps/api/package.json ./apps/api/

# Install pnpm and dependencies
RUN corepack enable pnpm && pnpm install --frozen-lockfile

# Copy source files
COPY tsconfig.base.json ./
COPY libs ./libs
COPY apps/api ./apps/api

# Build
RUN pnpm build api

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001 -G nodejs

# Copy built application
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/package.json ./

USER nestjs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/v1/health || exit 1

CMD ["node", "dist/apps/api/main.js"]
