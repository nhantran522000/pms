---
phase: 04-habits-tasks
plan: 06
subsystem: api
tags: [tasks, filtering, sorting, prisma, query-parameters]

# Dependency graph
requires:
  - phase: 04-04
    provides: TaskEntity with isOverdue()/getStatus() methods, TaskRepository with findAll, TaskService, TaskController
provides:
  - Dynamic sorting for tasks by dueDate, priority, createdAt, title
  - Status filtering for tasks (pending, completed, overdue)
  - Query parameter validation schemas for task list endpoint
affects: []

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Dynamic Prisma orderBy with nulls last for dueDate sorting
    - Zod query parameter validation schemas

key-files:
  created: []
  modified:
    - libs/feature-tasks/src/infrastructure/repositories/task.repository.ts
    - libs/feature-tasks/src/application/services/task.service.ts
    - libs/feature-tasks/src/presentation/controllers/task.controller.ts
    - libs/shared-types/src/tasks/tasks.schema.ts

key-decisions:
  - "Default sort is createdAt desc for consistent task ordering"
  - "dueDate sorting uses nulls: 'last' to push tasks without deadlines to the end"

patterns-established:
  - "Dynamic orderBy construction using switch statement with Prisma.TaskOrderByWithRelationInput"

requirements-completed:
  - TASK-07
  - TASK-08

# Metrics
duration: 9min
completed: 2026-03-22
---

# Phase 04 Plan 06: Task Filtering and Sorting Summary

**Enhanced TaskRepository with dynamic sorting (dueDate, priority, createdAt, title) and status filtering (pending, completed, overdue) via query parameters**

## Performance

- **Duration:** 9 min
- **Started:** 2026-03-22T18:53:53Z
- **Completed:** 2026-03-22T19:03:20Z
- **Tasks:** 4
- **Files modified:** 4

## Accomplishments

- Added dynamic sorting support to TaskRepository with sortBy and sortOrder options
- Implemented dueDate sorting with null values sorted last using Prisma's nulls option
- Extended TaskService to pass sorting parameters through to repository
- Added query parameter validation with Zod schema in TaskController
- Created shared type schemas (TaskStatusSchema, TaskSortBySchema, SortOrderSchema, TaskListResponseSchema)

## Task Commits

Each task was committed atomically:

1. **Task 1: Update TaskRepository with dynamic sorting** - `36efeb6` (feat)
2. **Task 2: Update TaskService with sorting parameters** - `1a56aa2` (feat)
3. **Task 3: Update TaskController with query parameters** - `c14501e` (feat)
4. **Task 4: Add shared-types schemas for filtering** - `3abf6e4` (feat)

## Files Created/Modified

- `libs/feature-tasks/src/infrastructure/repositories/task.repository.ts` - Added sortBy/sortOrder options to findAll, dynamic orderBy construction
- `libs/feature-tasks/src/application/services/task.service.ts` - Added sortBy/sortOrder to findAll options interface
- `libs/feature-tasks/src/presentation/controllers/task.controller.ts` - Added sortBy/sortOrder query params, TaskQuerySchema validation
- `libs/shared-types/src/tasks/tasks.schema.ts` - Added TaskStatusSchema, TaskSortBySchema, SortOrderSchema, TaskListResponseSchema

## Decisions Made

- Default sort is createdAt desc to maintain consistent ordering when no sort specified
- dueDate sorting pushes null values to the end (nulls: 'last') since tasks without deadlines shouldn't appear first
- Priority sorting uses direct asc/desc mapping (not reversed) to match user expectations
- Query validation schema added to controller for type-safe query parameter handling

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None - all tasks completed without issues.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Task filtering and sorting complete, API supports GET /tasks with status, sortBy, sortOrder, priority, tags, rootOnly query parameters
- Ready for frontend integration with task list views

## Self-Check: PASSED

All files and commits verified.

---
*Phase: 04-habits-tasks*
*Completed: 2026-03-22*
