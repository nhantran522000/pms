---
phase: 06
slug: notes-journal
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-23
---

# Phase 06 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Jest (via Nx) |
| **Config file** | None detected — likely using Nx defaults |
| **Quick run command** | `pnpm nx test feature-notes` |
| **Full suite command** | `pnpm nx run-many --target=test --all` |
| **Estimated runtime** | ~30 seconds |

---

## Sampling Rate

- **After every task commit:** Run `pnpm nx test feature-notes`
- **After every plan wave:** Run `pnpm nx run-many --target=test --all`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 06-01-01 | 01 | 1 | NOTE-01 | integration | `pnpm nx test feature-notes --testFile=note.service.spec` | ❌ W0 | ⬜ pending |
| 06-01-02 | 01 | 1 | NOTE-02 | integration | `pnpm nx test feature-notes --testFile=note.service.spec` | ❌ W0 | ⬜ pending |
| 06-02-01 | 02 | 1 | NOTE-03 | unit | `pnpm nx test feature-notes --testFile=note-editor.component.spec` | ❌ W0 | ⬜ pending |
| 06-03-01 | 03 | 2 | NOTE-04 | integration | `pnpm nx test feature-notes --testFile=search.service.spec` | ❌ W0 | ⬜ pending |
| 06-04-01 | 04 | 2 | NOTE-05 | integration | `pnpm nx test feature-notes --testFile=folder.service.spec` | ❌ W0 | ⬜ pending |
| 06-05-01 | 05 | 2 | NOTE-06 | integration | `pnpm nx test feature-notes --testFile=journal.service.spec` | ❌ W0 | ⬜ pending |
| 06-06-01 | 06 | 3 | NOTE-07 | unit | `pnpm nx test feature-notes --testFile=mood-trends.service.spec` | ❌ W0 | ⬜ pending |
| 06-07-01 | 07 | 3 | NOTE-08 | unit | `pnpm nx test feature-notes --testFile=auto-save.hook.spec` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `libs/feature-notes/src/application/services/note.service.spec.ts` — stubs for NOTE-01, NOTE-02
- [ ] `libs/feature-notes/src/infrastructure/services/full-text-search.service.spec.ts` — stubs for NOTE-04
- [ ] `libs/feature-notes/src/application/services/journal.service.spec.ts` — stubs for NOTE-06, NOTE-07
- [ ] `libs/feature-notes/src/presentation/hooks/use-auto-save.spec.ts` — stubs for NOTE-08
- [ ] Test framework setup: Ensure Jest is configured for the feature-notes lib

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Tiptap editor rendering | NOTE-03 | Visual verification of rich text toolbar, formatting | Create note, verify bold/italic/lists/headings render correctly |
| Mood trend visualization | NOTE-07 | Chart rendering verification | Create 7+ journal entries with varying moods, verify line chart + emoji grid |
| Auto-save debounce | NOTE-08 | Timing verification | Type in note, verify API call fires 500ms after last keystroke |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
