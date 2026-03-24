# Phase 07: Hobbies - Research

**Researched:** 2026-03-24
**Domain:** Hobby tracking with flexible tracking types, progress visualization, and AI-powered insights
**Confidence:** HIGH

## Summary

Phase 7 implements a flexible hobby tracking module supporting three tracking types (counter, percentage, list) with progress visualization, goal tracking, and AI-generated insights. The implementation follows established DDD patterns from prior phases (Health, Habits, Notes) using a single-table design with type discriminator and JSONB for polymorphic log data.

The key design decision from CONTEXT.md is using a single `HobbyLog` table with `trackingType` discriminator (COUNTER, PERCENTAGE, LIST) and a `logValue` JSONB column storing type-specific data. This mirrors the HealthLog pattern successfully used in Phase 5. Goals are stored directly on the Hobby entity with optional deadline, enabling dashboard completion percentage calculation without complex joins.

**Primary recommendation:** Follow the established Health module pattern for single-table polymorphic logs, reuse AI Gateway's ANALYZE task type for insights, and implement chart endpoints following the health trends controller structure.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

#### Tracking Type Behavior
- Counter logs accept an increment amount (default +1); users can specify any positive integer per log entry
- Multiple log entries per day are allowed (no daily limit) — benefits hobbies like reading pages or practicing songs
- List entries store a string label using the log's `createdAt` timestamp
- Counters are additive only — no decrement; each session log is a positive contribution

#### Progress Visualization
- Time range options: 7/30/90/365 day views — broader short-term context than health module
- Counter charts: bar chart showing per-log values plus a running total line overlay
- List progress: count of entries per day as a bar chart showing activity cadence
- Percentage charts: line chart over time showing percentage value per log entry

#### Goals & Dashboard
- Target value goals only: reach X total (counter) or reach X% (percentage)
- Goal deadline is optional — users can set "by [date]" or leave open-ended
- Completion percentage formula: (current total / goal target) × 100, capped at 100%
- Dashboard shows each hobby's completion percentage toward its goal

#### AI Insights
- On-demand GET endpoint — user requests insights when desired (no scheduling overhead)
- ANALYZE task type — best for trend analysis and correlations, consistent with health digest
- Insights include: progress trends, consistency streaks, goal trajectory, notable milestones

### Claude's Discretion
- Follow established DDD patterns from prior phases
- Feature module: `libs/feature-hobbies` with domain/application/infrastructure/presentation layers
- Single table for hobby logs with type discriminator (consistent with HealthLog JSONB pattern)
- Reuse AI Gateway AiGatewayService for insights generation

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| HOBB-01 | User can create hobbies with name, tracking type (counter, percentage, list) | DDD entity pattern with Zod validation; TrackingType enum from CONTEXT.md |
| HOBB-02 | User can log hobby progress (increment counter, set percentage, add list item) | Single HobbyLog table with polymorphic logValue JSONB; service layer validation |
| HOBB-03 | User can view hobby progress over time | HealthTrendsService pattern adapted for hobby charts; time range queries with date filtering |
| HOBB-04 | System generates hobby progress insights | AI Gateway ANALYZE task type; prompt building pattern from HealthDigestService |
| HOBB-05 | User can set hobby goals (target counter, target percentage) | Hobby entity goalTarget/goalDeadline fields; completion calculation in service layer |
| HOBB-06 | Dashboard shows hobby completion percentage | HobbyDashboardService following health dashboard pattern; aggregation and serialization |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| NestJS | 11.1.17 | Backend framework with DDD layering | Established pattern across all feature modules; dependency injection for clean architecture |
| Prisma | 7.5.0 | ORM with RLS and type safety | Tenant context middleware already implemented; moduleFormat: cjs for NestJS compatibility |
| PostgreSQL | 17 | Database with JSONB support | JSONB column for polymorphic log data; RLS for tenant isolation |
| Zod | 4.3.6 | Schema validation and DTOs | Used across all modules for request validation; type-safe API boundaries |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @pms/shared-kernel | existing | AI Gateway, utilities, guards | Reuse AiGatewayService for insights generation |
| @pms/data-access | existing | Prisma client, tenant context | AsyncLocalStorage for tenant injection |
| @pms/shared-types | existing | Shared Zod schemas and enums | Extend with HobbyTrackingType enum and hobby DTOs |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Single table with JSONB | Separate tables per tracking type | Breaks DRY, complex queries, harder to maintain; HealthLog pattern proven |
| On-demand insights | Scheduled AI digest | CONTEXT.md explicitly requires on-demand; avoids pg-boss complexity for this phase |

**Installation:**
```bash
# No new packages required — reuse existing dependencies
pnpm install
```

**Version verification:**
- NestJS 11.1.17 (verified 2026-03-24)
- Zod 4.3.6 (verified 2026-03-24)
- Prisma 7.5.0 (verified 2026-03-24)

## Architecture Patterns

### Recommended Project Structure
```
libs/feature-hobbies/
├── src/
│   ├── domain/
│   │   ├── entities/
│   │   │   ├── hobby.entity.ts          # Hobby aggregate root
│   │   │   └── hobby-log.entity.ts      # HobbyLog entity
│   │   ├── value-objects/
│   │   │   └── hobby-log-data.vo.ts     # Polymorphic log value validator
│   │   └── index.ts
│   ├── application/
│   │   ├── services/
│   │   │   ├── hobby.service.ts         # CRUD operations
│   │   │   ├── hobby-log.service.ts     # Log progress tracking
│   │   │   ├── hobby-trends.service.ts  # Chart data generation
│   │   │   ├── hobby-insights.service.ts # AI-powered insights
│   │   │   └── hobby-dashboard.service.ts # Dashboard aggregation
│   │   └── index.ts
│   ├── infrastructure/
│   │   ├── repositories/
│   │   │   ├── hobby.repository.ts
│   │   │   └── hobby-log.repository.ts
│   │   └── index.ts
│   ├── presentation/
│   │   ├── controllers/
│   │   │   ├── hobby.controller.ts
│   │   │   ├── hobby-log.controller.ts
│   │   │   ├── hobby-trends.controller.ts
│   │   │   ├── hobby-insights.controller.ts
│   │   │   └── hobby-dashboard.controller.ts
│   │   └── index.ts
│   ├── hobbies.module.ts
│   └── index.ts
```

### Pattern 1: Single Table with Type Discriminator (HealthLog Pattern)
**What:** Single `HobbyLog` table with `trackingType` enum (COUNTER, PERCENTAGE, LIST) and `logValue` JSONB column storing type-specific data.

**When to use:** Polymorphic data that shares common fields (id, tenantId, hobbyId, loggedAt) but has type-specific values. Prevents table proliferation and enables unified querying.

**Example:**
```typescript
// Prisma schema (CONTEXT.md decision)
model HobbyLog {
  id           String            @id @default(cuid())
  tenantId     String            @map("tenantId")
  hobbyId      String            @map("hobbyId")
  trackingType HobbyTrackingType
  logValue     Json              @map("logValue") // { increment: number } | { percentage: number } | { label: string }
  loggedAt     DateTime          @map("loggedAt")
  notes        String?           @db.VarChar(500)
  createdAt    DateTime          @default(now())
  updatedAt    DateTime          @updatedAt
  hobby        Hobby             @relation(fields: [hobbyId], references: [id], onDelete: Cascade)
  tenant       Tenant            @relation(fields: [tenantId], references: [id], onDelete: Cascade)

  @@index([tenantId, hobbyId, loggedAt])
  @@index([trackingType])
  @@map("hobby_logs")
}

// Entity pattern from HealthLogEntity
export class HobbyLogEntity {
  private constructor(private readonly props: HobbyLogEntityProps) {}

  static fromPrisma(log: HobbyLog): HobbyLogEntity {
    return new HobbyLogEntity({
      id: log.id,
      tenantId: log.tenantId,
      hobbyId: log.hobbyId,
      trackingType: log.trackingType,
      logValue: log.logValue as Record<string, unknown>,
      loggedAt: log.loggedAt,
      notes: log.notes,
      createdAt: log.createdAt,
      updatedAt: log.updatedAt,
    });
  }

  // Type-safe getters for logValue
  getCounterIncrement(): number | null {
    if (this.props.trackingType !== 'COUNTER') return null;
    return this.props.logValue.increment as number;
  }

  getPercentage(): number | null {
    if (this.props.trackingType !== 'PERCENTAGE') return null;
    return this.props.logValue.percentage as number;
  }

  getListLabel(): string | null {
    if (this.props.trackingType !== 'LIST') return null;
    return this.props.logValue.label as string;
  }
}
```

### Pattern 2: Chart Data Structure (HealthTrendsService Pattern)
**What:** Time-series chart endpoints return `{ type, data, startDate, endDate }` where `data` is an array of `{ x, y, date, notes }` points. No interpolation for missing days.

**When to use:** Progress visualization requiring flexible time ranges and consistent chart format across multiple metrics.

**Example:**
```typescript
// Service following HealthTrendsService pattern
export class HobbyTrendsService {
  async getTrendData(query: HobbyTrendQuery): Promise<HobbyTrendData> {
    const { startDate, endDate } = this.calculateDateRange(query);
    const logs = await this.hobbyLogRepository.findByHobbyAndDateRange(
      tenantId,
      query.hobbyId,
      startDate,
      endDate,
    );

    // Transform to chart format based on tracking type
    const data = this.transformToTrendData(hobby, logs);

    return { type: hobby.trackingType, data, startDate, endDate };
  }

  private transformToTrendData(hobby: HobbyEntity, logs: HobbyLogEntity[]): TrendDataPoint[] {
    switch (hobby.trackingType) {
      case 'COUNTER':
        // Bar chart: per-log increment values + running total line overlay
        return this.buildCounterChartData(hobby, logs);
      case 'PERCENTAGE':
        // Line chart: percentage values over time
        return logs.map(log => ({
          x: log.loggedAt.getTime(),
          y: log.getPercentage()!,
          date: log.loggedAt,
          notes: log.notes,
        }));
      case 'LIST':
        // Bar chart: count of entries per day
        return this.buildListActivityChartData(logs);
    }
  }
}
```

### Pattern 3: AI Insights Generation (HealthDigestService Pattern)
**What:** On-demand AI insights using ANALYZE task type, gathering domain-specific data, building structured prompt, parsing JSON response, falling back to data-only summary on failure.

**When to use:** Generating qualitative insights from quantitative data; consistent with health digest approach.

**Example:**
```typescript
// Service following HealthDigestService pattern
export class HobbyInsightsService {
  async generateInsights(tenantId: string, hobbyId: string): Promise<HobbyInsights> {
    const hobby = await this.hobbyRepository.findById(tenantId, hobbyId);
    const logs = await this.hobbyLogRepository.findByHobby(tenantId, hobbyId);

    try {
      const aiInsights = await this.generateAiInsights(hobby, logs);
      if (aiInsights) return aiInsights;
    } catch (error) {
      this.logger.warn(`AI insights failed: ${error}. Falling back to data-only.`);
    }

    return this.createDataOnlyInsights(hobby, logs);
  }

  private async generateAiInsights(hobby: HobbyEntity, logs: HobbyLogEntity[]): Promise<HobbyInsights | null> {
    const prompt = this.buildInsightsPrompt(hobby, logs);

    const response = await this.aiGateway.execute({
      taskType: 'ANALYZE',
      prompt,
      context: { hobbyName: hobby.name, trackingType: hobby.trackingType },
    });

    if (!response.success || !response.result) return null;

    const result = response.result as Record<string, unknown>;
    return {
      summary: result.summary as string,
      trends: result.trends as string[],
      consistencyStreaks: result.streaks as string[],
      goalTrajectory: result.trajectory as string[],
      milestones: result.milestones as string[],
      generatedAt: new Date(),
      isDataOnly: false,
    };
  }
}
```

### Anti-Patterns to Avoid
- **Separate CounterLog/PercentageLog/ListLog tables:** Unnecessary complexity; proven HealthLog pattern works well
- **Calculated currentTotal field:** Always compute from logs; derived data leads to inconsistency
- **Scheduled AI insights:** CONTEXT.md explicitly requires on-demand; avoids pg-boss dependency
- **Goal deadline validation enforcing future dates:** Users may want to set retrospective goals
- **Missing 0% completion baseline:** Dashboard must show 0% when no goal target set (not null)

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Tenant context injection | Custom middleware | @pms/data-access AsyncLocalStorage | Already integrated with Prisma RLS |
| AI provider selection | Direct Groq/Gemini calls | AiGatewayService | Circuit breaker, caching, quota tracking built-in |
| Request validation | Custom validators | Zod schemas + ZodValidationPipe | Type-safe, consistent across modules |
| Date range calculations | Manual date math | Follow HealthTrendsService pattern | Proven logic for 7/30/90/365 day ranges |
| JSON response formatting | Inline transformations | Standard `{ success, data, error }` format | Consistent API contract |

**Key insight:** The project has established patterns for tenant isolation, AI operations, and API responses. Building custom versions creates technical debt and breaks developer expectations.

## Runtime State Inventory

> Not applicable — greenfield phase with no rename/refactor operations.

## Common Pitfalls

### Pitfall 1: Counter Goal Completion Calculation
**What goes wrong:** Using `SUM(increment)` for current total ignores that counters are additive only; users may log multiple times per day.

**Why it happens:** Simple aggregation assumes daily single-entry pattern like habits, but CONTEXT.md explicitly allows multiple counter logs per day.

**How to avoid:** Always compute `currentTotal = SUM(logValue.increment)` across all logs; never assume daily limits or use last value.

**Warning signs:** Dashboard completion exceeds 100% despite not reaching goal; user confusion about progress.

### Pitfall 2: Running Total Chart Line Overlay
**What goes wrong:** Bar chart shows per-log increments but missing running total line overlay requested in CONTEXT.md.

**Why it happens:** Implementing simple bar chart without dual-series (bars + line) visualization requirement.

**How to avoid:** Chart data endpoint returns two series: `{ bars: TrendDataPoint[], line: TrendDataPoint[] }` where line contains cumulative sum.

**Warning signs:** Frontend requests missing cumulative data; charts show only per-log values without progress context.

### Pitfall 3: List Activity Cadence Aggregation
**What goes wrong:** Returning individual list entries instead of count per day for chart data.

**Why it happens:** Treating list logs like counter/percentage with per-entry points, missing CONTEXT.md requirement for "count of entries per day as a bar chart showing activity cadence."

**How to avoid:** Aggregate logs by `DATE(loggedAt)`, return `{ x: date.getTime(), y: count, date }` points.

**Warning signs:** Chart shows sparse data points instead of daily activity bars; difficult to see engagement patterns.

### Pitfall 4: Goal Target Type Mismatch
**What goes wrong:** Allowing percentage goals for counter hobbies or counter goals for list hobbies.

**Why it happens:** Weak Zod validation on goalTarget field allowing any number regardless of trackingType.

**How to avoid:** Discriminated union in schema: `goalTarget: z.number().optional()` validated based on `trackingType` (percentage goals only for PERCENTAGE type, counter goals only for COUNTER type).

**Warning signs:** Completion percentage calculations produce nonsensical results (e.g., 5000% for counter goal on list hobby).

### Pitfall 5: Insights Fallback Silent Failure
**What goes wrong:** AI insights fail silently, returning empty response instead of data-only fallback.

**Why it happens:** Missing try/catch around AI calls or not implementing fallback pattern from HealthDigestService.

**How to avoid:** Always wrap AI calls in try/catch; return `{ isDataOnly: true, ...basicStats }` on failure; never return null.

**Warning signs:** Insights endpoint throws 500 errors; users see blank insights section.

## Code Examples

Verified patterns from official sources:

### HobbyLog Repository Query with Date Range
```typescript
// Source: libs/feature-health/src/infrastructure/repositories/health-log.repository.ts (reference pattern)
async findByHobbyAndDateRange(
  tenantId: string,
  hobbyId: string,
  startDate: Date,
  endDate: Date,
): Promise<HobbyLogEntity[]> {
  const logs = await this.prisma.hobbyLog.findMany({
    where: {
      tenantId,
      hobbyId,
      loggedAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    orderBy: {
      loggedAt: 'asc',
    },
  });

  return logs.map((log) => HobbyLogEntity.fromPrisma(log));
}
```

### Completion Percentage Calculation with Goal Target
```typescript
// Source: CONTEXT.md decision + decimal.js pattern from financial module
import Decimal from 'decimal.js';

function calculateCompletionPercentage(currentTotal: number, goalTarget: number | null): number {
  if (!goalTarget || goalTarget <= 0) {
    return 0; // No goal set or invalid goal
  }

  const current = new Decimal(currentTotal);
  const target = new Decimal(goalTarget);
  const percentage = current.div(target).times(100);

  // Cap at 100% as per CONTEXT.md
  return Math.min(percentage.toNumber(), 100);
}
```

### List Activity Cadence Aggregation
```typescript
// Source: CONTEXT.md requirement for "count of entries per day"
function buildListActivityChartData(logs: HobbyLogEntity[]): TrendDataPoint[] {
  // Group by date
  const byDate = new Map<string, number>();

  logs.forEach((log) => {
    const dateKey = log.loggedAt.toISOString().split('T')[0];
    byDate.set(dateKey, (byDate.get(dateKey) || 0) + 1);
  });

  // Convert to chart points
  return Array.from(byDate.entries()).map(([dateStr, count]) => {
    const date = new Date(dateStr);
    return {
      x: date.getTime(),
      y: count,
      date,
      notes: null, // Aggregated data has no individual notes
    };
  });
}
```

### Counter Running Total Calculation
```typescript
// Source: CONTEXT.md requirement for "running total line overlay"
function buildCounterChartData(hobby: HobbyEntity, logs: HobbyLogEntity[]): {
  bars: TrendDataPoint[];
  line: TrendDataPoint[];
} {
  let runningTotal = 0;

  const bars = logs.map((log) => {
    const increment = log.getCounterIncrement()!;
    return {
      x: log.loggedAt.getTime(),
      y: increment,
      date: log.loggedAt,
      notes: log.notes,
    };
  });

  const line: TrendDataPoint[] = [];
  bars.forEach((bar) => {
    runningTotal += bar.y;
    line.push({
      x: bar.x,
      y: runningTotal,
      date: bar.date,
      notes: bar.notes,
    });
  });

  return { bars, line };
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Separate tables per metric type | Single table with JSONB | Phase 5 (Health) | Reduced schema complexity, unified queries |
| Scheduled AI digests | On-demand insights | Phase 7 decision | Lower operational overhead, user-controlled |
| Multiple ORM models | Single domain entity | Phase 1 | Aligns with DDD aggregates, reduces mapping |

**Deprecated/outdated:**
- Manual tenant filtering in queries: RLS policies handle this automatically at database level
- Direct Groq SDK calls: AiGatewayService abstraction required for quota tracking and circuit breaking

## Open Questions

1. **List hobby goal semantics**
   - What we know: CONTEXT.md specifies target counter and target percentage goals
   - What's unclear: List hobbies don't have numeric values; what does a "goal" mean for list tracking?
   - Recommendation: List goals could be "add X items per month" or left as not applicable; defer to planner discretion

2. **Chart data granularity for counter running total**
   - What we know: CONTEXT.md requires bar chart (per-log) + running total line overlay
   - What's unclear: Should running total be interpolated to daily points or only at log timestamps?
   - Recommendation: Keep running total points at log timestamps only; no interpolation matches health module pattern

## Environment Availability

> Step 2.6: SKIPPED (no external dependencies identified)

Phase 7 uses only existing project dependencies (NestJS, Prisma, Zod, AI Gateway). No new tools, services, or runtimes required.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest (existing from Phase 1) |
| Config file | nx集成 - uses @nx/js plugin configuration |
| Quick run command | `pnpm nx test feature-hobbies` |
| Full suite command | `pnpm nx run-many --target=test --all` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| HOBB-01 | Create hobby with tracking type | unit | `pnpm nx test feature-hobbies -- --testNamePattern="create hobby"` | ❌ Wave 0 |
| HOBB-02 | Log progress per tracking type | unit | `pnpm nx test feature-hobbies -- --testNamePattern="log progress"` | ❌ Wave 0 |
| HOBB-02 | Counter logs are additive only | unit | `pnpm nx test feature-hobbies -- --testNamePattern="counter additive"` | ❌ Wave 0 |
| HOBB-03 | Chart data returns correct structure | unit | `pnpm nx test feature-hobbies -- --testNamePattern="chart data"` | ❌ Wave 0 |
| HOBB-04 | AI insights generation | integration | `pnpm nx test feature-hobbies -- --testNamePattern="insights"` | ❌ Wave 0 |
| HOBB-04 | Insights fallback on AI failure | unit | `pnpm nx test feature-hobbies -- --testNamePattern="insights fallback"` | ❌ Wave 0 |
| HOBB-05 | Goal target completion percentage | unit | `pnpm nx test feature-hobbies -- --testNamePattern="completion percentage"` | ❌ Wave 0 |
| HOBB-06 | Dashboard aggregates all hobbies | integration | `pnpm nx test feature-hobbies -- --testNamePattern="dashboard"` | ❌ Wave 0 |

### Sampling Rate
- **Per task commit:** `pnpm nx test feature-hobbies`
- **Per wave merge:** `pnpm nx run-many --target=test --all`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- `libs/feature-hobbies/src/domain/entities/hobby.entity.spec.ts` — Hobby entity creation and validation
- `libs/feature-hobbies/src/domain/entities/hobby-log.entity.spec.ts` — HobbyLog entity polymorphic log value
- `libs/feature-hobbies/src/application/services/hobby.service.spec.ts` — CRUD operations, goal completion calculation
- `libs/feature-hobbies/src/application/services/hobby-trends.service.spec.ts` — Chart data transformation per tracking type
- `libs/feature-hobbies/src/application/services/hobby-insights.service.spec.ts` — AI insights generation and fallback
- `libs/feature-hobbies/test/fixtures/hobby.fixtures.ts` — Test data factories for hobbies and logs
- Framework install: Already installed (Vitest from Phase 1) — if none detected, add to devDependencies: `pnpm add -D vitest @vitest/ui`

## Sources

### Primary (HIGH confidence)
- CONTEXT.md (Phase 7 decisions) — User-locked decisions on tracking types, visualization, goals, AI insights
- STATE.md (Project decisions and history) — Established patterns from Phases 1-6
- REQUIREMENTS.md — HOBB-01 through HOBB-06 requirement specifications
- /Users/nhan/Developer/my-projects/pms/libs/feature-health — Reference implementation for single-table JSONB pattern, chart data structure, AI insights
- /Users/nhan/Developer/my-projects/pms/libs/feature-habits — Reference implementation for streak calculation, completion tracking
- /Users/nhan/Developer/my-projects/pms/libs/shared-kernel/src/ai/ai-gateway.service.ts — AI Gateway service with ANALYZE task type

### Secondary (MEDIUM confidence)
- NestJS 11.1.17 documentation (verified via npm) — Module structure, dependency injection
- Zod 4.3.6 documentation (verified via npm) — Schema validation patterns
- Prisma 7.5.0 documentation (verified via npm) — JSONB queries, date filtering

### Tertiary (LOW confidence)
- Data visualization best practices — Chart type selection (bar/line) from established UI/UX principles; no specific source verified

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All versions verified via npm, existing project dependencies
- Architecture: HIGH - Directly references existing codebase patterns from Phase 5 (Health) and Phase 4 (Habits)
- Pitfalls: HIGH - Derived from CONTEXT.md constraints and proven health module implementation
- Data visualization: MEDIUM - Chart requirements specified in CONTEXT.md but UI implementation deferred to Phase 9 (web client)

**Research date:** 2026-03-24
**Valid until:** 2026-04-23 (30 days - stable dependencies and established patterns)
