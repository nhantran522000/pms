# Architecture Research

**Domain:** Personal Management SaaS Platform
**Researched:** 2026-03-21
**Confidence:** HIGH (based on official PostgreSQL docs, Nx docs, Clean Architecture patterns, NestJS ecosystem)

## Standard Architecture

### System Overview

```
+-----------------------------------------------------------+
|                    CLIENT APPLICATIONS                      |
+-----------------------------------------------------------+
|  +------------+  +------------+  +------------+            |
|  | Next.js    |  | Expo       |  | Tauri      |            |
|  | Web App    |  | Mobile App |  | Desktop    |            |
|  +-----+------+  +-----+------+  +-----+------+            |
|        |               |               |                    |
+--------|---------------|---------------|--------------------+
         |               |               |
         v               v               v
+-----------------------------------------------------------+
|                    API GATEWAY / NESTJS                     |
+-----------------------------------------------------------+
|  +-----------------------------------------------------+   |
|  |                    Fastify Adapter                   |   |
|  +-----------------------------------------------------+   |
|                           |                                |
+---------------------------|--------------------------------+
                            |
         +------------------+------------------+
         |                  |                  |
         v                  v                  v
+--------+------+  +--------+------+  +--------+------+
|     Auth      |  |   Tenant      |  |   AI         |
|   Module      |  |   Context     |  |   Gateway    |
+-------+-------+  +-------+-------+  +-------+-------+
        |                  |                  |
+-------|------------------|------------------|----------+
|       v                  v                  v          |
|  +----+----+  +----+----+  +----+----+  +----+----+   |
|  |Financial|  | Habits |  | Health |  |  Notes  |   |  <-- DOMAIN MODULES
|  | Module  |  | Module |  | Module |  | Module  |   |
|  +----+----+  +----+----+  +----+----+  +----+----+   |
|       |           |           |           |            |
|       v           v           v           v            |
|  +----+----+  +----+----+  +----+----+  +----+----+   |
|  | Hobbies |  |Subscription| |  ...   |  |  ...   |   |
|  | Module  |  |  Module   |  |        |  |        |   |
|  +----+----+  +----+----+  +--------+  +--------+   |
|       |           |                                     |
+-------|-----------|-------------------------------------+
        |           |
        v           v
+-----------------------------------------------------------+
|                    INFRASTRUCTURE LAYER                    |
+-----------------------------------------------------------+
|  +-------------+  +-------------+  +-------------+         |
|  | PostgreSQL  |  | pg-boss     |  | LemonSqueezy|         |
|  | (RLS)       |  | (Jobs)      |  | (Payments)  |         |
|  +-------------+  +-------------+  +-------------+         |
+-----------------------------------------------------------+
```

### Component Responsibilities

| Component | Responsibility | Implementation |
|-----------|----------------|----------------|
| **API Gateway** | Request routing, auth middleware, tenant context setup | NestJS 11.1 + Fastify adapter |
| **Auth Module** | JWT authentication, password hashing, session management | Passport.js, bcrypt |
| **Tenant Context** | Set PostgreSQL session variable for RLS, tenant resolution | Middleware setting `app.current_tenant` |
| **AI Gateway** | Unified interface to Groq/Gemini, circuit breaker, caching | Custom provider with fallback chain |
| **Financial Module** | Transactions, budgets, recurring rules, anomaly detection | Domain + Application + Infrastructure layers |
| **Habits Module** | Tasks, habit streaks, cron scheduling, NLP parsing | Domain + Application + Infrastructure layers |
| **Health Module** | Vitals, sleep, workouts with JSONB logs, digest | Domain + Application + Infrastructure layers |
| **Notes Module** | Tiptap editor, full-text search, mood trends | Domain + Application + Infrastructure layers |
| **Hobbies Module** | Flexible tracking (counter, %, list), progress analysis | Domain + Application + Infrastructure layers |
| **Subscription Module** | LemonSqueezy webhooks, trial management, tiered plans | Webhook handlers, entitlement checks |
| **Event Bus** | Cross-module communication, domain events | @nestjs/event-emitter (EventEmitter2) |
| **PostgreSQL RLS** | Tenant isolation at database level, zero manual filtering | Row Level Security policies |

## Recommended Project Structure

```
pms/
├── apps/
│   ├── api/                          # NestJS backend
│   │   ├── src/
│   │   │   ├── main.ts               # Fastify bootstrap
│   │   │   ├── app.module.ts         # Root module
│   │   │   ├── common/               # Shared utilities
│   │   │   │   ├── decorators/       # Custom decorators
│   │   │   │   ├── filters/          # Exception filters
│   │   │   │   ├── guards/           # Auth guards
│   │   │   │   ├── interceptors/     # Logging, caching
│   │   │   │   └── pipes/            # Validation pipes
│   │   │   ├── infrastructure/       # Infrastructure adapters
│   │   │   │   ├── database/         # TypeORM/Prisma config
│   │   │   │   ├── cache/            # In-memory caching
│   │   │   │   ├── queue/            # pg-boss setup
│   │   │   │   └── ai/               # AI provider adapters
│   │   │   └── modules/              # Feature modules
│   │   │       ├── auth/
│   │   │       ├── tenants/
│   │   │       ├── subscriptions/
│   │   │       ├── financial/
│   │   │       ├── habits/
│   │   │       ├── health/
│   │   │       ├── notes/
│   │   │       └── hobbies/
│   │   └── test/
│   ├── web/                          # Next.js web client
│   │   ├── src/
│   │   │   ├── app/                  # App router pages
│   │   │   ├── components/           # UI components
│   │   │   ├── lib/                  # API client, utilities
│   │   │   └── hooks/                # Custom React hooks
│   │   └── public/
│   ├── mobile/                       # Expo React Native
│   │   ├── src/
│   │   │   ├── screens/
│   │   │   ├── components/
│   │   │   ├── navigation/
│   │   │   └── services/
│   │   └── app.json
│   └── desktop/                      # Tauri desktop
│       ├── src/                      # Rust backend
│       └── ui/                       # Web frontend
├── libs/
│   ├── domain/                       # Domain layer (shared)
│   │   ├── financial/
│   │   │   ├── entities/             # Transaction, Budget, etc.
│   │   │   ├── value-objects/        # Money, Percentage, etc.
│   │   │   ├── events/               # Domain events
│   │   │   └── services/             # Domain services
│   │   ├── habits/
│   │   ├── health/
│   │   ├── notes/
│   │   └── hobbies/
│   ├── shared/                       # Cross-cutting concerns
│   │   ├── types/                    # Shared TypeScript types
│   │   ├── utils/                    # Utility functions
│   │   └── testing/                  # Test utilities
│   └── contracts/                    # API contracts (DTOs)
│       ├── financial/
│       ├── habits/
│       └── ...
├── tools/                            # Nx generators, scripts
├── docker/                           # Docker Compose files
└── docs/                             # Documentation
```

### Structure Rationale

- **apps/**: Deployable applications with clear boundaries
- **libs/domain/**: Framework-agnostic domain logic, highest stability
- **libs/shared/**: Utilities used across all layers
- **libs/contracts/**: DTOs shared between API and clients
- **Module-internal structure**: Each module follows hexagonal architecture

### Module Internal Structure (Hexagonal/Ports & Adapters)

```
modules/financial/
├── domain/                    # Core business logic (no dependencies)
│   ├── entities/
│   │   ├── transaction.entity.ts
│   │   └── budget.entity.ts
│   ├── value-objects/
│   │   ├── money.vo.ts
│   │   └── recurring-rule.vo.ts
│   ├── events/
│   │   ├── transaction-created.event.ts
│   │   └── budget-exceeded.event.ts
│   ├── services/
│   │   └── anomaly-detector.service.ts
│   └── ports/                 # Interfaces (ports)
│       ├── repositories/
│       │   ├── transaction.repository.port.ts
│       │   └── budget.repository.port.ts
│       └── services/
│           └── ai-classifier.port.ts
├── application/               # Use cases (depends on domain only)
│   ├── commands/
│   │   ├── create-transaction.command.ts
│   │   └── create-transaction.handler.ts
│   ├── queries/
│   │   ├── get-spending-summary.query.ts
│   │   └── get-spending-summary.handler.ts
│   └── services/
│       └── budget-validator.service.ts
├── infrastructure/            # Adapters (implements ports)
│   ├── persistence/
│   │   ├── typeorm/
│   │   │   ├── transaction.orm-entity.ts
│   │   │   └── transaction.repository.ts
│   │   └── mappers/
│   │       └── transaction.mapper.ts
│   ├── adapters/
│   │   └── groq-classifier.adapter.ts
│   └── events/
│       └── event-publishers.ts
├── presentation/              # Controllers, DTOs
│   ├── controllers/
│   │   ├── transactions.controller.ts
│   │   └── budgets.controller.ts
│   └── dtos/
│       ├── create-transaction.dto.ts
│       └── transaction-response.dto.ts
└── financial.module.ts        # NestJS module definition
```

## Architectural Patterns

### Pattern 1: Hexagonal Architecture (Ports & Adapters)

**What:** Isolates domain logic from infrastructure concerns through well-defined interfaces (ports) and their implementations (adapters).

**When to use:** Always - this is the foundational pattern for all modules.

**Trade-offs:**
- (+) Domain logic remains pure and testable without infrastructure
- (+) Easy to swap implementations (e.g., switch AI providers, databases)
- (+) Clear dependency direction (inward toward domain)
- (-) More boilerplate and initial setup
- (-) Requires discipline to maintain boundaries

**Example:**

```typescript
// domain/ports/repositories/transaction.repository.port.ts
export interface TransactionRepositoryPort {
  findById(id: string): Promise<Transaction | null>;
  findByTenantId(tenantId: string, filters: TransactionFilters): Promise<Transaction[]>;
  save(transaction: Transaction): Promise<Transaction>;
  delete(id: string): Promise<void>;
}

// infrastructure/persistence/typeorm/transaction.repository.ts
import { TransactionRepositoryPort } from '../../domain/ports/repositories/transaction.repository.port';

@Injectable()
export class TypeOrmTransactionRepository implements TransactionRepositoryPort {
  constructor(
    @InjectRepository(TransactionOrmEntity)
    private readonly repository: Repository<TransactionOrmEntity>,
  ) {}

  async findById(id: string): Promise<Transaction | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? TransactionMapper.toDomain(entity) : null;
  }

  // ... other methods
}
```

### Pattern 2: Row Level Security (RLS) for Multi-Tenancy

**What:** PostgreSQL enforces tenant isolation at the database level using RLS policies. No application code needs to filter by tenant.

**When to use:** All tenant-scoped tables must have RLS enabled.

**Trade-offs:**
- (+) Zero chance of data leakage between tenants
- (+) Simplifies application code (no manual tenant filtering)
- (+) Database-level security is more robust than application-level
- (-) Requires setting session variable on each connection
- (-) More complex database migrations

**Example:**

```sql
-- Enable RLS on tenant-scoped table
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Create policy using session variable set by middleware
CREATE POLICY tenant_isolation_policy ON transactions
  USING (tenant_id = current_setting('app.current_tenant')::uuid)
  WITH CHECK (tenant_id = current_setting('app.current_tenant')::uuid);

-- Middleware sets the variable before queries
SET app.current_tenant = 'tenant-uuid-here';
```

```typescript
// NestJS middleware to set tenant context
@Injectable()
export class TenantContextMiddleware implements NestMiddleware {
  constructor(private readonly connection: Connection) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const tenantId = req.user?.tenantId;
    if (tenantId) {
      const queryRunner = this.connection.createQueryRunner();
      await queryRunner.query(`SET app.current_tenant = '${tenantId}'`);
      req.queryRunner = queryRunner;
    }
    next();
  }
}
```

### Pattern 3: Event-Driven Module Communication

**What:** Modules communicate through domain events via EventEmitter2, never through direct imports.

**When to use:** Cross-module concerns like "send notification when budget exceeded" or "update AI insights when transaction created".

**Trade-offs:**
- (+) Loose coupling between modules
- (+) Easy to add new event listeners without modifying publishers
- (+) Module can be extracted to microservice later
- (-) Harder to trace execution flow
- (-) Requires careful event naming conventions

**Example:**

```typescript
// domain/events/transaction-created.event.ts
export class TransactionCreatedEvent {
  constructor(
    public readonly transactionId: string,
    public readonly tenantId: string,
    public readonly amount: number,
    public readonly category: string,
  ) {}
}

// application/commands/create-transaction.handler.ts
@CommandHandler(CreateTransactionCommand)
export class CreateTransactionHandler {
  constructor(
    private readonly transactionRepo: TransactionRepositoryPort,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(command: CreateTransactionCommand): Promise<Transaction> {
    const transaction = Transaction.create(command.payload);
    await this.transactionRepo.save(transaction);

    // Publish domain event
    this.eventEmitter.emit(
      'transaction.created',
      new TransactionCreatedEvent(
        transaction.id,
        transaction.tenantId,
        transaction.amount,
        transaction.category,
      ),
    );

    return transaction;
  }
}

// AI module listening for events
@EventHandler(TransactionCreatedEvent)
export class TransactionAiHandler implements IEventHandler<TransactionCreatedEvent> {
  constructor(private readonly aiGateway: AiGatewayService) {}

  async handle(event: TransactionCreatedEvent) {
    // Classify transaction using AI
    const classification = await this.aiGateway.classify({
      type: 'CLASSIFY',
      input: { description: event.category, amount: event.amount },
    });
    // Update transaction with classification...
  }
}
```

### Pattern 4: AI Gateway with Circuit Breaker

**What:** Unified interface to multiple AI providers with automatic fallback and resilience patterns.

**When to use:** All AI operations go through the gateway, never directly to providers.

**Trade-offs:**
- (+) Graceful degradation when providers fail
- (+) Easy to add new providers or change primary
- (+) Centralized token budget management
- (-) Additional abstraction layer
- (-) Slightly higher latency for fallback scenarios

**Example:**

```typescript
// infrastructure/ai/ai-gateway.service.ts
@Injectable()
export class AiGatewayService {
  private readonly providers: AiProvider[];
  private readonly circuitBreakers: Map<string, CircuitBreaker>;

  constructor(
    private readonly groqProvider: GroqProvider,
    private readonly geminiProvider: GeminiProvider,
  ) {
    this.providers = [groqProvider, geminiProvider];
    this.circuitBreakers = new Map(
      this.providers.map(p => [p.name, new CircuitBreaker({ threshold: 5, timeout: 60000 })])
    );
  }

  async execute<T>(request: AiRequest): Promise<AiResponse<T>> {
    for (const provider of this.providers) {
      const breaker = this.circuitBreakers.get(provider.name)!;

      if (breaker.isOpen) {
        continue; // Skip if circuit is open
      }

      try {
        const response = await breaker.execute(() => provider.execute(request));
        return response;
      } catch (error) {
        breaker.recordFailure();
        console.warn(`Provider ${provider.name} failed, trying next...`);
      }
    }

    throw new Error('All AI providers failed');
  }
}
```

## Data Flow

### Request Flow

```
[Client Request]
      |
      v
+------------------+
| Caddy Proxy      |  -- TLS termination, reverse proxy
+------------------+
      |
      v
+------------------+
| Fastify Adapter  |  -- HTTP parsing, routing
+------------------+
      |
      v
+------------------+
| Auth Guard       |  -- JWT validation, user context
+------------------+
      |
      v
+------------------+
| Tenant Middleware|  -- Set app.current_tenant session var
+------------------+
      |
      v
+------------------+
| Controller       |  -- Request validation, DTO mapping
+------------------+
      |
      v
+------------------+
| Command Handler  |  -- Use case orchestration
| (Application)    |
+------------------+
      |
      v
+------------------+
| Domain Entity    |  -- Business rules, invariants
+------------------+
      |
      v
+------------------+
| Repository       |  -- Persistence abstraction
| (Infrastructure) |
+------------------+
      |
      v
+------------------+
| PostgreSQL       |  -- RLS enforces tenant isolation
| (with RLS)       |
+------------------+
      |
      v
[Response to Client]
```

### Event Flow (Cross-Module Communication)

```
[Module A: Transaction Created]
            |
            v
+------------------------+
| EventEmitter2          |
| (In-process)           |
+------------------------+
            |
    +-------+-------+
    |               |
    v               v
+--------+    +--------+
| Module B|    | Module C|
| AI      |    | Notify  |
| Handler |    | Handler |
+--------+    +--------+
    |               |
    v               v
[Classification] [Email Sent]
```

### Key Data Flows

1. **Authentication Flow:**
   - Client sends credentials -> Auth module validates -> JWT issued
   - Subsequent requests include JWT -> Guard extracts user -> Tenant middleware sets RLS context

2. **Multi-Tenant Data Access:**
   - Request arrives with JWT containing tenantId
   - Tenant middleware executes `SET app.current_tenant = 'uuid'`
   - All subsequent queries in that connection are automatically filtered by RLS
   - No application code needs to add `WHERE tenant_id = ?`

3. **AI-Enhanced Features:**
   - Domain event published (e.g., `transaction.created`)
   - AI Gateway handler listens for event
   - Gateway attempts Groq first, falls back to Gemini if failed
   - Result stored back to database

4. **Subscription Webhook:**
   - LemonSqueezy sends webhook -> Subscription module validates signature
   - Updates tenant subscription status -> Event published
   - Other modules react to subscription changes (enable/disable features)

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| 0-1k users | Monolith on single VPS, all modules in one NestJS process, SQLite-level simplicity with PostgreSQL |
| 1k-10k users | Add read replicas for PostgreSQL, enable connection pooling (PgBouncer), consider caching layer |
| 10k-100k users | Extract AI Gateway to separate service, add CDN for static assets, horizontal API scaling |
| 100k+ users | Extract high-traffic modules to microservices, add message queue (RabbitMQ/Kafka), multi-region deployment |

### Scaling Priorities

1. **First bottleneck: Database connections**
   - 8GB RAM limits connection pool size
   - Fix: PgBouncer for connection pooling, read replicas for reporting queries

2. **Second bottleneck: AI provider rate limits**
   - Free tier limits (~1M tokens/day on Groq)
   - Fix: Aggressive caching, prompt deduplication, batch processing

3. **Third bottleneck: Single VPS saturation**
   - 4 vCPU limits concurrent request handling
   - Fix: Horizontal scaling with load balancer, extract heavy modules

### Single-Developer Optimization

- **Monolith-first:** All modules in one deployable unit until scale demands extraction
- **Shared database:** Single PostgreSQL instance with RLS, no separate DBs per tenant
- **In-process events:** EventEmitter2, no external message queue initially
- **Minimal services:** API + PostgreSQL + Caddy, nothing else

## Anti-Patterns

### Anti-Pattern 1: Direct Module Imports

**What people do:** Import services directly from another module.

```typescript
// WRONG: Direct import creates tight coupling
import { AiGatewayService } from '../../ai/ai-gateway.service';

export class TransactionService {
  constructor(private readonly aiGateway: AiGatewayService) {}
}
```

**Why it's wrong:** Violates module boundaries, makes extraction impossible, creates hidden dependencies.

**Do this instead:** Use domain events for cross-module communication.

```typescript
// CORRECT: Loose coupling via events
export class TransactionService {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  async createTransaction(data: CreateTransactionDto) {
    const transaction = await this.repo.save(data);
    this.eventEmitter.emit('transaction.created', new TransactionCreatedEvent(transaction));
    return transaction;
  }
}
```

### Anti-Pattern 2: Manual Tenant Filtering

**What people do:** Add `WHERE tenant_id = ?` to every query.

```typescript
// WRONG: Manual filtering is error-prone
async findByUser(userId: string, tenantId: string) {
  return this.repo.find({ where: { userId, tenantId } });
}
```

**Why it's wrong:** Easy to forget, potential data leakage, repetitive code.

**Do this instead:** Trust RLS, never filter by tenant in application code.

```typescript
// CORRECT: RLS handles tenant isolation
async findByUser(userId: string) {
  // RLS already filters by tenant from session variable
  return this.repo.find({ where: { userId } });
}
```

### Anti-Pattern 3: Domain Logic in Controllers

**What people do:** Put business rules directly in controller methods.

```typescript
// WRONG: Business logic in presentation layer
@Post()
async create(@Body() dto: CreateTransactionDto) {
  if (dto.amount < 0) throw new BadRequestException('Amount must be positive');
  if (dto.category === 'income' && dto.amount > 10000) {
    // flag for review...
  }
  return this.repo.save(dto);
}
```

**Why it's wrong:** Violates layering, hard to test, duplicates logic.

**Do this instead:** Domain logic belongs in entities/domain services.

```typescript
// CORRECT: Logic in domain entity
@Post()
async create(@Body() dto: CreateTransactionDto) {
  const transaction = Transaction.create(dto); // Entity enforces rules
  return this.transactionService.create(transaction);
}

// domain/entities/transaction.entity.ts
export class Transaction {
  static create(dto: CreateTransactionDto): Transaction {
    if (dto.amount < 0) throw new InvalidAmountError('Amount must be positive');
    return new Transaction(dto);
  }
}
```

### Anti-Pattern 4: God Modules

**What people do:** Create one massive module that does everything.

**Why it's wrong:** Becomes unmaintainable, violates single responsibility, creates merge conflicts.

**Do this instead:** Split by bounded context. Financial has transactions, budgets, recurring rules as separate aggregates within the module.

## Nx Module Boundaries

### Tag-Based Dependency Constraints

```json
// nx.json or .eslintrc.json
{
  "rules": {
    "@nx/enforce-module-boundaries": [
      "error",
      {
        "allow": [],
        "depConstraints": [
          {
            "sourceTag": "type:app",
            "onlyDependOnLibsWithTags": ["type:lib", "type:shared", "type:contract"]
          },
          {
            "sourceTag": "domain:financial",
            "onlyDependOnLibsWithTags": ["type:shared", "domain:shared"]
          },
          {
            "sourceTag": "domain:habits",
            "onlyDependOnLibsWithTags": ["type:shared", "domain:shared"]
          },
          {
            "sourceTag": "layer:infrastructure",
            "onlyDependOnLibsWithTags": ["layer:domain", "layer:shared"]
          },
          {
            "sourceTag": "layer:application",
            "onlyDependOnLibsWithTags": ["layer:domain", "layer:shared"]
          },
          {
            "sourceTag": "layer:presentation",
            "onlyDependOnLibsWithTags": ["layer:application", "layer:shared", "type:contract"]
          }
        ]
      }
    ]
  }
}
```

### Tag Strategy

| Tag Pattern | Meaning | Example |
|-------------|---------|---------|
| `type:app` | Deployable application | `apps/api`, `apps/web` |
| `type:lib` | Reusable library | `libs/domain/financial` |
| `type:shared` | Cross-cutting utilities | `libs/shared/utils` |
| `type:contract` | API DTOs | `libs/contracts/financial` |
| `domain:*` | Bounded context | `domain:financial`, `domain:habits` |
| `layer:*` | Architecture layer | `layer:domain`, `layer:infrastructure` |

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| Groq API | HTTP via AI Gateway adapter | Primary AI provider, circuit breaker |
| Gemini 2.0 Flash | HTTP via AI Gateway adapter | Fallback AI provider |
| LemonSqueezy | Webhook receiver, HTTP client | Merchant of record, handles VAT |
| Resend | SMTP/HTTP adapter | Transactional emails |
| Cloudflare | DNS/CDN | Static assets, DDoS protection |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| Domain <-> Infrastructure | Port/Adapter interfaces | Domain defines port, infra implements |
| Application <-> Domain | Direct imports | Use cases call domain entities/services |
| Presentation <-> Application | Command/Query handlers | CQRS pattern within modules |
| Module <-> Module | EventEmitter2 events | Never direct imports |
| API <-> Clients | REST/JSON | Shared contract library for types |

## Build Order Implications

Based on the architecture, the recommended build order for incremental development:

```
Phase 1: Foundation (shared utilities)
+-- libs/shared/types
+-- libs/shared/utils
+-- libs/shared/testing

Phase 2: Core Infrastructure
+-- apps/api (skeleton with Fastify)
+-- infrastructure/database (PostgreSQL + RLS setup)
+-- infrastructure/auth (JWT, guards)
+-- infrastructure/tenant (RLS middleware)

Phase 3: First Domain Module (Financial)
+-- libs/domain/financial (entities, value objects, events)
+-- libs/contracts/financial (DTOs)
+-- apps/api/modules/financial (full hexagonal stack)

Phase 4: AI Integration
+-- infrastructure/ai (providers, gateway, circuit breaker)
+-- Event handlers for AI-enhanced features

Phase 5: Additional Domain Modules
+-- libs/domain/habits + apps/api/modules/habits
+-- libs/domain/health + apps/api/modules/health
+-- libs/domain/notes + apps/api/modules/notes
+-- libs/domain/hobbies + apps/api/modules/hobbies

Phase 6: Subscription System
+-- libs/domain/subscription
+-- infrastructure/payments (LemonSqueezy adapter)
+-- Webhook handlers

Phase 7: Client Applications
+-- apps/web (Next.js)
+-- apps/mobile (Expo)
+-- apps/desktop (Tauri)
```

### Dependency Graph Summary

```
shared/types, shared/utils
        |
        v
domain/* (entities, value objects, domain services)
        |
        v
contracts/* (DTOs that reference domain types)
        |
        v
application/* (use cases, command/query handlers)
        |
        v
infrastructure/* (adapters, repositories, external services)
        |
        v
presentation/* (controllers, resolvers)
        |
        v
apps/* (NestJS modules, Next.js pages, etc.)
```

## Sources

- PostgreSQL Row Security Policies: https://www.postgresql.org/docs/current/ddl-rowsecurity.html (HIGH confidence - official docs)
- Nx Module Boundaries: https://nx.dev/features/enforce-module-boundaries (HIGH confidence - official docs)
- Clean Architecture / Organizing App Logic: https://khalilstemmler.com/articles/software-design-architecture/organizing-app-logic/ (HIGH confidence - industry expert)
- NestJS Event Emitter: https://github.com/nestjs/event-emitter (HIGH confidence - official NestJS package)
- NestJS Documentation: https://docs.nestjs.com (HIGH confidence - official docs)

---
*Architecture research for: Personal Management SaaS Platform*
*Researched: 2026-03-21*
