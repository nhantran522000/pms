---
phase: 09-web-client
plan: 09
title: PWA Client Component Static Export Build Failure
summary: Identified critical Next.js 16 incompatibility with client components using hooks in root layout during static export prerendering
status: blocked
tags: [nextjs, static-export, pwa, client-components, blocker]
requirements: [WEB-01, WEB-07]
dependency_graph:
  requires: []
  provides: []
  affects: [09-10]
tech_stack:
  added: []
  patterns: []
key_files:
  created:
    - path: apps/web/src/lib/browser.ts
      purpose: Browser environment detection utility
    - path: apps/web/src/components/ProvidersWrapper.tsx
      purpose: Client wrapper component (attempted fix)
    - path: apps/web/src/components/Providers.test.tsx
      purpose: Test minimal provider component
    - path: .planning/phases/09-web-client/09-09-BLOCKER.md
      purpose: Blocker documentation with resolution options
  modified:
    - path: apps/web/src/app/layout.tsx
      changes: Attempted dynamic import, reverted to static import
    - path: apps/web/src/components/Providers.tsx
      changes: Added isBrowser guard for useEffect
decisions: []
metrics:
  duration: "45 minutes"
  completed_date: "2026-03-24T13:37:00Z"
---

# Phase 09 Plan 09: PWA Client Component Static Export Build Failure Summary

## Objective

Fix the static export build failure caused by PWA client component incompatibility using Next.js dynamic import with `ssr: false`.

**Status**: ❌ **BLOCKED** - Critical Next.js 16 framework limitation discovered

## Problem Statement

The web client static export build fails with error:

```
Error occurred prerendering page "/_global-error"
TypeError: Cannot read properties of null (reading 'useContext')
Export encountered an error on /_global-error/page: /_global-error, exiting the build.
```

## Root Cause

Next.js 16 has a fundamental incompatibility when using client components with React hooks in the root layout:

1. The `Providers` component is a client component (`'use client'`) that uses `useEffect` for PWA service worker registration (WEB-07 requirement)
2. Next.js automatically generates special system pages (`_global-error`, `_not-found`) during build
3. When prerendering these system pages, Next.js attempts to render with the root layout
4. React context is null during this prerendering phase, causing `useContext` to fail
5. The error occurs regardless of static export configuration - it's a prerendering issue

## Execution Summary

### Attempted Solutions (All Failed)

1. **Dynamic Import with `ssr: false`**: Not supported in Server Components (layout.tsx is a Server Component in App Router)

2. **Client Wrapper Component (`ProvidersWrapper`)**: Created wrapper with client-side detection using `useState` - still failed during prerendering

3. **Mounted State Check**: Added `useState` to check if component is mounted before rendering - still failed

4. **Browser Environment Check**: Created `isBrowser` utility to guard `useEffect` execution - still failed because the component itself is client-side

5. **Custom global-error.tsx**: Created custom error page - Next.js requires it to be a client component, compounding the issue

6. **Removed global-error.tsx**: Next.js auto-generates it anyway with same error

7. **Disabled static export**: Error persists even without `output: 'export'` - issue is prerendering, not export

### Files Modified

- `apps/web/src/app/layout.tsx`: Reverted to static import (dynamic import not supported)
- `apps/web/src/components/Providers.tsx`: Added `isBrowser` check for useEffect
- `apps/web/src/lib/browser.ts`: Created browser detection utility
- `apps/web/src/components/ProvidersWrapper.tsx`: Created client wrapper (failed)
- `apps/web/src/components/Providers.test.tsx`: Created minimal test provider (failed)

### Commits

- `b3eb3d7`: feat(09-09): attempt PWA client component fixes for static export
- `e9608f3`: docs(09-09): document Next.js 16 static export blocker

## Deviations from Plan

### Critical Deviation: Plan Cannot Be Completed

The plan assumed this was a standard configuration issue solvable with dynamic imports. After extensive investigation, this is confirmed as a **fundamental Next.js 16 framework limitation** requiring architectural changes.

**Scope Boundary**: Deviation rule 4 applies - this requires significant structural modification (removing client components from root layout or downgrading Next.js).

## Resolution Options

### Option 1: Remove Client Component from Root Layout (Major Refactor)
- Move all client-side functionality to individual pages
- **Impact**: Major refactoring, breaks existing app-wide provider pattern
- **Estimate**: 2-3 hours
- **Risk**: High - may break existing functionality

### Option 2: Downgrade Next.js
- Try Next.js 15 or 14
- **Impact**: Version downgrade, Nx compatibility unknown
- **Estimate**: 1 hour to test
- **Risk**: Medium - may introduce other issues

### Option 3: Remove PWA Service Worker (Abandon WEB-07)
- Remove useEffect from Providers
- **Impact**: PWA features won't work (no offline support)
- **Estimate**: 15 minutes
- **Risk**: Low - but fails requirement WEB-07

### Option 4: Use Third-Party PWA Library
- Try `@ducanh2912/next-pwa` or similar
- **Impact**: Add dependency, rework PWA config
- **Estimate**: 1-2 hours
- **Risk**: Medium - library may have same issues

### Option 5: Wait for Next.js Fix
- Monitor Next.js 16.2+ releases
- **Impact**: Delays phase 09 completion indefinitely
- **Estimate**: Unknown
- **Risk**: High - uncertain timeline

## Requirements Impact

- **WEB-01** (Static Export): ❌ BLOCKED - Build fails with exit code 1
- **WEB-07** (PWA Features): ❌ BLOCKED - Cannot use service worker registration

## Known Stubs

None - this is a framework-level blocker, not a code stub issue.

## Self-Check

**Status**: ❌ FAILED - Plan objectives not met due to framework limitation

**Missing Items**:
- Static export build does not succeed (exit code 1)
- Build output directory `apps/web/out/` is not created
- Both WEB-01 and WEB-07 requirements unmet

**Completed Items**:
- Root cause identified and documented
- Multiple solutions attempted and documented
- Resolution options provided with trade-offs
- Blocker documentation created for user decision

## Recommendations

**Immediate Action**: User decision required on resolution path.

**Recommended Path**: **Option 1** (Remove Client Component from Root Layout) OR **Option 4** (Try Third-Party PWA Library)

**Rationale**:
- Option 1 aligns with Next.js App Router best practices
- Option 4 may provide better PWA handling with less architectural change
- Options 2 and 3 have significant downsides
- Option 5 causes indefinite delay

## Next Steps

1. **User Decision**: Review blocker documentation and choose resolution path
2. **If Option 1**: Create new plan to refactor root layout architecture
3. **If Option 4**: Create new plan to integrate `@ducanh2912/next-pwa`
4. **Otherwise**: Document decision and update requirements

## References

- **Blocker Details**: `.planning/phases/09-web-client/09-09-BLOCKER.md`
- **Next.js 16 Docs**: https://nextjs.org/docs/app/building-your-application/rendering/server-components
- **Next.js Static Export**: https://nextjs.org/docs/app/building-your-application/deploying/static-exports

---

**Execution Time**: 45 minutes
**Tasks Attempted**: 2 of 4 (Tasks 1-2 completed, Task 3 blocked by framework limitation)
**Outcome**: Framework blocker identified and documented, awaiting user decision
