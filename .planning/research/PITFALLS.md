# Domain Pitfalls

**Domain:** Personal Management System (PMS) SaaS
**Researched:** 2026-03-21
**Confidence:** MEDIUM (Web search rate-limited; relied on official docs + training knowledge)

## Critical Pitfalls

### Pitfall 1: Multi-Tenancy Retrofit (Adding tenantId Later)

**What goes wrong:**
Starting with single-tenant architecture and attempting to add `tenantId` columns after launch. This requires touching every table, every query, and every index. Data migration becomes a nightmare with high risk of data leakage between tenants.

**Why it happens:**
Developers think "I'll add multi-tenancy when I need it" to ship faster. They underestimate the scope of changes needed to retrofit tenant isolation into an existing codebase.

**Consequences:**
- Every query must be rewritten to include `tenantId` filter
- Foreign key relationships break during migration
- Risk of data leakage during transition period
- Indexes become ineffective without tenant partitioning
- Estimated 2-4 weeks of dedicated work for a medium codebase

**Prevention:**
Add `tenant_id` to every table from day one. Use PostgreSQL RLS policies that automatically filter by tenant. Design all queries with tenant context as a required parameter.

**Warning signs:**
- Tables without `tenant_id` column
- Queries that don't include tenant filtering
- Manual `WHERE tenant_id = ?` clauses instead of RLS
- Code reviews mentioning "we'll add multi-tenancy later"

**Detection:**
Run audit query: `SELECT table_name FROM information_schema.columns WHERE column_name = 'tenant_id'` — compare against all tables.

**Phase to address:** Phase 1 (Foundation) — must be correct from the start

---

### Pitfall 2: PostgreSQL RLS Policy Misconfiguration

**What goes wrong:**
RLS policies are either too permissive (security hole), too restrictive (breaks functionality), or completely bypassed by using superuser connections. Common mistake: enabling RLS on tables but not creating any policies, which blocks ALL access including legitimate.

**Why it happens:**
RLS syntax is subtle. Developers copy-paste policies without understanding `USING` vs `WITH CHECK` clauses. They test with admin accounts that bypass RLS, then deploy and regular users can't access anything.

**Consequences:**
- Security breach if policies are too permissive
- Application errors if policies are too restrictive
- Silent data leakage between tenants
- Debugging is difficult because errors don't show which policy failed

**Prevention:**
1. Always use `CURRENT_SETTING('app.current_tenant')` for tenant isolation
2. Create policies for both SELECT (USING) and INSERT/UPDATE (WITH CHECK)
3. Test with non-superuser database connections
4. Include RLS policy tests in test suite

**Warning signs:**
- `ENABLE ROW LEVEL SECURITY` without any `CREATE POLICY` statements
- Policies using `true` or `1=1` as conditions
- Application uses database superuser for connections
- No RLS-related tests in test suite

**Detection:**
```sql
-- Check tables with RLS enabled but no policies
SELECT schemaname, tablename
FROM pg_tables
WHERE rowsecurity = true
AND NOT EXISTS (
  SELECT 1 FROM pg_policy
  WHERE pg_policy.polrelid = pg_tables.relname::regclass
);
```

**Phase to address:** Phase 1 (Foundation) — core to multi-tenant architecture

---

### Pitfall 3: Nx Monorepo Boundary Violations

**What goes wrong:**
Libraries import from modules they shouldn't depend on, creating circular dependencies or violating the modular monolith architecture. The monorepo becomes a "distributed ball of mud" instead of clean separation.

**Why it happens:**
Nx boundary enforcement requires explicit configuration. Without it, TypeScript allows any import. Developers take shortcuts during deadline pressure, importing from convenient locations without considering architecture.

**Consequences:**
- `nx affected` builds become unreliable
- Module isolation breaks down
- Refactoring becomes extremely difficult
- Circular dependency errors at build time
- Tests can't be run in isolation

**Prevention:**
1. Configure `.eslintrc.json` with `@nx/enforce-module-boundaries` rule
2. Define tags for each lib: `type:feature`, `type:util`, `domain:finance`, etc.
3. Set dependency constraints in `nx.json`
4. Run `nx graph` regularly to visualize dependencies

**Warning signs:**
- `import { something } from '../../../other-module` (relative paths across modules)
- Build warnings about circular dependencies
- `nx affected` returning unexpected results
- Unable to run tests for a single module in isolation

**Detection:**
```bash
# Check for boundary violations
npx nx run-many --target=lint --all
# Visualize dependency graph
npx nx graph
```

**Phase to address:** Phase 1 (Foundation) — monorepo setup must include boundaries

---

### Pitfall 4: AI Provider Rate Limit Exhaustion

**What goes wrong:**
Application hits Groq's free tier limits (~1M tokens/day) or Gemini's rate limits during peak usage. AI features fail silently or return errors to users. No fallback mechanism means complete feature outage.

**Why it happens:**
Free tier limits are generous during development but insufficient for production. Developers don't implement circuit breakers, token budgeting, or graceful degradation. They assume "it will be fine."

**Consequences:**
- AI-powered features stop working
- Poor user experience with unhandled errors
- Wasted API calls on duplicate/redundant requests
- No visibility into token usage until limits hit

**Prevention:**
1. Implement circuit breaker pattern for AI calls
2. Cache responses for identical prompts (semantic deduplication)
3. Use token budgeting per tenant per day
4. Primary/fallback chain: Groq -> Gemini -> Cached response -> Graceful degradation
5. Monitor token usage with alerts at 80% capacity

**Warning signs:**
- No retry logic on AI API calls
- No caching of AI responses
- No monitoring of token consumption
- AI errors shown directly to users

**Detection:**
Log all AI API responses including rate limit headers. Alert when `x-ratelimit-remaining` drops below threshold.

**Phase to address:** Phase 2 (AI Gateway) — must be built before AI features

---

### Pitfall 5: VPS Memory Exhaustion (8 GB Constraint)

**What goes wrong:**
Running PostgreSQL, NestJS, Next.js build, Docker containers, and background jobs exceeds available RAM. The system starts swapping heavily, causing dramatic performance degradation or OOM kills.

**Why it happens:**
Each service has default memory configurations designed for machines with more RAM. Developers don't tune PostgreSQL work_mem, Node memory limits, or Docker container limits for constrained environments.

**Consequences:**
- Response times spike from 100ms to 10+ seconds
- Background jobs fail silently
- Database connections drop
- System becomes unresponsive
- Cascading failures across services

**Prevention:**
1. Set PostgreSQL `work_mem = 64MB`, `shared_buffers = 2GB`, `effective_cache_size = 6GB`
2. Limit Node.js heap: `NODE_OPTIONS="--max-old-space-size=2048"`
3. Use Docker memory limits per container
4. Run builds on CI/CD, not production server
5. Monitor with `htop`, `docker stats`, and PostgreSQL `pg_stat_activity`

**Warning signs:**
- `free -h` shows less than 500MB available
- Swap usage consistently above 50%
- `dmesg` shows OOM killer messages
- Intermittent 502/503 errors

**Detection:**
```bash
# Set up monitoring alert
free -h | awk '/Mem:/ {print $4}' # Available memory
# Should alert if < 500MB
```

**Phase to address:** Phase 1 (Foundation) — infrastructure setup

---

### Pitfall 6: LemonSqueezy Webhook Race Conditions

**What goes wrong:**
Webhooks arrive out of order (e.g., `subscription_cancelled` before `subscription_created`), or duplicate webhooks for the same event cause double-processing. Subscription state becomes inconsistent between LemonSqueezy and local database.

**Why it happens:**
LemonSqueezy retries failed webhooks up to 3 times. Network delays can cause reordering. Developers assume webhooks arrive exactly once and in chronological order.

**Consequences:**
- Users lose access incorrectly
- Free trials not properly tracked
- Billing state mismatch causes support tickets
- Revenue tracking becomes inaccurate

**Prevention:**
1. Make webhook processing idempotent (safe to process same event multiple times)
2. Store webhook event ID and skip if already processed
3. Use webhook timestamp for ordering, not arrival order
4. Handle "past" state changes gracefully (update, don't reject)
5. Always return HTTP 200 within 5 seconds, process async

**Warning signs:**
- Webhook handlers doing direct state transitions
- No deduplication logic
- Long-running webhook processing (>5 seconds)
- Database errors from duplicate key violations

**Detection:**
Log all webhook event IDs. Query for duplicates: `SELECT event_id, COUNT(*) FROM webhook_events GROUP BY event_id HAVING COUNT(*) > 1`

**Phase to address:** Phase 3 (SaaS Subscription) — billing integration

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Skip RLS policies | Ship faster | Security vulnerability, data leakage | Never |
| Hardcode tenant ID in queries | Faster to write | Manual filtering everywhere, easy to miss | Never |
| No AI response caching | Simpler code | Wasted tokens, slower responses | Never for production |
| Skip Nx boundary config | Faster imports | Circular deps, refactoring nightmare | Prototype only |
| Run builds on production server | Simpler deploy | Memory exhaustion during builds | Never for 8GB VPS |
| Process webhooks synchronously | Simpler logic | Timeouts, retries, race conditions | Never |
| Use database superuser | Avoid permission issues | Bypasses RLS, security risk | Local dev only |

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| LemonSqueezy | Trusting webhook order | Process by event timestamp, make idempotent |
| LemonSqueezy | Slow webhook response | Return 200 immediately, process async |
| LemonSqueezy | Not verifying signature | Always validate `X-Signature` header |
| Groq API | No retry on rate limit | Exponential backoff with jitter |
| Groq API | No fallback provider | Chain: Groq -> Gemini -> degrade gracefully |
| Gemini API | Assuming no rate limits | Dynamic shared quota has no hard limits, but still rate-limited |
| PostgreSQL RLS | Testing with superuser | Create dedicated app user, test with that |
| Nx | No dependency constraints | Configure tags and constraints in eslint/nx.json |

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| N+1 queries with tenant filter | Slow page loads, high DB CPU | Use JOINs, batch queries, dataloader | 100+ concurrent users |
| Full table scans without tenant index | Queries taking seconds | Create composite indexes: `(tenant_id, ...)` | 10K+ rows per tenant |
| Unbounded AI requests per user | Token budget exhausted | Per-tenant daily token budgets | Any production load |
| Next.js builds on production | Memory exhaustion, 503 | Build on CI, deploy static files | First production build |
| pg-boss without job limits | Queue grows unbounded | Set max concurrent jobs, job timeouts | Heavy background job usage |
| No connection pooling | Connection exhaustion | Use pg-boss built-in pooling or PgBouncer | 50+ concurrent DB users |

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| RLS bypass via superuser connection | Tenant data leakage | Create dedicated app DB user with limited privileges |
| Missing RLS policy on new table | Data leakage | Add migration checklist: "Did you add RLS policy?" |
| LemonSqueezy webhook unverified | Fraud, unauthorized access | Validate X-Signature with HMAC-SHA256 |
| Hardcoded API keys in code | Key exposure, credential theft | Use environment variables, never commit |
| No rate limiting on auth endpoints | Brute force attacks | Implement rate limiting on login/register |
| Tenant ID from user input | IDOR vulnerability | Get tenant_id from authenticated session only |

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| AI feature fails with error message | Confusion, feature appears broken | Graceful degradation with helpful message |
| Subscription state sync delay | Access granted/denied incorrectly | Show pending state, poll or use webhooks |
| Cross-platform data inconsistency | Confusion when switching devices | Sync immediately, show sync status |
| No offline support on mobile | App unusable without network | Cache data locally, sync when online |
| Slow initial load | Users abandon app | Progressive loading, skeleton screens |
| Unclear subscription status | Unexpected charges or access loss | Always show renewal date, status prominently |

## "Looks Done But Isn't" Checklist

- [ ] **Multi-tenancy:** Often missing RLS policies on join tables — verify all tables have `tenant_id` and policies
- [ ] **Nx boundaries:** Often missing enforcement — verify `@nx/enforce-module-boundaries` is configured and passing
- [ ] **AI Gateway:** Often missing fallback logic — verify circuit breaker and fallback chain work
- [ ] **LemonSqueezy:** Often missing idempotency — verify duplicate webhooks don't cause issues
- [ ] **RLS:** Often tested with superuser — verify tests run with restricted DB user
- [ ] **Memory:** Often fine in dev, fails in production — verify memory limits under load
- [ ] **Cross-platform:** Often inconsistent data models — verify type definitions are shared

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Multi-tenancy retrofit | HIGH (2-4 weeks) | Add tenant_id to all tables, migrate data, update all queries, add RLS |
| RLS misconfiguration | MEDIUM (1-3 days) | Audit policies, fix with new migration, test with restricted user |
| Nx boundary violations | MEDIUM (1-2 weeks) | Configure enforcement, fix violations, may need refactoring |
| AI rate limit exhaustion | LOW (hours) | Add caching, implement circuit breaker, add monitoring |
| VPS memory exhaustion | LOW (hours) | Tune configs, add limits, move builds to CI |
| Webhook race conditions | MEDIUM (2-5 days) | Add idempotency keys, reorder processing logic, add event log |

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Multi-tenancy retrofit | Phase 1 (Foundation) | All tables have tenant_id, RLS policies tested |
| PostgreSQL RLS misconfiguration | Phase 1 (Foundation) | Policies exist, tested with non-superuser |
| Nx monorepo boundary violations | Phase 1 (Foundation) | Lint passes, `nx graph` shows clean boundaries |
| AI provider rate limit exhaustion | Phase 2 (AI Gateway) | Circuit breaker works, fallback tested |
| VPS memory exhaustion | Phase 1 (Foundation) | Load test passes, monitoring alerts set |
| LemonSqueezy webhook race conditions | Phase 3 (SaaS Subscription) | Duplicate webhooks handled, ordering tested |

## Sources

- Nx Documentation: https://nx.dev/concepts/mental-model (monorepo concepts, module boundaries)
- PostgreSQL 17 RLS Documentation: https://www.postgresql.org/docs/current/ddl-rowsecurity.html (policy syntax, security considerations)
- Supabase RLS Guide: https://supabase.com/docs/guides/auth/row-level-security (practical patterns)
- LemonSqueezy Webhook Documentation: https://docs.lemonsqueezy.com/guides/developer-guide/webhooks (event handling, signature validation, retry behavior)
- Google Cloud Vertex AI Quotas: https://cloud.google.com/vertex-ai/generative-ai/docs/quotas (Gemini rate limits, Dynamic Shared Quota)
- Modular Monolith Architecture: Kamil Grzybek's course (module boundaries, dependency rules)
- Project Constraints: `.planning/PROJECT.md` (8 GB RAM, $5/month budget, single developer)

---
*Pitfalls research for: Personal Management System (PMS) SaaS*
*Researched: 2026-03-21*
