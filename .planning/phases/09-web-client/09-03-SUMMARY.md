---
phase: 09-web-client
plan: 03
type: execute
wave: 3
depends_on:
  - 09-01
  - 09-02
subsystem: Web Client - TanStack Query Integration
tags:
  - tanstack-query
  - data-fetching
  - api-integration
  - react-hooks
  - dashboard
dependency_graph:
  requires:
    - id: 09-01
      what: Next.js app initialization
    - id: 09-02
      what: Base layout and navigation components
  provides:
    - id: 09-04
      what: TanStack Query hooks for data fetching in UI components
    - id: 09-05
      what: Data hooks for chart components
    - id: 09-06
      what: Real-time data updates for module pages
    - id: 09-07
      what: Mutation hooks for form submissions
  affects:
    - what: Dashboard page
      how: Replaced placeholder metrics with real API data
    - what: ModuleCard component
      how: Enhanced to support loading and error states
tech_stack:
  added:
    - "@tanstack/react-query@^5"
    - "@tanstack/react-query-devtools@^5"
  patterns:
    - TanStack Query useQuery for data fetching
    - Query key patterns: ['module', 'entity', params]
    - Custom hooks pattern for module-specific data fetching
    - API client pattern with typed responses
key_files:
  created:
    - path: apps/web/src/lib/queryClient.ts
      purpose: TanStack Query client configuration
    - path: apps/web/src/lib/api.ts
      purpose: Base API client with fetch wrapper
    - path: apps/web/src/lib/api/financial.ts
      purpose: Financial module API client
    - path: apps/web/src/lib/api/habits.ts
      purpose: Habits module API client
    - path: apps/web/src/lib/api/tasks.ts
      purpose: Tasks module API client
    - path: apps/web/src/lib/api/health.ts
      purpose: Health module API client
    - path: apps/web/src/lib/api/notes.ts
      purpose: Notes module API client
    - path: apps/web/src/lib/api/hobbies.ts
      purpose: Hobbies module API client
    - path: apps/web/src/hooks/useFinancialData.ts
      purpose: TanStack Query hooks for Financial data
    - path: apps/web/src/hooks/useHabitsData.ts
      purpose: TanStack Query hooks for Habits data
    - path: apps/web/src/hooks/useTasksData.ts
      purpose: TanStack Query hooks for Tasks data
    - path: apps/web/src/hooks/useHealthData.ts
      purpose: TanStack Query hooks for Health data
    - path: apps/web/src/hooks/useNotesData.ts
      purpose: TanStack Query hooks for Notes data
    - path: apps/web/src/hooks/useHobbiesData.ts
      purpose: TanStack Query hooks for Hobbies data
  modified:
    - path: apps/web/src/app/layout.tsx
      changes: Added QueryClientProvider and ReactQueryDevtools
    - path: apps/web/src/app/dashboard/page.tsx
      changes: Replaced placeholder metrics with real data hooks
    - path: apps/web/src/components/ModuleCard.tsx
      changes: Enhanced Metric interface to support isLoading and error
    - path: apps/web/package.json
      changes: Added TanStack Query dependencies
decisions:
  - TanStack Query v5 for server state management (per CONTEXT.md decision)
  - 30-second stale time for balance between freshness and API calls
  - Refetch on window focus to keep data current
  - Query key pattern: ['module', 'entity', params] for cache management
  - Separate API client files per module for maintainability
  - Custom hooks pattern for reusable data fetching logic
metrics:
  duration: 216 seconds (~3 minutes)
  tasks_completed: 7
  files_created: 15
  files_modified: 4
  commits: 7
  completed_date: 2026-03-24T12:06:32Z
---

# Phase 09 Plan 03: TanStack Query Integration - Summary

Integrate TanStack Query v5 for server state management with custom hooks for all 6 modules (Financial, Habits, Tasks, Health, Notes, Hobbies). Establish data fetching patterns, API client abstractions, and loading/error states for the dashboard.

## One-Liner

TanStack Query v5 integration with 30s stale time, /api/v1/ base URL, custom hooks for 6 modules, and dashboard real data connection.

## Tasks Completed

| Task | Name | Commit | Files |
| ---- | ---- | ---- | ---- |
| 1 | Install TanStack Query v5 and configure QueryClient | 8f113a3 | package.json, queryClient.ts |
| 2 | Wrap app with QueryClientProvider in root layout | 60683f3 | layout.tsx |
| 3 | Create base API client with fetch wrapper | 51e7ff0 | api.ts |
| 4 | Create Financial API client functions | 5c5433c | api/financial.ts |
| 5 | Create remaining module API clients | 3cbfd5e | api/habits.ts, tasks.ts, health.ts, notes.ts, hobbies.ts |
| 6 | Create TanStack Query hooks for each module | ea7f808 | hooks/useFinancialData.ts, useHabitsData.ts, useTasksData.ts, useHealthData.ts, useNotesData.ts, useHobbiesData.ts |
| 7 | Update dashboard to use real data from custom hooks | cddd066 | dashboard/page.tsx, ModuleCard.tsx, layout.tsx |

## Deviations from Plan

### Auto-fixed Issues

None — plan executed exactly as written. All tasks completed without deviations or blocking issues.

## Implementation Details

### TanStack Query Configuration
- **QueryClient Location**: `apps/web/src/lib/queryClient.ts`
- **Stale Time**: 30 seconds (30000ms) per CONTEXT.md requirement
- **Refetch on Window Focus**: Enabled for automatic data refresh
- **Retry**: 1 attempt on failure with 1-second delay
- **DevTools**: React Query DevTools available in development only

### Base API Client
- **Location**: `apps/web/src/lib/api.ts`
- **Base URL**: `/api/v1/` (relative path for same-origin requests)
- **Methods**: `get<T>()`, `post<T>()`, `put<T>()`, `del<T>()`
- **Headers**: Content-Type: application/json
- **Credentials**: 'include' for httpOnly auth cookies
- **Error Handling**: Extracts backend error format `{ success: false, error: { code, message, details } }`

### Module API Clients
All 6 modules have dedicated API client files in `apps/web/src/lib/api/`:
- **financial.ts**: Accounts, transactions, categories, budgets
- **habits.ts**: Habits, check-ins, completions, streaks
- **tasks.ts**: Tasks, overdue tasks, create/update operations
- **health.ts**: Dashboard, weight, vitals, sleep, workouts
- **notes.ts**: Notes, search operations
- **hobbies.ts**: Hobbies, trends, logging, dashboard

Each API client:
- Imports base functions (get, post, put, del) from `../api`
- Exports typed functions matching backend controller endpoints
- Uses TypeScript interfaces for request/response types
- Supports query parameters (filters, pagination)

### Custom Hooks Pattern
All 6 modules have custom hooks in `apps/web/src/hooks/`:
- **useFinancialData.ts**: useAccounts, useTransactions, useCategories, useBudgets
- **useHabitsData.ts**: useHabits, useHabitsForToday, useHabitCompletions, useHabitStreak
- **useTasksData.ts**: useTasks, useOverdueTasks
- **useHealthData.ts**: useHealthDashboard, useWeightSummary, useVitalsSummary, useSleepSummary, useWorkoutSummary
- **useNotesData.ts**: useNotes, useNoteSearch
- **useHobbiesData.ts**: useHobbies, useHobbyTrends, useHobbyDashboard

Each hook:
- Imports `useQuery` from `@tanstack/react-query`
- Imports corresponding API function from `lib/api/*`
- Uses queryKey pattern: `['module', 'entity', params]`
- Returns `{ data, isLoading, error, refetch }` from useQuery
- Supports conditional queries with `enabled` parameter

### Dashboard Integration
Updated `apps/web/src/app/dashboard/page.tsx`:
- Replaced all placeholder metrics with real data hooks
- Added loading state display ("Loading dashboard data...")
- Added error state display (inline error message)
- Calculates metrics from real API data:
  - **Financial**: Total balance from `useTotalBalance()`
  - **Habits**: Completion rate from `useHabitsForToday()`
  - **Tasks**: Overdue count from `useOverdueTasks()`, pending count from `useTasks()`
  - **Health**: Weight and sleep from `useHealthDashboard()`
  - **Notes**: Note count from `useNotes()`
  - **Hobbies**: Active count and completion rate from `useHobbyDashboard()`

### Component Enhancements
Updated `apps/web/src/components/ModuleCard.tsx`:
- Enhanced `Metric` interface with optional `isLoading` and `error` properties
- Extended `trend` type to support: 'up', 'down', 'neutral', 'positive', 'negative', 'improving', 'stable', 'declining'
- Added skeleton loading state (pulsing gray block)
- Added error state display ("Error" text in red)
- Trend indicators: ↑ (positive/improving), ↓ (negative/declining), → (neutral/stable)

## Technical Decisions

1. **TanStack Query v5**: Chosen per CONTEXT.md for React 18+ compatibility and excellent DevTools
2. **Query Key Pattern**: `['module', 'entity', params]` for predictable cache management
3. **Separate API Clients**: One file per module for maintainability and clear boundaries
4. **Custom Hooks**: Abstracts TanStack Query complexity, provides reusable data fetching logic
5. **Loading States**: Skeleton screens (per CONTEXT.md) for better perceived performance
6. **Error Handling**: Inline error messages on dashboard (toast notifications coming in plan 09-04)

## Verification Results

All success criteria met:
- ✓ TanStack Query v5 installed and configured
- ✓ QueryClientProvider wraps app (root layout)
- ✓ QueryClient has 30s staleTime, refetchOnWindowFocus enabled
- ✓ Base API client at lib/api.ts with /api/v1/ base URL
- ✓ API clients for all 6 modules (Financial, Habits, Tasks, Health, Notes, Hobbies)
- ✓ Custom hooks in hooks/ directory using useQuery
- ✓ Dashboard displays real data from backend APIs (not placeholders)
- ✓ WEB-03 requirement verified: TanStack Query for server state management

## Known Stubs

None — all functionality is fully implemented with real API connections. No hardcoded placeholders or TODOs remain.

## Next Steps

Plan 09-04 will add:
- shadcn/ui component library installation
- Toast notification system for better error feedback
- Enhanced loading states with proper skeleton components
- Form validation patterns for mutations

## Performance Metrics

- **Execution Time**: ~3 minutes for 7 tasks
- **Average per Task**: ~30 seconds
- **Files Created**: 15 new files
- **Files Modified**: 4 existing files
- **Commits**: 7 atomic commits (one per task)
- **Lines Added**: ~1,000+ lines of TypeScript code

## Architecture Impact

This plan establishes the data fetching foundation for the entire web client:
- All future components can reuse these hooks
- Query key patterns enable efficient cache management
- API clients provide type-safe backend communication
- Loading/error patterns established for consistent UX
- Dashboard now shows real data, enabling end-to-end testing with backend APIs

## Self-Check: PASSED

**Files Created:**
- ✓ apps/web/src/lib/queryClient.ts
- ✓ apps/web/src/lib/api.ts
- ✓ apps/web/src/lib/api/financial.ts
- ✓ apps/web/src/lib/api/habits.ts
- ✓ apps/web/src/lib/api/tasks.ts
- ✓ apps/web/src/lib/api/health.ts
- ✓ apps/web/src/lib/api/notes.ts
- ✓ apps/web/src/lib/api/hobbies.ts
- ✓ apps/web/src/hooks/useFinancialData.ts
- ✓ apps/web/src/hooks/useHabitsData.ts
- ✓ apps/web/src/hooks/useTasksData.ts
- ✓ apps/web/src/hooks/useHealthData.ts
- ✓ apps/web/src/hooks/useNotesData.ts
- ✓ apps/web/src/hooks/useHobbiesData.ts
- ✓ .planning/phases/09-web-client/09-03-SUMMARY.md

**Commits Verified:**
- ✓ 8f113a3: feat(09-03): install TanStack Query v5 and configure QueryClient
- ✓ 60683f3: feat(09-03): wrap app with QueryClientProvider in root layout
- ✓ 51e7ff0: feat(09-03): create base API client with fetch wrapper
- ✓ 5c5433c: feat(09-03): create Financial API client functions
- ✓ 3cbfd5e: feat(09-03): create remaining module API clients
- ✓ ea7f808: feat(09-03): create TanStack Query hooks for each module
- ✓ cddd066: feat(09-03): update dashboard to use real data from custom hooks
- ✓ 2ec61e9: docs(09-03): complete TanStack Query integration plan

**State Updates:**
- ✓ STATE.md: Position advanced to plan 04, decisions logged, session updated
- ✓ ROADMAP.md: Phase 09 progress updated (3/7 summaries)
- ✓ REQUIREMENTS.md: WEB-03 marked complete

All deliverables verified and committed successfully.
