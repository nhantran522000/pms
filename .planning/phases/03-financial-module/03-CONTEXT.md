# Phase 3: Financial Module - Context

**Gathered:** 2026-03-22
**Status:** Ready for planning

<domain>
## Phase Boundary

Complete financial tracking with transactions, categories, accounts, envelope budgets, recurring rules, and AI categorization. This phase delivers the Financial Module that users interact with for personal finance management.

</domain>

<decisions>
## Implementation Decisions

### Claude's Discretion
All implementation choices are at Claude's discretion — follow established patterns from Phase 1 (DDD layers, shared libraries structure) and Phase 2 (AI Gateway integration).

**Locked from Phase 1:**
- Project structure: `@pms/shared-kernel`, `@pms/feature-*` naming
- Feature structure: `feature/{domain,application,infrastructure,presentation}` DDD layers
- Prisma location: `libs/data-access/prisma/schema.prisma`
- Error format: `{ success: false, error: { code, message, details } }`

**Locked from Phase 2:**
- AI Gateway: Use `AiGatewayService.execute()` for AI categorization
- Task types: Use `CLASSIFY` task type for transaction categorization
- Token budgeting: Respect per-tenant quotas

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `libs/shared-kernel` — Core utilities, guards, interceptors, middleware
- `libs/shared-types` — Zod schemas and DTOs
- `libs/data-access/prisma` — Prisma client with RLS middleware
- `libs/data-access/tenant-context` — AsyncLocalStorage tenant context
- `libs/shared-kernel/src/ai` — AI Gateway with all providers and services

### Established Patterns
- NestJS 11.1 with Fastify adapter
- Prisma 7.3 with moduleFormat: cjs
- PostgreSQL 17 with RLS
- AsyncLocalStorage for tenant context
- httpOnly cookies for session management
- DDD layers: domain/application/infrastructure/presentation

### Integration Points
- Financial transactions use AI Gateway for auto-categorization (CLASSIFY task type)
- Recurring transactions will use pg-boss for scheduling
- All data must include tenantId for RLS

</code_context>

<specifics>
## Specific Ideas

- Follow hexagonal architecture pattern for domain purity
- Use decimal.js or similar for precise money calculations
- Implement soft deletes for transactions (audit trail)
- Cache category hierarchies for performance
- Use database transactions for balance updates

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>
