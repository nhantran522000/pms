# Phase 4: Habits & Tasks - Context

**Gathered:** 2026-03-22
**Status:** Ready for planning

<domain>
## Phase Boundary

Habit tracking with streaks, RPG gamification, and task management with natural language parsing. This phase delivers the Habits and Tasks modules that users interact with for personal productivity management.

</domain>

<decisions>
## Implementation Decisions

### Claude's Discretion
All implementation choices are at Claude's discretion — follow established patterns from Phase 1 (DDD layers, shared libraries structure), Phase 2 (AI Gateway integration), and Phase 3 (Financial Module hexagonal architecture).

**Locked from Phase 1:**
- Project structure: `@pms/shared-kernel`, `@pms/feature-*` naming
- Feature structure: `feature/{domain,application,infrastructure,presentation}` DDD layers
- Prisma location: `libs/data-access/prisma/schema.prisma`
- Error format: `{ success: false, error: { code, message, details } }`

**Locked from Phase 2:**
- AI Gateway: Use `AiGatewayService.execute()` for natural language parsing
- Task types: Use `EXTRACT` task type for parsing tasks from natural language
- Token budgeting: Respect per-tenant quotas

**Locked from Phase 3:**
- Hexagonal architecture pattern for domain purity
- Repository pattern for data access
- Value objects for domain concepts (streaks, XP, levels)
- Automatic calculations in service layer

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `libs/shared-kernel` — Core utilities, guards, interceptors, middleware
- `libs/shared-types` — Zod schemas and DTOs
- `libs/data-access/prisma` — Prisma client with RLS middleware
- `libs/data-access/tenant-context` — AsyncLocalStorage tenant context
- `libs/shared-kernel/src/ai` — AI Gateway with all providers and services
- `libs/feature-financial` — Reference implementation of hexagonal architecture

### Established Patterns
- NestJS 11.1 with Fastify adapter
- Prisma 7.3 with moduleFormat: cjs
- PostgreSQL 17 with RLS
- AsyncLocalStorage for tenant context
- httpOnly cookies for session management
- DDD layers: domain/application/infrastructure/presentation
- Money value object pattern for precise calculations

### Integration Points
- Task natural language parsing uses AI Gateway EXTRACT task type
- XP and level calculations follow gamification patterns
- Streak calculation based on habit completion history

</code_context>

<specifics>
## Specific Ideas

- Use cron expression parsing for habit frequency
- XP: 10 per completion, level up every 100 XP
- Achievement milestones: 7, 30, 100 day streaks
- Natural language task parsing: extract title, due date, tags
- Subtasks as self-referential relation or JSON array
- Overdue highlighting via date comparison in queries

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>
