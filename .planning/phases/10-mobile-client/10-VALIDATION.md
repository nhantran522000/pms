---
phase: 10
slug: mobile-client
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-24
---

# Phase 10 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | jest 29.x (via Expo) |
| **Config file** | apps/mobile/jest.config.js (Wave 0 installs) |
| **Quick run command** | `pnpm nx test mobile` |
| **Full suite command** | `pnpm nx test mobile --coverage` |
| **Estimated runtime** | ~30 seconds |

---

## Sampling Rate

- **After every task commit:** Run `pnpm nx test mobile`
- **After every plan wave:** Run `pnpm nx test mobile --coverage`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 60 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 10-01-01 | 01 | 1 | MOB-01 | unit | `pnpm nx test mobile` | ✅ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `apps/mobile/jest.config.js` — Jest configuration for Expo/React Native
- [ ] `apps/mobile/__tests__/` — test directory structure
- [ ] `@testing-library/react-native` — React Native testing utilities
- [ ] `libs/shared-data-access/**/*.test.ts` — shared hooks tests

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Push notification delivery | MOB-04 | Requires Expo Push API and physical device | 1. Build development app 2. Install on device 3. Send test push via Expo dashboard 4. Verify notification appears |
| Offline queue sync | MOB-06 | Requires network toggle and AsyncStorage inspection | 1. Create transaction while offline 2. Verify queued in expo-sqlite 3. Reconnect 4. Verify sync to API |
| NativeWind styling | MOB-02 | Visual verification on physical device | 1. Run app on device/simulator 2. Verify Tailwind classes render correctly |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 60s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
