# Phase 9: Web Client - Context

**Gathered:** 2026-03-24
**Status:** Ready for planning

<domain>
## Phase Boundary

Next.js 16.2 static web client with responsive dashboard, module navigation, TanStack Query for server state, shadcn/ui components with Tailwind styling, Recharts for data visualization, dark/light theme toggle, and PWA manifest. This is the primary user-facing interface for the PMS platform, consuming all backend APIs from Phases 1-8.

</domain>

<decisions>
## Implementation Decisions

### Dashboard Layout & Navigation
- **Navigation pattern:** Sidebar (desktop) + bottom tab bar (mobile) — Scalable for 6+ modules, native mobile pattern
- **Module organization:** By domain (Finance: Financial, Habits & Tasks, Health: Health, Productivity: Notes, Hobbies)
- **Home screen:** Cross-module summary dashboard — Key metrics from all modules in one view
- **Mobile breakpoint:** Bottom tab navigation below 768px width

### Theme & Styling
- **Base color:** Zinc (neutral grays) — Clean, professional, content-first
- **Accent color:** Indigo (primary) — Balanced, trustworthy, good contrast
- **Dark mode:** System preference aware with manual override — Respects OS setting
- **Typography:** Inter (variable font) — Excellent readability, shadcn/ui default

### Charts & Data Visualization
- **Chart style:** Minimal line/bar charts — Clean, data-focused, no 3D or gradients
- **Color palette:** Semantic colors (green=positive, red=negative, blue=neutral) — Universal understanding
- **Interactivity:** Tooltips on hover + click to expand modal — Balance information density with UX
- **Time ranges:** Preset buttons (30d/90d/365d) + custom date picker — Flexibility + speed

### Data Fetching & State Management
- **Stale time:** 30 seconds — Fresh data without excessive API calls
- **Refetch strategy:** On window focus — Keeps data current when user returns to tab
- **Loading states:** Skeleton screens — Better perceived performance than spinners
- **Error handling:** Toast notification + inline error message — Clear feedback with actionability
- **Offline support:** Basic detection message — Simple, honest about limitations

### Module Cards & Navigation
- **Financial card:** Account balance, monthly spending, budget progress bar
- **Habits card:** Today's completion rate, current streak, upcoming habits
- **Tasks card:** Overdue count, today's tasks, priority badge
- **Health card:** Latest weight, sleep quality badge, workout streak
- **Notes card:** Recent notes count, mood trend indicator
- **Hobbies card:** Active hobbies, completion rate, goal progress

### PWA Configuration
- **Manifest:** Installable web app with app name, icons, theme color
- **Service worker:** Cache-first for static assets, network-first for API
- **Offline mode:** "No connection" banner with retry button
- **Install prompt:** Browser-native install UI (manual trigger)

### Claude's Discretion
- Specific sidebar width and breakpoints
- Exact animation durations for transitions
- Toast position and timing
- Chart responsive breakpoints
- Mobile navigation icon designs
- PWA icon sizes and formats
- Service worker cache strategy details

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Configuration
- `CLAUDE.md` — Nx workspace patterns, package manager usage
- `.planning/PROJECT.md` — Core value, technical environment, constraints
- `.planning/REQUIREMENTS.md` — WEB-01 through WEB-07 requirements

### API Specifications (to consume)
- `libs/feature-auth/src/presentation/controllers/auth.controller.ts` — Auth endpoints for login/signup
- `libs/feature-financial/src/presentation/controllers/` — Financial module API
- `libs/feature-habits/src/presentation/controllers/` — Habits module API
- `libs/feature-tasks/src/presentation/controllers/` — Tasks module API
- `libs/feature-health/src/presentation/controllers/` — Health module API
- `libs/feature-notes/src/presentation/controllers/` — Notes module API
- `libs/feature-hobbies/src/presentation/controllers/` — Hobbies module API

### Shared Libraries (to reuse)
- `libs/shared-types/src/index.ts` — Zod schemas for API validation
- `libs/data-access/src/tenant-context/` — Tenant context injection for API calls

### Frontend Patterns (to establish for mobile/desktop reuse)
- Create in `libs/ui-web/` for shared web components
- Create in `libs/ui-mobile/` for shared mobile components (Phase 10)
- Pattern: Extract hooks from `apps/web/src/hooks/` into shared libraries for reuse

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- **Backend APIs:** All modules (Auth, Financial, Habits, Tasks, Health, Notes, Hobbies) fully implemented
- **Shared types:** Zod schemas in `shared-types` for request/response validation
- **Tenant context:** AsyncLocalStorage pattern for multi-tenancy
- **AI Gateway:** Unified AI service for smart features

### Established Patterns
- **Nx monorepo:** Module boundaries enforced via ESLint tags
- **DDD layers:** domain/application/infrastructure/presentation in backend
- **Prisma schema:** All models have tenantId with RLS
- **API versioning:** `/api/v1/` prefix for all endpoints
- **Error format:** `{ success: false, error: { code, message, details } }`
- **Authentication:** JWT httpOnly cookies, session-based

### Integration Points
- **Base URL:** API at `/api/v1/` relative path (served via Caddy)
- **Auth flow:** Login/signup endpoints set httpOnly cookie
- **Tenant isolation:** All API calls automatically filtered by RLS
- **CORS:** API configured for same-origin (static files served by Caddy)
- **Shared hooks:** Create in `libs/ui-web/src/lib/` for reuse in Phase 10 (mobile)

### New App Structure
- **App name:** `@pms/web` — Follows `@pms/*` naming from Phase 1
- **Location:** `apps/web/` in Nx workspace
- **Framework:** Next.js 16.2 with App Router
- **Build:** Static export (`output: 'export'`) — No SSR server
- **Styling:** Tailwind CSS + shadcn/ui components

</code_context>

<specifics>
## Specific Ideas

- Use **Next.js 16.2** App Router (not Pages Router) — Latest patterns, better data fetching
- **Static export** configuration for hosting on Caddy alongside API
- **shadcn/ui** installed via CLI (`npx shadcn@latest init`) — Copy components, not npm package
- **TanStack Query v5** with React Query DevTools in development
- **Recharts** for all charts (financial, health, habits, hobbies)
- **next-themes** for dark/light mode toggle with system preference detection
- **Module structure:** Mirror backend modules in UI (e.g., `/financial`, `/habits`, `/tasks`)
- **Dashboard route:** `/` or `/dashboard` — Cross-module summary view

</specifics>

<deferred>
## Deferred Ideas

- **Real-time updates:** WebSocket or Server-Sent Events for live data — Defer to v2
- **Advanced offline queue:** Full offline mode with action queueing — Mobile phase (Phase 10)
- **Custom module ordering:** User drag-and-drop dashboard — Defer to v2
- **Multi-language support:** i18n — Not in scope for v1
- **Advanced chart features:** Candlestick charts, heatmaps, correlations — Defer to v2
- **Export to PDF:** Report generation — Defer to v2
- **Collaborative features:** Sharing, comments on entries — Social phase (v2)

</deferred>

---

*Phase: 09-web-client*
*Context gathered: 2026-03-24 via Smart Discuss (Autonomous Mode)*
