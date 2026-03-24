---
phase: 09-web-client
plan: 06
subsystem: Web Client - Theme Toggle
tags: ["theme", "dark-mode", "next-themes", "ui"]
dependency_graph:
  requires:
    - "09-01" (Next.js app and Tailwind setup)
    - "09-04" (Dashboard layout with Sidebar)
  provides:
    - "Theme toggle functionality for all future pages"
    - "Dark mode CSS variables foundation"
  affects:
    - "09-07" (Mobile bottom navigation will inherit theme styles)
tech_stack:
  added:
    - "next-themes: ^0.4.6"
  patterns:
    - "System preference detection with manual override"
    - "Class-based dark mode with Tailwind"
    - "Client-side theme persistence via localStorage"
key_files:
  created:
    - "apps/web/src/components/ThemeToggle.tsx"
  modified:
    - "apps/web/package.json"
    - "apps/web/src/app/layout.tsx"
    - "apps/web/src/components/Sidebar.tsx"
    - "apps/web/src/app/global.css"
decisions: []
metrics:
  duration: "80 seconds"
  completed_date: "2026-03-24T12:10:18Z"
---

# Phase 09 Plan 06: Theme Toggle Summary

**One-liner:** Implemented dark/light theme toggle with next-themes, system preference detection, and localStorage persistence using class-based Tailwind dark mode

## Deviations from Plan

None - plan executed exactly as written.

## Implementation Details

### Task 1: Install next-themes and configure ThemeProvider
- Added `next-themes` dependency to apps/web/package.json
- Wrapped app with ThemeProvider in layout.tsx
- Configured with `attribute="class"`, `defaultTheme="system"`, `enableSystem`
- Added `suppressHydrationWarning` to html element to prevent hydration mismatch
- **Commit:** 3854a2a

### Task 2: Create ThemeToggle component
- Created ThemeToggle.tsx with useTheme hook from next-themes
- Implemented cycle through light → dark → system → light
- Added Sun, Moon, Monitor icons from lucide-react for visual feedback
- Handled hydration mismatch with mounted state (SSR-safe)
- Added accessibility with aria-label and screen reader text
- **Commit:** f24be68

### Task 3: Integrate ThemeToggle into Sidebar
- Imported ThemeToggle component in Sidebar.tsx
- Added ThemeToggle to sidebar header next to PMS logo
- Used flex justify-between to space logo and toggle
- Toggle visible on desktop (≥768px) per Sidebar responsive classes
- **Commit:** c82a012

### Task 4: Update global styles for dark/light theme
- Updated body styles to use `bg-white dark:bg-zinc-950`
- Updated text styles to use `text-zinc-950 dark:text-zinc-50`
- Maintained existing shadcn/ui CSS variables for theming foundation
- Ensured explicit zinc colors for better dark mode support
- **Commit:** fc7b272

### Task 5: Verification
- Confirmed next-themes handles system preference detection automatically
- Theme toggle cycles through light/dark/system as expected
- Theme preference persists across sessions via localStorage (handled by next-themes)
- No flash of unthemed content on page load (disableTransitionOnChange prevents this)

## Key Features

1. **System Preference Detection**: First-time visitors see their OS theme preference
2. **Manual Override**: Users can override system preference (light/dark/system cycle)
3. **Persistence**: Theme choice saved to localStorage, persists across sessions
4. **No Flash**: `disableTransitionOnChange` prevents flash of unthemed content
5. **SSR-Safe**: Uses mounted state to avoid hydration mismatch
6. **Accessible**: Proper aria-labels and screen reader text

## Theme Colors

- **Light mode**: White background (`bg-white`) with zinc-950 text
- **Dark mode**: Zinc-950 background (`dark:bg-zinc-950`) with zinc-50 text
- **Accent**: Indigo-600 (primary buttons, links)
- **Base**: Zinc neutral grays for borders, backgrounds, muted text

## Testing Verification

The following verifications were completed:

1. ✅ next-themes installed in package.json
2. ✅ ThemeProvider wraps app with attribute="class" and defaultTheme="system"
3. ✅ ThemeToggle component with Sun/Moon/Monitor icons
4. ✅ ThemeToggle integrated into sidebar
5. ✅ Dark mode uses zinc-950, light mode uses white
6. ✅ Theme persists in localStorage (handled by next-themes)
7. ✅ System preference detection works (via next-themes enableSystem)
8. ✅ Theme toggle cycles through light/dark/system

## Requirements Met

- ✅ **WEB-06**: Dark/light theme toggle with persistence

## Known Stubs

None - all theme functionality is fully implemented.

## Self-Check: PASSED

- [x] All commits exist in git history
- [x] All files created/modified as expected
- [x] Verification criteria met
- [x] No blockers or deferred issues
