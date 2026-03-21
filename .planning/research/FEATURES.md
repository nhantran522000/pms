# Feature Research

**Domain:** Personal Management System (PMS)
**Researched:** 2026-03-21
**Confidence:** MEDIUM

## Feature Landscape

### Table Stakes (Users Expect These)

Features users assume exist. Missing these = product feels incomplete.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| **Financial: Transaction Entry** | Core functionality — users need to record spending | LOW | Simple CRUD, date/amount/category/payee |
| **Financial: Category Management** | Organizing transactions is fundamental | LOW | Hierarchical categories, user-defined |
| **Financial: Account Balances** | Knowing "how much do I have" is basic | MEDIUM | Multi-account support, running totals |
| **Habits: Daily Check-in** | Mark habit complete/incomplete is core | LOW | Single tap, streak calculation |
| **Habits: Streak Counter** | Gamification baseline users expect | LOW | Consecutive days, current/longest streak |
| **Tasks: Due Dates** | Basic task management requirement | LOW | Date picker, overdue highlighting |
| **Tasks: Completion Status** | Core task functionality | LOW | Checkbox, done/undone toggle |
| **Health: Weight Tracking** | Most common health metric | LOW | Number entry, date, simple chart |
| **Health: Basic Charts** | Visual progress feedback expected | MEDIUM | Line/bar charts for trends |
| **Notes: Create/Edit/Delete** | CRUD baseline for any notes app | LOW | Basic text input, auto-save |
| **Notes: Search** | Finding notes is essential | MEDIUM | Full-text search, title/content |
| **Notes: Organization** | Folders/tags expected | MEDIUM | Hierarchical or tag-based |
| **Auth: Email/Password Login** | Standard authentication | MEDIUM | Secure password handling, email verification |
| **Cross-Platform Sync** | Users expect data everywhere | HIGH | Real-time or near-real-time sync |

### Differentiators (Competitive Advantage)

Features that set the product apart. Not required, but valuable.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **AI Spending Anomaly Detection** | Proactive financial insights without manual review | HIGH | Pattern recognition, threshold alerts |
| **AI Transaction Categorization** | Reduces manual entry friction | MEDIUM | ML classification from payee/description |
| **Envelope Budgeting** | Zero-based budgeting method — ActualBudget reference | MEDIUM | Allocate income to categories, roll-over |
| **Natural Language Task Parsing** | "Buy milk tomorrow 5pm" → structured task | HIGH | NLP parsing, date extraction |
| **Habit Gamification (RPG Elements)** | Habitica-style engagement — XP, levels, rewards | HIGH | Character progression, achievements |
| **Habit Cron Scheduling** | Flexible recurrence beyond daily | MEDIUM | "Every Mon,Wed,Fri" or "every 2 weeks" |
| **AI Journal Summarization** | Weekly/monthly insights from entries | HIGH | LLM summarization, mood analysis |
| **AI Mood Trend Analysis** | Mental health insights over time | HIGH | Sentiment analysis, correlation detection |
| **Flexible Hobby Tracking** | Support counter, percentage, list-based tracking | MEDIUM | Schema-agnostic, JSONB logs |
| **AI Health Insights** | Correlation between habits/sleep/weight | HIGH | Pattern detection, recommendations |
| **White-Label Custom Domains** | SaaS feature for premium users | MEDIUM | Caddy automatic HTTPS, tenant domains |
| **Multi-Tenant Architecture** | Scales to SaaS without rewrites | HIGH | PostgreSQL RLS from day one |
| **Unified AI Gateway** | Single interface to multiple LLM providers | MEDIUM | Groq primary, Gemini fallback, circuit breaker |
| **Weekly Health Digest** | Automated health summary email | MEDIUM | Scheduled job, AI-generated insights |
| **Recurring Transaction Rules** | Automate predictable income/expenses | MEDIUM | Rule engine, auto-create transactions |

### Anti-Features (Commonly Requested, Often Problematic)

Features that seem good but create problems.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| **Bank Sync/Plaid Integration** | Automates transaction import | API costs ($0.30+/call), security audit burden, vendor lock-in | CSV import, manual entry with AI categorization |
| **Real-Time Collaboration** | "Like Google Docs for notes" | WebSocket complexity, conflict resolution, infrastructure cost | Optimistic locking, merge on conflict |
| **Social Features/Friends** | "Share habits with friends" | Privacy concerns, notification spam, scope creep | Private by default, export for external sharing |
| **Real-Time Chat** | "Communicate within the app" | Not core to personal management, high complexity | Keep focused on individual productivity |
| **Video/Image Attachments** | "Attach receipts, workout videos" | Storage costs, CDN bandwidth, backup complexity | Text-based, optional URL references to external storage |
| **Native Mobile Apps (First)** | "Need App Store presence" | Double codebase, app review delays, 30% fee | PWA/Expo initially, native later if validated |
| **OAuth-Only Login** | "No passwords is modern" | Dependency on providers, account recovery edge cases | Email/password v1, add OAuth as enhancement |
| **Redis for Caching** | "Need fast caching" | Additional service, memory overhead | PostgreSQL for everything, in-app caching |

## Feature Dependencies

```
[Envelope Budgeting]
    └──requires──> [Category Management]
    └──requires──> [Account Balances]

[AI Spending Anomaly Detection]
    └──requires──> [Transaction Entry]
    └──requires──> [AI Gateway]
    └──requires──> [Historical Data (30+ days)]

[AI Transaction Categorization]
    └──requires──> [AI Gateway]
    └──requires──> [Category Management]

[Natural Language Task Parsing]
    └──requires──> [AI Gateway]

[AI Journal Summarization]
    └──requires──> [AI Gateway]
    └──requires──> [Notes: Create/Edit/Delete]

[Weekly Health Digest]
    └──requires──> [Health: Weight Tracking]
    └──requires──> [AI Gateway]
    └──requires──> [Email Service (Resend)]

[Habit Gamification]
    └──requires──> [Habits: Daily Check-in]
    └──requires──> [Habits: Streak Counter]
    └──enhances──> [User Retention]

[Multi-Tenant Architecture]
    └──requires──> [PostgreSQL RLS Setup]
    └──enables──> [SaaS Subscription System]

[White-Label Custom Domains]
    └──requires──> [Multi-Tenant Architecture]
    └──requires──> [Caddy Reverse Proxy]

[Cross-Platform Sync]
    └──requires──> [Auth: Email/Password Login]
    └──requires──> [API Layer (NestJS)]

[Recurring Transaction Rules]
    └──requires──> [Transaction Entry]
    └──conflicts──> [AI Anomaly Detection] (auto-transactions may skew patterns)
```

### Dependency Notes

- **AI Anomaly Detection requires Historical Data:** Need 30+ days of transactions before patterns emerge. Launch without, enable after data accumulation.
- **Envelope Budgeting requires Category Management:** Cannot allocate to envelopes without categories defined.
- **Habit Gamification enhances User Retention:** RPG elements drive engagement but add significant complexity — defer to v1.x.
- **Recurring Rules conflicts with Anomaly Detection:** Auto-generated transactions may trigger false anomaly alerts. Solution: Flag recurring transactions, exclude from anomaly baseline.
- **White-Label Domains requires Multi-Tenant:** Custom domains per tenant only makes sense with tenant isolation.
- **AI Journal Summarization requires AI Gateway:** Centralized AI interface prevents vendor lock-in and enables fallback logic.

## MVP Definition

### Launch With (v1)

Minimum viable product — what's needed to validate the concept.

- [x] **Auth: Email/Password Login** — Cannot use app without authentication
- [x] **Financial: Transaction Entry** — Core value proposition
- [x] **Financial: Category Management** — Required for organization
- [x] **Financial: Account Balances** — Basic financial awareness
- [x] **Habits: Daily Check-in** — Core habit functionality
- [x] **Habits: Streak Counter** — Minimal gamification
- [x] **Tasks: Due Dates** — Basic task management
- [x] **Tasks: Completion Status** — Task tracking baseline
- [x] **Notes: Create/Edit/Delete** — Core notes functionality
- [x] **Notes: Search** — Essential for finding notes
- [x] **AI Gateway (Basic)** — Single provider (Groq), no fallback initially
- [x] **Cross-Platform Sync** — Web + mobile (Expo) baseline

### Add After Validation (v1.x)

Features to add once core is working.

- [ ] **AI Transaction Categorization** — Reduces friction, validates AI value
- [ ] **Envelope Budgeting** — Differentiator for financial module
- [ ] **Recurring Transaction Rules** — Automates predictable entries
- [ ] **Natural Language Task Parsing** — Speeds up task creation
- [ ] **Health: Weight Tracking** — First health metric
- [ ] **Health: Basic Charts** — Visual progress feedback
- [ ] **Notes: Organization (Tags)** — Better note management
- [ ] **Habit Cron Scheduling** — Flexible recurrence
- [ ] **AI Gateway Fallback (Gemini)** — Reliability improvement

### Future Consideration (v2+)

Features to defer until product-market fit is established.

- [ ] **AI Spending Anomaly Detection** — Requires historical data, complex ML
- [ ] **Habit Gamification (RPG Elements)** — Significant complexity, may not resonate
- [ ] **AI Journal Summarization** — Requires substantial journal usage first
- [ ] **AI Mood Trend Analysis** — Mental health features need careful UX
- [ ] **Flexible Hobby Tracking** — Schema design complexity
- [ ] **AI Health Insights** — Requires multiple health data streams
- [ ] **Weekly Health Digest** — Email infrastructure, scheduling
- [ ] **White-Label Custom Domains** — SaaS feature, not personal use
- [ ] **SaaS Subscription System (LemonSqueezy)** — Only when scaling to customers
- [ ] **Native Desktop (Tauri)** — Web-first, desktop when needed

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Transaction Entry | HIGH | LOW | P1 |
| Category Management | HIGH | LOW | P1 |
| Account Balances | HIGH | MEDIUM | P1 |
| Auth: Email/Password | HIGH | MEDIUM | P1 |
| Habits: Daily Check-in | HIGH | LOW | P1 |
| Habits: Streak Counter | MEDIUM | LOW | P1 |
| Tasks: Due Dates | HIGH | LOW | P1 |
| Tasks: Completion Status | HIGH | LOW | P1 |
| Notes: Create/Edit/Delete | HIGH | LOW | P1 |
| Notes: Search | HIGH | MEDIUM | P1 |
| AI Gateway (Basic) | HIGH | MEDIUM | P1 |
| Cross-Platform Sync | HIGH | HIGH | P1 |
| AI Transaction Categorization | HIGH | MEDIUM | P2 |
| Envelope Budgeting | HIGH | MEDIUM | P2 |
| Recurring Transaction Rules | MEDIUM | MEDIUM | P2 |
| Natural Language Task Parsing | MEDIUM | HIGH | P2 |
| Health: Weight Tracking | MEDIUM | LOW | P2 |
| Health: Basic Charts | MEDIUM | MEDIUM | P2 |
| Notes: Organization (Tags) | MEDIUM | MEDIUM | P2 |
| AI Spending Anomaly Detection | HIGH | HIGH | P3 |
| Habit Gamification (RPG) | MEDIUM | HIGH | P3 |
| AI Journal Summarization | MEDIUM | HIGH | P3 |
| White-Label Custom Domains | LOW | MEDIUM | P3 |
| SaaS Subscription System | LOW | HIGH | P3 |

**Priority key:**
- P1: Must have for launch (v1)
- P2: Should have, add when possible (v1.x)
- P3: Nice to have, future consideration (v2+)

## Competitor Feature Analysis

| Feature | ActualBudget | Habitica | Notion | Our Approach |
|---------|--------------|----------|--------|--------------|
| Budgeting Method | Envelope | N/A | N/A | Envelope (v1.x) |
| Transaction Import | Manual/CSV | N/A | N/A | Manual + AI categorization |
| Habit Tracking | N/A | Daily + RPG | N/A | Daily + streaks, gamification v2 |
| Gamification | N/A | XP, Levels, Quests | N/A | Streaks v1, RPG elements v2 |
| Notes Editor | N/A | N/A | Block-based | Tiptap headless editor |
| AI Features | None | None | AI assistant | Categorize, summarize, analyze |
| Multi-Tenant | No | Yes | Yes | PostgreSQL RLS from day one |
| Open Source | Yes | Yes | No | Yes (monetize via hosting) |
| Self-Hostable | Yes | Yes | No | Yes (Docker Compose) |
| Mobile App | No (PWA) | Yes | Yes | Expo cross-platform |
| Offline Support | Yes (local-first) | No | Partial | Sync-first, offline queue |

## AI Feature Mapping by Module

### Financial Module
| AI Task | Use Case | Complexity | Phase |
|---------|----------|------------|-------|
| CLASSIFY | Transaction categorization from payee | MEDIUM | v1.x |
| ANOMALY | Spending pattern deviation detection | HIGH | v2+ |
| EXTRACT | Parse recurring rule from description | MEDIUM | v1.x |

### Habits & Tasks Module
| AI Task | Use Case | Complexity | Phase |
|---------|----------|------------|-------|
| PARSE | Natural language to structured task | HIGH | v1.x |
| LABEL | Auto-tag tasks by content | LOW | v2+ |
| SUGGEST | Habit recommendations based on goals | HIGH | v2+ |

### Health & Fitness Module
| AI Task | Use Case | Complexity | Phase |
|---------|----------|------------|-------|
| ANALYZE | Correlation: sleep vs weight vs habits | HIGH | v2+ |
| SUMMARIZE | Weekly health digest generation | MEDIUM | v2+ |
| PREDICT | Weight trend projection | MEDIUM | v2+ |

### Notes & Journal Module
| AI Task | Use Case | Complexity | Phase |
|---------|----------|------------|-------|
| SUMMARIZE | Journal entry summarization | MEDIUM | v2+ |
| ANALYZE | Mood trend detection | HIGH | v2+ |
| EXTRACT | Action items from notes | MEDIUM | v2+ |
| SEARCH | Semantic search across notes | HIGH | v2+ |

### Hobbies Module
| AI Task | Use Case | Complexity | Phase |
|---------|----------|------------|-------|
| ANALYZE | Progress insights, pattern detection | MEDIUM | v2+ |
| SUMMARIZE | Collection/progress summaries | LOW | v2+ |

## Sources

- **ActualBudget** (GitHub) — Reference for envelope budgeting, local-first architecture, self-hosting patterns
  - https://github.com/actualbudget/actual
- **Habitica** (GitHub) — Reference for habit gamification, RPG mechanics, engagement patterns
  - https://github.com/HabitRPG/habitica
- **Tiptap** (GitHub) — Reference for headless rich text editor, extension system
  - https://github.com/ueberdosis/tiptap
- **NestJS Documentation** — Reference for modular architecture, dependency injection
  - https://github.com/nestjs/nest
- **PROJECT.md** — Project-specific requirements and constraints
  - `.planning/PROJECT.md`

---
*Feature research for: Personal Management System (PMS)*
*Researched: 2026-03-21*
