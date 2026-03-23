# Phase 2: AI Gateway - Context

**Gathered:** 2026-03-22
**Status:** Ready for planning

<domain>
## Phase Boundary

Unified AI service with circuit breaker, caching, multi-provider support, and token budgeting. This phase delivers the AI Gateway that all AI-dependent features will use for consistent, reliable, and cost-controlled AI operations.

</domain>

<decisions>
## Implementation Decisions

### Claude's Discretion
All implementation choices are at Claude's discretion — pure infrastructure phase. Follow established patterns from Phase 1 (DDD layers, shared libraries structure).

**Locked from Phase 1:**
- Project structure: `@pms/shared-kernel`, `@pms/feature-*` naming
- Feature structure: `feature/{domain,application,infrastructure,presentation}` DDD layers
- Prisma location: `libs/data-access/prisma/schema.prisma`
- Error format: `{ success: false, error: { code, message, details } }`

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `libs/shared-kernel` — Core utilities, guards, interceptors, middleware
- `libs/shared-types` — Zod schemas and DTOs
- `libs/data-access/prisma` — Prisma client with RLS middleware
- `libs/data-access/tenant-context` — AsyncLocalStorage tenant context
- `libs/feature-auth` — Reference DDD structure for feature modules

### Established Patterns
- NestJS 11.1 with Fastify adapter
- Prisma 7.3 with moduleFormat: cjs
- PostgreSQL 17 with RLS
- AsyncLocalStorage for tenant context
- httpOnly cookies for session management

### Integration Points
- AI Gateway will be consumed by all AI-dependent features (financial categorization, health digest, task parsing)
- Gateway must respect tenant context for token quotas
- Logging must use existing Pino + correlation ID infrastructure

</code_context>

<specifics>
## Specific Ideas

- Follow CLAUDE.md technology stack: Groq primary, Gemini 2.0 Flash fallback
- Use free tiers: Groq, Gemini
- Target $5/month operational cost
- Design for 8 GB RAM VPS with memory tuning

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>
