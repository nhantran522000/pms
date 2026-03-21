# Stack Research: PMS Ecosystem

**Researched:** 2026-03-21
**Confidence:** HIGH (based on official documentation and project spec)

## Executive Summary

This stack is optimized for a **single-developer, low-cost ($5/mo), full-stack SaaS** with AI features. The key constraint is the 8 GB RAM VPS, which eliminates Redis and requires aggressive memory tuning. The Nx monorepo enables code sharing across web, mobile, and desktop while enforcing module boundaries.

---

## Core Stack

### Monorepo & Build

| Layer | Technology | Version | Rationale |
|-------|------------|---------|-----------|
| Monorepo | Nx | 22.6 | Affected builds, module boundary lint, project graph visualization |
| Package Manager | pnpm | 9.x | Disk efficient, fast installs, workspace support |

**Nx Configuration:**
- Use `@nx/enforce-module-boundaries` with tags: `type:app|lib`, `domain:financial|habits|health|notes|hobbies|shared`, `layer:domain|application|infrastructure|presentation`
- Enable distributed caching with Nx Cloud (free for small teams)

**Confidence:** HIGH — Nx is the standard for TypeScript monorepos in 2025

---

### API Layer

| Layer | Technology | Version | Rationale |
|-------|------------|---------|-----------|
| Framework | NestJS | 11.1 | Modular DI, guards, interceptors, TypeScript-first |
| HTTP Adapter | Fastify | 5.x | 2x faster than Express, lower memory footprint |
| Validation | Zod | 3.24 | Runtime validation, type inference, shared with frontend |
| Serialization | class-transformer | 0.5 | DTO transformation, response filtering |

**Key NestJS Packages:**
- `@nestjs/config` — Typed configuration with Zod validation
- `@nestjs/event-emitter` — EventEmitter2 for domain events
- `@nestjs/jwt` — JWT authentication (no Passport needed for simple auth)
- `@nestjs/throttler` — Rate limiting
- `nestjs-pino` — Fast structured logging

**Avoid:**
- Express adapter — 2x slower, higher memory
- Passport — Overkill for single-tenant auth; use JWT + cookies directly

**Confidence:** HIGH — NestJS + Fastify is the recommended combo per NestJS docs

---

### Database Layer

| Layer | Technology | Version | Rationale |
|-------|------------|---------|-----------|
| Database | PostgreSQL | 17 | RLS for multi-tenancy, JSONB for flexible logs, full-text search |
| ORM | Prisma | 7.3 | Type-safe queries, migrations, Zod integration |
| Job Queue | pg-boss | 10 | PostgreSQL-backed, no Redis needed, runs in-process |

**PostgreSQL Configuration (8 GB VPS):**
```env
POSTGRES_SHARED_BUFFERS=1GB
POSTGRES_WORK_MEM=16MB
POSTGRES_MAINTENANCE_WORK_MEM=256MB
POSTGRES_EFFECTIVE_CACHE_SIZE=3GB
POSTGRES_MAX_CONNECTIONS=20
```

**Prisma Configuration:**
```prisma
generator client {
  provider        = "prisma-client-js"
  moduleFormat    = "cjs"  // Required for NestJS
  previewFeatures = ["fullTextSearch"]
}
```

**Schema Patterns:**
- All tables include `tenantId String` with RLS policy
- Use `Json` type for flexible logs (workouts, health metrics)
- Use `@@index` for full-text search columns

**Avoid:**
- TypeORM — Less type-safe, migration issues
- MikroORM — Smaller community, more config
- Redis — Adds ~100MB RAM, pg-boss handles queue needs

**Confidence:** HIGH — PostgreSQL 17 + Prisma 7 is the current standard

---

### Frontend Stack

#### Web (Next.js)

| Layer | Technology | Version | Rationale |
|-------|------------|---------|-----------|
| Framework | Next.js | 16.2 | Static export, Turbopack, React 19.2 |
| React | React | 19.2 | Server Components for dashboard, client for interactivity |
| Styling | Tailwind CSS | 4.x | Utility-first, small bundle size |
| Components | shadcn/ui | latest | Accessible, customizable, Radix primitives |
| State | TanStack Query | 5.x | Server state, caching, optimistic updates |
| Forms | React Hook Form | 7.x | Performance, Zod integration |
| Charts | Recharts | 2.x | Simple, composable, React-native |

**Next.js Configuration:**
```js
// next.config.js
export default {
  output: 'export',  // Static site generation
  images: { unoptimized: true },  // Required for static export
  turbopack: true,  // Faster dev builds
}
```

**Avoid:**
- SSR server process — Adds RAM overhead, static export is sufficient
- Redux/Zustand — TanStack Query handles most state needs
- Material UI — Large bundle size, harder to customize

**Confidence:** HIGH — Next.js static export is ideal for low-cost hosting

---

#### Mobile (Expo)

| Layer | Technology | Version | Rationale |
|-------|------------|---------|-----------|
| Framework | Expo | SDK 55 | OTA updates, managed workflow, React Native 0.83 |
| Styling | NativeWind | 4.x | Tailwind for React Native |
| Navigation | Expo Router | 4.x | File-based routing, deep linking |
| State | TanStack Query | 5.x | Same as web, shared hooks |

**Key Expo Packages:**
- `expo-notifications` — Local and push notifications
- `expo-secure-store` — Secure credential storage
- `expo-updates` — OTA updates without app store review

**Avoid:**
- Bare React Native — Lose OTA updates, more complex builds
- Styled Components — NativeWind is faster, smaller

**Confidence:** HIGH — Expo SDK 55 is current as of March 2026

---

#### Desktop (Tauri)

| Layer | Technology | Version | Rationale |
|-------|------------|---------|-----------|
| Framework | Tauri | 2.x | 10x smaller than Electron, Rust backend |
| Bundler | Vite | 6.x | Fast HMR, ES modules |
| UI | React | 19.2 | Wraps static Next.js build |

**Tauri Advantages:**
- ~10 MB binary vs ~150 MB for Electron
- Native OS integration (menus, tray, notifications)
- Secure by default (CSP enforced)

**Avoid:**
- Electron — Large binary, high memory usage
- Neutralino — Smaller community, fewer features

**Confidence:** HIGH — Tauri 2 is mature for production desktop apps

---

### AI Integration

| Layer | Technology | Version | Rationale |
|-------|------------|---------|-----------|
| Primary Provider | Groq | API | Free tier ~1M tokens/day, Llama 3.3 70B |
| Fallback Provider | Gemini | 2.0 Flash | Free tier 1M tokens/day, 1500 req/day |
| HTTP Client | native fetch | — | Streaming support, no extra dependency |

**Task Type → Model Mapping:**
| Task | Max Tokens | Primary | Fallback |
|------|------------|---------|----------|
| CLASSIFY | 50 | Groq / gemma2-9b-it | Gemini 2.0 Flash |
| LABEL | 80 | Groq / gemma2-9b-it | Gemini 2.0 Flash |
| SUMMARIZE | 400 | Groq / llama-3.3-70b-versatile | Gemini 2.0 Flash |
| ANALYZE | 800 | Groq / llama-3.3-70b-versatile | Together AI |
| EXTRACT | 500 | Gemini 2.0 Flash (JSON mode) | Groq / llama-3.3-70b-versatile |
| CHAT | 600 | Gemini 2.0 Flash | Groq / llama-3.3-70b-versatile |

**Avoid:**
- OpenAI GPT-4 — Expensive, hits budget quickly
- LangChain — Abstraction overhead, direct API calls are simpler
- Anthropic Claude — Reserve for Phase 3+ enterprise demand

**Confidence:** MEDIUM — Free tier limits may change; monitor usage

---

### Infrastructure

| Layer | Technology | Cost | Rationale |
|-------|------------|------|-----------|
| VPS | Contabo VPS 10 | $4.95/mo | 4 vCPU, 8 GB RAM, 150 GB SSD |
| Reverse Proxy | Caddy | Free | Automatic HTTPS, on-demand TLS for white-label |
| Containers | Docker Compose v2 | Free | Single-server orchestration |
| CDN/DDoS | Cloudflare | Free | Static asset caching, hides VPS IP |
| Push (web/desktop) | ntfy.sh self-hosted | Free | Go binary ~30 MB RAM |
| Push (mobile) | Expo Push | Free | Wraps APNs + FCM |
| Email | Resend | Free (3k/mo) | React email templates |
| Payments | LemonSqueezy | 5% + $0.50 | Merchant of record, handles VAT |
| Backup | rclone + Google Drive | Free | 15 GB free tier |

**Docker Services:**
```yaml
services:
  caddy:
    image: caddy:latest
    ports: ["80:80", "443:443"]

  api:
    build: ./apps/api
    environment:
      NODE_OPTIONS: "--max-old-space-size=1536"  # 1.5 GB heap limit

  postgres:
    image: postgres:17-alpine
    environment:
      POSTGRES_SHARED_BUFFERS: 1GB

  ntfy:
    image: binwiederhier/ntfy
    command: serve
```

**Avoid:**
- Nginx — Manual cert management, no on-demand TLS
- Redis — Adds RAM overhead, pg-boss sufficient
- AWS/GCP — Costs escalate quickly, Contabo is predictable

**Confidence:** HIGH — This stack is optimized for the $5/mo constraint

---

### Development Tools

| Tool | Purpose |
|------|---------|
| ESLint + typescript-eslint | Linting, type-aware rules |
| Prettier | Code formatting |
| Husky + lint-staged | Pre-commit hooks |
| Vitest | Unit testing (faster than Jest) |
| Playwright | E2E testing |
| TypeScript | Type safety across monorepo |

**Testing Stack:**
- Unit: Vitest + Testing Library
- Integration: Supertest + test PostgreSQL container
- E2E: Playwright for web, Detox for mobile

---

## Shared Libraries Structure

```
libs/
├── shared-kernel/        # Domain events, AI gateway, config, observability
│   ├── domain/           # BaseEntity, DomainEvent, ValueObject
│   ├── events/           # All event type definitions
│   ├── ai/               # AiGateway, task types, circuit breaker
│   ├── config/           # @nestjs/config factories
│   └── observability/    # Pino logger, correlation ID
│
├── shared-types/         # Zod schemas + inferred TS types
│
├── data-access/          # TanStack Query hooks + Axios client
│
├── ui-web/               # shadcn/ui + Tailwind components
│
├── ui-mobile/            # NativeWind React Native components
│
├── email-templates/      # React Email templates
│
└── modules/              # Feature modules (hexagonal)
    ├── financial/
    ├── habits/
    ├── health/
    ├── notes/
    └── hobbies/
```

---

## Version Verification Commands

Run these before starting development:

```bash
npm show nx version           # Should be 22.x
npm show @nestjs/core version # Should be 11.x
npm show prisma version       # Should be 7.x
npm show next version         # Should be 16.x
npm show expo version         # Should be SDK 55
```

---

## Anti-Patterns to Avoid

| Anti-Pattern | Why Avoid | Alternative |
|--------------|-----------|-------------|
| Express adapter | 2x slower than Fastify | Use Fastify adapter |
| Redis for queues | Adds RAM overhead | Use pg-boss |
| SSR server process | RAM overhead, complexity | Static export |
| TypeORM | Less type-safe than Prisma | Use Prisma |
| Redux for state | Overkill with TanStack Query | TanStack Query only |
| Electron | 150 MB binary | Tauri (10 MB) |
| OpenAI primary | Expensive | Groq + Gemini free tiers |
| Nginx | Manual cert management | Caddy auto-HTTPS |
| LangChain | Abstraction overhead | Direct API calls |

---

## Confidence Summary

| Area | Confidence | Reason |
|------|------------|--------|
| Monorepo (Nx) | HIGH | Industry standard, well-documented |
| API (NestJS + Fastify) | HIGH | Official NestJS recommendation |
| Database (PostgreSQL + Prisma) | HIGH | Current best practice |
| Frontend (Next.js) | HIGH | Static export is proven |
| Mobile (Expo) | HIGH | SDK 55 is current |
| Desktop (Tauri) | HIGH | Tauri 2 is production-ready |
| AI (Groq + Gemini) | MEDIUM | Free tier limits may change |
| Infrastructure | HIGH | Optimized for $5/mo constraint |

---

## Next Steps

1. Initialize Nx workspace with `npx create-nx-workspace@latest`
2. Configure module boundary tags in `nx.json`
3. Set up shared libraries structure
4. Begin Phase 1: Foundation
