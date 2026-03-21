# Project Research Summary

**Project:** PMS Ecosystem — Personal Management SaaS Platform
**Domain:** Personal Management System (Financial, Habits, Tasks, Health, Notes, Hobbies)
**Researched:** 2026-03-21
**Confidence:** HIGH

## Executive Summary

The PMS Ecosystem is a multi-module personal management SaaS platform that combines financial tracking, habit formation, task management, health monitoring, note-taking, and hobby tracking into a unified system. Research indicates that successful platforms in this domain follow a **modular monolith architecture with hexagonal patterns**, using PostgreSQL Row Level Security (RLS) for multi-tenancy from day one. The key differentiator is AI-powered features (transaction categorization, anomaly detection, natural language parsing) implemented through a unified gateway that abstracts multiple providers.

The recommended approach prioritizes **foundational correctness over feature velocity**: implement multi-tenancy with RLS before writing any business logic, establish Nx module boundaries to prevent architectural erosion, and build the AI Gateway with circuit breakers before adding AI features. The 8 GB RAM VPS constraint ($5/mo) demands aggressive optimization—no Redis, static Next.js exports instead of SSR, and pg-boss for job queues instead of separate services. This stack is proven at scale (ActualBudget uses similar patterns) and designed for single-developer productivity while remaining extensible to microservices when needed.

**Critical risks** are well-documented with clear mitigations: multi-tenancy retrofit (prevented by RLS from day one), Nx boundary violations (prevented by `@nx/enforce-module-boundaries` rule), AI rate limit exhaustion (prevented by circuit breaker + fallback chain), and VPS memory exhaustion (prevented by tuned PostgreSQL configs and heap limits). The research shows these are not theoretical concerns—each has caused production failures in similar projects.

## Key Findings

### Recommended Stack

The stack is optimized for single-developer productivity, low-cost hosting ($5/mo VPS), and AI features without vendor lock-in. Core technologies are chosen for type safety, developer experience, and memory efficiency.

**Core technologies:**
- **Nx 22.6 + pnpm 9.x** — Monorepo with enforced module boundaries prevents architectural erosion and enables code sharing across web/mobile/desktop
- **NestJS 11.1 + Fastify 5.x** — Modular DI framework with 2x faster performance than Express, lower memory footprint ideal for 8 GB constraint
- **PostgreSQL 17 + Prisma 7.3** — RLS for multi-tenancy eliminates data leakage risk, JSONB for flexible health/hobby logs, type-safe queries
- **Next.js 16.2 (static export)** — Turbopack builds, React 19.2 Server Components, static export eliminates SSR memory overhead
- **Expo SDK 55** — Cross-platform mobile with OTA updates, NativeWind for Tailwind styling, shared TanStack Query hooks with web
- **Groq (primary) + Gemini 2.0 Flash (fallback)** — Free tier AI providers (~1M tokens/day each) accessed through unified gateway with circuit breaker
- **Caddy + Docker Compose** — Automatic HTTPS without manual cert management, single-server orchestration for $5/mo VPS
- **pg-boss 10** — PostgreSQL-backed job queue eliminates Redis requirement, runs in-process

**Avoid:** Express (slower), Redis (adds ~100MB RAM), SSR Next.js (memory overhead), TypeORM (less type-safe), Electron (150MB binary vs Tauri's 10MB), OpenAI GPT-4 (expensive).

### Expected Features

Research identified clear table stakes features that users expect versus differentiators that create competitive advantage. MVP should focus on core CRUD across all modules before adding AI enhancements.

**Must have (table stakes):**
- **Auth: Email/Password Login** — Cannot use app without authentication
- **Financial: Transaction Entry, Category Management, Account Balances** — Core value proposition, users expect basic financial awareness
- **Habits: Daily Check-in, Streak Counter** — Minimal gamification baseline, users expect streak tracking
- **Tasks: Due Dates, Completion Status** — Basic task management requirement
- **Notes: Create/Edit/Delete, Search** — CRUD baseline, finding notes is essential
- **Cross-Platform Sync** — Users expect data everywhere, web + mobile baseline

**Should have (competitive):**
- **AI Transaction Categorization** — Reduces manual entry friction, validates AI value proposition
- **Envelope Budgeting** — Zero-based budgeting method (ActualBudget reference), differentiator for financial module
- **Natural Language Task Parsing** — "Buy milk tomorrow 5pm" → structured task, speeds up task creation
- **Recurring Transaction Rules** — Automates predictable income/expenses
- **Habit Cron Scheduling** — Flexible recurrence beyond daily (e.g., "every Mon,Wed,Fri")

**Defer (v2+):**
- **AI Spending Anomaly Detection** — Requires 30+ days historical data, complex ML patterns
- **Habit Gamification (RPG Elements)** — Habitica-style XP/levels, significant complexity for unproven engagement
- **AI Journal Summarization** — Requires substantial journal usage first
- **White-Label Custom Domains** — SaaS feature, not relevant for personal use v1
- **SaaS Subscription System** — Only when scaling to customers, LemonSqueezy integration
- **Bank Sync/Plaid Integration** — API costs ($0.30+/call), security audit burden, CSV import + AI categorization sufficient

### Architecture Approach

The recommended architecture follows **hexagonal/ports-and-adapters patterns** within a modular monolith structure. Each domain module (financial, habits, health, notes, hobbies) is isolated with clear layers: domain (entities, value objects, events), application (use cases, CQRS handlers), infrastructure (repositories, adapters), and presentation (controllers, DTOs). Modules communicate via EventEmitter2 domain events—never direct imports. PostgreSQL RLS enforces tenant isolation at the database level, eliminating manual tenant filtering and data leakage risk. The AI Gateway provides a unified interface to Groq/Gemini with automatic fallback, circuit breakers, and token budgeting.

**Major components:**
1. **API Gateway (NestJS + Fastify)** — Request routing, auth middleware (JWT), tenant context setup (sets `app.current_tenant` for RLS)
2. **Domain Modules (hexagonal)** — Financial, Habits, Health, Notes, Hobbies, each with domain/application/infrastructure/presentation layers
3. **Tenant Context Middleware** — Sets PostgreSQL session variable for RLS, automatic tenant filtering without application code
4. **AI Gateway** — Unified interface to Groq/Gemini with circuit breaker, fallback chain, response caching, token budgeting per tenant
5. **Event Bus (EventEmitter2)** — Cross-module communication via domain events, loose coupling enables future microservice extraction
6. **PostgreSQL with RLS** — Tenant isolation at database level, JSONB for flexible logs (workouts, health metrics), full-text search
7. **Subscription Module (future)** — LemonSqueezy webhooks, trial management, tiered plans, entitlement checks

### Critical Pitfalls

Research identified six critical pitfalls that have caused production failures in similar projects. Each has clear prevention strategies.

1. **Multi-Tenancy Retrofit** — Adding `tenantId` after launch requires touching every table/query/index, 2-4 weeks work, high data leakage risk. **Prevention:** Add `tenant_id` to every table from day one, use PostgreSQL RLS policies, never manually filter by tenant in application code.

2. **PostgreSQL RLS Policy Misconfiguration** — Policies too permissive (security hole) or too restrictive (breaks functionality), testing with superuser bypasses RLS. **Prevention:** Use `CURRENT_SETTING('app.current_tenant')` for tenant isolation, create policies for both SELECT (USING) and INSERT/UPDATE (WITH CHECK), test with non-superuser connections.

3. **Nx Monorepo Boundary Violations** — Libraries import from modules they shouldn't, creates circular dependencies, `nx affected` becomes unreliable. **Prevention:** Configure `@nx/enforce-module-boundaries` with tags (`type:app|lib`, `domain:*`, `layer:*`), run `nx graph` regularly, set dependency constraints in `nx.json`.

4. **AI Provider Rate Limit Exhaustion** — Hitting Groq's ~1M tokens/day or Gemini's rate limits causes AI feature outages, no fallback means complete failure. **Prevention:** Implement circuit breaker pattern, cache responses for identical prompts, primary/fallback chain (Groq → Gemini → cached response → graceful degradation), monitor token usage with alerts at 80%.

5. **VPS Memory Exhaustion (8 GB constraint)** — PostgreSQL, NestJS, Next.js builds, Docker containers exceed available RAM, causes swapping/OOM kills. **Prevention:** Tune PostgreSQL (`work_mem=64MB`, `shared_buffers=2GB`, `effective_cache_size=6GB`), limit Node.js heap (`NODE_OPTIONS="--max-old-space-size=2048"`), run builds on CI/CD not production, monitor with `htop`/`docker stats`.

6. **LemonSqueezy Webhook Race Conditions** — Webhooks arrive out of order or duplicate, double-processing causes subscription state inconsistency. **Prevention:** Make webhook processing idempotent, store webhook event ID and skip duplicates, use webhook timestamp for ordering, return HTTP 200 within 5 seconds then process async.

## Implications for Roadmap

Based on research dependencies and architecture patterns, the roadmap should follow a layered approach: foundational infrastructure first, then domain modules incrementally, AI integration after core features work, subscription system last.

### Phase 1: Foundation (Multi-Tenancy & Auth)
**Rationale:** Multi-tenancy cannot be retrofitted—RLS policies must be correct before any business logic is written. Nx boundaries must be enforced from the start or technical debt accumulates. This phase addresses the highest-risk pitfalls first.

**Delivers:**
- Nx workspace with module boundary enforcement configured
- NestJS API skeleton with Fastify adapter
- PostgreSQL 17 with RLS policies on all tables
- JWT authentication with password hashing
- Tenant context middleware that sets `app.current_tenant`
- Docker Compose setup with memory limits tuned for 8 GB
- Shared libraries (types, utils, testing)

**Addresses:** Auth: Email/Password Login (from FEATURES.md table stakes)

**Avoids:** Multi-tenancy retrofit pitfall, Nx boundary violations pitfall, VPS memory exhaustion pitfall

### Phase 2: Financial Module (Core Value)
**Rationale:** Financial tracking is the primary value proposition. Implementing it first validates the hexagonal architecture pattern and provides data for AI features later. Envelope budgeting requires categories and accounts to exist first.

**Delivers:**
- Financial domain module with hexagonal layers
- Transaction CRUD with category management
- Account balances with running totals
- Basic financial charts (spending by category over time)
- Full-text search for transactions

**Addresses:** Financial: Transaction Entry, Category Management, Account Balances (FEATURES.md table stakes)

**Uses:** PostgreSQL with JSONB for flexible transaction metadata, Prisma for type-safe queries

**Implements:** Hexagonal architecture pattern (domain/application/infrastructure/presentation layers), Repository pattern with ports

### Phase 3: AI Gateway & Enhancement
**Rationale:** AI features differentiate the product but require the gateway infrastructure first. Building the gateway with circuit breakers before AI features prevents rate limit exhaustion pitfall. Transaction categorization validates AI value with immediate user benefit.

**Delivers:**
- AI Gateway service with Groq/Gemini providers
- Circuit breaker pattern with fallback chain
- Response caching and token budgeting per tenant
- AI transaction categorization (classify payee/description)
- Natural language task parsing ("Buy milk tomorrow 5pm")
- Domain event handlers for AI integration

**Addresses:** AI Transaction Categorization, Natural Language Task Parsing (FEATURES.md should-have)

**Uses:** Groq (primary, gemma2-9b-it for classification), Gemini 2.0 Flash (fallback, JSON mode for extraction)

**Implements:** AI Gateway pattern, Circuit Breaker pattern, Domain event-driven integration

**Avoids:** AI provider rate limit exhaustion pitfall

### Phase 4: Additional Domain Modules
**Rationale:** With architecture validated and AI infrastructure in place, remaining modules can be implemented rapidly using established patterns. Cross-module features (e.g., AI analyzing health data) become possible.

**Delivers:**
- Habits module (daily check-in, streak counter, cron scheduling)
- Tasks module (due dates, completion status, natural language parsing from Phase 3)
- Health module (weight tracking, JSONB workout logs, basic charts)
- Notes module (Tiptap editor, full-text search, mood tags)
- Hobbies module (flexible tracking: counter, percentage, list-based)

**Addresses:** Habits: Daily Check-in, Streak Counter; Tasks: Due Dates, Completion Status; Health: Weight Tracking, Basic Charts; Notes: Create/Edit/Delete, Search (FEATURES.md table stakes)

**Uses:** Tiptap for rich text editor, Recharts for visualizations, JSONB for flexible health/hobby logs

**Implements:** Hexagonal architecture per module, Domain events for cross-module communication

### Phase 5: Cross-Platform Clients
**Rationale:** With API complete, build clients using shared type definitions and hooks. TanStack Query enables consistent state management across platforms. Static Next.js export keeps hosting costs low.

**Delivers:**
- Web client (Next.js 16.2 with static export, shadcn/ui components)
- Mobile client (Expo SDK 55, NativeWind, Expo Router)
- Shared data-access layer (TanStack Query hooks, Axios client)
- Shared UI components (web: shadcn/ui, mobile: NativeWind React Native)

**Addresses:** Cross-Platform Sync (FEATURES.md table stakes)

**Uses:** Next.js static export (eliminates SSR memory overhead), NativeWind for Tailwind on React Native, Expo OTA updates for rapid iteration

**Implements:** Repository pattern in clients, shared state management via TanStack Query

### Phase 6: Subscription System (SaaS)
**Rationale:** Subscription system is only needed when scaling to customers. Building it last prevents premature complexity. LemonSqueezy handles VAT/taxes as merchant of record.

**Delivers:**
- Subscription domain module
- LemonSqueezy webhook handlers with idempotency
- Trial management and tiered plans
- Entitlement checks for premium features
- White-label custom domain support (Caddy reverse proxy)

**Addresses:** SaaS Subscription System, White-Label Custom Domains (FEATURES.md defer)

**Uses:** LemonSqueezy API (merchant of record), Caddy automatic HTTPS for custom domains

**Implements:** Webhook event processing, Idempotency pattern for duplicate prevention

**Avoids:** LemonSqueezy webhook race conditions pitfall

### Phase 7: Advanced AI Features (Future)
**Rationale:** These features require substantial historical data or complex ML patterns. Defer until product-market fit is validated and data accumulation enables pattern detection.

**Delivers:**
- AI spending anomaly detection (requires 30+ days transaction history)
- AI journal summarization and mood trend analysis
- AI health insights (correlation between habits/sleep/weight)
- Weekly health digest emails (Resend integration)

**Addresses:** AI Spending Anomaly Detection, AI Journal Summarization, AI Mood Trend Analysis, AI Health Insights, Weekly Health Digest (FEATURES.md defer)

**Uses:** Historical data accumulation, pattern detection ML models, Resend for transactional emails

### Phase Ordering Rationale

- **Foundation first:** Multi-tenancy and auth are prerequisites for all features. RLS policies must be correct before data accumulates.
- **Financial module second:** Validates hexagonal architecture, provides data for AI features, demonstrates core value proposition.
- **AI Gateway third:** Infrastructure for AI features must be built with resilience patterns before AI dependencies are added.
- **Additional modules fourth:** Architecture patterns proven, can implement remaining modules rapidly using templates.
- **Clients fifth:** API must be complete before clients can be built. Shared libraries prevent code duplication.
- **Subscription sixth:** Only needed when scaling to customers, adds complexity not required for personal use validation.
- **Advanced AI seventh:** Requires historical data and ML patterns, defer until product-market fit validated.

### Research Flags

**Phases likely needing deeper research during planning:**
- **Phase 3 (AI Gateway):** Groq/Gemini API rate limits may change, fallback logic needs testing with actual API failures. Research actual token consumption patterns for classification/extraction tasks.
- **Phase 6 (Subscription System):** LemonSqueezy webhook retry behavior, signature validation implementation, and subscription state machine edge cases need detailed research during planning.
- **Phase 7 (Advanced AI Features):** Anomaly detection ML patterns, mood trend analysis algorithms, and health correlation models are complex—research during phase planning, not during initial roadmap creation.

**Phases with standard patterns (skip research-phase):**
- **Phase 1 (Foundation):** NestJS + Fastify, PostgreSQL RLS, Nx boundaries—all well-documented with established patterns.
- **Phase 2 (Financial Module):** Hexagonal architecture, Prisma ORM, transaction CRUD—standard domain modeling with proven patterns.
- **Phase 4 (Additional Domain Modules):** Follows Phase 2 patterns, CRUD operations are well-understood.
- **Phase 5 (Cross-Platform Clients):** Next.js static export, Expo, TanStack Query—all have excellent documentation and community patterns.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All technologies verified via official documentation (Nx 22.6, NestJS 11.1, PostgreSQL 17, Next.js 16.2, Expo SDK 55). Only AI providers have MEDIUM confidence due to free tier volatility. |
| Features | HIGH | Table stakes features identified via competitor analysis (ActualBudget, Habitica, Notion). Clear distinction between must-have vs. differentiators. Dependency graph validated. |
| Architecture | HIGH | Hexagonal/ports-and-adapters patterns verified via PostgreSQL RLS docs, Nx module boundaries docs, and industry best practices (Kamil Grzybek). |
| Pitfalls | HIGH | All six critical pitfalls documented with official sources (PostgreSQL RLS docs, Nx docs, LemonSqueezy webhook docs, Groq/Gemini rate limits). Prevention strategies are concrete. |

**Overall confidence:** HIGH

### Gaps to Address

- **AI Token Consumption:** Groq/Gemini free tiers are generous (1M tokens/day each) but actual consumption patterns for classification/extraction tasks are unknown. **Handle during planning:** Build token budgeting and monitoring from Phase 3, set alerts at 80% capacity, implement graceful degradation before limits hit.

- **RLS Policy Performance:** PostgreSQL RLS adds query overhead but performance impact at scale (10K+ rows per tenant) is unknown. **Handle during planning:** Create composite indexes `(tenant_id, ...)` for all queries, load test during Phase 2, add read replicas if needed during scaling.

- **Cross-Platform Data Consistency:** Sync-first architecture with offline queue (mobile) has complexity risks. **Handle during planning:** Implement optimistic locking with conflict resolution, version all entities, sync status indicators in UI.

- **Habit Gamification Efficacy:** RPG elements (XP, levels, rewards) may not resonate with users—significant complexity for unproven engagement. **Handle during planning:** Defer to v2+, validate basic habit tracking first, A/B test gamification features before full implementation.

## Sources

### Primary (HIGH confidence)
- PostgreSQL 17 Row Level Security Documentation — RLS policy syntax, USING vs WITH CHECK clauses, session variables for tenant isolation: https://www.postgresql.org/docs/current/ddl-rowsecurity.html
- Nx Module Boundaries Documentation — `@nx/enforce-module-boundaries` rule, tag-based dependency constraints, `nx graph` visualization: https://nx.dev/features/enforce-module-boundaries
- NestJS Documentation — Fastify adapter recommendation (2x faster than Express), modular DI, event emitter: https://docs.nestjs.com
- Prisma 7 Documentation — Type-safe queries, migrations, Zod integration, full-text search: https://www.prisma.io/docs
- LemonSqueezy Webhook Documentation — Signature validation, retry behavior (up to 3x), event ordering: https://docs.lemonsqueezy.com/guides/developer-guide/webhooks

### Secondary (MEDIUM confidence)
- ActualBudget (GitHub) — Envelope budgeting reference, local-first architecture patterns, self-hosting: https://github.com/actualbudget/actual
- Habitica (GitHub) — Habit gamification reference, RPG mechanics, engagement patterns: https://github.com/HabitRPG/habitica
- Tiptap (GitHub) — Headless rich text editor, extension system: https://github.com/ueberdosis/tiptap
- Kamil Grzybek's Modular Monolith Course — Module boundaries, hexagonal architecture, domain-driven design patterns

### Tertiary (LOW confidence)
- Groq API Documentation — Free tier limits (1M tokens/day), model specifications (gemma2-9b-it, llama-3.3-70b-versatile) — **volatile, may change**
- Gemini 2.0 Flash Documentation — Free tier limits (1M tokens/day, 1500 req/day), Dynamic Shared Quota — **volatile, may change**

---
*Research completed: 2026-03-21*
*Ready for roadmap: yes*
