# PMS Ecosystem

## What This Is

A self-hosted, full-stack personal management platform built for a single developer. It starts as a personal tool (financial tracking, habits, health, notes, hobbies) and is designed to scale to a multi-tenant SaaS subscription product without major architectural changes. All infrastructure is open-source and free to avoid SaaS lock-in.

## Core Value

A unified personal data platform with AI-powered insights that costs ~$5/month to run and can scale to a SaaS business when ready.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Financial module — transactions, budgets, recurring rules, spending anomaly detection
- [ ] Habits & Tasks module — one-off tasks, habit streaks, cron scheduling, natural language parsing
- [ ] Health & Fitness module — vitals, sleep, workouts with JSONB logs, weekly health digest
- [ ] Notes & Journal module — Tiptap editor, full-text search, mood trends, journal summarization
- [ ] Hobbies module — flexible tracking (counter, %, list), collection insights, progress analysis
- [ ] AI Gateway — unified interface to Groq + Gemini 2.0 Flash with circuit breaker, caching, token budgets
- [ ] Multi-tenant architecture — PostgreSQL RLS, tenant isolation from day one
- [ ] SaaS subscription system — LemonSqueezy integration, 30-day trial, tiered plans
- [ ] Cross-platform clients — Next.js web, Expo mobile, Tauri desktop

### Out of Scope

- Real-time chat — High complexity, not core to personal management value
- Video hosting — Storage/bandwidth costs, defer indefinitely
- OAuth login initially — Email/password sufficient for v1, add later
- Redis — Using pg-boss instead, no extra service needed

## Context

**Technical Environment:**
- Full-stack TypeScript monorepo (Nx 22.6)
- Modular monolith with Ports & Adapters architecture
- PostgreSQL 17 with Row Level Security for multi-tenancy
- NestJS 11.1 + Fastify adapter for API
- Next.js 16.2 static export for web
- Expo SDK 55 for mobile
- Tauri 2 for desktop

**Infrastructure:**
- Contabo VPS 10 ($4.95/mo): 4 vCPU, 8 GB RAM, 150 GB SSD
- Caddy reverse proxy with automatic HTTPS
- Docker Compose for all services
- Cloudflare CDN/DDoS protection (free)
- rclone backups to Google Drive

**AI Integration:**
- Primary: Groq (free tier ~1M tokens/day)
- Fallback: Gemini 2.0 Flash (free tier)
- Task types: CLASSIFY, LABEL, SUMMARIZE, ANALYZE, EXTRACT, CHAT
- Optimizations: prompt caching, semantic deduplication, batching

**Payment Processing:**
- LemonSqueezy as merchant of record (5% + $0.50/transaction)
- Handles VAT/GST globally — critical for Vietnam-based developer
- Webhook-driven subscription management

## Constraints

- **Budget**: ~$5/month fixed cost before revenue
- **VPS RAM**: 8 GB with 2 GB swap — limits concurrent services
- **Free Tiers**: Maximize Groq, Gemini, Resend, Cloudflare free tiers
- **Latency**: Contabo EU ~200ms from Vietnam; consider Singapore at scale
- **Single Developer**: Architecture must be maintainable solo
- **PostgreSQL Only**: No Redis, no separate services — keep stack simple

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Nx monorepo | Module boundaries enforced at lint level, affected builds | — Pending |
| Modular monolith | Module isolation without microservice complexity | — Pending |
| PostgreSQL RLS | Tenant isolation at database level, zero manual filtering | — Pending |
| LemonSqueezy over Stripe | Merchant of record handles global VAT automatically | — Pending |
| Caddy over Nginx | Automatic HTTPS for white-label custom domains | — Pending |
| pg-boss over Redis | No extra service, runs inside NestJS process | — Pending |
| Tauri over Electron | 10x smaller binary, native performance | — Pending |

---

*Last updated: 2026-03-21 after initialization*

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd:transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state
