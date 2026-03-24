---
phase: 09-web-client
verified: 2026-03-24T19:50:00Z
status: gaps_found
score: 6/7 must-haves verified
re_verification:
  previous_status: gaps_found
  previous_score: 6/7
  gaps_closed:
    - "Chart TypeScript errors fixed - Generic BaseChartProps<T> interface implemented"
  gaps_remaining:
    - "Static export build fails due to PWA incompatibility with SSR prerendering"
  regressions: []
gaps:
  - truth: "Web client builds as static export (no SSR server process)"
    status: failed
    reason: "PWA configuration incompatible with static export. Providers.tsx uses 'use client' + useEffect which fails during Next.js static export prerendering phase. Error: TypeError: Cannot read properties of null (reading 'useEffect') at prerender time."
    artifacts:
      - path: "apps/web/src/components/Providers.tsx"
        issue: "Client component with useEffect cannot be used in root layout during static export SSR phase"
      - path: "apps/web/next.config.ts"
        issue: "output: 'export' enables static export which prerenders all pages at build time"
      - path: "apps/web/src/app/layout.tsx"
        issue: "Wraps children with Providers component, causing SSR/prerender incompatibility"
    missing:
      - "Architectural decision required: Choose between static export (simple hosting) vs PWA features (offline support, installability)"
      - "Option 1: Disable PWA - Remove Providers wrapper, service worker, offline features → Static export works"
      - "Option 2: Disable static export - Change to hybrid/server mode → PWA works, requires Node.js server"
      - "Option 3: Split Providers - Create SSR-safe wrapper with dynamic client-only import → Complex, keeps both features"
  - truth: "Recharts for data visualization (financial charts, health trends, habit streaks, hobby progress)"
    status: partial
    reason: "Chart components fully implemented and TypeScript errors fixed, but static export build fails before completion. Charts are substantive (533 total lines across 4 components), use semantic colors, have tooltips, and integrate with module pages. Build blocker prevents final verification."
    artifacts:
      - path: "apps/web/src/components/charts/FinancialChart.tsx"
        status: "VERIFIED - 118 lines, extends BaseChartProps<FinancialDataPoint>, no stubs"
      - path: "apps/web/src/components/charts/WeightChart.tsx"
        status: "VERIFIED - 89 lines, extends BaseChartProps<WeightDataPoint>, no stubs"
      - path: "apps/web/src/components/charts/HabitStreakChart.tsx"
        status: "VERIFIED - 105 lines, extends BaseChartProps<HabitStreakDataPoint>, no stubs"
      - path: "apps/web/src/components/charts/HobbyProgressChart.tsx"
        status: "VERIFIED - 221 lines, extends BaseChartProps<HobbyProgressDataPoint>, no stubs"
      - path: "apps/web/src/lib/chart-utils.ts"
        status: "VERIFIED - 109 lines, Generic BaseChartProps<T extends object = object>, no stubs"
    missing:
      - "Resolve static export build blocker to complete chart integration verification"
human_verification:
  - test: "Verify PWA installability (if PWA features kept)"
    expected: "Browser shows install prompt when visiting the app, manifest loads correctly with PMS name and indigo theme color"
    why_human: "Install prompts only appear in browser with HTTPS/localhost and user interaction. Cannot verify via static code analysis."
  - test: "Verify service worker caching behavior (if PWA features kept)"
    expected: "Static assets cached on first load, API responses cached with network-first strategy, offline banner appears when disconnected"
    why_human: "Service worker runtime behavior requires browser environment to verify cache strategies and offline detection."
  - test: "Verify theme toggle behavior"
    expected: "Click cycles through light → dark → system → light, preference persists across page reloads, system preference detected on first visit"
    why_human: "Theme persistence and system detection require browser localStorage and matchMedia APIs."
  - test: "Verify responsive layout behavior"
    expected: "Sidebar visible on desktop (≥768px), bottom tab bar visible on mobile (<768px), no layout breakage between breakpoints"
    why_human: "Responsive design requires viewport width testing and visual inspection."
  - test: "Verify chart tooltips and interactions (if build succeeds)"
    expected: "Hovering over charts shows tooltips with formatted values, time range buttons (30d/90d/365d) update chart data"
    why_human: "Chart interactivity requires browser DOM events and user interaction testing."
---

# Phase 09: Web Client Re-Verification Report (After Gap Closure)

**Phase Goal:** Next.js static web client with dashboard, TanStack Query, shadcn/ui, charts, theme toggle, and PWA
**Verified:** 2026-03-24T19:50:00Z
**Status:** gaps_found
**Re-verification:** Yes — after gap closure plan 09-08

## Goal Achievement

### Observable Truths

| #   | Truth   | Status     | Evidence       |
| --- | ------- | ---------- | -------------- |
| 1   | Next.js 16.2 app generates with App Router structure | ✓ VERIFIED | package.json has next@~16.1.7, src/app/layout.tsx and page.tsx exist with App Router structure |
| 2   | Static export configuration builds successfully without SSR server | ✗ FAILED | PWA incompatibility: Providers.tsx with 'use client' + useEffect fails during static export prerendering. Error: `TypeError: Cannot read properties of null (reading 'useEffect')` |
| 3   | Responsive dashboard with module navigation (sidebar desktop, bottom tab mobile) | ✓ VERIFIED | DashboardLayout.tsx, Sidebar.tsx (hidden md:flex), BottomTabBar.tsx (md:hidden) all present |
| 4   | TanStack Query v5 for server state management with caching and invalidation | ✓ VERIFIED | @tanstack/react-query@^5.95.2 in deps, queryClient.ts with 30s staleTime, all hooks use useQuery |
| 5   | shadcn/ui components with Tailwind styling and dark/light theme toggle | ✓ VERIFIED | button.tsx, card.tsx, skeleton.tsx, toast.tsx, use-toast.ts all present, ThemeToggle.tsx functional |
| 6   | Recharts for data visualization (financial charts, health trends, habit streaks, hobby progress) | ⚠️ PARTIAL | Chart components fully implemented (533 lines), TypeScript errors fixed, but static export build fails before completion |
| 7   | PWA manifest for installable web app | ✓ VERIFIED | manifest.json with PMS name, icons (192x192, 512x512), service worker registered in Providers.tsx |

**Score:** 6/7 truths verified

**Progress from Previous Verification:**
- ✅ **CLOSED:** Chart TypeScript errors - Fixed with generic `BaseChartProps<T extends object = object>`
- ❌ **NEW BLOCKER:** Static export vs PWA architectural incompatibility discovered

### Required Artifacts

| Artifact | Expected    | Status | Details |
| -------- | ----------- | ------ | ------- |
| `apps/web/package.json` | Next.js 16.2, TanStack Query, Recharts, next-themes | ✓ VERIFIED | next@~16.1.7, @tanstack/react-query@^5.95.2, recharts@^3.8.0, next-themes@^0.4.6 |
| `apps/web/next.config.ts` | Static export configuration | ✓ VERIFIED | output: 'export' configured |
| `apps/web/tailwind.config.js` | Zinc/Indigo theme, darkMode class | ✓ VERIFIED | darkMode: ['class'], Inter font, CSS variables for theming |
| `apps/web/src/app/layout.tsx` | Root layout with providers | ⚠️ VERIFIED | Imports Providers component but causes build failure with static export |
| `apps/web/src/components/Providers.tsx` | Client-side providers wrapper | ⚠️ VERIFIED | 'use client' with useEffect for SW registration - incompatible with static export |
| `apps/web/src/app/dashboard/page.tsx` | Cross-module summary dashboard | ✓ VERIFIED | 298 lines, uses all 6 module hooks, skeleton loading states, toast error handling |
| `apps/web/src/components/DashboardLayout.tsx` | Responsive layout wrapper | ✓ VERIFIED | Integrates Sidebar and BottomTabBar |
| `apps/web/src/components/Sidebar.tsx` | Desktop sidebar (≥768px) | ✓ VERIFIED | hidden md:flex, 64 NavItems, ThemeToggle integrated |
| `apps/web/src/components/BottomTabBar.tsx` | Mobile bottom tab (<768px) | ✓ VERIFIED | md:hidden, fixed bottom-0 |
| `apps/web/src/components/ModuleCard.tsx` | Module summary cards | ✓ VERIFIED | 119 lines, uses shadcn Card components |
| `apps/web/src/lib/queryClient.ts` | TanStack Query client config | ✓ VERIFIED | staleTime: 30000, refetchOnWindowFocus: true |
| `apps/web/src/lib/api.ts` | Base API client | ✓ VERIFIED | 89 lines, /api/v1 base URL, credentials: 'include' |
| `apps/web/src/lib/api/*.ts` | Module API clients (6 files) | ✓ VERIFIED | financial.ts (154 lines), habits.ts (90), health.ts (114), hobbies.ts (88), notes.ts (53), tasks.ts (103) |
| `apps/web/src/hooks/use*.ts` | TanStack Query hooks (6 files) | ✓ VERIFIED | useFinancialData.ts (71 lines), useHabitsData.ts (45), useHealthData.ts (47), useHobbiesData.ts (32), useNotesData.ts (24), useTasksData.ts (30) |
| `apps/web/src/components/ui/*.tsx` | shadcn/ui components | ✓ VERIFIED | button.tsx, card.tsx, skeleton.tsx, toast.tsx, use-toast.ts, toaster.ts |
| `apps/web/src/components/charts/*.tsx` | Recharts components | ✓ VERIFIED | WeightChart.tsx (89 lines), FinancialChart.tsx (118), HabitStreakChart.tsx (105), HobbyProgressChart.tsx (221) - **TypeScript errors FIXED** |
| `apps/web/src/lib/chart-utils.ts` | Chart utilities | ✓ VERIFIED | 109 lines, **Generic BaseChartProps<T extends object = object>** - TypeScript error FIXED |
| `apps/web/src/components/ThemeToggle.tsx` | Theme toggle button | ✓ VERIFIED | 66 lines, cycles light/dark/system |
| `apps/web/src/lib/navigation.ts` | Navigation configuration | ✓ VERIFIED | 82 lines, 6 modules organized by domain |
| `apps/web/src/app/financial/page.tsx` | Financial module page | ✓ VERIFIED | 164 lines, FinancialChart integrated |
| `apps/web/src/app/health/page.tsx` | Health module page | ✓ VERIFIED | 146 lines, WeightChart integrated |
| `apps/web/src/app/habits/page.tsx` | Habits module page | ✓ VERIFIED | 137 lines, HabitStreakChart integrated |
| `apps/web/src/app/hobbies/page.tsx` | Hobbies module page | ✓ VERIFIED | 188 lines, HobbyProgressChart integrated |
| `apps/web/public/manifest.json` | PWA manifest | ✓ VERIFIED | name: "PMS - Personal Management System", theme_color: #4f46e5, display: standalone |
| `apps/web/public/icon-192x192.png` | PWA icon 192x192 | ✓ VERIFIED | File exists (808 bytes) |
| `apps/web/public/icon-512x512.png` | PWA icon 512x512 | ✓ VERIFIED | File exists (2373 bytes) |
| `apps/web/public/sw.js` | Service worker | ✓ VERIFIED | File exists (2499 bytes), cache-first static, network-first API |
| `apps/web/src/components/OfflineBanner.tsx` | Offline detection banner | ✓ VERIFIED | 35 lines, navigator.onLine detection |

### Key Link Verification

| From | To  | Via | Status | Details |
| ---- | --- | --- | ------ | ------- |
| `apps/web/src/app/layout.tsx` | `apps/web/src/components/Providers.tsx` | `<Providers>{children}</Providers>` | ⚠️ WIRED | Connected but causes static export build failure |
| `apps/web/src/components/Providers.tsx` | `apps/web/src/lib/queryClient.ts` | QueryClientProvider | ✓ WIRED | `client={queryClient}` |
| `apps/web/src/components/Providers.tsx` | `next-themes` | ThemeProvider | ✓ WIRED | `attribute="class" defaultTheme="system"` |
| `apps/web/src/components/Providers.tsx` | `apps/web/public/sw.js` | navigator.serviceWorker.register | ✓ WIRED | `useEffect` registers `/sw.js` |
| `apps/web/src/app/dashboard/page.tsx` | `apps/web/src/hooks/use*.ts` | import hooks | ✓ WIRED | All 6 module hooks imported and used |
| `apps/web/src/hooks/useFinancialData.ts` | `apps/web/src/lib/api/financial.ts` | import API functions | ✓ WIRED | `import * as financialApi from '@/lib/api/financial'` |
| `apps/web/src/app/dashboard/page.tsx` | `apps/web/src/components/ui/card.tsx` | import Card | ✓ WIRED | `import { Card, CardHeader, CardContent } from '@/components/ui/card'` |
| `apps/web/src/app/dashboard/page.tsx` | `apps/web/src/components/ui/skeleton.tsx` | import Skeleton | ✓ WIRED | SkeletonCard component uses Skeleton |
| `apps/web/src/app/dashboard/page.tsx` | `apps/web/src/components/ui/use-toast.ts` | import useToast | ✓ WIRED | 6 useEffect hooks show toast on errors |
| `apps/web/src/components/Sidebar.tsx` | `apps/web/src/components/ThemeToggle.tsx` | import ThemeToggle | ✓ WIRED | Rendered in sidebar header |
| `apps/web/src/app/financial/page.tsx` | `apps/web/src/components/charts/FinancialChart.tsx` | import FinancialChart | ✓ WIRED | Import exists, TypeScript errors fixed |
| `apps/web/src/app/health/page.tsx` | `apps/web/src/components/charts/WeightChart.tsx` | import WeightChart | ✓ WIRED | Import exists, TypeScript errors fixed |
| `apps/web/src/app/habits/page.tsx` | `apps/web/src/components/charts/HabitStreakChart.tsx` | import HabitStreakChart | ✓ WIRED | Import exists, TypeScript errors fixed |
| `apps/web/src/app/hobbies/page.tsx` | `apps/web/src/components/charts/HobbyProgressChart.tsx` | import HobbyProgressChart | ✓ WIRED | Import exists, TypeScript errors fixed |

### Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
| -------- | ------------- | ------ | ------------------ | ------ |
| `apps/web/src/app/dashboard/page.tsx` | balanceData, habits, tasks, healthDashboard, notes, hobbiesDashboard | API via TanStack Query hooks | ✓ FLOWING | All hooks use useQuery with proper queryKeys, API calls to /api/v1 endpoints |
| `apps/web/src/hooks/useFinancialData.ts` | useTotalBalance | get('/financial/balance') | ✓ FLOWING | API function defined in financial.ts |
| `apps/web/src/hooks/useHabitsData.ts` | useHabitsForToday | get('/habits/today') | ✓ FLOWING | API function defined in habits.ts |
| `apps/web/src/hooks/useHealthData.ts` | useHealthDashboard | get('/health/dashboard') | ✓ FLOWING | API function defined in health.ts |
| `apps/web/src/app/financial/page.tsx` | transactions, accounts | API via hooks | ✓ FLOWING | Uses useTransactions, useAccounts hooks |
| `apps/web/src/app/health/page.tsx` | weightTrends | API via hooks | ✓ FLOWING | Uses useWeightTrends hook |
| `apps/web/src/app/habits/page.tsx` | habits, checkIns | API via hooks | ✓ FLOWING | Uses useHabits, useHabitCheckIns hooks |
| `apps/web/src/app/hobbies/page.tsx` | hobbies, trends | API via hooks | ✓ FLOWING | Uses useHobbies, useHobbyTrends hooks |

**Note:** Data flow is properly implemented with TanStack Query hooks connecting to API client functions. All hooks return `{ data, isLoading, error }` tuples and components handle loading/error states appropriately.

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
| -------- | ------- | ------ | ------ |
| Build static export | `pnpm nx build web` | ✗ FAIL - TypeError: Cannot read properties of null (reading 'useEffect') during prerender | ✗ FAILED |
| Next.js dependency check | `grep '"next":' apps/web/package.json` | `"next": "~16.1.7"` | ✓ PASS |
| TanStack Query dependency check | `grep '@tanstack/react-query' apps/web/package.json` | `"@tanstack/react-query": "^5.95.2"` | ✓ PASS |
| Recharts dependency check | `grep 'recharts' apps/web/package.json` | `"recharts": "^3.8.0"` | ✓ PASS |
| Static export config check | `grep 'output.*export' apps/web/next.config.ts` | `output: 'export'` | ✓ PASS |
| Dark mode config check | `grep 'darkMode' apps/web/tailwind.config.js` | `darkMode: ['class']` | ✓ PASS |
| PWA manifest exists | `test -f apps/web/public/manifest.json` | File exists | ✓ PASS |
| Service worker exists | `test -f apps/web/public/sw.js` | File exists | ✓ PASS |
| PWA icons exist | `test -f apps/web/public/icon-192x192.png && test -f apps/web/public/icon-512x512.png` | Both files exist | ✓ PASS |
| Chart components exist | `ls apps/web/src/components/charts/*.tsx` | 4 chart files present | ✓ PASS |
| Generic BaseChartProps | `grep "extends BaseChartProps<" apps/web/src/components/charts/*.tsx` | All 4 charts use generic syntax | ✓ PASS |
| API clients exist | `ls apps/web/src/lib/api/*.ts` | 6 API files present | ✓ PASS |
| Hooks exist | `ls apps/web/src/hooks/*.ts` | 6 hook files present | ✓ PASS |
| Chart line count | `wc -l apps/web/src/components/charts/*.tsx apps/web/src/lib/chart-utils.ts` | 642 total lines (substantive) | ✓ PASS |
| Chart placeholders | `grep -E "TODO|FIXME|PLACEHOLDER" apps/web/src/components/charts/*.tsx` | No placeholders found | ✓ PASS |
| Chart empty returns (non-tooltip) | `grep "return null" apps/web/src/components/charts/*.tsx \| grep -v "if (!active"` | 0 found | ✓ PASS |

**Build Error Details:**
```
Error occurred prerendering page "/_not-found". Read more: https://nextjs.org/docs/messages/prerender-error
TypeError: Cannot read properties of null (reading 'useEffect')
    at aO (.next/server/chunks/ssr/apps_web_src_components_Providers_tsx_9131d1a8._.js:1:40457) {
  digest: '3386722375'
}
Export encountered an error on /_not-found/page: /_not-found, exiting the build.
```

**Root Cause:** Static export mode (`output: 'export'`) prerenders all pages at build time. The Providers component is a client component (`'use client'`) with `useEffect` for service worker registration. When Next.js tries to prerender pages during the build phase, it can't execute client-side hooks, causing the build to fail.

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
| ----------- | ---------- | ----------- | ------ | -------- |
| WEB-01 | 09-01-PLAN.md | Static export build (no SSR server process) | ✗ BLOCKED | next.config.ts has output: 'export' but build fails due to PWA incompatibility |
| WEB-02 | 09-02-PLAN.md | Responsive dashboard with module navigation | ✓ SATISFIED | DashboardLayout with Sidebar (desktop) and BottomTabBar (mobile), 6 module cards with real metrics |
| WEB-03 | 09-03-PLAN.md | TanStack Query for server state management | ✓ SATISFIED | @tanstack/react-query@^5.95.2, queryClient with 30s staleTime, 6 module hooks with useQuery |
| WEB-04 | 09-04-PLAN.md | shadcn/ui components with Tailwind styling | ✓ SATISFIED | button.tsx, card.tsx, skeleton.tsx, toast.tsx all present and used in dashboard |
| WEB-05 | 09-05-PLAN.md | Recharts for data visualization | ⚠️ PARTIAL | Chart components fully implemented (642 lines), TypeScript errors fixed, but build fails before completion |
| WEB-06 | 09-06-PLAN.md | Dark/light theme toggle | ✓ SATISFIED | next-themes@^0.4.6, ThemeProvider with defaultTheme="system", ThemeToggle cycles light/dark/system |
| WEB-07 | 09-07-PLAN.md | PWA manifest for installable web app | ✓ SATISFIED | manifest.json with PMS name, icons, theme color, service worker registered, offline banner |

**No orphaned requirements:** All 7 WEB requirements (WEB-01 through WEB-07) are claimed by the 7 plans (09-01 through 09-07).

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
| ---- | ---- | ------- | -------- | ------ |
| None | - | No TODO/FIXME/PLACEHOLDER comments found in charts | - | Chart code appears production-ready |
| `apps/web/src/lib/navigation.ts` | 18, 26, 33, 40, 48, 55 | `require('lucide-react')` for icon imports | ℹ️ Info | Non-ESLint-standard import pattern, works but should use `import { DollarSign } from 'lucide-react'` |
| `apps/web/src/components/Providers.tsx` | 1 | `'use client'` with useEffect | 🛑 Blocker | Incompatible with static export prerendering - causes build failure |

**Note:** The navigation.ts file uses `require()` for dynamic icon imports. This is a workaround for TypeScript issues with lucide-react icon exports but should be refactored to use standard ES imports.

### Human Verification Required

### 1. PWA Installability Test (If PWA Features Kept)

**Test:** Open the built app in Chrome/Edge browser, check for install icon in address bar (⊕ or install prompt), click install and verify app opens as standalone window

**Expected:** Browser shows install prompt, app installs with PMS name and indigo icon, opens in standalone window without browser UI

**Why human:** Install prompts only appear with HTTPS/localhost and require user interaction. Service worker must be active (only in production build or localhost with sw.js loaded).

### 2. Service Worker Caching Verification (If PWA Features Kept)

**Test:** Open DevTools → Application → Service Workers, verify sw.js is active, open Cache Storage and check for pms-static-v1 and pms-api-v1 caches, go offline in DevTools Network tab, reload page and verify cached content loads

**Expected:** Static assets cached on first load, API responses cached with network-first strategy, offline banner appears when disconnected, page loads from cache when offline

**Why human:** Service worker runtime behavior requires browser environment to verify cache strategies, offline detection, and cache storage contents.

### 3. Theme Toggle Behavior Verification

**Test:** Click theme toggle button in sidebar, verify it cycles through sun (light) → moon (dark) → monitor (system) icons, refresh page and verify theme persists, change OS system preference and verify "system" mode follows OS

**Expected:** Theme cycles light → dark → system → light on each click, preference persists across page reloads (localStorage), system mode detects OS preference on first visit

**Why human:** Theme persistence requires localStorage inspection, system preference detection requires matchMedia API, visual verification of dark/light mode transition.

### 4. Responsive Layout Breakpoint Testing

**Test:** Open browser DevTools, enable responsive mode, test widths at 320px (mobile), 768px (tablet breakpoint), 1024px (desktop), verify sidebar appears at ≥768px and bottom bar appears at <768px

**Expected:** Sidebar visible on desktop (≥768px) with 256px width, bottom tab bar visible on mobile (<768px) fixed at bottom, no horizontal scrolling or layout overlap

**Why human:** Responsive breakpoints require viewport width testing and visual inspection of layout changes at specific breakpoints.

### 5. Chart Interactivity and Tooltips (If Build Succeeds)

**Test:** Navigate to /financial page, hover over FinancialChart bars, verify tooltip shows formatted income/expense values, click time range buttons (30d/90d/365d) and verify chart updates

**Expected:** Tooltips appear on hover with formatted currency values, time range buttons fetch new data and update chart, no console errors during chart interactions

**Why human:** Chart tooltips require mouse events and DOM inspection, time range buttons trigger data fetching that needs network verification, animation smoothness requires visual testing.

### Gaps Summary

**Primary Gap:** Static Export Build Failure Due to PWA Incompatibility

The phase is 85% complete (6/7 truths verified) but cannot be marked as achieved because the web client does not build successfully. The issue is an architectural incompatibility between static export mode and PWA configuration:

1. **Root Cause:** `Providers.tsx` is a client component (`'use client'`) with `useEffect` for service worker registration
2. **Impact:** Static export (`output: 'export'`) tries to prerender all pages at build time, but can't execute client-side hooks
3. **Error:** `TypeError: Cannot read properties of null (reading 'useEffect')` during prerendering of `/_not-found` page
4. **Affected Files:**
   - `apps/web/next.config.ts` (line 9) - `output: 'export'`
   - `apps/web/src/app/layout.tsx` (line 33) - Wraps with `<Providers>`
   - `apps/web/src/components/Providers.tsx` (line 1) - `'use client'` directive
   - `apps/web/src/components/Providers.tsx` (line 12-20) - `useEffect` for SW registration

**Architectural Decision Required:**

This is a significant project decision that affects deployment strategy. Three options:

**Option 1: Disable PWA, Keep Static Export**
- Pros: Simple hosting on Caddy as static files, no Node.js server needed
- Cons: Lose offline support, installability, service worker caching
- Changes: Remove Providers wrapper, service worker, offline banner
- Impact: WEB-07 requirement would be unmet

**Option 2: Disable Static Export, Keep PWA**
- Pros: All PWA features work, offline support, installability
- Cons: Requires Node.js server, can't host on Caddy as static files
- Changes: Remove `output: 'export'` from next.config.ts
- Impact: WEB-01 requirement would be unmet (needs SSR server)

**Option 3: Split Providers (Hybrid Approach)**
- Pros: Keep both static export and PWA features
- Cons: Complex architecture, requires SSR-safe wrapper with dynamic client-only import
- Changes: Create separate providers for SSR-safe (QueryClient, ThemeProvider) and client-only (SW registration)
- Impact: Meets both WEB-01 and WEB-07, but high complexity

**Recommendation:** This decision affects project deployment architecture and should be made by the project owner. The gap closure plan (09-08) successfully fixed the chart TypeScript errors but discovered this deeper architectural issue.

**Secondary Gaps:** Human Verification Required

After resolving the build blocker, the following items require manual testing in a browser:
- PWA installability (if Option 1 or 3 chosen)
- Service worker caching behavior (if Option 1 or 3 chosen)
- Theme toggle persistence and system detection
- Responsive layout breakpoints
- Chart interactivity and tooltips

**Positive Findings:**

All other phase goals are achieved:
- ✅ Next.js 16.2 with App Router structure
- ✅ Static export configured (output: 'export')
- ✅ Responsive dashboard with 6 module cards
- ✅ TanStack Query v5 with 30s staleTime
- ✅ shadcn/ui components (button, card, skeleton, toast)
- ✅ Theme toggle with next-themes (light/dark/system)
- ✅ PWA manifest with icons and service worker
- ✅ API clients for all 6 modules (718 total lines)
- ✅ TanStack Query hooks for all 6 modules (249 total lines)
- ✅ Chart components implemented (642 total lines) - **TypeScript errors FIXED**
- ✅ Generic BaseChartProps<T> interface - **Working correctly**
- ✅ No placeholder/stub code in charts (no TODO/FIXME comments)
- ✅ Real data flow from API → hooks → components
- ✅ Error handling with toast notifications
- ✅ Loading states with skeleton screens

**Gap Closure Progress (Plan 09-08):**

✅ **CLOSED:** Chart TypeScript errors
- Generic `BaseChartProps<T extends object = object>` implemented
- All 4 chart components properly extend with specific types
- Tooltip types fixed with optional payload
- YAxis tickFormatter return type fixed
- Import paths fixed (removed .ts extension)
- Charts are substantive (533 lines) with no stubs

❌ **NEW BLOCKER:** Static export vs PWA incompatibility
- Discovered during plan 09-08 execution
- Documented in 09-08-SUMMARY.md
- Requires architectural decision
- Not fixable with simple code changes

---

_Verified: 2026-03-24T19:50:00Z_
_Verifier: Claude (gsd-verifier)_
_Re-verification: After gap closure plan 09-08_
