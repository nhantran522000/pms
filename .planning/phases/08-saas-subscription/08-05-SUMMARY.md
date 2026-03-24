---
phase: 08-saas-subscription
plan: 05
title: "Tenant Branding Service and API"
subsystem: "feature-subscription"
tags: ["branding", "jsonb", "defaults", "customization"]

# Dependency Graph
requires:
  - "08-01" # Subscription domain module with Tenant.branding field
  - "08-04" # Feature guard infrastructure (for consistency)
provides:
  - "branding-api" # Branding CRUD endpoints for other features
affects:
  - "frontend" # Frontend can use branding API for UI customization

# Tech Stack
added:
  - "Zod validation for hex colors and URLs"
  - "JSONB merging with system defaults"
patterns:
  - "Defaults merging pattern: ?? for nullable fields, || for strings"
  - "DTO validation with Zod schemas"
  - "Service layer with PrismaClient injection"

# Key Files Created/Modified
created:
  - "libs/feature-subscription/src/application/dto/branding.dto.ts"
  - "libs/feature-subscription/src/application/services/branding.service.ts"
  - "libs/feature-subscription/src/presentation/controllers/branding.controller.ts"
modified:
  - "libs/feature-subscription/src/subscription.module.ts"
  - "libs/feature-subscription/src/index.ts"
  - "apps/api/src/app.module.ts"

# Key Decisions
decisions:
  - "Use ?? for logoUrl to allow explicit null (user can clear logo)"
  - "Use || for primaryColor/appName to use system defaults when null/undefined"
  - "Remove undefined values from JSONB to keep data clean"
  - "Hex color validation with regex /^#[0-9A-Fa-f]{6}$/"
  - "AppName max 50 characters to prevent abuse"

# Metrics
duration_seconds: 45
tasks_completed: 4
files_created: 3
files_modified: 3
commits: 4
completed_date: "2026-03-24T11:23:29Z"
---

# Phase 08 Plan 05: Tenant Branding Service and API Summary

## One-Liner

Tenant branding system with JSONB storage, Zod validation, and system defaults for primaryColor (#3b82f6), appName (PMS), and logoUrl (null).

## Implementation Details

### Task 1: BrandingDto with Zod Validation
Created `libs/feature-subscription/src/application/dto/branding.dto.ts`:
- `UpdateBrandingSchema`: Validates partial updates with hex color regex, appName length (max 50), and nullable URL
- `BrandingResponseSchema`: Response shape with all fields required (defaults applied)
- `BRANDING_DEFAULTS`: System defaults constant (`#3b82f6`, `PMS`, `null`)

### Task 2: BrandingService with Defaults Merging
Created `libs/feature-subscription/src/application/services/branding.service.ts`:
- `getBranding(tenantId)`: Retrieves tenant branding, merges with defaults
- `updateBranding(tenantId, dto)`: Updates branding, removes undefined values, returns merged result
- `mergeWithDefaults(private)`: Applies system defaults using `??` for nullable fields and `||` for strings

### Task 3: BrandingController with GET/PATCH Endpoints
Created `libs/feature-subscription/src/presentation/controllers/branding.controller.ts`:
- `GET /subscription/branding`: Returns tenant branding with defaults applied
- `PATCH /subscription/branding`: Updates tenant branding (partial updates supported)
- Both endpoints protected by `JwtAuthGuard`
- Tenant ID extracted from JWT payload (`req.user.tenantId`)

### Task 4: Module Wiring and Integration
Updated module configuration:
- Added `BrandingService` to SubscriptionModule providers and exports
- Added `BrandingController` to SubscriptionModule controllers
- Exported both from `libs/feature-subscription/src/index.ts`
- Imported `SubscriptionModule` in `AppModule`

## Deviations from Plan

None - plan executed exactly as written.

## Verification Results

All automated verifications passed:
- ✓ BRANDING_DEFAULTS exported with #3b82f6 primaryColor
- ✓ BrandingService has getBranding, updateBranding, mergeWithDefaults methods
- ✓ BrandingController has @Get() and @Patch() endpoints with JwtAuthGuard
- ✓ SubscriptionModule includes BrandingController and BrandingService
- ✓ AppModule imports SubscriptionModule

## Known Stubs

None - all functionality fully implemented.

## Success Criteria Met

- [x] Branding stored as JSONB on Tenant model (from 08-01)
- [x] GET /subscription/branding returns { primaryColor, appName, logoUrl } with defaults
- [x] PATCH /subscription/branding updates branding fields
- [x] Defaults applied: primaryColor="#3b82f6", appName="PMS", logoUrl=null

## Integration Points

- **Frontend**: Can call `GET /subscription/branding` to retrieve theme colors and app name for UI customization
- **Tenant creation**: Branding starts as `null`, defaults applied automatically
- **Future**: Admin UI could provide branding settings page using PATCH endpoint
