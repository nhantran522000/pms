<!-- gitnexus:start -->
# GitNexus — Code Intelligence

This project is indexed by GitNexus as **pms** (0 symbols, 0 relationships, 0 execution flows). Use the GitNexus MCP tools to understand code, assess impact, and navigate safely.

> If any GitNexus tool warns the index is stale, run `npx gitnexus analyze` in terminal first.

## Always Do

- **MUST run impact analysis before editing any symbol.** Before modifying a function, class, or method, run `gitnexus_impact({target: "symbolName", direction: "upstream"})` and report the blast radius (direct callers, affected processes, risk level) to the user.
- **MUST run `gitnexus_detect_changes()` before committing** to verify your changes only affect expected symbols and execution flows.
- **MUST warn the user** if impact analysis returns HIGH or CRITICAL risk before proceeding with edits.
- When exploring unfamiliar code, use `gitnexus_query({query: "concept"})` to find execution flows instead of grepping. It returns process-grouped results ranked by relevance.
- When you need full context on a specific symbol — callers, callees, which execution flows it participates in — use `gitnexus_context({name: "symbolName"})`.

## When Debugging

1. `gitnexus_query({query: "<error or symptom>"})` — find execution flows related to the issue
2. `gitnexus_context({name: "<suspect function>"})` — see all callers, callees, and process participation
3. `READ gitnexus://repo/pms/process/{processName}` — trace the full execution flow step by step
4. For regressions: `gitnexus_detect_changes({scope: "compare", base_ref: "main"})` — see what your branch changed

## When Refactoring

- **Renaming**: MUST use `gitnexus_rename({symbol_name: "old", new_name: "new", dry_run: true})` first. Review the preview — graph edits are safe, text_search edits need manual review. Then run with `dry_run: false`.
- **Extracting/Splitting**: MUST run `gitnexus_context({name: "target"})` to see all incoming/outgoing refs, then `gitnexus_impact({target: "target", direction: "upstream"})` to find all external callers before moving code.
- After any refactor: run `gitnexus_detect_changes({scope: "all"})` to verify only expected files changed.

## Never Do

- NEVER edit a function, class, or method without first running `gitnexus_impact` on it.
- NEVER ignore HIGH or CRITICAL risk warnings from impact analysis.
- NEVER rename symbols with find-and-replace — use `gitnexus_rename` which understands the call graph.
- NEVER commit changes without running `gitnexus_detect_changes()` to check affected scope.

## Tools Quick Reference

| Tool | When to use | Command |
|------|-------------|---------|
| `query` | Find code by concept | `gitnexus_query({query: "auth validation"})` |
| `context` | 360-degree view of one symbol | `gitnexus_context({name: "validateUser"})` |
| `impact` | Blast radius before editing | `gitnexus_impact({target: "X", direction: "upstream"})` |
| `detect_changes` | Pre-commit scope check | `gitnexus_detect_changes({scope: "staged"})` |
| `rename` | Safe multi-file rename | `gitnexus_rename({symbol_name: "old", new_name: "new", dry_run: true})` |
| `cypher` | Custom graph queries | `gitnexus_cypher({query: "MATCH ..."})` |

## Impact Risk Levels

| Depth | Meaning | Action |
|-------|---------|--------|
| d=1 | WILL BREAK — direct callers/importers | MUST update these |
| d=2 | LIKELY AFFECTED — indirect deps | Should test |
| d=3 | MAY NEED TESTING — transitive | Test if critical path |

## Resources

| Resource | Use for |
|----------|---------|
| `gitnexus://repo/pms/context` | Codebase overview, check index freshness |
| `gitnexus://repo/pms/clusters` | All functional areas |
| `gitnexus://repo/pms/processes` | All execution flows |
| `gitnexus://repo/pms/process/{name}` | Step-by-step execution trace |

## Self-Check Before Finishing

Before completing any code modification task, verify:
1. `gitnexus_impact` was run for all modified symbols
2. No HIGH/CRITICAL risk warnings were ignored
3. `gitnexus_detect_changes()` confirms changes match expected scope
4. All d=1 (WILL BREAK) dependents were updated

## Keeping the Index Fresh

After committing code changes, the GitNexus index becomes stale. Re-run analyze to update it:

```bash
npx gitnexus analyze
```

If the index previously included embeddings, preserve them by adding `--embeddings`:

```bash
npx gitnexus analyze --embeddings
```

To check whether embeddings exist, inspect `.gitnexus/meta.json` — the `stats.embeddings` field shows the count (0 means no embeddings). **Running analyze without `--embeddings` will delete any previously generated embeddings.**

> Claude Code users: A PostToolUse hook handles this automatically after `git commit` and `git merge`.

## CLI

| Task | Read this skill file |
|------|---------------------|
| Understand architecture / "How does X work?" | `.claude/skills/gitnexus/gitnexus-exploring/SKILL.md` |
| Blast radius / "What breaks if I change X?" | `.claude/skills/gitnexus/gitnexus-impact-analysis/SKILL.md` |
| Trace bugs / "Why is X failing?" | `.claude/skills/gitnexus/gitnexus-debugging/SKILL.md` |
| Rename / extract / split / refactor | `.claude/skills/gitnexus/gitnexus-refactoring/SKILL.md` |
| Tools, resources, schema reference | `.claude/skills/gitnexus/gitnexus-guide/SKILL.md` |
| Index, status, clean, wiki CLI commands | `.claude/skills/gitnexus/gitnexus-cli/SKILL.md` |

<!-- gitnexus:end -->

<!-- GSD:project-start source:PROJECT.md -->
## Project

**PMS Ecosystem**

A self-hosted, full-stack personal management platform built for a single developer. It starts as a personal tool (financial tracking, habits, health, notes, hobbies) and is designed to scale to a multi-tenant SaaS subscription product without major architectural changes. All infrastructure is open-source and free to avoid SaaS lock-in.

**Core Value:** A unified personal data platform with AI-powered insights that costs ~$5/month to run and can scale to a SaaS business when ready.

### Constraints

- **Budget**: ~$5/month fixed cost before revenue
- **VPS RAM**: 8 GB with 2 GB swap — limits concurrent services
- **Free Tiers**: Maximize Groq, Gemini, Resend, Cloudflare free tiers
- **Latency**: Contabo EU ~200ms from Vietnam; consider Singapore at scale
- **Single Developer**: Architecture must be maintainable solo
- **PostgreSQL Only**: No Redis, no separate services — keep stack simple
<!-- GSD:project-end -->

<!-- GSD:stack-start source:research/STACK.md -->
## Technology Stack

## Executive Summary
## Core Stack
### Monorepo & Build
| Layer | Technology | Version | Rationale |
|-------|------------|---------|-----------|
| Monorepo | Nx | 22.6 | Affected builds, module boundary lint, project graph visualization |
| Package Manager | pnpm | 9.x | Disk efficient, fast installs, workspace support |
- Use `@nx/enforce-module-boundaries` with tags: `type:app|lib`, `domain:financial|habits|health|notes|hobbies|shared`, `layer:domain|application|infrastructure|presentation`
- Enable distributed caching with Nx Cloud (free for small teams)
### API Layer
| Layer | Technology | Version | Rationale |
|-------|------------|---------|-----------|
| Framework | NestJS | 11.1 | Modular DI, guards, interceptors, TypeScript-first |
| HTTP Adapter | Fastify | 5.x | 2x faster than Express, lower memory footprint |
| Validation | Zod | 3.24 | Runtime validation, type inference, shared with frontend |
| Serialization | class-transformer | 0.5 | DTO transformation, response filtering |
- `@nestjs/config` — Typed configuration with Zod validation
- `@nestjs/event-emitter` — EventEmitter2 for domain events
- `@nestjs/jwt` — JWT authentication (no Passport needed for simple auth)
- `@nestjs/throttler` — Rate limiting
- `nestjs-pino` — Fast structured logging
- Express adapter — 2x slower, higher memory
- Passport — Overkill for single-tenant auth; use JWT + cookies directly
### Database Layer
| Layer | Technology | Version | Rationale |
|-------|------------|---------|-----------|
| Database | PostgreSQL | 17 | RLS for multi-tenancy, JSONB for flexible logs, full-text search |
| ORM | Prisma | 7.3 | Type-safe queries, migrations, Zod integration |
| Job Queue | pg-boss | 10 | PostgreSQL-backed, no Redis needed, runs in-process |
- All tables include `tenantId String` with RLS policy
- Use `Json` type for flexible logs (workouts, health metrics)
- Use `@@index` for full-text search columns
- TypeORM — Less type-safe, migration issues
- MikroORM — Smaller community, more config
- Redis — Adds ~100MB RAM, pg-boss handles queue needs
### Frontend Stack
#### Web (Next.js)
| Layer | Technology | Version | Rationale |
|-------|------------|---------|-----------|
| Framework | Next.js | 16.2 | Static export, Turbopack, React 19.2 |
| React | React | 19.2 | Server Components for dashboard, client for interactivity |
| Styling | Tailwind CSS | 4.x | Utility-first, small bundle size |
| Components | shadcn/ui | latest | Accessible, customizable, Radix primitives |
| State | TanStack Query | 5.x | Server state, caching, optimistic updates |
| Forms | React Hook Form | 7.x | Performance, Zod integration |
| Charts | Recharts | 2.x | Simple, composable, React-native |
- SSR server process — Adds RAM overhead, static export is sufficient
- Redux/Zustand — TanStack Query handles most state needs
- Material UI — Large bundle size, harder to customize
#### Mobile (Expo)
| Layer | Technology | Version | Rationale |
|-------|------------|---------|-----------|
| Framework | Expo | SDK 55 | OTA updates, managed workflow, React Native 0.83 |
| Styling | NativeWind | 4.x | Tailwind for React Native |
| Navigation | Expo Router | 4.x | File-based routing, deep linking |
| State | TanStack Query | 5.x | Same as web, shared hooks |
- `expo-notifications` — Local and push notifications
- `expo-secure-store` — Secure credential storage
- `expo-updates` — OTA updates without app store review
- Bare React Native — Lose OTA updates, more complex builds
- Styled Components — NativeWind is faster, smaller
#### Desktop (Tauri)
| Layer | Technology | Version | Rationale |
|-------|------------|---------|-----------|
| Framework | Tauri | 2.x | 10x smaller than Electron, Rust backend |
| Bundler | Vite | 6.x | Fast HMR, ES modules |
| UI | React | 19.2 | Wraps static Next.js build |
- ~10 MB binary vs ~150 MB for Electron
- Native OS integration (menus, tray, notifications)
- Secure by default (CSP enforced)
- Electron — Large binary, high memory usage
- Neutralino — Smaller community, fewer features
### AI Integration
| Layer | Technology | Version | Rationale |
|-------|------------|---------|-----------|
| Primary Provider | Groq | API | Free tier ~1M tokens/day, Llama 3.3 70B |
| Fallback Provider | Gemini | 2.0 Flash | Free tier 1M tokens/day, 1500 req/day |
| HTTP Client | native fetch | — | Streaming support, no extra dependency |
| Task | Max Tokens | Primary | Fallback |
|------|------------|---------|----------|
| CLASSIFY | 50 | Groq / gemma2-9b-it | Gemini 2.0 Flash |
| LABEL | 80 | Groq / gemma2-9b-it | Gemini 2.0 Flash |
| SUMMARIZE | 400 | Groq / llama-3.3-70b-versatile | Gemini 2.0 Flash |
| ANALYZE | 800 | Groq / llama-3.3-70b-versatile | Together AI |
| EXTRACT | 500 | Gemini 2.0 Flash (JSON mode) | Groq / llama-3.3-70b-versatile |
| CHAT | 600 | Gemini 2.0 Flash | Groq / llama-3.3-70b-versatile |
- OpenAI GPT-4 — Expensive, hits budget quickly
- LangChain — Abstraction overhead, direct API calls are simpler
- Anthropic Claude — Reserve for Phase 3+ enterprise demand
### Infrastructure
| Layer | Technology | Cost | Rationale |
|-------|------------|------|-----------|
| VPS | Contabo VPS 10 | $4.95/mo | 4 vCPU, 8 GB RAM, 150 GB SSD |
| Reverse Proxy | Caddy | Free | Automatic HTTPS, on-demand TLS for white-label |
| Containers | Docker Compose v2 | Free | Single-server orchestration |
| CDN/DDoS | Cloudflare | Free | Static asset caching, hides VPS IP |
| Push (web/desktop) | ntfy.sh self-hosted | Free | Go binary ~30 MB RAM |
| Push (mobile) | Expo Push | Free | Wraps APNs + FCM |
| Email | Resend | Free (3k/mo) | React email templates |
| Payments | LemonSqueezy | 5% + $0.50 | Merchant of record, handles VAT |
| Backup | rclone + Google Drive | Free | 15 GB free tier |
- Nginx — Manual cert management, no on-demand TLS
- Redis — Adds RAM overhead, pg-boss sufficient
- AWS/GCP — Costs escalate quickly, Contabo is predictable
### Development Tools
| Tool | Purpose |
|------|---------|
| ESLint + typescript-eslint | Linting, type-aware rules |
| Prettier | Code formatting |
| Husky + lint-staged | Pre-commit hooks |
| Vitest | Unit testing (faster than Jest) |
| Playwright | E2E testing |
| TypeScript | Type safety across monorepo |
- Unit: Vitest + Testing Library
- Integration: Supertest + test PostgreSQL container
- E2E: Playwright for web, Detox for mobile
## Shared Libraries Structure
## Version Verification Commands
## Anti-Patterns to Avoid
| Anti-Pattern | Why Avoid | Alternative |
|--------------|-----------|-------------|
| Express adapter | 2x slower than Fastify | Use Fastify adapter |
| Redis for queues | Adds RAM overhead | Use pg-boss |
| SSR server process | RAM overhead, complexity | Static export |
| TypeORM | Less type-safe than Prisma | Use Prisma |
| Redux for state | Overkill with TanStack Query | TanStack Query only |
| Electron | 150 MB binary | Tauri (10 MB) |
| OpenAI primary | Expensive | Groq + Gemini free tiers |
| Nginx | Manual cert management | Caddy auto-HTTPS |
| LangChain | Abstraction overhead | Direct API calls |
## Confidence Summary
| Area | Confidence | Reason |
|------|------------|--------|
| Monorepo (Nx) | HIGH | Industry standard, well-documented |
| API (NestJS + Fastify) | HIGH | Official NestJS recommendation |
| Database (PostgreSQL + Prisma) | HIGH | Current best practice |
| Frontend (Next.js) | HIGH | Static export is proven |
| Mobile (Expo) | HIGH | SDK 55 is current |
| Desktop (Tauri) | HIGH | Tauri 2 is production-ready |
| AI (Groq + Gemini) | MEDIUM | Free tier limits may change |
| Infrastructure | HIGH | Optimized for $5/mo constraint |
## Next Steps
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

Conventions not yet established. Will populate as patterns emerge during development.
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

Architecture not yet mapped. Follow existing patterns found in the codebase.
<!-- GSD:architecture-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd:quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd:debug` for investigation and bug fixing
- `/gsd:execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->

<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd:profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
