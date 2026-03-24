# Phase 7: Hobbies - Context

**Gathered:** 2026-03-24
**Status:** Ready for planning

<domain>
## Phase Boundary

Flexible hobby tracking with multiple tracking types (counter, percentage, list), goals, AI-generated insights, and progress visualization. This phase delivers the Hobbies Module that users interact with for tracking personal hobbies and interests.

</domain>

<decisions>
## Implementation Decisions

### Tracking Type Behavior
- Counter logs accept an increment amount (default +1); users can specify any positive integer per log entry
- Multiple log entries per day are allowed (no daily limit) — benefits hobbies like reading pages or practicing songs
- List entries store a string label using the log's `createdAt` timestamp
- Counters are additive only — no decrement; each session log is a positive contribution

### Progress Visualization
- Time range options: 7/30/90/365 day views — broader short-term context than health module
- Counter charts: bar chart showing per-log values plus a running total line overlay
- List progress: count of entries per day as a bar chart showing activity cadence
- Percentage charts: line chart over time showing percentage value per log entry

### Goals & Dashboard
- Target value goals only: reach X total (counter) or reach X% (percentage)
- Goal deadline is optional — users can set "by [date]" or leave open-ended
- Completion percentage formula: (current total / goal target) × 100, capped at 100%
- Dashboard shows each hobby's completion percentage toward its goal

### AI Insights
- On-demand GET endpoint — user requests insights when desired (no scheduling overhead)
- ANALYZE task type — best for trend analysis and correlations, consistent with health digest
- Insights include: progress trends, consistency streaks, goal trajectory, notable milestones

### Claude's Discretion
- Follow established DDD patterns from prior phases
- Feature module: `libs/feature-hobbies` with domain/application/infrastructure/presentation layers
- Single table for hobby logs with type discriminator (consistent with HealthLog JSONB pattern)
- Reuse AI Gateway AiGatewayService for insights generation

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `libs/shared-kernel` — Core utilities, guards, interceptors, middleware
- `libs/shared-types` — Zod schemas and DTOs
- `libs/data-access/prisma` — Prisma client with RLS middleware
- `libs/data-access/tenant-context` — AsyncLocalStorage tenant context
- `libs/shared-kernel/src/ai` — AI Gateway for insights generation
- `libs/feature-health` — Reference for single-table JSONB pattern and chart data structure
- `libs/feature-habits` — Reference for streak/frequency patterns

### Established Patterns
- NestJS 11.1 with Fastify adapter
- Prisma 7.3 with moduleFormat: cjs
- PostgreSQL 17 with RLS
- AsyncLocalStorage for tenant context
- DDD layers: domain/application/infrastructure/presentation
- Feature module naming: `@pms/feature-*`
- Single table with type discriminator + JSONB for polymorphic data (HealthLog pattern)
- Standard API response format: `{ success, data?, error? }`

### Integration Points
- All hobby records must include tenantId for RLS
- Prisma middleware handles tenant context injection
- AI Gateway provides ANALYZE task type for insights
- Chart data endpoints follow health module pattern (time range param, data points array)

</code_context>

<specifics>
## Specific Ideas

- Single `HobbyLog` table with `trackingType` discriminator and polymorphic log value
- Progress chart endpoints return data points array (consistent with health chart endpoints)
- Hobby goal stored on the Hobby entity (goalTarget + optional goalDeadline fields)
- Dashboard endpoint returns hobby list with name, trackingType, goalTarget, completionPct

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>
