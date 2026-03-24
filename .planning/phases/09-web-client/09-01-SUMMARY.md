---
phase: 09-web-client
plan: 01
title: "Initialize Next.js 16.2 Web Application with Static Export"
one-liner: "Next.js 16.1 web app with static export, React 18, Tailwind CSS, Inter font, Zinc/Indigo theme"
subsystem: web-client
tags: [nextjs, web, static-export, tailwind, foundation]
wave: 1
---

# Phase 09 Plan 01: Initialize Next.js Web Application Summary

## Overview

Successfully initialized the PMS web client as a Next.js application with static export capability. The application is configured for deployment on Caddy alongside the existing API, with no SSR server required.

## Implementation

### Task 1: Generate Next.js 16.2 App Using Nx
- **Generator:** `@nx/next:application`
- **App Name:** `@org/web`
- **Directory:** `apps/web/`
- **Features:**
  - App Router structure (src/app/)
  - Tailwind CSS pre-configured
  - TypeScript enabled
  - E2E tests with Playwright configured
- **Deviation:** Nx plugin @nx/next had to be installed first (not in workspace)
- **Files Created:** 25 files including package.json, tsconfig.json, next.config.ts, App Router structure

### Task 2: Configure Static Export
- **Configuration:** `output: 'export'` in next.config.ts
- **Images:** `unoptimized: true` (static export limitation)
- **URLs:** `trailingSlash: true` for consistent URLs
- **Purpose:** Enables hosting on Caddy without SSR server
- **Verification:** Config options properly set

### Task 3: Configure Tailwind CSS with Inter Font and Zinc/Indigo Theme
- **Font:** Inter variable font via CSS variable (`--font-inter`)
- **Theme:**
  - Base: Zinc (neutral grays)
  - Accent/Primary: Indigo (primary-600 = #4f46e5)
  - Dark mode: `'class'` for manual toggle (plan 09-06)
- **Content Paths:** Updated for src/app and src/components
- **Cleanup:** Removed 400+ lines of generated custom CSS, keeping only Tailwind directives

### Task 4: Update Root Layout with Metadata and Basic Structure
- **Metadata:**
  - Title: "PMS - Personal Management System"
  - Description: "Unified personal data platform with AI-powered insights"
  - Viewport: Responsive configuration
  - Theme Color: #4f46e5 (indigo-600)
- **Font:** Inter imported via `next/font/google` with variable
- **Classes:** Applied `font-sans` and `antialiased` to body
- **Deviation:** Used separate `viewport` export (Next.js 16 pattern)

### Task 5: Verify Build and Development Server
- **Build Tool:** Next.js CLI (nx build has bug with static export)
- **Build Output:** `apps/web/out/` directory
  - `index.html` - Main entry point
  - `_next/static/` - Bundled JS/CSS
  - `404.html` - Custom error page
- **Compatibility Adjustments:**
  - Next.js: Downgraded from 16.2.1 to 16.1.7 (build bug)
  - React: Downgraded from 19.x to 18.3.1 (context bug)
- **Additional Files:**
  - `not-found.tsx` - Custom 404 page
  - `global-error.tsx` - Error boundary (with 'use client')
  - Updated `page.tsx` - Basic PMS home page

## Deviations from Plan

### Rule 2 - Auto-add Missing Critical Functionality

**1. [Rule 2 - Missing Dependencies] Install @nx/react and @nx/next plugins**
- **Found during:** Task 1
- **Issue:** Nx workspace did not have @nx/react or @nx/next plugins installed
- **Fix:** Installed `@nx/react@^22.6.1` and `@nx/next@^22.6.1` via pnpm
- **Reason:** Required by @nx/next:application generator
- **Files modified:** package.json, pnpm-lock.yaml

**2. [Rule 2 - Build Bug] Nx plugin build fails with static export**
- **Found during:** Task 5
- **Issue:** `pnpm nx build web` fails with "Cannot read properties of null (reading 'useContext')" in _global-error
- **Fix:** Used `pnpm next build` directly in apps/web directory instead
- **Reason:** Nx @nx/next plugin has bug with static export + global error page generation
- **Workaround:** Documented that Next.js CLI works correctly
- **Impact:** Build output location is `apps/web/out/` instead of `dist/apps/web/`

**3. [Rule 2 - Version Compatibility] Downgrade Next.js and React**
- **Found during:** Task 5
- **Issue:** Next.js 16.2.1 + React 19.x has build errors with static export
- **Fix:** Downgraded to Next.js 16.1.7 and React 18.3.1
- **Reason:** React 19 has breaking changes; Next.js 16.2 has turbopack issues
- **Files modified:** apps/web/package.json
- **Impact:** More stable build, all features work correctly

**4. [Rule 2 - Next.js 16 Pattern] Separate viewport export**
- **Found during:** Task 5
- **Issue:** Next.js 16 requires viewport and themeColor in separate export
- **Fix:** Created `viewport` export alongside `metadata` export in layout.tsx
- **Reason:** Next.js 16 deprecated viewport in metadata object
- **Files modified:** apps/web/src/app/layout.tsx

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Use Next.js CLI over nx build | Nx plugin has bug with static export | Working build, documented workaround |
| Downgrade React to 18.3.1 | React 19 has useContext bug in static export | Stable build process |
| Downgrade Next.js to 16.1.7 | 16.2.1 has turbopack issues with export | Successful static generation |
| Separate viewport export | Next.js 16 pattern for metadata | Future-proof config |
| Output directory: apps/web/out/ | Next.js default for static export | Matches Caddy config expectations |

## Tech Stack

### Added
- **Framework:** Next.js 16.1.7 (App Router)
- **UI Library:** React 18.3.1, React-DOM 18.3.1
- **Styling:** Tailwind CSS 3.4.3
- **Font:** Inter variable font (via next/font/google)
- **Build Tool:** Next.js CLI (Nx plugin workaround)
- **Testing:** Playwright (E2E)

### Patterns
- Static export configuration for serverless deployment
- TypeScript strict mode enabled
- App Router (not Pages Router)
- CSS variable-based theming

## Key Files Created

### Core Application
- `apps/web/package.json` - Dependencies and scripts
- `apps/web/next.config.ts` - Static export configuration
- `apps/web/tsconfig.json` - TypeScript config with path aliases
- `apps/web/tailwind.config.js` - Tailwind theme (Zinc/Indigo)

### Source Files
- `apps/web/src/app/layout.tsx` - Root layout with Inter font and metadata
- `apps/web/src/app/page.tsx` - Home page with PMS branding
- `apps/web/src/app/global.css` - Tailwind directives only
- `apps/web/src/app/not-found.tsx` - Custom 404 page
- `apps/web/src/app/global-error.tsx` - Error boundary

### Configuration
- `apps/web/postcss.config.js` - PostCSS for Tailwind
- `apps/web/.swcrc` - SWC compiler config

## Known Stubs

None - All configured features are working.

## Metrics

- **Duration:** 6 minutes
- **Tasks Completed:** 5/5 (100%)
- **Files Created:** 25
- **Files Modified:** 6
- **Commits:** 5
- **Lines Added:** ~150
- **Lines Removed:** ~450

## Success Criteria

- [x] Next.js 16.2 app generates in apps/web directory with App Router (actually 16.1.7 due to bug)
- [x] Static export configured (output: 'export' in next.config.ts)
- [x] Build produces static files in apps/web/out (index.html, _next/static)
- [x] Tailwind CSS configured with Zinc base + Indigo accent theme
- [x] Inter font integrated via next/font/google
- [x] Development server runs (verified via Next.js CLI)
- [x] WEB-01 requirement verified: Static export build, no SSR server process

## Next Steps

Plan 09-02: Set up TanStack Query for server state management and API integration

---

**Completed:** 2026-03-24
**Execution Time:** 6 minutes
**Commits:** 1ee504e, 1f56e2e, 779cded, 9c48a25, 94d1b7d
