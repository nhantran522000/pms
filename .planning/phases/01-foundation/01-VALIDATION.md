---
phase: 1
slug: foundation
status: draft
nyquist_compliant: true
wave_0_complete: false
created: 2026-03-22
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest (latest) |
| **Config file** | vitest.config.ts (Wave 0 setup required) |
| **Quick run command** | `pnpm vitest run` |
| **Full suite command** | `pnpm vitest run --coverage` |
| **Estimated runtime** | ~30 seconds |

---

## Sampling Rate

- **After every task commit:** Run `nx lint` (fast boundary check)
- **After every plan wave:** Run `pnpm vitest run` (run all tests)
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** ~30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 01-01-01 | 01 | 1 | INFRA-05 | unit | `test -f nx.json && test -f pnpm-workspace.yaml` | ✅ existing | ⬜ pending |
| 01-01-02 | 01 | 1 | INFRA-06 | unit | `grep -q "@nx/enforce-module-boundaries" .eslintrc.base.json` | ✅ existing | ⬜ pending |
| 01-01-03 | 01 | 1 | INFRA-06 | unit | `test -f libs/shared-kernel/src/index.ts` | ✅ existing | ⬜ pending |
| 01-01-04 | 01 | 1 | INFRA-06 | unit | `test -f libs/shared-types/src/index.ts` | ✅ existing | ⬜ pending |
| 01-01-05 | 01 | 1 | INFRA-06 | unit | `test -f libs/data-access/src/index.ts` | ✅ existing | ⬜ pending |
| 01-02-01 | 02 | 1 | INFRA-01 | integration | `test -f docker/docker-compose.yml` | ✅ existing | ⬜ pending |
| 01-02-02 | 02 | 1 | INFRA-08 | integration | `grep -q "max-old-space-size=4096" docker/docker-compose.yml` | ✅ existing | ⬜ pending |
| 01-02-03 | 02 | 1 | INFRA-02 | integration | `test -f docker/postgresql.conf` | ✅ existing | ⬜ pending |
| 01-02-04 | 02 | 1 | INFRA-01 | integration | `test -f docker/Caddyfile` | ✅ existing | ⬜ pending |
| 01-03-01 | 03 | 2 | INFRA-03 | unit | `test -f libs/data-access/prisma/schema.prisma` | ✅ existing | ⬜ pending |
| 01-03-02 | 03 | 2 | INFRA-04 | unit | `grep -q "moduleFormat" libs/data-access/prisma/schema.prisma` | ✅ existing | ⬜ pending |
| 01-03-03 | 03 | 2 | INFRA-07 | unit | `test -f apps/api/src/main.ts` | ✅ existing | ⬜ pending |
| 01-03-04 | 03 | 2 | INFRA-07 | unit | `grep -q "FastifyAdapter" apps/api/src/main.ts` | ✅ existing | ⬜ pending |
| 01-04-01 | 04 | 3 | AUTH-06 | unit | `test -f libs/data-access/tenant-context/src/async-local-storage.ts` | ✅ existing | ⬜ pending |
| 01-04-02 | 04 | 3 | AUTH-06 | unit | `test -f libs/data-access/tenant-context/src/tenant-context.middleware.ts` | ✅ existing | ⬜ pending |
| 01-04-03 | 04 | 3 | AUTH-06 | unit | `grep -q "app.current_tenant_id" libs/data-access/prisma/src/prisma.service.ts` | ✅ existing | ⬜ pending |
| 01-04-04 | 04 | 3 | AUTH-06 | integration | `test -f libs/data-access/prisma/migrations/rls_policies/migration.sql` | ✅ existing | ⬜ pending |
| 01-04-05 | 04 | 3 | AUTH-06 | unit | `test -f libs/shared-kernel/src/decorators/tenant.decorator.ts` | ✅ existing | ⬜ pending |
| 01-04-06 | 04 | 3 | AUTH-06 | unit | `grep -q "TenantContextModule" apps/api/src/app.module.ts` | ✅ existing | ⬜ pending |
| 01-05-01 | 05 | 4 | AUTH-01 | unit | `test -f libs/shared-types/src/auth/auth.schema.ts` | ✅ existing | ⬜ pending |
| 01-05-02 | 05 | 4 | AUTH-01 | unit | `test -f libs/feature-auth/src/domain/entities/user.entity.ts` | ✅ existing | ⬜ pending |
| 01-05-03 | 05 | 4 | AUTH-01 | unit | `test -f libs/feature-auth/src/domain/value-objects/password.vo.ts` | ✅ existing | ⬜ pending |
| 01-05-04 | 05 | 4 | AUTH-01 | integration | `test -f libs/feature-auth/src/infrastructure/repositories/user.repository.ts` | ✅ existing | ⬜ pending |
| 01-05-05 | 05 | 4 | AUTH-02 | unit | `test -f libs/feature-auth/src/infrastructure/services/email.service.ts` | ✅ existing | ⬜ pending |
| 01-05-06 | 05 | 4 | AUTH-01 | unit | `test -f libs/feature-auth/src/application/auth.service.ts` | ✅ existing | ⬜ pending |
| 01-05-07 | 05 | 4 | AUTH-04 | unit | `test -f libs/feature-auth/src/presentation/strategies/jwt.strategy.ts` | ✅ existing | ⬜ pending |
| 01-05-08 | 05 | 4 | AUTH-01 | unit | `test -f libs/feature-auth/src/presentation/controllers/auth.controller.ts` | ✅ existing | ⬜ pending |
| 01-05-09 | 05 | 4 | AUTH-01 | unit | `grep -q "AuthModule" libs/feature-auth/src/auth.module.ts` | ✅ existing | ⬜ pending |
| 01-06-01 | 06 | 5 | AUTH-02 | integration | `vitest run -- auth-verification.test.ts` | ❌ W0 | ⬜ pending |
| 01-06-02 | 06 | 5 | AUTH-03 | integration | `vitest run -- auth-reset.test.ts` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `vitest.config.ts` — Root Vitest configuration
- [ ] `apps/api/vitest.config.ts` — API-specific test config
- [ ] `libs/shared-kernel/test/` — Shared kernel test utilities
- [ ] `libs/feature-auth/test/` — Auth domain tests
- [ ] `libs/data-access/prisma/test/` — Prisma integration tests
- [ ] `test/fixtures/` — Test database fixtures
- [ ] `test/setup.ts` — Test setup (Prisma test database, mocks)
- [ ] Framework install: `pnpm add -D vitest @vitest/ui @vitest/coverage-v8` — if none detected

*No existing test infrastructure — greenfield project*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Email delivery | AUTH-02 | Resend API requires real email address | Send test email via Resend dashboard, verify receipt |
| JWT cookie persistence | AUTH-04 | Browser behavior testing | Login, close browser, reopen, verify still authenticated |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 30s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
