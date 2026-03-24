---
phase: 7
slug: hobbies
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-24
---

# Phase 7 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest (existing from Phase 1) |
| **Config file** | `vitest.workspace.ts` |
| **Quick run command** | `pnpm nx test feature-hobbies` |
| **Full suite command** | `pnpm nx run-many --target=test --all` |
| **Estimated runtime** | ~30 seconds |

---

## Sampling Rate

- **After every task commit:** Run `pnpm nx test feature-hobbies`
- **After every plan wave:** Run `pnpm nx run-many --target=test --all`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 45 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 07-01-01 | 01 | 1 | HOBB-01 | unit | `pnpm nx test feature-hobbies -- hobbies.entity.spec.ts` | ✅ W0 | ⬜ pending |
| 07-01-02 | 01 | 1 | HOBB-01 | unit | `pnpm nx test feature-hobbies -- hobbies.repository.spec.ts` | ✅ W0 | ⬜ pending |
| 07-02-01 | 02 | 1 | HOBB-02 | unit | `pnpm nx test feature-hobbies -- hobbies-log.service.spec.ts` | ✅ W0 | ⬜ pending |
| 07-03-01 | 03 | 2 | HOBB-03 | integration | `pnpm nx test feature-hobbies -- progress-chart.spec.ts` | ✅ W0 | ⬜ pending |
| 07-04-01 | 04 | 2 | HOBB-04 | unit | `pnpm nx test feature-hobbies -- hobby-goals.service.spec.ts` | ✅ W0 | ⬜ pending |
| 07-05-01 | 05 | 3 | HOBB-05 | integration | `pnpm nx test feature-hobbies -- hobby-insights.service.spec.ts` | ✅ W0 | ⬜ pending |
| 07-06-01 | 06 | 3 | HOBB-06 | integration | `pnpm nx test feature-hobbies -- hobby-dashboard.service.spec.ts` | ✅ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `libs/feature-hobbies/test/**/*.spec.ts` — stubs for all HOBB- requirements
- [ ] `libs/feature-hobbies/test/fixtures/hobby.fixtures.ts` — shared test fixtures
- [ ] Vitest configuration already exists from Phase 1

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Chart visual rendering | HOBB-03 | UI implementation deferred to Phase 9 (Web Client) | Create hobby logs, call chart endpoints, verify JSON response structure |
| AI insights quality | HOBB-05 | Requires LLM evaluation | Sample insights from various hobby types, verify trends and streaks detected |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 45s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
