---
status: testing
phase: 09-web-client
source:
  - .planning/phases/09-web-client/09-01-SUMMARY.md
  - .planning/phases/09-web-client/09-02-SUMMARY.md
  - .planning/phases/09-web-client/09-03-SUMMARY.md
  - .planning/phases/09-web-client/09-04-SUMMARY.md
  - .planning/phases/09-web-client/09-05-SUMMARY.md
  - .planning/phases/09-web-client/09-06-SUMMARY.md
  - .planning/phases/09-web-client/09-07-SUMMARY.md
started: "2026-03-24T12:30:00Z"
updated: "2026-03-24T12:30:00Z"
---

## Current Test
<!-- OVERWRITE each test - shows where we are -->

number: 3
name: Theme Displays Correctly
expected: |
  Open the web app in browser at http://localhost:3000. Background is white (or zinc-950 in dark mode), text is readable, Inter font is loaded. Zinc/Indigo color scheme is visible (indigo accents on buttons/links).
awaiting: user response

## Tests

### 1. Cold Start Smoke Test
expected: Kill any running Next.js dev server. Clear the .next cache directory. Start the web app from scratch with `pnpm next dev` in apps/web. Server boots without errors, the home page loads at http://localhost:3000, and basic navigation to /dashboard works.
result: pass

### 2. Static Export Build
expected: Run `pnpm next build` in apps/web directory. Build completes successfully with no errors. Static files are generated in apps/web/out/ directory including index.html and _next/static/ folder.
result: blocked
blocked_by: typescript-config
reason: "TypeScript strict checking errors with BaseChartProps interface. Dev server runs fine. Build issues deferred - needs tsconfig refactoring for chart types."

### 3. Theme Displays Correctly
expected: Open the web app in browser. Background is white (or zinc-950 in dark mode), text is readable, Inter font is loaded. Zinc/Indigo color scheme is visible (indigo accents on buttons/links).
result: pending

### 4. Desktop Sidebar Navigation
expected: On desktop screen (≥768px width), sidebar is visible on the left side. Shows "PMS" logo at top, 6 module icons (DollarSign, CheckSquare, Calendar, Activity, FileText, Palette) with labels. Theme toggle button is at top right.
result: pending

### 5. Mobile Bottom Tab Navigation
expected: On mobile screen (<768px width), bottom tab bar is visible at bottom. Shows 6 icons horizontally. Sidebar is hidden. Bottom bar has safe area for home indicator.
result: pending

### 6. Dashboard Module Cards
expected: Dashboard (/dashboard) shows 6 cards in responsive grid (1 col mobile, 2 col tablet, 3 col desktop). Each card has icon, title, description, and 4 metrics. Cards show loading skeletons initially, then real data.
result: pending

### 7. Navigation Links Work
expected: Click any module card or navigation item. Page navigates to correct route (/financial, /habits, /tasks, /health, /notes, /hobbies). URL updates, page loads without errors.
result: pending

### 8. Real Data Display
expected: Dashboard metrics show real values from backend API, not placeholder zeros. Financial card shows balance, Habits shows completion rate, Tasks shows overdue count, etc.
result: pending

### 9. Loading States
expected: When loading dashboard or module pages, skeleton cards/components show pulsing animation. Skeletons match layout of real content. After data loads, skeletons are replaced with actual content.
result: pending

### 10. Error Handling with Toast
expected: If API errors occur, red toast notification appears at bottom right with error message. Toast has dismiss button and auto-dismisses. Inline error message also shows in relevant card.
result: pending

### 11. Financial Chart Display
expected: Navigate to /financial. Page shows FinancialChart with income (green bars) and expense (red bars) by date. Chart has legend, tooltips on hover, and time range buttons (30d/90d/365d). Summary cards show total balance, monthly spending/income.
result: pending

### 12. Health Weight Chart
expected: Navigate to /health. Page shows WeightChart as line chart with weight trend over time. Blue line with smooth curves, dots at data points. Tooltip shows date and weight on hover. Time range buttons available.
result: pending

### 13. Habit Streak Charts
expected: Navigate to /habits. Each habit card shows HabitStreakChart as line chart of streak progression. Charts are collapsed by default, click to expand. Blue line shows streak values.
result: pending

### 14. Hobby Progress Charts
expected: Navigate to /hobbies. Each hobby shows HobbyProgressChart based on tracking type: COUNTER shows bars + line combo, PERCENTAGE shows progress to goal, LIST shows activity bars.
result: pending

### 15. Theme Toggle Functionality
expected: Click theme toggle button in sidebar (desktop) or it cycles through light → dark → system → light. Background and text colors change immediately. Theme persists after page refresh (localStorage).
result: pending

### 16. Dark Mode Colors
expected: In dark mode, background is zinc-950 (very dark gray), text is zinc-50 (very light gray). All components (cards, buttons, charts) adapt colors for dark mode visibility. No contrast issues.
result: pending

### 17. System Preference Detection
expected: On fresh visit (no localStorage), app detects OS theme preference. If OS is dark, app starts in dark mode. Toggle button starts at "system" (monitor icon).
result: pending

### 18. PWA Manifest Configured
expected: Open browser DevTools → Application → Manifest. Manifest shows name: "PMS - Personal Management System", short name: "PMS", display: "standalone", theme color: "#4f46e5" (indigo), icons at 192x192 and 512x512.
result: pending

### 19. PWA Installable
expected: In Chrome/Edge, address bar shows install icon (plus in circle or "Install" button in menu). Clicking install prompts to install PMS as app. After install, app opens in standalone window without browser UI.
result: pending

### 20. Service Worker Registered
expected: Open DevTools → Application → Service Workers. Service worker at "/sw.js" is registered and active. Activate checkbox is checked. Status shows "activated" or "running".
result: pending

### 21. Offline Detection Banner
expected: Disconnect internet (turn off WiFi or use DevTools offline mode). Red banner appears at top: "You are offline. Some features may be unavailable." with Retry button. Reconnect → banner disappears.
result: pending

## Summary

total: 21
passed: 1
issues: 0
pending: 19
skipped: 0
blocked: 1

## Gaps

none yet
