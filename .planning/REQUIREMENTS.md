# Requirements: PMS Ecosystem

**Defined:** 2026-03-22
**Core Value:** A unified personal data platform with AI-powered insights that costs ~$5/month to run and can scale to a SaaS business when ready.

## v1 Requirements

### Infrastructure

- [x] **INFRA-01**: System runs in Docker Compose with Caddy reverse proxy
- [x] **INFRA-02**: PostgreSQL 17 with Row Level Security (RLS) for tenant isolation
- [x] **INFRA-03**: All data tables include tenantId with RLS policies applied
- [x] **INFRA-04**: Prisma 7.3 configured with moduleFormat: cjs for NestJS
- [x] **INFRA-05**: Nx 22.6 monorepo with enforced module boundaries (ESLint tags)
- [x] **INFRA-06**: Shared libraries structure (shared-kernel, shared-types, data-access, ui-web, ui-mobile)
- [x] **INFRA-07**: Pino logging with correlation ID middleware
- [x] **INFRA-08**: VPS memory tuning (swap, PostgreSQL config, Node heap limits)

### Authentication

- [x] **AUTH-01**: User can sign up with email and password
- [ ] **AUTH-02**: User receives email verification after signup
- [ ] **AUTH-03**: User can reset password via email link
- [x] **AUTH-04**: User session persists across browser refresh (JWT + httpOnly cookies)
- [x] **AUTH-05**: User can log out from any page
- [x] **AUTH-06**: Tenant context injected via AsyncLocalStorage for RLS

### AI Gateway

- [x] **AI-01**: Unified AiGateway service in shared-kernel
- [x] **AI-02**: Groq as primary provider (gemma2-9b-it, llama-3.3-70b-versatile)
- [x] **AI-03**: Gemini 2.0 Flash as fallback provider
- [x] **AI-04**: Circuit breaker logic (429 → 60s block, 5xx → immediate rotate)
- [x] **AI-05**: Task type matrix (CLASSIFY, LABEL, SUMMARIZE, ANALYZE, EXTRACT, CHAT)
- [x] **AI-06**: Prompt caching with 24h TTL in ai_prompt_cache table
- [x] **AI-07**: Per-tenant token quota tracking in ai_usage_logs table
- [x] **AI-08**: All AI calls logged with provider, model, tokens, latency

### Financial Module

- [x] **FIN-01**: User can create transaction with date, amount, category, payee, notes
- [x] **FIN-02**: User can edit and delete their own transactions
- [x] **FIN-03**: User can create hierarchical categories (parent/child)
- [x] **FIN-04**: User can create multiple accounts (checking, savings, cash, credit)
- [x] **FIN-05**: User can view account balances with running totals
- [ ] **FIN-06**: User can filter transactions by date range, category, account
- [x] **FIN-07**: System auto-categorizes transactions using AI from payee/description
- [x] **FIN-08**: User can create envelope budgets allocating income to categories
- [x] **FIN-09**: Envelope balances roll over to next month
- [x] **FIN-10**: User can create recurring transaction rules (daily, weekly, monthly, yearly)
- [x] **FIN-11**: System auto-creates transactions from recurring rules via pg-boss
- [x] **FIN-12**: Recurring transactions flagged and excluded from anomaly detection

### Habits Module

- [x] **HAB-01**: User can create habits with name, description, frequency
- [x] **HAB-02**: User can check in habit as complete/incomplete for the day
- [x] **HAB-03**: System calculates current streak and longest streak
- [ ] **HAB-04**: User can view habit calendar with completion history
- [ ] **HAB-05**: User can create habits with cron schedule ("every Mon,Wed,Fri", "every 2 weeks")
- [ ] **HAB-06**: System shows only habits scheduled for current day
- [ ] **HAB-07**: User earns XP for completing habits (10 XP per completion)
- [ ] **HAB-08**: User levels up based on XP thresholds (100 XP = level 2, etc.)
- [ ] **HAB-09**: User unlocks achievements for streak milestones (7, 30, 100 days)
- [ ] **HAB-10**: Dashboard shows user level, XP progress bar, recent achievements

### Tasks Module

- [x] **TASK-01**: User can create tasks with title, description, due date, priority
- [x] **TASK-02**: User can mark tasks as complete/incomplete
- [x] **TASK-03**: System highlights overdue tasks
- [x] **TASK-04**: User can create subtasks under parent tasks
- [x] **TASK-05**: User can create tasks via natural language ("Buy milk tomorrow 5pm #errands")
- [x] **TASK-06**: System parses title, due date, and tags from natural language input
- [x] **TASK-07**: User can filter tasks by status (pending, completed, overdue)
- [x] **TASK-08**: User can sort tasks by due date, priority, creation date

### Health Module

- [x] **HLTH-01**: User can log weight with date and optional notes
- [x] **HLTH-02**: User can view weight trend chart (line chart, 30/90/365 day views)
- [ ] **HLTH-03**: User can log vitals (blood pressure, heart rate) as JSONB
- [ ] **HLTH-04**: User can log sleep duration and quality
- [ ] **HLTH-05**: User can log workouts with type, duration, intensity (JSONB)
- [ ] **HLTH-06**: System generates weekly health digest via AI
- [ ] **HLTH-07**: Health digest sent via email (Resend) every Sunday
- [ ] **HLTH-08**: Dashboard shows health metrics summary with trends

### Notes & Journal Module

- [ ] **NOTE-01**: User can create notes with title and content
- [ ] **NOTE-02**: User can edit and delete their own notes
- [ ] **NOTE-03**: Notes content uses Tiptap rich text editor
- [ ] **NOTE-04**: User can search notes by title and content (full-text search)
- [ ] **NOTE-05**: User can organize notes with folders and tags
- [ ] **NOTE-06**: User can create journal entries with mood indicator
- [ ] **NOTE-07**: System tracks mood trends over time
- [ ] **NOTE-08**: Notes auto-save with debounce (500ms)

### Hobbies Module

- [ ] **HOBB-01**: User can create hobbies with name, tracking type (counter, percentage, list)
- [ ] **HOBB-02**: User can log hobby progress (increment counter, set percentage, add list item)
- [ ] **HOBB-03**: User can view hobby progress over time
- [ ] **HOBB-04**: System generates hobby progress insights
- [ ] **HOBB-05**: User can set hobby goals (target counter, target percentage)
- [ ] **HOBB-06**: Dashboard shows hobby completion percentage

### SaaS & Subscription

- [ ] **SAAS-01**: New users get 30-day free trial automatically
- [ ] **SAAS-02**: System tracks trial end date per tenant
- [ ] **SAAS-03**: Day 27: System sends trial expiry warning email
- [ ] **SAAS-04**: Day 30: System restricts access to free tier
- [ ] **SAAS-05**: LemonSqueezy webhook handles subscription events
- [ ] **SAAS-06**: Webhook handlers are idempotent (handle duplicates)
- [ ] **SAAS-07**: PlanFeatureGuard restricts gated endpoints
- [ ] **SAAS-08**: Tenant branding stored as JSONB (primaryColor, appName, logoUrl)

### Web Client (Next.js)

- [ ] **WEB-01**: Static export build (no SSR server process)
- [ ] **WEB-02**: Responsive dashboard with module navigation
- [ ] **WEB-03**: TanStack Query for server state management
- [ ] **WEB-04**: shadcn/ui components with Tailwind styling
- [ ] **WEB-05**: Recharts for data visualization
- [ ] **WEB-06**: Dark/light theme toggle
- [ ] **WEB-07**: PWA manifest for installable web app

### Mobile Client (Expo)

- [ ] **MOB-01**: Expo SDK 55 with React Native 0.83
- [ ] **MOB-02**: NativeWind for styling (Tailwind for React Native)
- [ ] **MOB-03**: Expo Router for file-based navigation
- [ ] **MOB-04**: Expo Push notifications integration
- [ ] **MOB-05**: Shared data-access hooks with web client
- [ ] **MOB-06**: Offline queue for actions without connectivity

### Desktop Client (Tauri)

- [ ] **DSK-01**: Tauri 2 wrapping Next.js static build
- [ ] **DSK-02**: Native OS menus and tray icon
- [ ] **DSK-03**: Auto-update mechanism
- [ ] **DSK-04**: Keyboard shortcuts for common actions
- [ ] **DSK-05**: System notifications via ntfy.sh

### Backup & Operations

- [ ] **OPS-01**: Daily PostgreSQL dump to Google Drive via rclone
- [ ] **OPS-02**: Backups older than 30 days auto-deleted
- [ ] **OPS-03**: Docker container logs capped at 30 MB per service
- [ ] **OPS-04**: Nightly API restart at 3 AM (memory leak prevention)
- [ ] **OPS-05**: ntfy.sh push notifications for 500 errors

## v2 Requirements

Deferred to future release.

### AI Enhancements
- **AI-09**: AI spending anomaly detection (requires 30+ days data)
- **AI-10**: Semantic search across notes with pgvector
- **AI-11**: AI health insights (correlations between sleep/weight/habits)

### Social & Collaboration
- **SOC-01**: Team/family sharing (invite flow, shared workspace)
- **SOC-02**: Real-time collaboration on notes

### Enterprise
- **ENT-01**: BYOK (bring your own AI key) for enterprise tenants
- **ENT-02**: Anthropic Claude and OpenAI provider options
- **ENT-03**: Marketplace module system

## Out of Scope

| Feature | Reason |
|---------|--------|
| Bank sync / Plaid | API costs ($0.30+/call), security audit burden |
| Real-time chat | Not core to personal management |
| Video/image attachments | Storage costs, CDN bandwidth |
| Redis caching | Adds RAM overhead, pg-boss sufficient |
| OAuth-only login | Email/password sufficient for v1 |
| Native mobile (non-Expo) | Lose OTA updates, double codebase |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| INFRA-01 | Phase 1 | Complete |
| INFRA-02 | Phase 1 | Complete |
| INFRA-03 | Phase 1 | Complete |
| INFRA-04 | Phase 1 | Complete |
| INFRA-05 | Phase 1 | Complete |
| INFRA-06 | Phase 1 | Complete |
| INFRA-07 | Phase 1 | Complete |
| INFRA-08 | Phase 1 | Complete |
| AUTH-01 | Phase 1 | Complete |
| AUTH-02 | Phase 1 | Pending |
| AUTH-03 | Phase 1 | Pending |
| AUTH-04 | Phase 1 | Complete |
| AUTH-05 | Phase 1 | Complete |
| AUTH-06 | Phase 1 | Complete |
| AI-01 | Phase 2 | Complete |
| AI-02 | Phase 2 | Complete |
| AI-03 | Phase 2 | Complete |
| AI-04 | Phase 2 | Complete |
| AI-05 | Phase 2 | Complete |
| AI-06 | Phase 2 | Complete |
| AI-07 | Phase 2 | Complete |
| AI-08 | Phase 2 | Complete |
| FIN-01 | Phase 3 | Complete |
| FIN-02 | Phase 3 | Complete |
| FIN-03 | Phase 3 | Complete |
| FIN-04 | Phase 3 | Complete |
| FIN-05 | Phase 3 | Complete |
| FIN-06 | Phase 3 | Pending |
| FIN-07 | Phase 3 | Complete |
| FIN-08 | Phase 3 | Complete |
| FIN-09 | Phase 3 | Complete |
| FIN-10 | Phase 3 | Complete |
| FIN-11 | Phase 3 | Complete |
| FIN-12 | Phase 3 | Complete |
| HAB-01 | Phase 4 | Complete |
| HAB-02 | Phase 4 | Complete |
| HAB-03 | Phase 4 | Complete |
| HAB-04 | Phase 4 | Pending |
| HAB-05 | Phase 4 | Pending |
| HAB-06 | Phase 4 | Pending |
| HAB-07 | Phase 4 | Pending |
| HAB-08 | Phase 4 | Pending |
| HAB-09 | Phase 4 | Pending |
| HAB-10 | Phase 4 | Pending |
| TASK-01 | Phase 4 | Complete |
| TASK-02 | Phase 4 | Complete |
| TASK-03 | Phase 4 | Complete |
| TASK-04 | Phase 4 | Complete |
| TASK-05 | Phase 4 | Complete |
| TASK-06 | Phase 4 | Complete |
| TASK-07 | Phase 4 | Complete |
| TASK-08 | Phase 4 | Complete |
| HLTH-01 | Phase 5 | Complete |
| HLTH-02 | Phase 5 | Complete |
| HLTH-03 | Phase 5 | Pending |
| HLTH-04 | Phase 5 | Pending |
| HLTH-05 | Phase 5 | Pending |
| HLTH-06 | Phase 5 | Pending |
| HLTH-07 | Phase 5 | Pending |
| HLTH-08 | Phase 5 | Pending |
| NOTE-01 | Phase 6 | Pending |
| NOTE-02 | Phase 6 | Pending |
| NOTE-03 | Phase 6 | Pending |
| NOTE-04 | Phase 6 | Pending |
| NOTE-05 | Phase 6 | Pending |
| NOTE-06 | Phase 6 | Pending |
| NOTE-07 | Phase 6 | Pending |
| NOTE-08 | Phase 6 | Pending |
| HOBB-01 | Phase 7 | Pending |
| HOBB-02 | Phase 7 | Pending |
| HOBB-03 | Phase 7 | Pending |
| HOBB-04 | Phase 7 | Pending |
| HOBB-05 | Phase 7 | Pending |
| HOBB-06 | Phase 7 | Pending |
| SAAS-01 | Phase 8 | Pending |
| SAAS-02 | Phase 8 | Pending |
| SAAS-03 | Phase 8 | Pending |
| SAAS-04 | Phase 8 | Pending |
| SAAS-05 | Phase 8 | Pending |
| SAAS-06 | Phase 8 | Pending |
| SAAS-07 | Phase 8 | Pending |
| SAAS-08 | Phase 8 | Pending |
| WEB-01 | Phase 9 | Pending |
| WEB-02 | Phase 9 | Pending |
| WEB-03 | Phase 9 | Pending |
| WEB-04 | Phase 9 | Pending |
| WEB-05 | Phase 9 | Pending |
| WEB-06 | Phase 9 | Pending |
| WEB-07 | Phase 9 | Pending |
| MOB-01 | Phase 10 | Pending |
| MOB-02 | Phase 10 | Pending |
| MOB-03 | Phase 10 | Pending |
| MOB-04 | Phase 10 | Pending |
| MOB-05 | Phase 10 | Pending |
| MOB-06 | Phase 10 | Pending |
| DSK-01 | Phase 11 | Pending |
| DSK-02 | Phase 11 | Pending |
| DSK-03 | Phase 11 | Pending |
| DSK-04 | Phase 11 | Pending |
| DSK-05 | Phase 11 | Pending |
| OPS-01 | Phase 12 | Pending |
| OPS-02 | Phase 12 | Pending |
| OPS-03 | Phase 12 | Pending |
| OPS-04 | Phase 12 | Pending |
| OPS-05 | Phase 12 | Pending |

**Coverage:**
- v1 requirements: 79 total
- Mapped to phases: 79
- Unmapped: 0

---
*Requirements defined: 2026-03-22*
*Last updated: 2026-03-22 after roadmap creation*
