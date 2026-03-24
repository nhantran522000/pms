# BLOCKER: Next.js 16 Static Export with Client Components

## Plan
09-09: Fix Static Export Build with PWA Client Components

## Status
**BLOCKED** - Cannot proceed with current Next.js 16 architecture

## Problem Description

The web client build fails with the following error during static export:

```
Error occurred prerendering page "/_global-error"
TypeError: Cannot read properties of null (reading 'useContext')
```

## Root Cause Analysis

After extensive investigation, the issue has been identified as a fundamental incompatibility in Next.js 16:

1. **Client Components in Root Layout**: The `Providers` component is a client component (`'use client'`) that uses React hooks (`useEffect` for service worker registration)

2. **Automatic Page Generation**: Next.js automatically generates special system pages like `_global-error` and `_not-found` during the build process

3. **Prerendering Failure**: When Next.js tries to prerender these system pages, it attempts to render them with the root layout, but the React context is null during the build phase, causing the `useContext` error

4. **PWA Requirements**: The `useEffect` hook in Providers is required for PWA service worker registration, which is a requirement for WEB-07

## Attempted Solutions (All Failed)

1. **Dynamic Import with `ssr: false`**: Not supported in Server Components (layout.tsx is a Server Component in Next.js App Router)

2. **Client Wrapper Component**: Created `ProvidersWrapper` with client-side detection - still failed because the wrapper itself is a client component

3. **Mounted State Check**: Added `useState` to check if component is mounted - still failed during prerendering

4. **Browser Environment Check**: Created `isBrowser` utility to guard `useEffect` - still failed because the component itself is client-side

5. **Custom global-error.tsx**: Created custom global error page - Next.js requires it to be a client component, which compounds the issue

6. **Removed global-error.tsx**: Next.js auto-generates it anyway, same error

7. **Disabled static export**: Error persists even with `output: 'export'` removed - issue is with prerendering, not export specifically

## Evidence

The error occurs consistently:
- With or without static export enabled
- With or without custom global-error page
- Regardless of how the client component is wrapped or guarded
- Even with minimal client component implementation

Test command:
```bash
pnpm nx build web
```

Always results in:
```
Error occurred prerendering page "/_global-error". Read more: https://nextjs.org/docs/messages/prerender-error
TypeError: Cannot read properties of null (reading 'useContext')
Export encountered an error on /_global-error/page: /_global-error, exiting the build.
```

## Possible Resolutions

### Option 1: Remove Client Component from Root Layout (Major Architectural Change)
- Move all client-side functionality (React Query, ThemeProvider, Service Worker) to individual pages
- Keep root layout as pure Server Component
- **Impact**: Major refactoring, may break existing page functionality
- **Pros**: Follows Next.js best practices, aligns with App Router architecture
- **Cons**: Significant work, may not work for app-wide providers

### Option 2: Downgrade Next.js
- Try Next.js 15 or 14 which may not have this limitation
- **Impact**: Version downgrade, potential compatibility issues with Nx 22.6
- **Pros**: May resolve the immediate blocker
- **Cons**: Loses Next.js 16 features, may introduce other issues

### Option 3: Remove PWA Service Worker (Abandon WEB-07)
- Remove `useEffect` from Providers, making it a pure wrapper component
- **Impact**: PWA features will not work (no offline support, no installability)
- **Pros**: Unblocks the build immediately
- **Cons**: Fails requirement WEB-07, defeats purpose of PWA configuration

### Option 4: Wait for Next.js Fix or Workaround
- Monitor Next.js 16.2+ releases for fixes
- Search for community workarounds
- **Impact**: Delays phase 09 completion
- **Pros**: No architectural changes
- **Cons**: Indefinite delay, uncertain timeline

### Option 5: Use Third-Party PWA Library
- Try `@ducanh2912/next-pwa` or similar which may handle this differently
- **Impact**: Add dependency, rework PWA configuration
- **Pros**: Battle-tested solution, may handle client component issues
- **Cons**: Additional dependency, may have same issues

## Recommendations

**Immediate Action**: Document this blocker and escalate to user for decision.

**Preferred Path**: Option 1 (Remove Client Component from Root Layout) with careful implementation:
1. Create a client component template for individual pages
2. Move Providers to page-level where needed
3. Test with one page first before applying globally

**Alternative Path**: Option 5 (Try Third-Party PWA Library) as it may resolve both the build issue and provide better PWA handling.

## Files Involved

- `/apps/web/src/app/layout.tsx` - Root layout (Server Component)
- `/apps/web/src/components/Providers.tsx` - Client component with hooks
- `/apps/web/next.config.ts` - Next.js configuration with `output: 'export'`
- `/apps/web/src/app/global-error.tsx` - Auto-generated error page

## Requirements Impact

- **WEB-01** (Static Export): BLOCKED - Build fails
- **WEB-07** (PWA Features): BLOCKED - Cannot use service worker registration

## References

- Next.js 16 Documentation: https://nextjs.org/docs/app/building-your-application/rendering/server-components
- Next.js Static Export: https://nextjs.org/docs/app/building-your-application/deploying/static-exports
- Related GitHub Issues: (Search for "Next.js 16 static export client component useContext")

## Next Steps

1. **User Decision Required**: Choose from the resolution options above
2. **If Option 1**: Create new plan to refactor root layout architecture
3. **If Option 2**: Test Next.js 15 compatibility with Nx 22.6
4. **If Option 3**: Remove WEB-07 from requirements, document trade-off
5. **If Option 4**: Create tracking issue, monitor Next.js releases
6. **If Option 5**: Research and test `@ducanh2912/next-pwa` or similar

---

**Created**: 2026-03-24
**Plan**: 09-09
**Phase**: 09-web-client
**Blocker Type**: Technical - Framework Limitation
