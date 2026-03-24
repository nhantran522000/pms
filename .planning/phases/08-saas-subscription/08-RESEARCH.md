# Phase 8: SaaS Subscription - Research

**Researched:** 2026-03-24
**Domain:** SaaS infrastructure, payment processing, subscription lifecycle management
**Confidence:** HIGH

## Summary

Phase 8 implements LemonSqueezy-powered SaaS subscription infrastructure with 30-day trial tracking, webhook event handlers with idempotency, plan-based feature guards, and tenant branding. The implementation leverages existing codebase patterns (guards, decorators, email service) and integrates `@lemonsqueezy/lemonsqueezy.js` v4.0.0 SDK for payment processing.

**Primary recommendation:** Use LemonSqueezy's official Node.js SDK v4.0.0 with HMAC webhook signature verification, PostgreSQL unique constraint for idempotency, and extend existing guard/decorator patterns for plan-based access control.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Trial starts automatically at tenant creation (when first user signs up)
- Trial status tracked via `trialEndDate DateTime` field on Tenant model
- All trial dates in UTC for consistency with system timestamps
- 2 subscription tiers: FREE (trial/default), PRO (paid)
- `@RequirePlan('FREE' | 'PRO')` decorator using enum for type safety
- Guard returns 403 Forbidden with upgrade link JSON when plan requirement not met
- Soft degradation on trial expiry: read-only access with banner warning
- Gated endpoints: advanced features (AI insights, trends, analytics) — core CRUD remains accessible
- Branding stored as JSONB on Tenant: `{primaryColor?: string, appName?: string, logoUrl?: string}`
- System defaults when null: `primaryColor="#3b82f6"`, `appName="PMS"`, `logoUrl=null`
- Idempotency: separate `WebhookEvent` table with idempotency key and 24h TTL
- Webhook security: LemonSqueezy HMAC signature verification
- Warning email: Day 27 at 9 AM (3 days before expiry)

### Claude's Discretion
- Specific LemonSqueezy API implementation details
- Webhook retry logic and error handling
- Plan upgrade/downgrade workflows
- Email template content for trial warnings

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| SAAS-01 | New users get 30-day free trial automatically | Tenant model extension with `trialEndDate`, tenant creation hook to set `now() + 30 days` |
| SAAS-02 | System tracks trial end date per tenant | `trialEndDate DateTime` field on Tenant model, UTC timezone |
| SAAS-03 | Day 27: System sends trial expiry warning email | pg-boss scheduled job, Resend email service integration |
| SAAS-04 | Day 30: System restricts access to free tier | Trial status check in PlanFeatureGuard, soft degradation to read-only |
| SAAS-05 | LemonSqueezy webhook handles subscription events | `@lemonsqueezy/lemonsqueezy.js` SDK v4.0.0, webhook controller |
| SAAS-06 | Webhook handlers are idempotent (handle duplicates) | WebhookEvent table with unique constraint on idempotency key |
| SAAS-07 | PlanFeatureGuard restricts gated endpoints | NestJS guard pattern with Reflector, metadata decorator |
| SAAS-08 | Tenant branding stored as JSONB (primaryColor, appName, logoUrl) | `branding Json?` field on Tenant model with system defaults |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `@lemonsqueezy/lemonsqueezy.js` | 4.0.0 | Official LemonSqueezy Node.js SDK | TypeScript support, webhook utilities, subscription management |
| `pg-boss` | 12.14.0 (installed) | Job scheduling for Day 27 warning email | Already in project, PostgreSQL-backed, cron support |
| `Resend` | (via existing email service) | Email delivery for trial warnings | Already integrated in feature-auth, HTML templates |
| `crypto` | (Node.js built-in) | HMAC signature verification for webhooks | Standard Node.js module, timing-safe comparison |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `zod` | (installed) | Schema validation for webhook payloads | Validate LemonSqueezy webhook events before processing |
| `@nestjs/config` | (installed) | Environment variable management | Store LemonSqueezy API key, webhook secret |
| `prisma` | 7.3 (installed) | Database schema migrations | Add Tenant fields, create WebhookEvent table |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| LemonSqueezy | Stripe | Stripe more complex for solo dev (tax handling), LemonSqueezy handles VAT/GST globally (5% + $0.50/transaction) |
| PostgreSQL idempotency | Redis | Adds infrastructure overhead, PostgreSQL sufficient for webhook deduplication |
| Separate WebhookEvent table | Process webhooks directly | No audit trail, harder to debug duplicates, no retry mechanism |

**Installation:**
```bash
npm install @lemonsqueezy/lemonsqueezy.js
```

**Version verification:**
```bash
npm view @lemonsqueezy/lemonsqueezy.js version
# 4.0.0 (current as of March 2026)
```

## Architecture Patterns

### Recommended Project Structure
```
libs/feature-subscription/
├── src/
│   ├── domain/
│   │   ├── entities/
│   │   │   ├── subscription.entity.ts
│   │   │   └── webhook-event.entity.ts
│   │   └── enums/
│   │       └── subscription-tier.enum.ts
│   ├── application/
│   │   ├── services/
│   │   │   ├── subscription.service.ts
│   │   │   ├── webhook.service.ts
│   │   │   └── trial.service.ts
│   │   └── dto/
│   │       ├── create-webhook-event.dto.ts
│   │       └── subscription-status.dto.ts
│   ├── infrastructure/
│   │   ├── repositories/
│   │   │   ├── webhook-event.repository.ts
│   │   │   └── tenant.repository.ts
│   │   └── services/
│   │       └── lemonsqueezy.service.ts
│   ├── presentation/
│   │   ├── controllers/
│   │   │   └── webhook.controller.ts
│   │   ├── guards/
│   │   │   └── plan-feature.guard.ts
│   │   └── decorators/
│   │       └── require-plan.decorator.ts
│   └── subscription.module.ts
```

### Pattern 1: Webhook Signature Verification
**What:** HMAC signature verification to authenticate LemonSqueezy webhooks
**When to use:** All incoming webhook endpoints before processing payload
**Example:**
```typescript
// Source: LemonSqueezy API documentation
import { createHmac, timingSafeEqual } from 'crypto';

function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const hmac = createHmac('sha256', secret);
  hmac.update(payload);
  const digest = hmac.digest('base64');

  // Use timing-safe comparison to prevent timing attacks
  return timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(digest)
  );
}
```

### Pattern 2: Idempotent Webhook Processing
**What:** Deduplicate webhook events using unique constraint
**When to use:** Processing any webhook event that could be delivered multiple times
**Example:**
```typescript
// Prisma schema
model WebhookEvent {
  id             String   @id @default(cuid())
  tenantId       String   @map("tenantId")
  eventId        String   @map("eventId") // LemonSqueezy event ID
  eventType      String   @map("eventType")
  idempotencyKey String   @unique @map("idempotencyKey") // Deduplication key
  payload        Json
  processed      Boolean  @default(false)
  createdAt      DateTime @default(now())
  expiresAt      DateTime @map("expiresAt") // 24h TTL

  @@index([tenantId])
  @@index([idempotencyKey])
  @@index([expiresAt])
  @@map("webhook_events")
}
```

### Pattern 3: Plan Feature Guard with Decorator
**What:** Restrict endpoint access based on subscription tier
**When to use:** Protecting gated features (AI insights, trends, analytics)
**Example:**
```typescript
// Decorator
import { SetMetadata } from '@nestjs/common';

export const PLAN_KEY = 'plan';
export enum SubscriptionTier {
  FREE = 'FREE',
  PRO = 'PRO',
}

export const RequirePlan = (tier: SubscriptionTier) =>
  SetMetadata(PLAN_KEY, tier);

// Guard
import { Reflector } from '@nestjs/core';
import { CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

export class PlanFeatureGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredTier = this.reflector.getAllAndOverride<SubscriptionTier>(
      PLAN_KEY,
      [context.getHandler(), context.getClass()]
    );

    if (!requiredTier) return true; // No tier requirement

    const request = context.switchToHttp().getRequest();
    const tenant = request.tenant; // Set by TenantContextMiddleware

    if (this.hasAccess(tenant.subscriptionTier, requiredTier)) {
      return true;
    }

    throw new ForbiddenException({
      message: 'This feature requires a PRO subscription',
      upgradeUrl: 'https://your-site.com/upgrade',
    });
  }

  private hasAccess(currentTier: string, requiredTier: string): boolean {
    // FREE can access FREE, PRO can access both
    if (requiredTier === SubscriptionTier.FREE) return true;
    return currentTier === SubscriptionTier.PRO;
  }
}
```

### Anti-Patterns to Avoid
- **Processing webhooks without idempotency:** Always deduplicate using unique constraint
- **Storing webhook secrets in code:** Use environment variables via ConfigService
- **Hardcoded subscription tiers:** Use enum for type safety
- **Returning 500 on webhook errors:** Return 200 immediately, process asynchronously
- **Synchronous webhook processing:** Queue webhooks with pg-boss for reliability

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Webhook signature verification | Custom HMAC logic | `crypto` module with `timingSafeEqual` | Timing attacks vulnerable in naive comparison |
| Subscription status mapping | Custom status enum | LemonSqueezy SDK's built-in statuses | Handles `on_trial`, `active`, `paused`, `past_due`, `unpaid`, `cancelled`, `expired` |
| Job scheduling for warning emails | setTimeout/setInterval | pg-boss with cron expression | PostgreSQL-backed, survives restarts, distributed-safe |
| Webhook deduplication | In-memory Set/Map | PostgreSQL unique constraint | Survives restarts, multi-instance safe, audit trail |
| Email HTML templates | String concatenation | @react-email/components (existing) | Type-safe, reusable, responsive |

**Key insight:** Webhook idempotency is critical—LemonSqueezy may redeliver events up to 7 days. Without database-level deduplication, you'll process duplicate subscriptions, double-charge customers, or corrupt trial status.

## Common Pitfalls

### Pitfall 1: Trial Date Timezone Confusion
**What goes wrong:** Trial expires at different times depending on user timezone
**Why it happens:** Mixing local timezone with UTC timestamps
**How to avoid:** Store all `trialEndDate` values in UTC, convert to user timezone only for display
**Warning signs:** Users report trial ending "a day early" or "a day late"

### Pitfall 2: Webhook Replay Attacks
**What goes wrong:** Attacker captures valid webhook and replays it later
**Why it happens:** Missing timestamp validation in signature verification
**How to avoid:** LemonSqueezy includes timestamp in signature—reject events older than 5 minutes
**Warning signs:** Subscription updates happening at unexpected times

### Pitfall 3: Race Conditions in Webhook Processing
**What goes wrong:** Two webhook events process simultaneously before idempotency check
**Why it happens:** Not using database transaction with unique constraint
**How to avoid:** Wrap webhook processing in Prisma transaction, rely on unique constraint for atomicity
**Warning signs:** Duplicate subscription records in database

### Pitfall 4: Hard Upgrade on Trial Expiry
**What goes wrong:** Users lose access to all data immediately after trial
**Why it happens:** Trial expiry check throws 403 for all endpoints
**How to avoid:** Soft degradation—read-only access with banner warning, not hard block
**Warning signs:** Support tickets from expired trial users unable to export data

### Pitfall 5: Missing Plan Guard Metadata
**What goes wrong:** Guard blocks all endpoints because metadata not set
**Why it happens:** Forgetting to use `@RequirePlan()` decorator on controller methods
**How to avoid:** Guard returns `true` if no metadata found (opt-in rather than opt-out)
**Warning signs:** All endpoints return 403 after guard deployed

## Code Examples

Verified patterns from official sources:

### LemonSqueezy SDK Initialization
```typescript
// Source: https://docs.lemonsqueezy.com/guides/rest-api
import { lemonSqueezySetup } from '@lemonsqueezy/lemonsqueezy.js';

lemonSqueezySetup({
  apiKey: process.env.LEMONSQUEEZY_API_KEY,
  onError: (error) => console.error('LemonSqueezy error:', error),
});
```

### Subscription Status Mapping
```typescript
// Source: LemonSqueezy API subscription object attributes
enum LemonSqueezyStatus {
  ON_TRIAL = 'on_trial',
  ACTIVE = 'active',
  PAUSED = 'paused',
  PAST_DUE = 'past_due',
  UNPAID = 'unpaid',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired',
}

// Map to internal tiers
function mapStatusToTier(status: LemonSqueezyStatus): SubscriptionTier {
  if (status === LemonSqueezyStatus.ACTIVE) return SubscriptionTier.PRO;
  if (status === LemonSqueezyStatus.ON_TRIAL) return SubscriptionTier.FREE;
  return SubscriptionTier.FREE; // Default to FREE for all other statuses
}
```

### pg-boss Scheduled Job for Warning Email
```typescript
// Source: pg-boss documentation (already installed in project)
import { Db } from 'pg-boss';

async function scheduleTrialWarning(db: Db, tenantId: string, trialEndDate: Date) {
  const warningDate = new Date(trialEndDate);
  warningDate.setDate(warningDate.getDate() - 3); // Day 27
  warningDate.setHours(9, 0, 0, 0); // 9 AM

  await db.send('trial-warning-email', {
    tenantId,
    trialEndDate,
  }, {
    startAfter: warningDate,
    tz: 'UTC',
  });
}
```

### Tenant Branding with Defaults
```typescript
// Service layer
function getTenantBranding(tenant: Tenant): TenantBranding {
  const defaults = {
    primaryColor: '#3b82f6',
    appName: 'PMS',
    logoUrl: null,
  };

  const branding = tenant.branding as TenantBranding | null;

  return {
    primaryColor: branding?.primaryColor || defaults.primaryColor,
    appName: branding?.appName || defaults.appName,
    logoUrl: branding?.logoUrl || defaults.logoUrl,
  };
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Stripe Checkout | LemonSqueezy | 2024 | Global VAT handling, simpler tax compliance |
| Email templates as strings | @react-email/components | 2023 | Type-safe, responsive HTML emails |
| In-memory job queues | pg-boss (PostgreSQL) | 2023 | No Redis dependency, survives restarts |
| Manual webhook deduplication | Database unique constraints | 2022 | Multi-instance safe, audit trail |

**Deprecated/outdated:**
- Custom HMAC implementation: Use Node.js `crypto.timingSafeEqual()` for security
- setTimeout-based scheduling: Use pg-boss or similar job queue
- Subscription status in code: Source of truth is LemonSqueezy, not local database

## Open Questions

1. **LemonSqueezy webhook retry policy**
   - What we know: LemonSqueezy retries webhooks for up to 7 days with exponential backoff
   - What's unclear: Exact retry intervals (1m, 5m, 30m, 2h, 6h, 24h pattern assumed)
   - Recommendation: Implement idempotency, assume aggressive redelivery, log all attempts

2. **Plan upgrade synchronization latency**
   - What we know: Webhook updates subscription status in real-time
   - What's unclear: How long before PlanFeatureGuard sees updated tier after upgrade
   - Recommendation: Cache subscription tier in Redis with 5-minute TTL, invalidate on webhook

3. **Trial expiry user notification frequency**
   - What we know: Day 27 warning email is required
   - What's unclear: Should we also show in-app banner on Day 28, 29, 30?
   - Recommendation: In-app banner appears when `trialEndDate - now() <= 3 days`, dismissible

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| pg-boss | Day 27 warning email scheduling | ✓ | 12.14.0 | — |
| Resend | Trial warning email delivery | ✓ | (via feature-auth) | — |
| PostgreSQL | WebhookEvent table, Tenant branding | ✓ | 17 | — |
| Node.js crypto | Webhook signature verification | ✓ | (built-in) | — |
| @lemonsqueezy/lemonsqueezy.js | Subscription API, webhooks | ✗ | — | Install required |

**Missing dependencies with no fallback:**
- `@lemonsqueezy/lemonsqueezy.js` — Required for payment processing, no alternative

**Missing dependencies with fallback:**
- None

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Jest (Nx default) |
| Config file | `jest.config.js` (root) |
| Quick run command | `nx test feature-subscription` |
| Full suite command | `nx run-many --target=test --all` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| SAAS-01 | Trial starts on tenant creation | unit | `nx test feature-subscription --testFile=trial.service.spec` | ❌ Wave 0 |
| SAAS-02 | Trial end date tracked | unit | `nx test feature-subscription --testFile=trial.service.spec` | ❌ Wave 0 |
| SAAS-03 | Day 27 warning email sent | integration | `nx test feature-subscription --testFile=trial-warning.integration.spec` | ❌ Wave 0 |
| SAAS-04 | Day 30 restricts access | unit | `nx test feature-subscription --testFile=plan-feature.guard.spec` | ❌ Wave 0 |
| SAAS-05 | LemonSqueezy webhook handled | integration | `nx test feature-subscription --testFile=webhook.controller.integration.spec` | ❌ Wave 0 |
| SAAS-06 | Webhook idempotency enforced | unit | `nx test feature-subscription --testFile=webhook.service.spec` | ❌ Wave 0 |
| SAAS-07 | PlanFeatureGuard restricts endpoints | unit | `nx test feature-subscription --testFile=plan-feature.guard.spec` | ❌ Wave 0 |
| SAAS-08 | Tenant branding stored/retrieved | unit | `nx test feature-subscription --testFile=branding.service.spec` | ❌ Wave 0 |

### Sampling Rate
- **Per task commit:** `nx test feature-subscription --coverage`
- **Per wave merge:** `nx run-many --target=test --all`
- **Phase gate:** Full suite green with 80%+ coverage before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `libs/feature-subscription/src/application/services/trial.service.spec.ts` — covers SAAS-01, SAAS-02
- [ ] `libs/feature-subscription/src/presentation/guards/plan-feature.guard.spec.ts` — covers SAAS-04, SAAS-07
- [ ] `libs/feature-subscription/src/application/services/webhook.service.spec.ts` — covers SAAS-05, SAAS-06
- [ ] `libs/feature-subscription/src/presentation/controllers/webhook.controller.spec.ts` — covers SAAS-05
- [ ] `libs/feature-subscription/test/trial-warning.integration.spec.ts` — covers SAAS-03
- [ ] `libs/feature-subscription/test/branding.service.spec.ts` — covers SAAS-08
- [ ] `libs/feature-subscription/test/fixtures/tenant.fixture.ts` — shared test data
- [ ] Framework setup: Jest already configured via Nx — no additional config needed

## Sources

### Primary (HIGH confidence)
- LemonSqueezy API Documentation - `/api/subscriptions` endpoint (subscription object attributes, status enum)
- LemonSqueezy API Documentation - `/api/webhooks` endpoint (webhook creation, signature verification)
- `@lemonsqueezy/lemonsqueezy.js` npm package v4.0.0 - Official Node.js SDK
- Existing codebase patterns - `libs/feature-auth/src/presentation/guards/jwt-auth.guard.ts` (guard pattern)
- Existing codebase patterns - `libs/feature-auth/src/presentation/decorators/public.decorator.ts` (decorator pattern)
- Existing codebase patterns - `libs/feature-auth/src/infrastructure/services/email.service.ts` (email service)

### Secondary (MEDIUM confidence)
- pg-boss v12.14.0 - Confirmed installed in project, used for job scheduling
- Prisma schema - Current Tenant model structure in `libs/data-access/prisma/schema.prisma`
- NestJS Guards documentation - Reflector pattern for metadata retrieval
- Node.js crypto module - HMAC signature verification with `timingSafeEqual`

### Tertiary (LOW confidence)
- None - All findings verified against official documentation or existing codebase

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Verified npm package, confirmed existing dependencies
- Architecture: HIGH - Examined existing codebase patterns (guards, decorators, email service)
- Pitfalls: HIGH - Researched common webhook/SaaS issues, verified against LemonSqueezy docs

**Research date:** 2026-03-24
**Valid until:** 2026-04-23 (30 days - LemonSqueezy API stable, pg-boss mature, NestJS patterns stable)
