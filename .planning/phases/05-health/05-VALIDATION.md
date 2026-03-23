---
phase: 05
slug: health
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-23
---

# Phase 05 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None detected - Nx with @nx/js:swc only |
| **Config file** | None - tests not configured |
| **Quick run command** | N/A (manual verification) |
| **Full suite command** | N/A |
| **Estimated runtime** | N/A |

**Note:** No test infrastructure detected. Tests should be added but are not blocking for implementation.

---

## Sampling Rate

- **After every task commit:** Manual verification (build + manual test)
- **After every plan wave:** Manual E2E testing via API endpoints
- **Before `/gsd:verify-work`:** Manual verification against success criteria
- **Max feedback latency:** N/A (manual)

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 05-01-01 | 01 | 1 | HLTH-01 | manual | `pnpm nx build feature-health` | N/A | ⬜ pending |
| 05-01-02 | 01 | 1 | HLTH-02 | manual | `pnpm nx build api` | N/A | ⬜ pending |
| 05-02-01 | 02 | 1 | HLTH-03 | manual | `pnpm nx build feature-health` | N/A | ⬜ pending |
| 05-03-01 | 03 | 1 | HLTH-04 | manual | `pnpm nx build feature-health` | N/A | ⬜ pending |
| 05-03-02 | 03 | 1 | HLTH-05 | manual | `pnpm nx build feature-health` | N/A | ⬜ pending |
| 05-04-01 | 04 | 2 | HLTH-06 | manual | `pnpm nx build feature-health` | N/A | ⬜ pending |
| 05-05-01 | 05 | 2 | HLTH-07 | manual | `pnpm nx build feature-health` | N/A | ⬜ pending |
| 05-06-01 | 06 | 2 | HLTH-08 | manual | `pnpm nx build feature-health` | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `vitest.config.ts` — Vitest configuration for unit tests
- [ ] `libs/feature-health/src/**/*.spec.ts` — unit test stubs
- [ ] `apps/api/test/health/*.e2e-spec.ts` — integration test stubs
- [ ] Mock utilities for Resend API
- [ ] Mock utilities for AI Gateway

*Current state: No test infrastructure exists. Wave 0 would install Vitest and create test stubs.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Email delivery | HLTH-07 | Requires Resend API key, external service | Send test email via Resend dashboard or API |
| AI digest quality | HLTH-06 | Requires LLM call, subjective quality | Review generated digest content manually |
| Trend chart display | HLTH-02 | Requires frontend (Phase 9) | Verify chart renders correctly in browser |
| Unsubscribe flow | HLTH-07 | Requires email client interaction | Click unsubscribe link, verify preference updated |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < N/A (manual)
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
