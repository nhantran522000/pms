# Phase 10: Mobile Client - Context

**Gathered:** 2026-03-24
**Status:** Ready for planning
**Mode:** Smart Discuss (autonomous batch proposals)

<domain>
## Phase Boundary

Deliver a cross-platform mobile app using Expo SDK 55 with React Native 0.83, NativeWind styling, Expo Router navigation, Expo Push notifications, shared TanStack Query data-access hooks with the web client, and an offline queue for full offline capability.

</domain>

<decisions>
## Implementation Decisions

### Navigation Structure
- 5 bottom tabs: Dashboard, Financial, Habits, Health, Profile — matches web sidebar, familiar mobile pattern
- Stack navigation per module — each tab has its own stack for drill-down (e.g., Financial → Transaction Details)
- Notes lives in Profile tab as a menu item — less frequently accessed, keeps tabs focused

### Push Notification Types
- All 5 modules get push notifications: Financial (budget alerts), Habits (streak reminders), Health (weekly digest ready), Tasks (overdue), Notes (shared)
- Timezone-aware timing: 9 AM local for reminders, weekly digest at user-selected time
- Quiet hours: 10 PM - 7 AM local time — no notifications during sleep hours

### Offline Queue Strategy
- All writes queued offline: create/update/delete across modules — full offline capability
- Queue persistence via AsyncStorage with periodic sync (5 min interval + immediate on reconnect)
- Conflict resolution: last-write-wins with server timestamp — simple, handles most cases

### Claude's Discretion
Expo Router file structure, NativeWind configuration approach, offline queue implementation details (library choice: expo-sqlite vs AsyncStorage), push notification payload format.

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- **Web app TanStack Query hooks** (`apps/web/src/hooks/use*.ts`) — can be extracted to shared library
- **API client functions** (`apps/web/src/lib/api/*.ts`) — modular GET/POST/PUT/DEL pattern with TypeScript interfaces
- **Type definitions** — shared interfaces for Account, Transaction, Category, Budget, Habit, Task, HealthLog, Note, Hobby
- **Query key pattern** — `['module', 'entity', params]` established in web client

### Established Patterns
- **Error handling** — try/catch with user-friendly error messages
- **Cookie-based auth** — web uses `credentials: 'include'` (mobile will need token-based auth)
- **Modular API layer** — separate files per module (financial, habits, tasks, health, notes, hobbies)
- **TanStack Query v5** — 30s staleTime, refetchOnWindowFocus pattern

### Integration Points
- **Backend API endpoints** — `/api/v1/*` routes already implemented
- **Shared data-access library** — create `libs/shared-data-access` for hooks usable by both web and mobile
- **Authentication flow** — mobile needs token-based auth (JWT in AsyncStorage) instead of cookies

</code_context>

<specifics>
## Specific Ideas

- NativeWind for styling (Tailwind for React Native) — consistent with web's Tailwind approach
- Expo Router for file-based navigation — matches Next.js App Router pattern from web
- Shared TanStack Query hooks extracted to `libs/shared-data-access` — single source of truth for data fetching logic
- Offline queue using expo-sqlite for robust persistence and sync tracking
- Push notifications via Expo Push Notification Service with per-module notification types

</specifics>

<deferred>
## Deferred Ideas

- Biometric auth (Face ID / fingerprint) — defer to v2, initial release with email/password
- Deep linking for push notification taps — can be added later
- Background sync for large datasets — initial sync on app open sufficient for v1
- Widget support (iOS/Android home screen widgets) — nice-to-have, not core v1

</deferred>
