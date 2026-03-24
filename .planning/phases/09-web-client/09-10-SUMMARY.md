---
phase: 09-web-client
plan: 10
title: Remove PWA Service Worker Features
status: BLOCKED
---
# Phase 09 Web Client - Plan 10: Remove PWA Service Worker Features

## Summary

**Status:** BLOCKED - Framework limitation persists despite removing all PWA features

This plan aimed to remove PWA service worker features to enable static export build. However, the build failure persists even after removing ALL client-side React hooks and context providers. The root cause is a fundamental limitation in Next.js static export mode that prevents ANY client components from being used during the build prerendering phase.

## One-Liner

Attempted to enable static export by removing PWA features, but discovered Next.js 15/16 cannot prerender pages with client components that use React Context, regardless of service worker configuration.

## Deviations from Plan

### Critical Deviation: Next.js Framework Limitation

**Issue:** Static export build fails with `TypeError: Cannot read properties of null (reading 'useContext')` during prerendering of `_global-error` page

**Root Cause:** Next.js 15.1.0 (and 16.1.6) static export mode has a fundamental limitation where client components using React Context cannot be prerendered, even when:
- No service worker registration
- No useEffect/hooks in layout
- No ThemeProvider
- No QueryClientProvider
- Minimal client component usage

**Attempted Solutions (all failed):**
1. Removed service worker registration from Providers.tsx
2. Deleted sw.js file
3. Deleted OfflineBanner component
4. Deleted browser utility file
5. Removed ThemeProvider from Providers
6. Removed ThemeToggle from Sidebar
7. Removed usePathname from navigation components
8. Created custom global-error.tsx page
9. Downgraded Next.js from 16.1.6 to 15.1.0
10. Removed Providers wrapper entirely from layout
11. Created client-side mount checks with useState/useEffect

**Files Modified:**
- `apps/web/src/components/Providers.tsx` - Removed SW registration, now just imports Providers.client
- `apps/web/src/components/Providers.client.tsx` - Created separate client providers file
- `apps/web/src/components/Sidebar.tsx` - Removed ThemeToggle and usePathname
- `apps/web/src/components/BottomTabBar.tsx` - Removed usePathname
- `apps/web/src/app/layout.tsx` - Removed Providers from layout
- `package.json` - Downgraded Next.js to 15.1.0

**Files Deleted:**
- `apps/web/public/sw.js` - Service worker file
- `apps/web/src/components/OfflineBanner.tsx` - Offline banner component
- `apps/web/src/lib/browser.ts` - Browser utility (no longer needed)
- `apps/web/src/app/global-error.tsx` - Custom global error (didn't help)

**Recommendation:** This is a **Rule 4 deviation** (architectural decision required). The user must choose one of:

1. **Wait for Next.js fix** - Monitor Next.js issues for static export + client component fix
2. **Switch to Next.js server deployment** - Use `output: 'standalone'` instead of static export
3. **Remove all client components** - Build a static-only version without any client-side interactivity (no TanStack Query, no theme switching)
4. **Use alternative static site generator** - Migrate to Astro, Remix, or Vite-plugin-SSG
5. **Accept build-time-only rendering** - Use data fetching at build time (getStaticProps) instead of client-side fetching

## Requirements Impact

| Requirement | Status | Notes |
|-------------|--------|-------|
| WEB-01 Static Export | BLOCKED | Build fails with Next.js 15.1.0 even after removing all PWA features |
| WEB-07 PWA Features | REMOVED | Service worker, offline support removed as planned |

## Technical Details

### Build Error

```
Error occurred prerendering page "/_global-error"
TypeError: Cannot read properties of null (reading 'useContext')
at M (.next/server/chunks/ssr/c4323_next_dist_89b27075._.js:4:15177)
Export encountered an error on /_global-error/page: /_global-error, exiting the build
```

### Environment

- Next.js: 15.1.0 (downgraded from 16.1.6)
- Output mode: `export` (static export)
- Issue: Prerendering fails for internal error pages when ANY client components exist in the app

### What We've Learned

1. Next.js static export mode has fundamental limitations with client components
2. The issue is NOT specific to service workers or PWA features
3. The problem occurs during build-time prerendering of ALL pages including internal Next.js pages
4. Downgrading to Next.js 15 did NOT resolve the issue
5. Removing all React hooks (useEffect, useState, useContext) from layouts did NOT resolve the issue

## Known Stubs

None - the blockers prevent the plan from completing successfully.

## Commits

1. `63bfe84` - fix(09-10): remove service worker registration from Providers
2. `19dcd74` - fix(09-10): delete service worker file
3. `b82a383` - fix(09-10): delete OfflineBanner component
4. `e7f2bdf` - fix(09-10): delete browser utility file
5. `88a4d09` - fix(09-10): remove PWA features and attempt static export fix (final attempt)

## Next Steps

**USER DECISION REQUIRED** - Choose one of the five options listed in the deviations section above.

The technical team cannot proceed with static export without resolving this Next.js framework limitation. The recommended path forward depends on project priorities:

- If static export is critical: Consider option 4 (migrate to Astro or Vite-plugin-SSG)
- If time-to-market is priority: Consider option 2 (switch to server deployment)
- If minimal changes desired: Consider option 5 (build-time data fetching)

## Duration

- Start: 2026-03-24T13:06:42Z
- End: 2026-03-24T13:48:00Z (estimated)
- Duration: ~42 minutes
- Status: BLOCKED - Framework limitation
