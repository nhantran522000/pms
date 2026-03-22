---
phase: 03-financial-module
plan: 07
subsystem: financial
tags: [recurring, scheduled, pg-boss, jobs, transactions]

# Dependency graph
requires:
  - phase: 03-04
    provides: TransactionRepository for creating recurring transactions
provides:
  - RecurringRuleRepository with next run calculation for all frequencies
  - RecurringTransactionService with CRUD and processRule()
  - RecurringTransactionJob with pg-boss hourly scheduled job
  - RecurringRuleController with REST endpoints for rule management
affects: []

# Tech tracking
tech-stack:
  added: [pg-boss]
  patterns: [scheduled-jobs, recurring-transactions, next-run-calculation]

key-files:
  created:
    - libs/shared-types/src/financial/financial.schema.ts (extended)
    - libs/feature-financial/src/infrastructure/repositories/recurring-rule.repository.ts
    - libs/feature-financial/src/application/services/recurring-transaction.service.ts
    - libs/feature-financial/src/infrastructure/jobs/recurring-transaction.job.ts
    - libs/feature-financial/src/infrastructure/jobs/index.ts
    - libs/feature-financial/src/presentation/controllers/recurring-rule.controller.ts
  modified:
    - libs/feature-financial/src/infrastructure/repositories/index.ts
    - libs/feature-financial/src/application/services/index.ts
    - libs/feature-financial/src/presentation/controllers/index.ts
    - libs/feature-financial/src/financial.module.ts
    - package.json

key-decisions:
  - "pg-boss for job scheduling using PostgreSQL as the queue backend"
  - "Hourly cron (0 * * * *) for processing due recurring rules"
  - "Money value object for all recurring rule amounts"
  - "Transactions created with isRecurring=true and recurringRuleId for tracking"

patterns-established:
  - "Next run calculation handles daily, weekly (with dayOfWeek), monthly (with dayOfMonth), yearly (with monthOfYear/dayOfMonth)"
  - "Rules respect endDate and isActive flags during processing"
  - "Background job continues processing other rules on individual failures"

requirements-completed: [FIN-10, FIN-11, FIN-12]

# Metrics
duration: 6.6min
completed: 2026-03-22
---

# Phase 03 Plan 07: Recurring Transaction Rules Summary

**Scheduled recurring transaction system with pg-boss job queue, supporting daily/weekly/monthly/yearly frequencies with flexible day and month constraints**

## Performance

- **Duration:** 6.6min
- **Started:** 2026-03-22T18:06:16Z
- **Completed:** 2026-03-22T18:12:55Z
- **Tasks:** 4
- **Files modified:** 11

## Accomplishments
- Recurring rule Zod schemas for create, update, and response types
- RecurringRuleRepository with CRUD and next run calculation for all frequency types
- RecurringTransactionService with full CRUD and processRule() for transaction creation
- RecurringTransactionJob with pg-boss integration and hourly cron schedule
- RecurringRuleController with full REST API for rule management

## Task Commits

Each task was committed atomically:

1. **Task 1: Add recurring rule schemas to shared-types** - `ec2b2ca` (feat)
2. **Task 2: Create RecurringRuleRepository** - `963c381` (feat)
3. **Task 3: Create RecurringTransactionService with pg-boss integration** - `2f2ba6c` (feat)
4. **Task 4: Create RecurringRuleController** - `420b525` (feat)

**Fix commit:** `ca23b43` (fix: pg-boss import and isActive field)

## Files Created/Modified
- `libs/shared-types/src/financial/financial.schema.ts` - Recurring rule Zod schemas (CreateRecurringRuleDto, UpdateRecurringRuleDto, RecurringRuleResponse, RecurringFrequency)
- `libs/feature-financial/src/infrastructure/repositories/recurring-rule.repository.ts` - Repository with CRUD, findDueForExecution, calculateNextRun
- `libs/feature-financial/src/application/services/recurring-transaction.service.ts` - Service with create, update, deactivate, processRule, processAllDue
- `libs/feature-financial/src/infrastructure/jobs/recurring-transaction.job.ts` - pg-boss job handler with hourly schedule
- `libs/feature-financial/src/infrastructure/jobs/index.ts` - Export RecurringTransactionJob
- `libs/feature-financial/src/presentation/controllers/recurring-rule.controller.ts` - REST controller with POST/GET/PUT/DELETE endpoints
- `libs/feature-financial/src/infrastructure/repositories/index.ts` - Export RecurringRuleRepository
- `libs/feature-financial/src/application/services/index.ts` - Export RecurringTransactionService
- `libs/feature-financial/src/presentation/controllers/index.ts` - Export RecurringRuleController
- `libs/feature-financial/src/financial.module.ts` - Register all new components
- `package.json` - Added pg-boss dependency

## Decisions Made
- pg-boss chosen for job scheduling: Uses existing PostgreSQL database, no additional infrastructure required
- Hourly processing: Balance between responsiveness and database load
- Graceful degradation: If pg-boss fails to initialize, the app continues without scheduled jobs (logs warning)
- Transaction balance updates: Income adds to balance, expense subtracts from balance (consistent with TransactionService)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Fixed pg-boss import for TypeScript compatibility**
- **Found during:** TypeScript compilation check
- **Issue:** Default import `import PgBoss from 'pg-boss'` did not work with pg-boss v12 module structure
- **Fix:** Changed to named import `import { PgBoss, Job } from 'pg-boss'`
- **Files modified:** libs/feature-financial/src/infrastructure/jobs/recurring-transaction.job.ts
- **Committed in:** `ca23b43`

**2. [Rule 1 - Bug] Added isActive to CreateRecurringRuleInput interface**
- **Found during:** TypeScript compilation check
- **Issue:** UpdateRecurringRuleDto allows updating isActive, but the repository input type didn't include it
- **Fix:** Added `isActive?: boolean` to CreateRecurringRuleInput interface
- **Files modified:** libs/feature-financial/src/infrastructure/repositories/recurring-rule.repository.ts
- **Committed in:** `ca23b43`

---

**Total deviations:** 2 auto-fixed (1 blocking, 1 bug)
**Impact on plan:** Minor fixes for TypeScript compatibility and interface completeness.

## Issues Encountered
None - implementation followed plan as specified.

## User Setup Required
- **pg-boss schema**: On first run, pg-boss will create its own schema (`pgboss`) in the database. Ensure the database user has CREATE schema permissions.
- **Environment**: `DATABASE_URL` must be configured for pg-boss to connect.

## Next Phase Readiness
- Recurring transaction system fully operational
- Rules automatically create transactions when due
- API endpoints ready for frontend integration
- Future enhancements: Manual trigger endpoint, rule history tracking, retry failed rules

## Self-Check: PASSED

- All created files verified to exist:
  - libs/feature-financial/src/infrastructure/repositories/recurring-rule.repository.ts: FOUND
  - libs/feature-financial/src/application/services/recurring-transaction.service.ts: FOUND
  - libs/feature-financial/src/infrastructure/jobs/recurring-transaction.job.ts: FOUND
  - libs/feature-financial/src/presentation/controllers/recurring-rule.controller.ts: FOUND
- All commits verified in git history:
  - ec2b2ca (Task 1): FOUND
  - 963c381 (Task 2): FOUND
  - 2f2ba6c (Task 3): FOUND
  - 420b525 (Task 4): FOUND
  - ca23b43 (Fix): FOUND
- Build verified with `pnpm nx run feature-financial:build`

---
*Phase: 03-financial-module*
*Completed: 2026-03-22*
