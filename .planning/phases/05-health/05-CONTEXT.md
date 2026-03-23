---
phase: 05-health
created_at: 2026-03-23
status: discussed
gray_areas_covered:
  - Data Model Design
  - Trend Visualization
  - AI Digest Format
  - Email Integration
---

# Phase 5: Health Module - Context

## Overview

Health tracking module for weight, vitals, sleep, and workouts with AI-generated weekly digest delivered via email.

## Decisions

### Data Model Design

**Storage Pattern:** Single table with type discriminator
- One `HealthLog` table with `type` field (weight, blood_pressure, heart_rate, sleep, workout)
- Follows pattern established in Financial module (single table, type field)

**Metric Data:** Single JSONB column
- `data` column stores metric-specific fields
- Flexible schema per type without multiple tables
- Example: `{"systolic": 120, "diastolic": 80}` for blood pressure

**Timestamp:** User-provided `logged_at`
- Users can backdate entries (e.g., logging yesterday's weight)
- System `createdAt` for audit, `logged_at` for actual measurement time

**Deletion:** Soft delete only
- `deletedAt` timestamp, never hard delete
- Health history is valuable for trends

**Data Source:** Single `source` field
- Track origin: "manual", "apple_health", "fitbit", etc.
- Future-proofing for integrations

**Reference Ranges:** Stored in code, not database
- Constants/config files for healthy ranges
- Example: Blood pressure normal = 90-120 systolic
- Easier to update without migrations

### Trend Visualization

**Chart Library:** Recharts
- Matches Phase 9 Web Client choice
- Declarative, composable, React-native

**Time Ranges:** All options supported
- 30 days (short-term)
- 90 days (quarterly)
- 365 days (yearly)
- Custom range (user-selected dates)

**Data Display:** Daily values with gaps
- Show actual data points, no interpolation
- Gaps in chart for missing days (no connecting lines)
- Handle sparsity gracefully

**Chart Layout:** Separate charts per metric
- One chart per health type (weight, blood pressure, etc.)
- Simple, focused visualization
- No combined/overlay charts

**Rendering:** Data points only
- No connecting lines between points
- Shows actual recorded values
- Clear visual of data density

**Goal Display:** None on charts
- Just show recorded data
- Goals tracked separately in UI

**Interactions:** Full support
- Tooltip on hover (show value/date)
- Click to expand (detailed modal/panel)
- Download data (CSV/JSON export)
- Share image (export chart as PNG)

### AI Digest Format

**Content Scope:** Comprehensive insights
- Trend analysis (weekly changes)
- Cross-metric correlations (e.g., sleep vs weight)
- Notable changes (anomaly detection)
- Recommendations (actionable next steps)

**Tone:** Supportive/friendly
- Encouraging, not clinical
- Positive framing of progress
- Gentle suggestions, not commands

**Length:** Medium (5-7 paragraphs)
- Full sentences with context
- Not bullet-point style
- Readable in 2-3 minutes

**Personalization:** All elements
- Personalized greeting (user's name)
- Historical comparison (vs last week/month)
- Goal progress (if goals set)
- Achievement mentions (streaks, consistency)

**Schedule:** Fixed Sunday delivery
- Every Sunday, user cannot change
- Consistent weekly cadence
- No time-of-day configuration

**Minimum Data:** Always send
- Generate digest even with 1 data point
- Graceful handling of sparse weeks
- "Start tracking" encouragement if no data

**AI Task Type:** ANALYZE
- Best for correlations and insights
- Single task call to AI Gateway
- Input: week's health data as structured JSON

**Failure Handling:** Send data-only digest
- If AI fails, send raw stats without insights
- Never skip delivery entirely
- Include note about limited insights

### Email Integration

**Provider:** Resend
- Modern API-first service
- Generous free tier
- React Email support

**Templates:** React Email templates
- `@react-email/components` for rendering
- Server-side rendering to HTML
- Type-safe template props

**Unsubscribe:** One-click link in footer
- Standard email footer link
- Immediate unsubscribe action
- Can re-enable in app settings

**Failure Handling:** Retry 3x with backoff
- Exponential backoff between retries
- Log final failure for investigation
- Don't block digest generation queue

## Code Context

### Existing Patterns to Follow

**From Financial Module (Phase 3):**
- Hexagonal architecture: domain/application/infrastructure/presentation
- Prisma schema with tenantId and RLS
- Repository pattern for data access
- Value objects for domain concepts (e.g., Money)
- Service layer for business logic

**From Habits Module (Phase 4):**
- Gamification integration pattern
- Calendar/schedule services
- Completion tracking with streaks

**From AI Gateway (Phase 2):**
- Task type enum: ANALYZE for this phase
- Provider rotation on failure
- Token budgeting per tenant
- Usage logging

### Database Schema (Draft)

```prisma
model HealthLog {
  id          String   @id @default(cuid())
  tenantId    String
  type        HealthLogType
  loggedAt    DateTime @db.Timestamp
  data        Json     // JSONB for metric-specific fields
  notes       String?
  source      String   @default("manual")
  deletedAt   DateTime?

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  tenant      Tenant   @relation(fields: [tenantId], references: [id])

  @@index([tenantId, type, loggedAt])
  @@index([tenantId, loggedAt])
}

enum HealthLogType {
  WEIGHT
  BLOOD_PRESSURE
  HEART_RATE
  SLEEP
  WORKOUT
}
```

### API Endpoints (Planned)

```
POST   /health/weight        - Log weight
POST   /health/vitals        - Log vitals (BP, HR)
POST   /health/sleep         - Log sleep
POST   /health/workout       - Log workout

GET    /health/weight        - Get weight history
GET    /health/vitals        - Get vitals history
GET    /health/sleep         - Get sleep history
GET    /health/workout       - Get workout history

GET    /health/trends/:type  - Get trend data for charts
GET    /health/summary       - Get health dashboard summary
```

### AI Digest Input Structure

```typescript
interface DigestInput {
  userName: string;
  weekStart: Date;
  weekEnd: Date;
  metrics: {
    weight?: { entries: WeightEntry[]; trend: 'up' | 'down' | 'stable' };
    vitals?: { entries: VitalsEntry[]; avgBP: string; avgHR: number };
    sleep?: { entries: SleepEntry[]; avgDuration: number; avgQuality: number };
    workouts?: { entries: WorkoutEntry[]; count: number; totalMinutes: number };
  };
  goals?: {
    weight?: { target: number; progress: number };
    // ...
  };
  streaks?: {
    loggingStreak: number;
    workoutStreak: number;
  };
}
```

## Out of Scope (Deferred Ideas)

- Health device integrations (Apple Health, Fitbit) - future phase
- Nutrition/calorie tracking - separate domain module
- Medication tracking - separate domain module
- Doctor appointment scheduling - out of PMS scope
- Health data sharing with providers - privacy concerns
- Custom health metric types - complexity for later

## Dependencies

- Phase 1: Foundation (auth, RLS, shared libs) ✅
- Phase 2: AI Gateway (ANALYZE task type) ✅

## Next Steps

1. Run `/gsd:plan-phase 5` to create PLAN.md files
2. Execute plans in order (06-01 through 06-06)
3. Verify against success criteria
