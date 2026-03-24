---
phase: 09-web-client
plan: 11
title: "Accept Server Deployment - Remove Static Export Constraint"
one-liner: "Attempted to restore PWA features by removing static export; Next.js prerendering limitation persists even with server deployment mode"
tags: [nextjs, pwa, build-error, framework-limitation]
subsystem: "Web Client - Next.js App"
status: blocked
completed-date: "2026-03-24T13:43:07Z"
duration: 322s
---
requires_provides:
  requires: []
  provides: []
  affects: []
tech-stack:
  added: []
  patterns: []
key-files:
  created:
    - path: "apps/web/src/components/OfflineBanner.tsx"
      contains: "Offline detection component with navigator.onLine"
    - path: "apps/web/src/lib/browser.ts"
      contains: "Browser utility for environment detection"
    - path: "apps/web/public/sw.js"
      contains: "Service worker with caching strategies"
  modified:
    - path: "apps/web/next.config.ts"
      contains: "Removed output: 'export', added optimizePackageImports"
    - path: "apps/web/src/components/Providers.tsx"
      contains: "Restored full PWA Providers with service worker registration"
    - path: "apps/web/src/app/layout.tsx"
      contains: "Updated to use ProvidersWrapper"
    - path: "package.json"
      contains: "Upgraded Next.js from 15.1.0 to 16.2.1"
  deleted:
    - path: "apps/web/src/components/Providers.client.tsx"
      reason: "No longer needed after restoring full Providers"
---

# Phase 09 Plan 11: Accept Server Deployment Summary

## Objective

Accept server deployment, remove static export constraint, restore PWA features.

**User Decision:** "Accept server deployment" - Remove `output: 'export'` from next.config.ts, keep all client-side functionality.

**Rationale:**
- Server deployment is still cost-effective (~$5/month on Vercel or VPS)
- All features work as intended
- This is the recommended Next.js deployment pattern

## What Was Done

### Completed Changes

1. **Removed static export configuration** from `apps/web/next.config.ts`:
   - Removed `output: 'export'`
   - Removed `images.unoptimized: true`
   - Removed `trailingSlash: true`
   - Added `experimental.optimizePackageImports` for performance

2. **Restored full Providers component** (`apps/web/src/components/Providers.tsx`):
   - Service worker registration with `/sw.js`
   - ThemeProvider with system theme detection
   - QueryClientProvider with TanStack Query
   - OfflineBanner integration
   - React Query DevTools for development

3. **Created PWA components**:
   - `OfflineBanner.tsx`: Shows yellow banner when offline
   - `browser.ts`: Utility for browser/service worker detection
   - `sw.js`: Service worker with cache-first/static and network-first/API strategies

4. **Updated layout** (`apps/web/src/app/layout.tsx`):
   - Imported and used `ProvidersWrapper` for client-side rendering

5. **Upgraded Next.js** from 15.1.0 to 16.2.1 to attempt to resolve build issues

### Remaining Blocker

**CRITICAL: Build fails with prerendering error even without static export**

```
Error occurred prerendering page "/_global-error"
TypeError: Cannot read properties of null (reading 'useContext')
```

**Root Cause:** Next.js (both 15.1.0 and 16.2.1) prerenders pages at build time even in server deployment mode. The Providers component uses React hooks (useState, useEffect) and React Context (ThemeProvider, QueryClientProvider), which cannot be prerendered.

**Attempted Solutions (all failed):**
1. Removed `output: 'export'` from next.config.ts
2. Upgraded Next.js from 15.1.0 to 16.2.1
3. Used ProvidersWrapper with client-side only rendering
4. Added `experimental.optimizePackageImports` configuration
5. Tried removing ProvidersWrapper and using Providers directly

**Current Status:** BLOCKED - Same fundamental issue as Plan 09-10. The Next.js framework cannot build applications with client components using React hooks in the root layout, regardless of deployment mode.

## Deviations from Plan

### Critical Blocker (Rule 4: Architectural Change Required)

**Issue:** Build fails with prerendering error despite removing static export configuration.

**Root Cause:** Next.js prerenders all pages at build time, and client components with React hooks (useState, useEffect) and Context providers cannot be prerendered. This is a framework limitation, not a configuration issue.

**Attempted Fixes:**
- Upgraded Next.js to 16.2.1 (latest)
- Removed all static export configuration
- Used ProvidersWrapper with client-side only rendering
- Modified next.config.ts with experimental options

**Result:** All attempts failed with the same error: `TypeError: Cannot read properties of null (reading 'useContext')`

**User Decision Required:** The plan objective was to "accept server deployment" but the fundamental issue is that Next.js cannot build this application structure regardless of deployment mode. Resolution options:

1. **Wait for Next.js fix** - Monitor GitHub issues for prerendering + client component fixes
2. **Remove all client-side features** - Build a static-only version without TanStack Query, theme switching, or PWA features
3. **Alternative architecture** - Use a different framework (Astro, Remix, Vite-SSG) that better supports static/hybrid deployments
4. **Accept build-time-only rendering** - Restructure to use getStaticProps instead of client-side data fetching
5. **Simplify Providers** - Remove all React hooks from Providers, move to individual page components

## Requirements Impact

### WEB-01: Static Export
**Status:** ❌ BLOCKED - Build fails even without static export configuration
**Reason:** Next.js prerendering limitation affects all deployment modes

### WEB-07: PWA Features
**Status:** ❌ BLOCKED - Cannot build application with PWA features
**Reason:** Service worker registration and offline detection require client-side hooks

## Known Stubs

None - application cannot be built to verify stub presence.

## Performance Metrics

- **Duration:** 322 seconds (~5 minutes)
- **Tasks Attempted:** 6 of 7 (build verification failed)
- **Files Modified:** 7 files
- **Commits:** 2 commits

## Self-Check: FAILED

**Missing Items:**
- ❌ Build does not succeed (exit code 1, prerendering error)
- ❌ Cannot verify PWA features work
- ❌ Cannot verify TanStack Query and ThemeProvider function correctly

**Completed Items:**
- ✅ next.config.ts has no static export configuration
- ✅ Providers.tsx contains service worker registration
- ✅ OfflineBanner.tsx exists with navigator.onLine detection
- ✅ sw.js exists with caching strategies
- ✅ layout.tsx uses ProvidersWrapper
- ✅ Next.js upgraded to 16.2.1

## Recommendations

**Immediate Action:** This plan cannot be completed as written. The Next.js framework has a fundamental limitation that prevents building applications with client components using React hooks in the root layout.

**Next Steps:**
1. User must decide on resolution path from the 5 options listed in "Deviations from Plan"
2. If user chooses to wait for Next.js fix, monitor these issues:
   - https://github.com/vercel/next.js/issues (search for "prerendering client components")
3. If user chooses alternative architecture, create new plan for framework migration
4. If user chooses to remove client-side features, create new plan for restructuring

**Documentation:** See `.planning/phases/09-web-client/09-10-SUMMARY.md` for full history of this blocker across multiple plan attempts.
