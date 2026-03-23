# Phase 5: Health Module - Research

**Researched:** 2026-03-23
**Domain:** Health tracking with AI-powered insights and email delivery
**Confidence:** HIGH

## Summary

This phase implements a comprehensive health tracking module with weight, vitals, sleep, and workout logging, AI-generated weekly digest, and email delivery via Resend. The module follows the established hexagonal architecture pattern from Financial and Habits modules, using a single-table design with type discriminator for flexibility.

**Primary recommendation:** Use the established patterns from FinancialModule (hexagonal architecture, Prisma with RLS, repository pattern) and extend with Resend integration for email delivery and pg-boss for weekly digest scheduling.

<user_constraints>

## User Constraints (from CONTEXT.md)

### Locked Decisions

**Data Model Design:**
- Single `HealthLog` table with `type` field (weight, blood_pressure, heart_rate, sleep, workout)
- Single JSONB `data` column for metric-specific fields
- User-provided `logged_at` timestamp (separate from system `createdAt`)
- Soft delete only (`deletedAt` timestamp)
- Single `source` field (manual, apple_health, fitbit, etc.)
- Reference ranges stored in code, not database

**Trend Visualization:**
- Chart Library: Recharts
- Time Ranges: 30/90/365 days + custom range
- Data Display: Daily values with gaps (no interpolation)
- Chart Layout: Separate charts per metric (no combined/overlay)
- Rendering: Data points only, no connecting lines
- Goal Display: None on charts
- Interactions: Tooltip on hover, click to expand, download CSV/JSON, export PNG

**AI Digest Format:**
- Content: Trend analysis, cross-metric correlations, notable changes, recommendations
- Tone: Supportive/friendly
- Length: Medium (5-7 paragraphs)
- Personalization: All elements (greeting, historical comparison, goal progress, achievements)
- Schedule: Fixed Sunday delivery (user cannot change)
- Minimum Data: Always send even with sparse data
- AI Task Type: ANALYZE
- Failure Handling: Send data-only digest if AI fails

**Email Integration:**
- Provider: Resend
- Templates: React Email templates with `@react-email/components`
- Unsubscribe: One-click link in footer
- Failure Handling: Retry 3x with exponential backoff

### Claude's Discretion

None - all decisions locked in CONTEXT.md.

### Deferred Ideas (OUT OF SCOPE)

- Health device integrations (Apple Health, Fitbit)
- Nutrition/calorie tracking
- Medication tracking
- Doctor appointment scheduling
- Health data sharing with providers
- Custom health metric types

</user_constraints>

<phase_requirements>

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| HLTH-01 | User can log weight with date and optional notes | HealthLog model with WEIGHT type, JSONB data field |
| HLTH-02 | User can view weight trend chart (30/90/365 day views) | Recharts ScatterChart for points-only display |
| HLTH-03 | User can log vitals (blood pressure, heart rate) as JSONB | HealthLog model with BLOOD_PRESSURE/HEART_RATE types |
| HLTH-04 | User can log sleep duration and quality | HealthLog model with SLEEP type |
| HLTH-05 | User can log workouts with type, duration, intensity (JSONB) | HealthLog model with WORKOUT type |
| HLTH-06 | System generates weekly health digest via AI | AiGatewayService with ANALYZE task type |
| HLTH-07 | Health digest sent via email (Resend) every Sunday | Resend + React Email + pg-boss scheduling |
| HLTH-08 | Dashboard shows health metrics summary with trends | Aggregation endpoints with trend calculation |

</phase_requirements>

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| @nestjs/common | ^11.1.17 | Framework | Existing project standard |
| @prisma/client | ^7.5.0 | ORM | Existing project with RLS patterns |
| zod | ^4.3.6 | Validation | Existing project standard |
| pg-boss | ^12.14.0 | Job scheduling | Existing pattern from Financial module |
| resend | ^6.9.4 | Email delivery | Locked decision - modern API-first service |
| @react-email/components | ^1.0.10 | Email templates | Locked decision - type-safe React templates |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| recharts | ^3.8.0 | Charts (frontend) | Phase 9 Web Client - ScatterChart for health trends |
| decimal.js | ^10.6.0 | Precision numbers | Weight values if decimal precision needed |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Resend | SendGrid | Resend has better React Email integration, simpler API |
| React Email | MJML | React Email is type-safe, component-based |
| pg-boss | Bull/BullMQ | pg-boss uses existing PostgreSQL, no Redis needed |
| ScatterChart | LineChart | ScatterChart shows points without connecting lines |

**Installation:**

```bash
# Already installed in project
# resend: ^6.9.4
# pg-boss: ^12.14.0

# New dependencies for this phase
pnpm add @react-email/components @react-email/render
pnpm add react react-dom # Required for React Email server-side rendering
```

**Version verification:**
- resend: 6.9.4 (current, verified 2026-03-23)
- @react-email/components: 1.0.10 (current, verified 2026-03-23)
- recharts: 3.8.0 (current, verified 2026-03-23)

## Architecture Patterns

### Recommended Project Structure

```
libs/feature-health/
├── src/
│   ├── domain/
│   │   ├── entities/
│   │   │   └── health-log.entity.ts
│   │   ├── value-objects/
│   │   │   └── health-data.vo.ts    # Type-specific data structures
│   │   └── index.ts
│   ├── application/
│   │   ├── services/
│   │   │   ├── health-log.service.ts
│   │   │   ├── health-trends.service.ts
│   │   │   ├── health-digest.service.ts
│   │   │   └── email.service.ts
│   │   └── index.ts
│   ├── infrastructure/
│   │   ├── repositories/
│   │   │   └── health-log.repository.ts
│   │   ├── jobs/
│   │   │   └── health-digest.job.ts  # pg-boss Sunday schedule
│   │   ├── email/
│   │   │   └── templates/
│   │   │       └── health-digest.template.tsx
│   │   └── index.ts
│   ├── presentation/
│   │   ├── controllers/
│   │   │   ├── health-log.controller.ts
│   │   │   └── health-trends.controller.ts
│   │   └── index.ts
│   ├── health.module.ts
│   └── index.ts
└── project.json
```

### Pattern 1: Single Table with Type Discriminator

**What:** Use one `HealthLog` table with `type` field to store all health metrics
**When to use:** When different metric types share common fields but have different data payloads
**Example:**

```prisma
// Source: CONTEXT.md schema draft
model HealthLog {
  id          String        @id @default(cuid())
  tenantId    String        @map("tenantId")
  type        HealthLogType
  loggedAt    DateTime      @db.Timestamp
  data        Json          // JSONB for metric-specific fields
  notes       String?
  source      String        @default("manual")
  deletedAt   DateTime?

  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt

  tenant      Tenant        @relation(fields: [tenantId], references: [id], onDelete: Cascade)

  @@index([tenantId, type, loggedAt])
  @@index([tenantId, loggedAt])
  @@map("health_logs")
}

enum HealthLogType {
  WEIGHT
  BLOOD_PRESSURE
  HEART_RATE
  SLEEP
  WORKOUT
}
```

### Pattern 2: JSONB Data Structure per Type

**What:** Each health type has a defined JSONB structure documented via Zod schemas
**When to use:** For flexible metric-specific data without multiple tables
**Example:**

```typescript
// Source: Based on CONTEXT.md AI Digest Input Structure
// Weight data
interface WeightData {
  value: number;      // kg or lbs
  unit: 'kg' | 'lbs';
}

// Blood pressure data
interface BloodPressureData {
  systolic: number;
  diastolic: number;
}

// Heart rate data
interface HeartRateData {
  bpm: number;
}

// Sleep data
interface SleepData {
  durationMinutes: number;
  quality: 1 | 2 | 3 | 4 | 5;  // 1=poor, 5=excellent
}

// Workout data
interface WorkoutData {
  type: string;        // 'running', 'cycling', 'weightlifting', etc.
  durationMinutes: number;
  intensity: 'low' | 'moderate' | 'high';
  caloriesBurned?: number;
}
```

### Pattern 3: AI Gateway Integration for Digest

**What:** Use existing `AiGatewayService` with ANALYZE task type for health insights
**When to use:** Generating weekly health digest with correlations and recommendations
**Example:**

```typescript
// Source: Based on libs/shared-kernel/src/ai/ai-gateway.service.ts
// and libs/feature-financial/src/application/services/ai-categorization.service.ts

@Injectable()
export class HealthDigestService {
  constructor(private readonly aiGateway: AiGatewayService) {}

  async generateDigest(input: DigestInput): Promise<HealthDigest> {
    const prompt = this.buildDigestPrompt(input);

    const response = await this.aiGateway.execute({
      taskType: 'ANALYZE',
      prompt,
      context: {
        userName: input.userName,
        weekStart: input.weekStart,
        weekEnd: input.weekEnd,
        metrics: input.metrics,
      },
    });

    if (!response.success || !response.result) {
      // Fallback: data-only digest without AI insights
      return this.createDataOnlyDigest(input);
    }

    const analyzeResult = response.result as AnalyzeResult;
    return {
      insights: analyzeResult.insights,
      recommendations: analyzeResult.recommendations ?? [],
      trends: analyzeResult.themes ?? [],
      rawContent: analyzeResult.insights.join('\n\n'),
    };
  }
}
```

### Pattern 4: Resend + React Email Integration

**What:** Server-side render React Email templates and send via Resend
**When to use:** Sending weekly health digest emails
**Example:**

```typescript
// Source: Based on resend.com/docs/send-with-nodejs
import { Resend } from 'resend';
import { render } from '@react-email/render';
import HealthDigestTemplate from './templates/health-digest.template';

@Injectable()
export class EmailService {
  private resend: Resend;

  constructor(private readonly configService: ConfigService) {
    this.resend = new Resend(configService.get('RESEND_API_KEY'));
  }

  async sendHealthDigest(
    email: string,
    digest: HealthDigest,
    unsubscribeUrl: string,
  ): Promise<void> {
    const html = await render(
      HealthDigestTemplate({
        userName: digest.userName,
        insights: digest.insights,
        recommendations: digest.recommendations,
        weekSummary: digest.weekSummary,
        unsubscribeUrl,
      })
    );

    const { error } = await this.resend.emails.send({
      from: 'health@yourdomain.com',
      to: email,
      subject: `Your Weekly Health Digest - ${digest.weekEnd}`,
      html,
      headers: {
        'List-Unsubscribe': `<${unsubscribeUrl}>`,
      },
    });

    if (error) {
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }
}
```

### Pattern 5: pg-boss Weekly Scheduling

**What:** Use pg-boss cron scheduling for Sunday digest delivery
**When to use:** Scheduling weekly health digest generation
**Example:**

```typescript
// Source: Based on libs/feature-financial/src/infrastructure/jobs/recurring-transaction.job.ts
import { PgBoss, Job } from 'pg-boss';

export const HEALTH_DIGEST_JOB = 'health-digest-weekly';
const SUNDAY_CRON = '0 9 * * 0';  // Every Sunday at 9 AM

@Injectable()
export class HealthDigestJob implements OnModuleInit, OnModuleDestroy {
  private boss: PgBoss | null = null;

  async onModuleInit() {
    this.boss = new PgBoss({
      connectionString: this.configService.get('DATABASE_URL'),
      schema: 'pgboss',
    });

    await this.boss.start();
    await this.boss.work(HEALTH_DIGEST_JOB, (job) => this.handleJob(job));
    await this.boss.schedule(HEALTH_DIGEST_JOB, SUNDAY_CRON);
  }

  private async handleJob(job: Job): Promise<void> {
    // Get all tenants with health data from the past week
    const tenants = await this.getTenantsWithHealthData();

    for (const tenant of tenants) {
      try {
        await this.healthDigestService.generateAndSend(tenant.id);
      } catch (error) {
        this.logger.error(`Failed to send digest to tenant ${tenant.id}`);
        // Continue with other tenants
      }
    }
  }
}
```

### Pattern 6: Recharts ScatterChart for Points-Only Display

**What:** Use ScatterChart to show data points without connecting lines
**When to use:** Displaying health trends with gaps for missing data
**Example:**

```tsx
// Source: Recharts documentation - ScatterChart shows only points
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

// Transform health logs to chart data
const chartData = healthLogs.map(log => ({
  x: new Date(log.loggedAt).getTime(),
  y: log.data.value,  // weight value
  date: log.loggedAt,
  notes: log.notes,
}));

<ScatterChart width={600} height={300}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis
    type="number"
    dataKey="x"
    domain={['auto', 'auto']}
    tickFormatter={(tick) => new Date(tick).toLocaleDateString()}
  />
  <YAxis dataKey="y" />
  <Tooltip
    formatter={(value, name, props) => [
      `${value} kg`,
      'Weight',
    ]}
    labelFormatter={(label) => new Date(label).toLocaleDateString()}
  />
  <Scatter
    name="Weight"
    data={chartData}
    fill="#8884d8"
    shape="circle"
  />
</ScatterChart>
```

### Anti-Patterns to Avoid

- **Hardcoded reference ranges in database:** Use code constants for easier updates without migrations
- **Interpolating missing data in charts:** Show actual data points only, gaps are informative
- **Combining multiple metrics in one chart:** Separate charts per metric type
- **Skipping digest on sparse data:** Always send digest, encourage tracking if no data
- **Storing AI insights in database:** Generate fresh each week, only log send status

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Email rendering | Custom HTML string builder | @react-email/render | Type-safe, tested, responsive |
| Job scheduling | Custom cron + polling | pg-boss | Proven pattern in Financial module |
| AI prompt handling | Custom LLM client | AiGatewayService | Existing abstraction with caching, budget |
| Health data validation | Manual type guards | Zod schemas | Type safety, runtime validation |
| Chart data gaps | Linear interpolation | Recharts ScatterChart | Native point-only display |

**Key insight:** This phase extends existing patterns rather than introducing new architectural concepts. The complexity is in the AI digest generation logic and email delivery orchestration, not the infrastructure.

## Common Pitfalls

### Pitfall 1: Timezone Handling in Logged At

**What goes wrong:** Users log health data at different times of day, timezone confusion causes incorrect day grouping
**Why it happens:** `loggedAt` is user-provided, `createdAt` is system-generated
**How to avoid:** Always store in UTC, convert to user's timezone for display, use date-only for daily aggregation
**Warning signs:** Charts showing data on wrong days, weekly digest missing same-day entries

### Pitfall 2: JSONB Data Validation Drift

**What goes wrong:** Invalid data shapes stored in JSONB column, queries fail or return unexpected results
**Why it happens:** No schema enforcement on JSONB, type evolution without migration
**How to avoid:** Define strict Zod schemas for each health type, validate before Prisma create/update
**Warning signs:** Type errors when accessing data properties, inconsistent metric values

### Pitfall 3: Email Delivery Blocking Digest Generation

**What goes wrong:** Email service downtime blocks digest generation entirely
**Why it happens:** Synchronous email send in job handler
**How to avoid:** Separate digest generation from email delivery, retry with exponential backoff, log failures for manual retry
**Warning signs:** Missing digest emails, job failures in pg-boss

### Pitfall 4: AI Fallback Not User-Friendly

**What goes wrong:** When AI fails, data-only digest looks broken or confusing
**Why it happens:** Fallback content not designed for user experience
**How to avoid:** Design fallback template to explain limited insights, include encouragement to keep tracking
**Warning signs:** User complaints about "broken" digest emails

### Pitfall 5: Tenant Context Lost in Job Handler

**What goes wrong:** Weekly digest job can't access tenant-scoped data
**Why it happens:** pg-boss job runs outside request context, AsyncLocalStorage doesn't have tenant ID
**How to avoid:** Store tenant ID in job data, explicitly set tenant context in job handler using `withTenantContext`
**Warning signs:** "Tenant not found" errors, empty digest content

## Code Examples

### Health Log Zod Schemas

```typescript
// Source: Based on libs/shared-types/src/financial/financial.schema.ts pattern
import { z } from 'zod';

// Health log types
export const HealthLogTypeSchema = z.enum([
  'WEIGHT',
  'BLOOD_PRESSURE',
  'HEART_RATE',
  'SLEEP',
  'WORKOUT',
]);
export type HealthLogType = z.infer<typeof HealthLogTypeSchema>;

// Type-specific data schemas
export const WeightDataSchema = z.object({
  value: z.number().positive(),
  unit: z.enum(['kg', 'lbs']),
});

export const BloodPressureDataSchema = z.object({
  systolic: z.number().int().min(60).max(250),
  diastolic: z.number().int().min(40).max(150),
});

export const HeartRateDataSchema = z.object({
  bpm: z.number().int().min(30).max(220),
});

export const SleepDataSchema = z.object({
  durationMinutes: z.number().int().min(0).max(1440),
  quality: z.number().int().min(1).max(5),
});

export const WorkoutDataSchema = z.object({
  type: z.string().max(100),
  durationMinutes: z.number().int().min(0),
  intensity: z.enum(['low', 'moderate', 'high']),
  caloriesBurned: z.number().int().min(0).optional(),
});

// Create health log schema
export const CreateHealthLogSchema = z.object({
  type: HealthLogTypeSchema,
  loggedAt: z.string().datetime().or(z.date()),
  data: z.union([
    WeightDataSchema,
    BloodPressureDataSchema,
    HeartRateDataSchema,
    SleepDataSchema,
    WorkoutDataSchema,
  ]),
  notes: z.string().max(1000).optional(),
  source: z.string().max(50).default('manual'),
});
export type CreateHealthLogDto = z.infer<typeof CreateHealthLogSchema>;

// Health log response
export const HealthLogResponseSchema = z.object({
  id: z.string(),
  tenantId: z.string(),
  type: HealthLogTypeSchema,
  loggedAt: z.date(),
  data: z.record(z.unknown()),
  notes: z.string().nullable(),
  source: z.string(),
  deletedAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type HealthLogResponse = z.infer<typeof HealthLogResponseSchema>;

// Trend query schema
export const TrendQuerySchema = z.object({
  type: HealthLogTypeSchema,
  startDate: z.string().date().optional(),
  endDate: z.string().date().optional(),
  range: z.enum(['30', '90', '365']).optional(),
});
export type TrendQuery = z.infer<typeof TrendQuerySchema>;
```

### Health Digest Email Template

```tsx
// Source: Based on @react-email/components documentation
import {
  Html,
  Head,
  Body,
  Container,
  Heading,
  Text,
  Section,
  Button,
  Hr,
  Preview,
} from '@react-email/components';

interface HealthDigestTemplateProps {
  userName: string;
  weekEnd: string;
  insights: string[];
  recommendations: string[];
  weekSummary: {
    weightEntries: number;
    workoutCount: number;
    avgSleepHours: number;
    loggingStreak: number;
  };
  unsubscribeUrl: string;
}

export default function HealthDigestTemplate({
  userName,
  weekEnd,
  insights,
  recommendations,
  weekSummary,
  unsubscribeUrl,
}: HealthDigestTemplateProps) {
  return (
    <Html>
      <Head />
      <Preview>Your weekly health insights for {weekEnd}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Your Weekly Health Digest</Heading>

          <Text style={greeting}>Hi {userName},</Text>

          <Text style={paragraph}>
            Here's your health summary for the week ending {weekEnd}:
          </Text>

          <Section style={statsSection}>
            <Text style={statText}>
              <strong>{weekSummary.weightEntries}</strong> weight entries
            </Text>
            <Text style={statText}>
              <strong>{weekSummary.workoutCount}</strong> workouts logged
            </Text>
            <Text style={statText}>
              <strong>{weekSummary.avgSleepHours}</strong> avg sleep hours
            </Text>
            <Text style={statText}>
              <strong>{weekSummary.loggingStreak}</strong> day logging streak
            </Text>
          </Section>

          <Hr style={hr} />

          <Heading style={h2}>Insights</Heading>
          {insights.map((insight, i) => (
            <Text key={i} style={paragraph}>
              {insight}
            </Text>
          ))}

          {recommendations.length > 0 && (
            <>
              <Hr style={hr} />
              <Heading style={h2}>Recommendations</Heading>
              {recommendations.map((rec, i) => (
                <Text key={i} style={paragraph}>
                  - {rec}
                </Text>
              ))}
            </>
          )}

          <Hr style={hr} />

          <Text style={footer}>
            Keep up the great work tracking your health!
            <br />
            <a href={unsubscribeUrl} style={unsubscribeLink}>
              Unsubscribe from weekly digest
            </a>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = { backgroundColor: '#f6f9fc', fontFamily: 'system-ui, sans-serif' };
const container = { margin: '0 auto', padding: '20px 0 48px', maxWidth: '560px' };
const h1 = { fontSize: '24px', fontWeight: '700', margin: '0 0 16px' };
const h2 = { fontSize: '18px', fontWeight: '600', margin: '24px 0 12px' };
const greeting = { fontSize: '16px', margin: '0 0 12px' };
const paragraph = { fontSize: '14px', lineHeight: '1.5', margin: '0 0 12px' };
const statsSection = { backgroundColor: '#eef2ff', padding: '16px', borderRadius: '8px', margin: '16px 0' };
const statText = { fontSize: '14px', margin: '4px 0' };
const hr = { borderColor: '#e6ebf1', margin: '20px 0' };
const footer = { fontSize: '12px', color: '#8898aa', margin: '24px 0 0' };
const unsubscribeLink = { color: '#8898aa', textDecoration: 'underline' };
```

### Reference Ranges (Code Constants)

```typescript
// Source: CONTEXT.md decision - stored in code, not database

export const HEALTH_REFERENCE_RANGES = {
  bloodPressure: {
    systolic: {
      low: 90,
      normal: { min: 90, max: 120 },
      elevated: { min: 120, max: 130 },
      high: 130,
    },
    diastolic: {
      low: 60,
      normal: { min: 60, max: 80 },
      high: 80,
    },
  },
  heartRate: {
    resting: {
      low: 60,
      normal: { min: 60, max: 100 },
      high: 100,
    },
  },
  sleep: {
    recommended: {
      adult: { minHours: 7, maxHours: 9 },
    },
  },
  weight: {
    // No universal range - use BMI or personalized targets
  },
} as const;

export function getBloodPressureCategory(
  systolic: number,
  diastolic: number
): 'normal' | 'elevated' | 'high' | 'low' {
  if (systolic < 90 || diastolic < 60) return 'low';
  if (systolic <= 120 && diastolic <= 80) return 'normal';
  if (systolic <= 130 && diastolic <= 80) return 'elevated';
  return 'high';
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Custom email HTML | React Email templates | 2023+ | Type-safe, reusable components |
| BullMQ for jobs | pg-boss (PostgreSQL) | Phase 3 | No Redis needed, simpler ops |
| LineChart for trends | ScatterChart for gaps | This phase | Shows actual data density |
| Per-type tables | Single table + JSONB | CONTEXT.md decision | Flexible, simpler migrations |

**Deprecated/outdated:**
- nodemailer: Use Resend SDK instead for better deliverability
- Handlebars/MJML: Use React Email for type safety

## Open Questions

1. **Unsubscribe Flow Implementation**
   - What we know: One-click link required in footer
   - What's unclear: Where is unsubscribe preference stored? User table or separate?
   - Recommendation: Add `healthDigestEnabled` boolean to User or create NotificationPreferences table

2. **Tenant Email Retrieval**
   - What we know: Digest sent to user's email
   - What's unclear: How to get email from tenant context (tenant has multiple users?)
   - Recommendation: Assume single user per tenant (v1), get email from User table via tenantId

3. **Multi-Unit Weight Display**
   - What we know: Users may prefer kg or lbs
   - What's unclear: Per-tenant preference or per-entry?
   - Recommendation: Store in original unit, convert at display time based on user preference

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | None detected - Nx with @nx/js:swc only |
| Config file | None - tests not configured |
| Quick run command | N/A |
| Full suite command | N/A |

### Phase Requirements -> Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| HLTH-01 | Log weight with date/notes | unit | N/A | No - Wave 0 |
| HLTH-02 | View weight trend chart | integration | N/A | No - Wave 0 |
| HLTH-03 | Log vitals as JSONB | unit | N/A | No - Wave 0 |
| HLTH-04 | Log sleep duration/quality | unit | N/A | No - Wave 0 |
| HLTH-05 | Log workouts with JSONB | unit | N/A | No - Wave 0 |
| HLTH-06 | Generate weekly digest via AI | integration | N/A | No - Wave 0 |
| HLTH-07 | Send digest email via Resend | integration | N/A | No - Wave 0 |
| HLTH-08 | Dashboard health summary | integration | N/A | No - Wave 0 |

### Sampling Rate

- **Per task commit:** Manual verification (no test infrastructure)
- **Per wave merge:** Manual E2E testing
- **Phase gate:** Manual verification against success criteria

### Wave 0 Gaps

- [ ] `libs/feature-health/src/**/*.spec.ts` - unit tests for services
- [ ] `apps/api/src/health/**/*.e2e-spec.ts` - integration tests for endpoints
- [ ] Jest/Vitest configuration - no test framework configured in project
- [ ] Test utilities for tenant context mocking
- [ ] Mock Resend API for email tests
- [ ] Mock AI Gateway for digest tests

**Note:** No test infrastructure detected in current project. Tests should be added but are not blocking for implementation. Consider adding Vitest configuration for unit tests given project uses modern tooling.

## Sources

### Primary (HIGH confidence)

- CONTEXT.md - Locked decisions from `/gsd:discuss-phase`
- libs/shared-kernel/src/ai/ai-gateway.service.ts - Existing AI integration pattern
- libs/feature-financial/src/financial.module.ts - Module structure pattern
- libs/feature-financial/src/infrastructure/jobs/recurring-transaction.job.ts - pg-boss pattern

### Secondary (MEDIUM confidence)

- [Resend Node.js docs](https://resend.com/docs/send-with-nodejs) - Email sending pattern
- [React Email docs](https://react.email/docs) - Template rendering

### Tertiary (LOW confidence)

- Recharts ScatterChart usage - Based on general knowledge, verify with docs

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All libraries already in project or verified via npm
- Architecture: HIGH - Following established Financial/Habits module patterns
- Pitfalls: MEDIUM - Based on common patterns, need real-world validation

**Research date:** 2026-03-23
**Valid until:** 30 days - stable patterns, library versions current
