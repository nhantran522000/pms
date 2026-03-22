# Phase 1: Foundation - Context

**Gathered:** 2026-03-22
**Status:** Ready for planning

<domain>
## Phase Boundary

Multi-tenant Nx monorepo with NestJS API, PostgreSQL RLS, authentication, and shared libraries. This phase delivers the foundational infrastructure that all subsequent modules build upon: project structure, database with tenant isolation, authentication flow, and development tooling.

</domain>

<decisions>
## Implementation Decisions

### Authentication UX
- Email verification required before first login (prevents typos, standard practice)
- Password strength: Zxcvbn score 3+ (user-friendly, modern approach)
- Session duration: 7 days before re-auth required (balances security/UX)
- Password reset token expiry: 1 hour (standard security window)

### API Design
- Versioning: URL path (/api/v1/) — explicit, cacheable
- Error format: `{ success: false, error: { code, message, details } }` — structured
- Pagination: Cursor-based — consistent with RLS, no offset issues
- Validation: Zod at controller boundary — shared types with frontend

### Project Structure
- App naming: `@pms/api`, `@pms/web`, `@pms/mobile` — short prefix
- Lib naming: `@pms/shared-kernel`, `@pms/feature-domain` — domain-first
- Feature structure: `feature/{domain,application,infrastructure,presentation}` — DDD layers
- Prisma location: `libs/data-access/prisma/schema.prisma` — shared access

### Development Workflow
- Database seeding: Seed script with default tenant + admin user
- Local DB: Docker Compose service — matches production
- RLS migrations: Apply RLS policies in same migration as table creation
- Config validation: Zod schema at startup — fail fast

### Claude's Discretion
- Specific implementation details for each plan within established patterns
- Exact file structure within DDD layer conventions
- Error code naming conventions
- Log format specifics

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
None — greenfield project. Starting from scratch.

### Established Patterns
- Nx 22.6 monorepo with enforced module boundaries (ESLint tags: type/domain/layer)
- NestJS 11.1 with Fastify adapter (2x faster than Express)
- PostgreSQL 17 with Row Level Security for multi-tenancy
- Prisma 7.3 with moduleFormat: cjs for NestJS compatibility
- JWT + httpOnly cookies for session management
- Pino logging with correlation ID middleware
- Docker Compose + Caddy for infrastructure
- pg-boss for job queue (no Redis)

### Integration Points
- All future modules depend on shared-kernel and shared-types
- All API endpoints require tenant context middleware for RLS
- All database queries automatically filtered by RLS policies
- Email service (Resend) integration for verification/reset emails

</code_context>

<specifics>
## Specific Ideas

- Follow CLAUDE.md technology stack decisions exactly
- Use free tiers: Groq, Gemini, Resend, Cloudflare
- Target $5/month operational cost
- Design for 8 GB RAM VPS with memory tuning

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>
