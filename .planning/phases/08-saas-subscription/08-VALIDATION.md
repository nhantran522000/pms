# Phase 8: SaaS Subscription - Validation Template

**Created:** 2026-03-24
**Purpose:** Validation checklist for phase execution verification

## Pre-Execution Checklist

Before running plans in this phase:

- [ ] LEMONSQUEEZY_API_KEY environment variable configured
- [ ] LEMONSQUEEZY_WEBHOOK_SECRET environment variable configured
- [ ] LemonSqueezy store and subscription product created in dashboard
- [ ] UPGRADE_URL environment variable set (for upgrade links in 403 responses)
- [ ] pg-boss database tables exist (for scheduled jobs)

## Plan-Level Validation

### Plan 08-01: Subscription Domain Module

| Truth | Verification | Status |
|-------|--------------|--------|
| Tenant model has trialEndDate field | `grep -q "trialEndDate" libs/data-access/prisma/schema.prisma` | [ ] |
| Tenant model has subscriptionTier field | `grep -q "subscriptionTier" libs/data-access/prisma/schema.prisma` | [ ] |
| SubscriptionTier enum has FREE and PRO | `grep -q "FREE = 'FREE'" libs/feature-subscription/src/domain/enums/subscription-tier.enum.ts` | [ ] |
| TrialService.initializeTrial exists | `grep -q "initializeTrial" libs/feature-subscription/src/application/services/trial.service.ts` | [ ] |
| TrialService.getTrialStatus exists | `grep -q "getTrialStatus" libs/feature-subscription/src/application/services/trial.service.ts` | [ ] |
| TrialService wired to AuthModule | `grep -q "TrialService" libs/feature-auth/src/auth.module.ts` | [ ] |
| Trial status endpoint exists | `grep -q "getTrialStatus" libs/feature-subscription/src/presentation/controllers/subscription.controller.ts` | [ ] |

### Plan 08-02: Webhook Handlers

| Truth | Verification | Status |
|-------|--------------|--------|
| WebhookEvent table exists | `grep -q "model WebhookEvent" libs/data-access/prisma/schema.prisma` | [ ] |
| Idempotency key unique constraint | `grep -q "idempotencyKey.*@unique" libs/data-access/prisma/schema.prisma` | [ ] |
| LemonSqueezyService.verifySignature uses timingSafeEqual | `grep -q "timingSafeEqual" libs/feature-subscription/src/infrastructure/services/lemonsqueezy.service.ts` | [ ] |
| WebhookService.processEvent uses transaction | `grep -q "\\$transaction" libs/feature-subscription/src/application/services/webhook.service.ts` | [ ] |
| Webhook endpoint has @Public() | `grep -q "@Public()" libs/feature-subscription/src/presentation/controllers/webhook.controller.ts` | [ ] |

### Plan 08-03: Trial Warning

| Truth | Verification | Status |
|-------|--------------|--------|
| TrialWarningService schedules Day 27 email | `grep -q "setDate.*- 3" libs/feature-subscription/src/application/services/trial-warning.service.ts` | [ ] |
| Warning scheduled at 9 AM UTC | `grep -q "setHours(9, 0, 0, 0)" libs/feature-subscription/src/application/services/trial-warning.service.ts` | [ ] |
| pg-boss job handler registered | `grep -q "trial-warning-email" libs/feature-subscription/src/infrastructure/jobs/trial-warning.job.ts` | [ ] |

### Plan 08-04: Plan Feature Guard

| Truth | Verification | Status |
|-------|--------------|--------|
| @RequirePlan decorator sets PLAN_KEY | `grep -q "PLAN_KEY.*requiredPlan" libs/feature-subscription/src/presentation/decorators/require-plan.decorator.ts` | [ ] |
| PlanFeatureGuard uses Reflector | `grep -q "getAllAndOverride.*PLAN_KEY" libs/feature-subscription/src/presentation/guards/plan-feature.guard.ts` | [ ] |
| Guard returns 403 with upgradeUrl | `grep -q "upgradeUrl" libs/feature-subscription/src/presentation/guards/plan-feature.guard.ts` | [ ] |
| TenantContextMiddleware populates request.tenant | `grep -q "request.tenant" libs/data-access/src/tenant-context/tenant-context.middleware.ts` | [ ] |

### Plan 08-05: Tenant Branding

| Truth | Verification | Status |
|-------|--------------|--------|
| BrandingDto has BRANDING_DEFAULTS | `grep -q "BRANDING_DEFAULTS" libs/feature-subscription/src/application/dto/branding.dto.ts` | [ ] |
| Defaults include #3b82f6 | `grep -q "#3b82f6" libs/feature-subscription/src/application/dto/branding.dto.ts` | [ ] |
| BrandingService merges with defaults | `grep -q "mergeWithDefaults" libs/feature-subscription/src/application/services/branding.service.ts` | [ ] |
| GET /subscription/branding endpoint | `grep -q "@Get()" libs/feature-subscription/src/presentation/controllers/branding.controller.ts` | [ ] |
| PATCH /subscription/branding endpoint | `grep -q "@Patch()" libs/feature-subscription/src/presentation/controllers/branding.controller.ts` | [ ] |

## Integration Validation

After all plans complete:

| Check | Command | Expected Result |
|-------|---------|-----------------|
| SubscriptionModule imported in AppModule | `grep -q "SubscriptionModule" apps/api/src/app.module.ts` | Pass |
| TrialService injectable from other modules | `grep -q "exports.*TrialService" libs/feature-subscription/src/subscription.module.ts` | Pass |
| Prisma client regenerated | `pnpm prisma generate` | No errors |
| TypeScript compiles | `pnpm nx run api:build` | No errors |
| All tests pass | `pnpm nx run-many -t test --projects=feature-subscription` | All pass |

## UAT Checklist

User acceptance testing after execution:

1. **Trial Initialization**
   - [ ] Create new tenant via signup
   - [ ] Verify trialEndDate is set to +30 days UTC
   - [ ] Verify subscriptionTier is 'FREE'

2. **Trial Status Query**
   - [ ] GET /api/subscription/trial-status returns 200
   - [ ] Response includes isActive, daysRemaining, trialEndDate

3. **Webhook Processing**
   - [ ] POST /api/subscription/webhook with valid signature returns 200
   - [ ] Duplicate webhook with same idempotencyKey returns 200 without reprocessing
   - [ ] Invalid signature returns 200 with error message (no 500)

4. **Plan Feature Guard**
   - [ ] Endpoint with @RequirePlan(PRO) returns 403 for FREE user
   - [ ] 403 response includes upgradeUrl
   - [ ] Endpoint without decorator accessible to all authenticated users

5. **Tenant Branding**
   - [ ] GET /api/subscription/branding returns defaults for new tenant
   - [ ] PATCH /api/subscription/branding updates branding fields
   - [ ] GET returns merged values after update

## Known Dependencies

- **TenantContextMiddleware** (libs/data-access/src/tenant-context/): Required by PlanFeatureGuard - populates `request.tenant`
- **EmailService** (libs/feature-auth/src/infrastructure/services/): Required by trial warning emails
- **pg-boss**: Required for scheduled trial warning jobs

---

*Generated by gsd:plan-phase revision*
