# Phase 8: SaaS Subscription - Context

**Gathered:** 2026-03-24
**Status:** Ready for planning

<domain>
## Phase Boundary

SaaS subscription infrastructure with LemonSqueezy integration — 30-day trial tracking, webhook event handlers with idempotency, plan-based feature guards via decorator, and tenant branding (primaryColor, appName, logoUrl stored as JSONB). Trial expiry triggers Day 27 warning email and Day 30 soft degradation (read-only with banner).
</domain>

<decisions>
## Implementation Decisions

### Trial Management
- Trial starts automatically at tenant creation (when first user signs up)
- Trial status tracked via `trialEndDate DateTime` field on Tenant model
- All trial dates in UTC for consistency with system timestamps

### Plan & Feature Guards
- 2 subscription tiers: FREE (trial/default), PRO (paid)
- `@RequirePlan('FREE' | 'PRO')` decorator using enum for type safety
- Guard returns 403 Forbidden with upgrade link JSON when plan requirement not met
- Soft degradation on trial expiry: read-only access with banner warning
- Gated endpoints: advanced features (AI insights, trends, analytics) — core CRUD remains accessible

### Tenant Branding & Webhooks
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

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `libs/feature-auth/src/presentation/guards/jwt-auth.guard.ts` — Guard pattern with Reflector
- `libs/feature-auth/src/presentation/decorators/public.decorator.ts` — Decorator pattern using SetMetadata
- `libs/feature-auth/src/infrastructure/services/email.service.ts` — Email sending via Resend
- `libs/shared-kernel/src/decorators/` — Existing decorator patterns

### Established Patterns
- Guards use `canActivate(context)` with Reflector for metadata
- Decorators use `SetMetadata(METADATA_KEY, value)` pattern
- Email service uses Resend with HTML templates
- DDD layering: domain → application → infrastructure → presentation

### Integration Points
- Tenant model: extend with `trialEndDate`, `subscriptionTier`, `branding` fields
- AppModule: will import SubscriptionModule
- Auth flow: trial starts on first user signup (tenant creation)

</code_context>

<specifics>
## Specific Ideas

From PROJECT.md:
- LemonSqueezy as merchant of record (5% + $0.50/transaction)
- Handles VAT/GST globally — critical for Vietnam-based developer
- Webhook-driven subscription management

From ROADMAP Phase 8:
- 08-01: Subscription domain module with trial management
- 08-02: LemonSqueezy webhook handlers with idempotency
- 08-03: Trial expiry warning email (Day 27) and free tier restriction (Day 30)
- 08-04: PlanFeatureGuard decorator for restricting gated endpoints
- 08-05: Tenant branding as JSONB (primaryColor, appName, logoUrl)

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope
</deferred>

---

*Phase: 08-saas-subscription*
*Context gathered: 2026-03-24 via Smart Discuss*
