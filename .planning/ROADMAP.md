# Roadmap: PMS Ecosystem

## Overview

The PMS Ecosystem roadmap builds a unified personal data platform with AI-powered insights, starting from foundational infrastructure (multi-tenancy, auth, Nx monorepo) and progressing through domain modules (financial, habits, tasks, health, notes, hobbies), AI integration, cross-platform clients (web, mobile, desktop), SaaS subscription system, and operations. Each phase delivers complete, verifiable capabilities while maintaining architectural correctness—RLS from day one, hexagonal patterns proven in Financial module, AI Gateway before AI-dependent features, and web client before mobile/desktop to establish shared components.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Foundation** - Multi-tenancy, auth, Nx monorepo, NestJS skeleton, shared libraries
- [ ] **Phase 2: AI Gateway** - Circuit breaker, caching, Groq/Gemini integration, token budgeting
- [ ] **Phase 3: Financial Module** - Transactions, categories, accounts, budgets, recurring rules, AI categorization
- [ ] **Phase 4: Habits & Tasks** - Habit tracking, streaks, RPG gamification, NL task parsing, subtasks
- [ ] **Phase 5: Health Module** - Weight, vitals, sleep, workouts, charts, AI weekly digest
- [ ] **Phase 6: Notes & Journal** - Tiptap editor, search, tags, journal, mood tracking, auto-save
- [ ] **Phase 7: Hobbies** - Flexible tracking, goals, insights, progress visualization
- [ ] **Phase 8: SaaS Subscription** - LemonSqueezy, trial management, plan guards, branding
- [ ] **Phase 9: Web Client** - Next.js static, dashboard, TanStack Query, shadcn/ui, PWA
- [ ] **Phase 10: Mobile Client** - Expo, NativeWind, offline queue, shared hooks
- [ ] **Phase 11: Desktop Client** - Tauri wrapping Next.js, native menus, auto-update
- [ ] **Phase 12: Backup & Operations** - rclone backups, log rotation, monitoring, alerts

## Phase Details

### Phase 1: Foundation
**Goal**: Multi-tenant Nx monorepo with NestJS API, PostgreSQL RLS, authentication, and shared libraries
**Depends on**: Nothing (first phase)
**Requirements**: INFRA-01, INFRA-02, INFRA-03, INFRA-04, INFRA-05, INFRA-06, INFRA-07, INFRA-08, AUTH-01, AUTH-02, AUTH-03, AUTH-04, AUTH-05, AUTH-06
**Success Criteria** (what must be TRUE):
  1. User can sign up with email/password, receive verification email, and log in with session persisting across refresh
  2. All database tables include tenantId with RLS policies enforced (tested with non-superuser connection)
  3. Nx workspace enforces module boundaries via ESLint tags (no violations across type/domain/layer)
  4. Docker Compose stack runs on 8 GB VPS with memory tuning (PostgreSQL config, Node heap limits, swap)
  5. Shared libraries structure exists (shared-kernel, shared-types, data-access, ui-web, ui-mobile)
**Plans**: 6 plans

Plans:
- [x] 01-01: Nx workspace initialization with module boundaries and shared libraries
- [ ] 01-02: Docker Compose with PostgreSQL 17, Caddy, and memory tuning
- [ ] 01-03: NestJS API skeleton with Fastify and Prisma 7.3
- [ ] 01-04: PostgreSQL RLS policies on all tables with tenant context middleware
- [ ] 01-05: JWT authentication with email verification and password reset
- [ ] 01-06: Pino logging with correlation ID middleware

### Phase 2: AI Gateway
**Goal**: Unified AI service with circuit breaker, caching, multi-provider support, and token budgeting
**Depends on**: Phase 1
**Requirements**: AI-01, AI-02, AI-03, AI-04, AI-05, AI-06, AI-07, AI-08
**Success Criteria** (what must be TRUE):
  1. AI Gateway handles CLASSIFY, LABEL, SUMMARIZE, ANALYZE, EXTRACT, CHAT task types
  2. Circuit breaker rotates providers on 429 (60s block) or 5xx (immediate rotation)
  3. Identical prompts cached for 24h in ai_prompt_cache table
  4. Per-tenant token quota tracked in ai_usage_logs with alerts at 80% capacity
  5. All AI calls logged with provider, model, tokens, latency for monitoring
**Plans**: 5 plans

Plans:
- [x] 02-01: AiGateway service with Groq primary and Gemini 2.0 Flash fallback
- [ ] 02-02: Circuit breaker pattern with provider rotation logic
- [ ] 02-03: Prompt caching with 24h TTL and token budgeting per tenant
- [ ] 02-04: AI usage logging and monitoring (provider, model, tokens, latency)
- [ ] 02-05: Task type matrix implementation (CLASSIFY, LABEL, SUMMARIZE, ANALYZE, EXTRACT, CHAT)

### Phase 3: Financial Module
**Goal**: Complete financial tracking with transactions, categories, accounts, envelope budgets, recurring rules, and AI categorization
**Depends on**: Phase 1, Phase 2
**Requirements**: FIN-01, FIN-02, FIN-03, FIN-04, FIN-05, FIN-06, FIN-07, FIN-08, FIN-09, FIN-10, FIN-11, FIN-12
**Success Criteria** (what must be TRUE):
  1. User can create/edit/delete transactions with date, amount, category, payee, notes, filtered by date/category/account
  2. User can create hierarchical categories and multiple accounts with running balance totals
  3. User can create envelope budgets allocating income to categories with rollover to next month
  4. System auto-categorizes transactions using AI from payee/description
  5. System auto-creates transactions from recurring rules (daily/weekly/monthly/yearly) via pg-boss, flagged for exclusion from anomaly detection
**Plans**: 5 plans

Plans:
- [ ] 03-01: Financial domain module with hexagonal architecture (domain/application/infrastructure/presentation)
- [ ] 03-02: Transaction CRUD with category management and hierarchical categories
- [ ] 03-03: Account management with running balance totals
- [ ] 03-04: Transaction filtering by date range, category, and account
- [ ] 03-05: AI transaction categorization (payee/description → category)
- [ ] 03-06: Envelope budgeting with income allocation and monthly rollover
- [ ] 03-07: Recurring transaction rules with pg-boss scheduled jobs
- [ ] 03-08: Financial charts and visualizations (spending by category, account balances over time)

### Phase 4: Habits & Tasks
**Goal**: Habit tracking with streaks, RPG gamification, and task management with natural language parsing
**Depends on**: Phase 1, Phase 2
**Requirements**: HAB-01, HAB-02, HAB-03, HAB-04, HAB-05, HAB-06, HAB-07, HAB-08, HAB-09, HAB-10, TASK-01, TASK-02, TASK-03, TASK-04, TASK-05, TASK-06, TASK-07, TASK-08
**Success Criteria** (what must be TRUE):
  1. User can create habits with name, description, frequency (including cron schedules), check in daily, view streaks and calendar history
  2. User earns XP (10 per completion), levels up, unlocks achievements for streak milestones (7, 30, 100 days)
  3. Dashboard shows user level, XP progress bar, recent achievements, and habits scheduled for current day
  4. User can create tasks with title, description, due date, priority, subtasks, mark complete/incomplete
  5. User can create tasks via natural language ("Buy milk tomorrow 5pm #errands") with system parsing title, due date, tags
  6. System highlights overdue tasks and enables filtering by status (pending/completed/overdue) and sorting by due date/priority/creation date
**Plans**: 5 plans

Plans:
- [ ] 04-01: Habits domain module with CRUD, daily check-in, streak calculation
- [ ] 04-02: Habit cron scheduling ("every Mon,Wed,Fri", "every 2 weeks") and scheduled day filtering
- [ ] 04-03: RPG gamification (XP, levels, achievements) and dashboard display
- [ ] 04-04: Tasks domain module with CRUD, subtasks, and overdue highlighting
- [ ] 04-05: Natural language task parsing (title, due date, tags extraction)
- [ ] 04-06: Task filtering by status and sorting by due date/priority/creation date
- [ ] 04-07: Habit calendar with completion history visualization

### Phase 5: Health Module
**Goal**: Health tracking with weight, vitals, sleep, workouts, charts, and AI-generated weekly digest
**Depends on**: Phase 1, Phase 2
**Requirements**: HLTH-01, HLTH-02, HLTH-03, HLTH-04, HLTH-05, HLTH-06, HLTH-07, HLTH-08
**Success Criteria** (what must be TRUE):
  1. User can log weight with date/notes, view trend chart (30/90/365 day views)
  2. User can log vitals (blood pressure, heart rate) as JSONB, sleep duration/quality, workouts (type, duration, intensity as JSONB)
  3. System generates weekly health digest via AI (correlations, trends, insights)
  4. Health digest sent via email (Resend) every Sunday
  5. Dashboard shows health metrics summary with trends (weight, vitals, sleep, workouts)
**Plans**: 5 plans

Plans:
- [ ] 05-01: Health domain module with weight tracking and trend charts (30/90/365 day views)
- [ ] 05-02: Vitals logging (blood pressure, heart rate) as JSONB
- [ ] 05-03: Sleep tracking (duration, quality) and workout logging (type, duration, intensity as JSONB)
- [ ] 05-04: AI weekly health digest generation (correlations, trends, insights)
- [ ] 05-05: Resend email integration for Sunday digest delivery
- [ ] 05-06: Health dashboard with metrics summary and trend visualization

### Phase 6: Notes & Journal
**Goal**: Note-taking with Tiptap rich text editor, search, organization, journaling, mood tracking, and auto-save
**Depends on**: Phase 1
**Requirements**: NOTE-01, NOTE-02, NOTE-03, NOTE-04, NOTE-05, NOTE-06, NOTE-07, NOTE-08
**Success Criteria** (what must be TRUE):
  1. User can create/edit/delete notes with title and Tiptap rich text content
  2. User can search notes by title and content (full-text search)
  3. User can organize notes with folders and tags
  4. User can create journal entries with mood indicator and view mood trends over time
  5. Notes auto-save with debounce (500ms)
**Plans**: 5 plans

Plans:
- [ ] 06-01: Notes domain module with CRUD operations
- [ ] 06-02: Tiptap rich text editor integration
- [ ] 06-03: Full-text search for notes (title and content)
- [ ] 06-04: Folder and tag organization system
- [ ] 06-05: Journal entries with mood indicator
- [ ] 06-06: Mood trend visualization over time
- [ ] 06-07: Auto-save with 500ms debounce

### Phase 7: Hobbies
**Goal**: Flexible hobby tracking with multiple tracking types, goals, insights, and progress visualization
**Depends on**: Phase 1
**Requirements**: HOBB-01, HOBB-02, HOBB-03, HOBB-04, HOBB-05, HOBB-06
**Success Criteria** (what must be TRUE):
  1. User can create hobbies with name and tracking type (counter, percentage, list)
  2. User can log hobby progress (increment counter, set percentage, add list item)
  3. User can view hobby progress over time with charts
  4. System generates hobby progress insights
  5. User can set hobby goals (target counter, target percentage) and view completion percentage on dashboard
**Plans**: 5 plans

Plans:
- [ ] 07-01: Hobbies domain module with flexible tracking types (counter, percentage, list)
- [ ] 07-02: Progress logging per tracking type
- [ ] 07-03: Progress visualization over time
- [ ] 07-04: Hobby goals (target counter, target percentage)
- [ ] 07-05: AI-generated hobby progress insights
- [ ] 07-06: Dashboard hobby completion percentage display

### Phase 8: SaaS Subscription
**Goal**: LemonSqueezy integration with 30-day trial, webhook handlers, plan guards, and tenant branding
**Depends on**: Phase 1
**Requirements**: SAAS-01, SAAS-02, SAAS-03, SAAS-04, SAAS-05, SAAS-06, SAAS-07, SAAS-08
**Success Criteria** (what must be TRUE):
  1. New users get 30-day free trial automatically with tracked trial end date
  2. Day 27: System sends trial expiry warning email; Day 30: System restricts access to free tier
  3. LemonSqueezy webhook handles subscription events with idempotent processing
  4. PlanFeatureGuard restricts gated endpoints based on subscription tier
  5. Tenant branding stored as JSONB (primaryColor, appName, logoUrl)
**Plans**: 5 plans

Plans:
- [ ] 08-01: Subscription domain module with trial management (30-day automatic trial, trial end date tracking)
- [ ] 08-02: LemonSqueezy webhook handlers with idempotency (duplicate handling, event ordering)
- [ ] 08-03: Trial expiry warning email (Day 27) and free tier restriction (Day 30)
- [ ] 08-04: PlanFeatureGuard decorator for restricting gated endpoints
- [ ] 08-05: Tenant branding as JSONB (primaryColor, appName, logoUrl)

### Phase 9: Web Client
**Goal**: Next.js static web client with dashboard, TanStack Query, shadcn/ui, charts, theme toggle, and PWA
**Depends on**: Phase 1, Phase 3, Phase 4, Phase 5, Phase 6, Phase 7, Phase 8
**Requirements**: WEB-01, WEB-02, WEB-03, WEB-04, WEB-05, WEB-06, WEB-07
**Success Criteria** (what must be TRUE):
  1. Web client builds as static export (no SSR server process) and is installable as PWA
  2. Responsive dashboard with module navigation (financial, habits, tasks, health, notes, hobbies)
  3. TanStack Query for server state management with caching and invalidation
  4. shadcn/ui components with Tailwind styling and dark/light theme toggle
  5. Recharts for data visualization (financial charts, health trends, habit streaks, hobby progress)
**Plans**: 5 plans

Plans:
- [ ] 09-01: Next.js 16.2 app with static export configuration
- [ ] 09-02: Responsive dashboard layout with module navigation
- [ ] 09-03: TanStack Query integration with shared data-access hooks
- [ ] 09-04: shadcn/ui components and Tailwind styling
- [ ] 09-05: Recharts integration for data visualization
- [ ] 09-06: Dark/light theme toggle with persistence
- [ ] 09-07: PWA manifest for installable web app

### Phase 10: Mobile Client
**Goal**: Expo mobile app with NativeWind, offline queue, push notifications, and shared hooks
**Depends on**: Phase 9
**Requirements**: MOB-01, MOB-02, MOB-03, MOB-04, MOB-05, MOB-06
**Success Criteria** (what must be TRUE):
  1. Expo SDK 55 app with React Native 0.83 and NativeWind styling
  2. Expo Router for file-based navigation
  3. Expo Push notifications integration
  4. Shared data-access hooks with web client (TanStack Query)
  5. Offline queue for actions without connectivity
**Plans**: 5 plans

Plans:
- [ ] 10-01: Expo SDK 55 project with React Native 0.83
- [ ] 10-02: NativeWind styling configuration
- [ ] 10-03: Expo Router file-based navigation setup
- [ ] 10-04: Expo Push notifications integration
- [ ] 10-05: Shared data-access hooks with web client
- [ ] 10-06: Offline queue for offline-first functionality

### Phase 11: Desktop Client
**Goal**: Tauri desktop app wrapping Next.js build with native menus, auto-update, keyboard shortcuts, and notifications
**Depends on**: Phase 9
**Requirements**: DSK-01, DSK-02, DSK-03, DSK-04, DSK-05
**Success Criteria** (what must be TRUE):
  1. Tauri 2 app wraps Next.js static build
  2. Native OS menus and tray icon
  3. Auto-update mechanism
  4. Keyboard shortcuts for common actions
  5. System notifications via ntfy.sh
**Plans**: 5 plans

Plans:
- [ ] 11-01: Tauri 2 project wrapping Next.js static build
- [ ] 11-02: Native OS menus and tray icon
- [ ] 11-03: Auto-update mechanism implementation
- [ ] 11-04: Keyboard shortcuts for common actions
- [ ] 11-05: System notifications via ntfy.sh

### Phase 12: Backup & Operations
**Goal**: Automated backups, log rotation, monitoring, and alerts for production operations
**Depends on**: Phase 1, Phase 3, Phase 4, Phase 5, Phase 6, Phase 7, Phase 8, Phase 9, Phase 10, Phase 11
**Requirements**: OPS-01, OPS-02, OPS-03, OPS-04, OPS-05
**Success Criteria** (what must be TRUE):
  1. Daily PostgreSQL dump to Google Drive via rclone
  2. Backups older than 30 days auto-deleted
  3. Docker container logs capped at 30 MB per service
  4. Nightly API restart at 3 AM (memory leak prevention)
  5. ntfy.sh push notifications for 500 errors
**Plans**: 5 plans

Plans:
- [ ] 12-01: rclone configuration for Google Drive backups
- [ ] 12-02: Daily PostgreSQL dump automation
- [ ] 12-03: Backup retention policy (30-day auto-delete)
- [ ] 12-04: Docker log rotation (30 MB cap per service)
- [ ] 12-05: Nightly API restart cron job (3 AM)
- [ ] 12-06: ntfy.sh alerting for 500 errors

## Progress

**Execution Order:**
Phases execute in numeric order: 2 → 2.1 → 2.2 → 3 → 3.1 → 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 1/6 | In progress | 2026-03-22 |
| 2. AI Gateway | 0/5 | Not started | - |
| 3. Financial Module | 0/8 | Not started | - |
| 4. Habits & Tasks | 0/7 | Not started | - |
| 5. Health Module | 0/6 | Not started | - |
| 6. Notes & Journal | 0/7 | Not started | - |
| 7. Hobbies | 0/6 | Not started | - |
| 8. SaaS Subscription | 0/5 | Not started | - |
| 9. Web Client | 0/7 | Not started | - |
| 10. Mobile Client | 0/6 | Not started | - |
| 11. Desktop Client | 0/5 | Not started | - |
| 12. Backup & Operations | 0/6 | Not started | - |
