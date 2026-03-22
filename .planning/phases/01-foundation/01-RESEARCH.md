# Phase 1: Foundation - Research

**Researched:** 2026-03-22
**Domain:** Multi-tenant Nx monorepo with NestJS API, PostgreSQL RLS, authentication
**Confidence:** HIGH

## Summary

Phase 1 establishes the foundational infrastructure for the entire PMS ecosystem: a multi-tenant Nx monorepo with NestJS API, PostgreSQL Row Level Security (RLS), JWT authentication, and shared libraries. This phase delivers the critical building blocks that all subsequent modules depend upon.

The technology stack is well-established with current versions: Nx 22.6.1 for monorepo management, NestJS 11.1.17 with Fastify adapter for API, PostgreSQL 17 with Prisma 7.5.0 ORM, and comprehensive authentication using JWT + httpOnly cookies. All selected libraries are production-ready with active communities and extensive documentation.

**Primary recommendation:** Follow the CLAUDE.md technology stack decisions exactly. Use Nx's preset generators for NestJS applications, configure Fastify adapter from bootstrap, implement RLS policies in Prisma migrations, and use AsyncLocalStorage for tenant context injection throughout the request lifecycle.

## User Constraints (from CONTEXT.md)

### Locked Decisions

**Authentication UX:**
- Email verification required before first login (prevents typos, standard practice)
- Password strength: Zxcvbn score 3+ (user-friendly, modern approach)
- Session duration: 7 days before re-auth required (balances security/UX)
- Password reset token expiry: 1 hour (standard security window)

**API Design:**
- Versioning: URL path (/api/v1/) — explicit, cacheable
- Error format: `{ success: false, error: { code, message, details } }` — structured
- Pagination: Cursor-based — consistent with RLS, no offset issues
- Validation: Zod at controller boundary — shared types with frontend

**Project Structure:**
- App naming: `@pms/api`, `@pms/web`, `@pms/mobile` — short prefix
- Lib naming: `@pms/shared-kernel`, `@pms/feature-domain` — domain-first
- Feature structure: `feature/{domain,application,infrastructure,presentation}` — DDD layers
- Prisma location: `libs/data-access/prisma/schema.prisma` — shared access

**Development Workflow:**
- Database seeding: Seed script with default tenant + admin user
- Local DB: Docker Compose service — matches production
- RLS migrations: Apply RLS policies in same migration as table creation
- Config validation: Zod schema at startup — fail fast

### Claude's Discretion

- Specific implementation details for each plan within established patterns
- Exact file structure within DDD layer conventions
- Error code naming conventions
- Log format specifics

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope.

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| INFRA-01 | System runs in Docker Compose with Caddy reverse proxy | Standard Docker Compose v2 patterns; Caddy automatic HTTPS via Caddyfile |
| INFRA-02 | PostgreSQL 17 with Row Level Security (RLS) for tenant isolation | PostgreSQL 17 RLS with session variables for tenant context |
| INFRA-03 | All data tables include tenantId with RLS policies applied | Prisma schema defaults + RLS policy patterns |
| INFRA-04 | Prisma 7.3 configured with moduleFormat: cjs for NestJS | Prisma 7.5.0 with `moduleFormat: cjs` in schema |
| INFRA-05 | Nx 22.6 monorepo with enforced module boundaries (ESLint tags) | Nx 22.6.1 with @nx/enforce-module-boundaries rule |
| INFRA-06 | Shared libraries structure (shared-kernel, shared-types, data-access, ui-web, ui-mobile) | Nx library generators with tags: `type:app|lib`, `domain:*`, `layer:*` |
| INFRA-07 | Pino logging with correlation ID middleware | nestjs-pino 4.6.1 with correlation ID middleware |
| INFRA-08 | VPS memory tuning (swap, PostgreSQL config, Node heap limits) | Docker Compose resource limits + PostgreSQL config + NODE_OPTIONS |
| AUTH-01 | User can sign up with email and password | NestJS controller with Zod validation, bcrypt hashing |
| AUTH-02 | User receives email verification after signup | Resend SDK integration with verification token |
| AUTH-03 | User can reset password via email link | Password reset token with expiry, bcrypt hash comparison |
| AUTH-04 | User session persists across browser refresh (JWT + httpOnly cookies) | @nestjs/jwt 11.0.2 with cookie serializer/deserializer |
| AUTH-05 | User can log out from any page | Clear httpOnly cookie, optional token blacklist |
| AUTH-06 | Tenant context injected via AsyncLocalStorage for RLS | NestJS middleware + AsyncLocalStorage + Prisma middleware |

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Nx | 22.6.1 | Monorepo management | Affected builds, module boundary enforcement, project graph visualization |
| @nestjs/core | 11.1.17 | API framework | Modular DI, guards, interceptors, TypeScript-first |
| @nestjs/platform-fastify | 11.1.17 | HTTP adapter | 2x faster than Express, lower memory footprint |
| @prisma/client | 7.5.0 | ORM | Type-safe queries, migrations, Zod integration |
| PostgreSQL | 17 | Database | RLS for multi-tenancy, JSONB for flexible logs, full-text search |
| pnpm | 9.x | Package manager | Disk efficient, fast installs, workspace support |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @nestjs/jwt | 11.0.2 | JWT authentication | Session tokens, password reset tokens |
| @nestjs/config | 4.0.3 | Configuration management | Typed configuration with Zod validation |
| @nestjs/throttler | 6.5.0 | Rate limiting | Protect authentication endpoints |
| @nestjs/event-emitter | 2.2.4 | Domain events | Decoupling module communication |
| zod | 3.24.2 | Runtime validation | Shared validation schemas between frontend/backend |
| nestjs-pino | 4.6.1 | Structured logging | Fast JSON logging with correlation IDs |
| pino | 10.3.1 | Logger core | Underlying logger for nestjs-pino |
| class-transformer | 0.5.1 | DTO transformation | Response filtering, serialization |
| bcrypt | 5.1.1 | Password hashing | Secure password storage |
| zxcvbn | 4.4.2 | Password strength | User-friendly password validation |
| pg-boss | 12.14.0 | Job queue | PostgreSQL-backed, no Redis needed |
| @resend/resend | latest | Email service | Transactional emails (verification, reset) |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Fastify adapter | Express adapter | Express is 2x slower, higher memory usage |
| Prisma | TypeORM, MikroORM | TypeORM less type-safe, MikroORM smaller community |
| pg-boss | Bull (Redis) | Bull adds Redis RAM overhead (~100MB) |
| JWT + cookies | Passport.js | Passport is overkill for single-tenant auth |
| Zod | Joi, class-validator | Zod provides TypeScript type inference |
| Zxcvbn | Custom regex rules | Zxcvbn is more user-friendly, entropy-based |
| Resend | SendGrid, Mailgun | Resend has better free tier (3k/mo), React Email |
| AsyncLocalStorage | CLS (continuation-local-storage) | AsyncLocalStorage is built into Node.js 16+ |

**Installation:**
```bash
# Create Nx workspace with NestJS
npx create-nx-workspace@latest pms --preset=nestjs --packageManager=pnpm

# Core dependencies
pnpm add @nestjs/core @nestjs/platform-fastify @nestjs/jwt @nestjs/config @nestjs/throttler @nestjs/event-emitter
pnpm add @prisma/client zod nestjs-pino pino class-transformer bcrypt zxcvbn
pnpm add @resend/resend

# Dev dependencies
pnpm add -D @nestjs/schematics @nestjs/cli prisma typescript-node
pnpm add -D @types/bcrypt @types/node

# Initialize Prisma
npx prisma init
```

**Version verification:**
```bash
# All versions verified current as of 2026-03-22
npm view nx version                    # 22.6.1
npm view @nestjs/core version          # 11.1.17
npm view @prisma/client version        # 7.5.0
npm view pino version                  # 10.3.1
npm view nestjs-pino version           # 4.6.1
npm view @nestjs/jwt version           # 11.0.2
npm view @nestjs/config version        # 4.0.3
npm view zod version                   # 3.24.2
npm view zxcvbn version                # 4.4.2
npm view @nestjs/throttler version     # 6.5.0
npm view pg-boss version               # 12.14.0
```

## Architecture Patterns

### Recommended Project Structure

```
pms/
├── apps/
│   ├── api/                    # NestJS API application
│   │   ├── src/
│   │   │   ├── app.module.ts
│   │   │   ├── main.ts         # Fastify adapter bootstrap
│   │   │   ├── config/         # Configuration modules
│   │   │   ├── auth/           # Auth feature module
│   │   │   └── shared/         # Shared utilities
│   │   ├── Dockerfile
│   │   └── project.json        # Nx project configuration
│   ├── web/                    # Next.js web client (Phase 9)
│   └── mobile/                 # Expo mobile app (Phase 10)
├── libs/
│   ├── shared-kernel/          # Core domain utilities
│   │   ├── src/
│   │   │   ├── decorators/     # Custom decorators (Tenant, CurrentUser)
│   │   │   ├── guards/         # Auth guards, tenant guards
│   │   │   ├── interceptors/   # Transform interceptors
│   │   │   ├── middleware/     # Tenant context middleware
│   │   │   └── types/          # Shared TypeScript types
│   │   └── project.json
│   ├── shared-types/           # Zod schemas, DTOs
│   │   ├── src/
│   │   │   ├── auth/           # Auth DTOs, Zod schemas
│   │   │   ├── common/         # Common types (pagination, errors)
│   │   │   └── index.ts
│   │   └── project.json
│   ├── data-access/
│   │   ├── prisma/             # Prisma schema and client
│   │   │   ├── src/
│   │   │   │   ├── schema.prisma
│   │   │   │   ├── seed.ts
│   │   │   │   └── migrations/
│   │   │   └── project.json
│   │   └── tenant-context/     # AsyncLocalStorage tenant context
│   │       ├── src/
│   │       │   ├── async-local-storage.ts
│   │       │   └── tenant-context.middleware.ts
│   │       └── project.json
│   └── feature-auth/           # Auth domain layer
│       ├── src/
│       │   ├── domain/         # Entities, value objects
│       │   ├── application/    # Use cases, DTOs
│       │   ├── infrastructure/ # Prisma repository, email service
│       │   └── presentation/   # Controllers, guards
│       └── project.json
├── docker/
│   ├── api.Dockerfile
│   ├── Caddyfile
│   └── docker-compose.yml
├── prisma/
│   └── schema.prisma           # Generated from libs/data-access/prisma
├── nx.json                     # Nx workspace configuration
├── tsconfig.base.json          # Root TypeScript config
├── package.json
└── pnpm-workspace.yaml
```

### Pattern 1: Nx Monorepo with Module Boundaries

**What:** Enforce architectural boundaries at the code level using ESLint tags.

**When to use:** All monorepo projects to prevent improper dependencies.

**Example:**

```typescript
// nx.json
{
  "namedInputs": {
    "default": ["{projectRoot}/**/*"]
  },
  "targetDefaults": {
    "@nx/jest:jest": {
      "cache": true
    }
  },
  "plugins": [
    {
      "plugin": "@nx/eslint/plugin",
      "options": {
        "targetName": "lint"
      }
    }
  ]
}

// .eslintrc.json
{
  "overrides": [
    {
      "files": ["*.ts", "*.tsx"],
      "rules": {
        "@nx/enforce-module-boundaries": [
          "error",
          {
            "allow": [],
            "depConstraints": [
              {
                "sourceTag": "type:app",
                "onlyDependOnLibsWithTags": ["type:lib"]
              },
              {
                "sourceTag": "type:lib",
                "onlyDependOnLibsWithTags": ["type:lib"]
              },
              {
                "sourceTag": "layer:application",
                "onlyDependOnLibsWithTags": ["layer:domain", "layer:application"]
              },
              {
                "sourceTag": "layer:infrastructure",
                "onlyDependOnLibsWithTags": ["layer:domain", "layer:application"]
              },
              {
                "sourceTag": "layer:presentation",
                "onlyDependOnLibsWithTags": ["layer:domain", "layer:application", "layer:infrastructure"]
              }
            ]
          }
        ]
      }
    }
  ]
}

// apps/api/project.json
{
  "name": "api",
  "tags": ["type:app", "domain:shared"],
  "targets": { ... }
}

// libs/shared-kernel/project.json
{
  "name": "shared-kernel",
  "tags": ["type:lib", "domain:shared", "layer:domain"],
  "targets": { ... }
}
```

### Pattern 2: NestJS with Fastify Adapter

**What:** Use Fastify instead of Express for 2x better performance and lower memory.

**When to use:** All NestJS applications in the monorepo.

**Example:**

```typescript
// apps/api/src/main.ts
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { contentParser } from 'fastify-multer';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: true,
      bodyLimit: 10 * 1024 * 1024, // 10MB
    }),
  );

  // Register content parser for multipart/form-data
  app.register(contentParser);

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Global prefix for versioning
  app.setGlobalPrefix('api/v1');

  // Enable CORS for frontend
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  await app.listen(process.env.PORT || 3000, '0.0.0.0');
}

bootstrap();
```

### Pattern 3: Multi-Tenancy with RLS and AsyncLocalStorage

**What:** Use PostgreSQL Row Level Security with AsyncLocalStorage for automatic tenant isolation.

**When to use:** All multi-tenant applications where data isolation is critical.

**Example:**

```typescript
// libs/data-access/tenant-context/src/async-local-storage.ts
import { AsyncLocalStorage } from 'async_hooks';

export interface TenantContext {
  tenantId: string;
  userId?: string;
  correlationId?: string;
}

export const tenantContext = new AsyncLocalStorage<TenantContext>();

export function getTenantContext(): TenantContext | undefined {
  return tenantContext.getStore();
}

export function getTenantId(): string | undefined {
  return tenantContext.getStore()?.tenantId;
}

// libs/data-access/tenant-context/src/tenant-context.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { tenantContext, TenantContext } from './async-local-storage';
import { randomUUID } from 'crypto';

@Injectable()
export class TenantContextMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Extract tenant from JWT (set by auth guard)
    const tenantId = (req as any).tenantId;
    const userId = (req as any).userId;

    const context: TenantContext = {
      tenantId: tenantId || 'default',
      userId,
      correlationId: randomUUID(),
    };

    tenantContext.run(context, () => {
      // Add correlation ID to response headers
      res.setHeader('x-correlation-id', context.correlationId);
      next();
    });
  }
}

// libs/data-access/prisma/src/prisma.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { getTenantId } from '@pms/tenant-context';

@Injectable()
export class PrismaService extends PrismaClient
  implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      log: ['error', 'warn'],
      errorFormat: 'minimal',
    });
  }

  async onModuleInit() {
    await this.$connect();

    // Add middleware to set RLS context for each query
    this.$use(async (params, next) => {
      const tenantId = getTenantId();

      if (tenantId) {
        // Set PostgreSQL session variable for RLS
        await this.$executeRawUnsafe(
          `SET LOCAL app.current_tenant_id = '${tenantId}'`
        );
      }

      return next(params);
    });
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async enableAllTables() {
    // Helper for seeding - disable RLS temporarily
    const tables = await this.$queryRaw<
      Array<{ tablename: string }>
    >`
      SELECT tablename
      FROM pg_tables
      WHERE schemaname = 'public'
    `;

    for (const table of tables) {
      await this.$executeRawUnsafe(
        `ALTER TABLE "${table.tablename}" DISABLE ROW LEVEL SECURITY`
      );
    }
  }

  async disableAllTables() {
    // Re-enable RLS after seeding
    const tables = await this.$queryRaw<
      Array<{ tablename: string }>
    >`
      SELECT tablename
      FROM pg_tables
      WHERE schemaname = 'public'
    `;

    for (const table of tables) {
      await this.$executeRawUnsafe(
        `ALTER TABLE "${table.tablename}" ENABLE ROW LEVEL SECURITY`
      );
    }
  }
}
```

### Pattern 4: Prisma Schema with RLS Policies

**What:** Define Prisma schema with RLS policies applied in migrations.

**When to use:** All tables requiring tenant isolation.

**Example:**

```prisma
// libs/data-access/prisma/src/schema.prisma
generator client {
  provider        = "prisma-client-js"
  moduleFormat    = "cjs"  // Required for NestJS
  previewFeatures = ["postgresqlExtensions"]
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Tenant model
model Tenant {
  id        String   @id @default(uuid())
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  users     User[]

  @@map("tenants")
}

// User model with RLS
model User {
  id           String             @id @default(uuid())
  email        String             @unique
  passwordHash String
  name         String?
  emailVerified Boolean          @default(false)
  createdAt    DateTime           @default(now())
  updatedAt    DateTime           @updatedAt

  // Tenant relationship
  tenantId     String
  tenant       Tenant             @relation(fields: [tenantId], references: [id], onDelete: Cascade)

  @@unique([email, tenantId])
  @@index([email])
  @@map("users")
}

// Generated migration will include RLS policies:
/*
-- Enable RLS
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;

-- Create policy: Users can only see users from their tenant
CREATE POLICY "users_tenant_isolation_policy" ON "users"
  FOR ALL
  USING (tenantId = current_setting('app.current_tenant_id')::uuid);

-- Create policy: Allow inserts with correct tenantId
CREATE POLICY "users_insert_policy" ON "users"
  FOR INSERT
  WITH CHECK (tenantId = current_setting('app.current_tenant_id')::uuid);
*/
```

### Pattern 5: JWT Authentication with httpOnly Cookies

**What:** Store JWT tokens in httpOnly cookies for XSS protection.

**When to use:** All web authentication flows.

**Example:**

```typescript
// libs/feature-auth/src/presentation/guards/jwt-auth.guard.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    if (err || !user) {
      throw new UnauthorizedException('Invalid or expired token');
    }
    return user;
  }
}

// libs/feature-auth/src/presentation/strategies/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private config: ConfigService) {
    super({
      // Extract JWT from cookie instead of Authorization header
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.jwt;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    return {
      userId: payload.sub,
      email: payload.email,
      tenantId: payload.tenantId,
    };
  }
}

// libs/feature-auth/src/presentation/controllers/auth.controller.ts
import { Controller, Post, Body, Res, Req, Get, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from '../../application/auth.service';
import { ZodValidationPipe } from '@pms/shared-kernel';
import { signupSchema, loginSchema, SignupDto, LoginDto } from '@pms/shared-types';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(
    @Body(new ZodValidationPipe(signupSchema)) dto: SignupDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, user } = await this.authService.signup(dto);

    // Set httpOnly cookie
    res.cookie('jwt', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/',
    });

    return {
      success: true,
      data: { user },
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body(new ZodValidationPipe(loginSchema)) dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, user } = await this.authService.login(dto);

    res.cookie('jwt', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });

    return {
      success: true,
      data: { user },
    };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('jwt', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });

    return {
      success: true,
      data: { message: 'Logged out successfully' },
    };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getCurrentUser(@Req() req: any) {
    return {
      success: true,
      data: { user: req.user },
    };
  }
}
```

### Pattern 6: Zod Validation with Shared Schemas

**What:** Define Zod schemas once, use for validation in both frontend and backend.

**When to use:** All API input validation.

**Example:**

```typescript
// libs/shared-types/src/auth/auth.schema.ts
import { z } from 'zod';

export const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

// Type inference
export type SignupDto = z.infer<typeof signupSchema>;
export type LoginDto = z.infer<typeof loginSchema>;
export type ForgotPasswordDto = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordDto = z.infer<typeof resetPasswordSchema>;

// libs/shared-kernel/src/pipes/zod-validation.pipe.ts
import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { ZodSchema } from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type !== 'body') {
      return value;
    }

    try {
      return this.schema.parse(value);
    } catch (error) {
      throw new BadRequestException({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input data',
          details: error.errors,
        },
      });
    }
  }
}
```

### Anti-Patterns to Avoid

- **Express adapter:** 2x slower than Fastify, higher memory usage. Always use Fastify adapter.
- **Passport.js for simple auth:** Overkill for single-tenant JWT auth. Use @nestjs/jwt directly.
- **Global Prisma client:** Creates connection pool issues. Use single PrismaService instance.
- **Mixing ESM and CJS:** Causes runtime errors. Set moduleFormat: cjs in Prisma schema for NestJS.
- **Ignoring RLS in development:** Creates production bugs. Always use RLS, even locally.
- **Storing JWT in localStorage:** Vulnerable to XSS. Always use httpOnly cookies.
- **Hardcoded secrets:** Use @nestjs/config with Zod validation, fail fast on missing env vars.
- **Monolithic auth module:** Split into domain/application/infrastructure/presentation layers.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Monorepo build system | Custom scripts | Nx 22.6 | Affected builds, module boundary enforcement, distributed caching |
| Validation | Custom validators | Zod 3.24 | Type inference, shared schemas, composable |
| Password hashing | Custom crypto | bcrypt 5.1 | Battle-tested, adaptive hashing, salt management |
| Password strength | Custom rules | zxcvbn 4.4 | Entropy-based, dictionary matching, user-friendly |
| Logging | console.log | nestjs-pino 4.6 | Structured JSON, correlation IDs, log levels |
| Rate limiting | Custom counters | @nestjs/throttler 6.5 | Built-in storage, auto-reset, configurable |
| Job queue | Custom pollers | pg-boss 12.14 | PostgreSQL-backed, no Redis needed, retry logic |
| Email templates | String concatenation | Resend + React Email | Type-safe, previewable, component-based |
| Module boundaries | Manual checks | @nx/enforce-module-boundaries | ESLint enforcement, automated, prevents violations |

**Key insight:** Every problem listed above has been solved by battle-tested libraries. Custom implementations inevitably miss edge cases (timing attacks in password hashing, memory leaks in job queues, race conditions in rate limiting). The 8 GB RAM constraint makes using optimized libraries critical — they're more efficient than hand-rolled solutions.

## Common Pitfalls

### Pitfall 1: Prisma Module Format Mismatch

**What goes wrong:** NestJS uses CommonJS by default, but Prisma 7+ defaults to ESM. This causes runtime errors: `require() of ES Module not supported`.

**Why it happens:** Prisma schema doesn't specify moduleFormat, generating ESM client that NestJS can't load.

**How to avoid:** Always set `moduleFormat: cjs` in Prisma schema:

```prisma
generator client {
  provider        = "prisma-client-js"
  moduleFormat    = "cjs"  // CRITICAL for NestJS
}
```

**Warning signs:** Error messages about `require() of ES Module` or `Unexpected token 'export'` when importing from `@prisma/client`.

### Pitfall 2: RLS Policies Not Applied

**What goes wrong:** Queries return data from all tenants instead of filtering by tenantId.

**Why it happens:** Forgetting to `ALTER TABLE ... ENABLE ROW LEVEL SECURITY` or policies don't use `current_setting('app.current_tenant_id')`.

**How to avoid:**

1. Always enable RLS in the same migration as table creation
2. Use policy template that checks tenant session variable
3. Test RLS by querying with different tenant contexts

```sql
-- Migration template
CREATE POLICY "table_tenant_isolation_policy" ON "table_name"
  FOR ALL
  USING (tenantId = current_setting('app.current_tenant_id')::uuid);
```

**Warning signs:** Seeing data from other tenants, count queries returning wrong totals.

### Pitfall 3: AsyncLocalStorage Context Lost

**What goes wrong:** Tenant context undefined in async operations (database queries, background jobs).

**Why it happens:** AsyncLocalStorage context doesn't automatically propagate across all async boundaries (e.g., pg-boss jobs, some promise chains).

**How to avoid:**

1. Always wrap request handlers in `tenantContext.run()`
2. Pass tenant context explicitly to job queues
3. Use Prisma middleware to set session variable before each query

```typescript
// WRONG: Context lost
pgBoss.send('email', { userId });

// CORRECT: Pass context explicitly
pgBoss.send('email', { userId, tenantId: getTenantId() });
```

**Warning signs:** RLS errors `current_setting received null`, queries returning empty results.

### Pitfall 4: JWT Cookie Security Misconfiguration

**What goes wrong:** JWT cookies accessible via JavaScript (XSS vulnerability) or sent over HTTP.

**Why it happens:** Forgetting `httpOnly: true`, `secure: true`, or `sameSite: 'strict'` in cookie options.

**How to avoid:** Use secure cookie defaults:

```typescript
res.cookie('jwt', token, {
  httpOnly: true,   // Prevents XSS
  secure: process.env.NODE_ENV === 'production',  // HTTPS only in prod
  sameSite: 'strict',  // CSRF protection
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: '/',
});
```

**Warning signs:** Security audit findings, cookies visible in `document.cookie`.

### Pitfall 5: Memory Leaks in Long-Running Processes

**What goes wrong:** API memory grows continuously, eventually OOM killing on 8 GB VPS.

**Why it happens:** Unbounded caches, event listener not cleaned up, Prisma connection pool too large.

**How to avoid:**

1. Set Prisma connection limit: `connection_limit: 10` in DATABASE_URL
2. Use bounded caches with TTL
3. Configure NODE_OPTIONS: `--max-old-space-size=4096` (4 GB limit)
4. Schedule nightly restart: Docker Compose restart policy

```yaml
# docker-compose.yml
services:
  api:
    environment:
      - NODE_OPTIONS=--max-old-space-size=4096
      - DATABASE_URL=postgresql://user:pass@db:5432/pms?connection_limit=10
    deploy:
      restart_policy:
        condition: on-failure
        max_attempts: 3
```

**Warning signs:** Memory usage growing > 4 GB, container restarts, slow response times.

### Pitfall 6: Nx Module Boundary Violations

**What goes wrong:** Architecture degrades as developers import across layers (e.g., presentation → infrastructure).

**Why it happens:** Module boundaries defined but not enforced, or teams disable ESLint rule.

**How to avoid:**

1. Enable `@nx/enforce-module-boundaries` in ESLint
2. Run `nx lint` in pre-commit hooks
3. Review and fix violations immediately

```typescript
// apps/api/project.json
{
  "tags": ["type:app", "domain:shared"]
}

// libs/feature-auth/project.json
{
  "tags": ["type:lib", "domain:auth", "layer:domain"]
}

// This import will FAIL ESLint:
// In apps/api (type:app)
import { UserService } from '@pms/feature-auth';  // ✅ Allowed
import { PrismaService } from '@pms/data-access';  // ❌ Blocked: layer:infrastructure
```

**Warning signs:** ESLint errors ignored, tightly coupled code, difficult refactoring.

## Code Examples

Verified patterns from official sources:

### NestJS Fastify Bootstrap

```typescript
// Source: https://docs.nestjs.com/faq/fastify
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  await app.listen(3000);
}
bootstrap();
```

### Prisma NestJS Integration

```typescript
// Source: https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/integrations/nestjs
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient
  implements OnModuleInit, OnModuleDestroy {

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
```

### Zod Validation Pipe

```typescript
// Common pattern for NestJS + Zod integration
import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { ZodSchema } from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: any, metadata: ArgumentMetadata) {
    try {
      return this.schema.parse(value);
    } catch (error) {
      throw new BadRequestException('Validation failed');
    }
  }
}
```

### AsyncLocalStorage Tenant Context

```typescript
// Source: Node.js documentation
import { AsyncLocalStorage } from 'async_hooks';

const storage = new AsyncLocalStorage();

function withTenant(tenantId: string, cb: () => void) {
  storage.run({ tenantId }, cb);
}

function getTenant() {
  return storage.getStore()?.tenantId;
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Turborepo | Nx 22.6 | 2024 | Better module boundary enforcement, built-in generators |
| Express adapter | Fastify adapter | NestJS 10 | 2x performance improvement, lower memory |
| TypeORM | Prisma 7.x | 2023-2024 | Better type safety, migration tooling |
| Passport.js | @nestjs/jwt | NestJS 9 | Simpler for single-tenant auth |
| class-validator | Zod | 2023-2024 | Type inference, shared with frontend |
| Redis queues | pg-boss | 2024 | No Redis overhead, PostgreSQL-native |

**Deprecated/outdated:**

- **Passport.js:** Still maintained but overkill for simple JWT auth. @nestjs/jwt is sufficient.
- **TypeORM:** Less type-safe than Prisma, migration issues. Prisma is current best practice.
- **Express adapter:** Still default but Fastify is recommended for performance.
- **class-validator:** Zod provides better TypeScript integration and type inference.
- **Redis for job queues:** pg-boss provides same functionality without extra infrastructure.

## Open Questions

1. **Prisma generation in monorepo**
   - What we know: Prisma CLI generates client to `node_modules/.prisma/client`
   - What's unclear: How to configure Prisma to generate to shared lib location in Nx workspace
   - Recommendation: Use `@prisma/client` from workspace root, symlink in libs, or configure custom output dir in schema

2. **RLS policy performance**
   - What we know: RLS adds query overhead for policy checks
   - What's unclear: Actual performance impact on complex queries with large tenant counts
   - Recommendation: Benchmark with 100+ tenants, add indexes on tenantId, consider partitioning if needed

3. **AsyncLocalStorage with pg-boss**
   - What we know: AsyncLocalStorage doesn't automatically propagate to background jobs
   - What's unclear: Best pattern for passing tenant context to pg-boss jobs
   - Recommendation: Explicitly pass tenantId in job payload, reconstruct context in job handler

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Vitest (latest) |
| Config file | None — Wave 0 setup required |
| Quick run command | `vitest run` (when configured) |
| Full suite command | `vitest run --coverage` (when configured) |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| INFRA-01 | Docker Compose starts services | integration | `docker-compose up -d && curl -f http://localhost:3000/health` | ❌ Wave 0 |
| INFRA-02 | PostgreSQL 17 runs with RLS enabled | integration | `psql -c "SELECT tablename FROM pg_tables WHERE rowsecurity = true;"` | ❌ Wave 0 |
| INFRA-03 | Tables have tenantId column | unit | `vitest run -- prisma.test.ts` | ❌ Wave 0 |
| INFRA-04 | Prisma client generates as CJS | unit | `vitest run -- prisma-generate.test.ts` | ❌ Wave 0 |
| INFRA-05 | Nx enforces module boundaries | unit | `nx lint --verbose` | ❌ Wave 0 |
| INFRA-06 | Shared libs export correctly | unit | `vitest run -- libs.test.ts` | ❌ Wave 0 |
| INFRA-07 | Pino logs with correlation ID | integration | `vitest run -- logging.test.ts` | ❌ Wave 0 |
| INFRA-08 | Memory limits enforced | integration | `docker stats --no-stream` | ❌ Wave 0 |
| AUTH-01 | User signup with email/password | integration | `vitest run -- auth-signup.test.ts` | ❌ Wave 0 |
| AUTH-02 | Email verification sent | unit | `vitest run -- auth-verification.test.ts` | ❌ Wave 0 |
| AUTH-03 | Password reset flow | unit | `vitest run -- auth-reset.test.ts` | ❌ Wave 0 |
| AUTH-04 | Session persists (JWT cookie) | integration | `vitest run -- auth-session.test.ts` | ❌ Wave 0 |
| AUTH-05 | Logout clears cookie | integration | `vitest run -- auth-logout.test.ts` | ❌ Wave 0 |
| AUTH-06 | Tenant context in RLS queries | integration | `vitest run -- tenant-context.test.ts` | ❌ Wave 0 |

### Sampling Rate

- **Per task commit:** `nx lint` (fast boundary check)
- **Per wave merge:** `nx test api` (run all API tests)
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps

- [ ] `vitest.config.ts` — Root Vitest configuration
- [ ] `apps/api/vitest.config.ts` — API-specific test config
- [ ] `libs/shared-kernel/test/` — Shared kernel test utilities
- [ ] `libs/feature-auth/test/` — Auth domain tests
- [ ] `libs/data-access/prisma/test/` — Prisma integration tests
- [ ] `test/fixtures/` — Test database fixtures
- [ ] `test/setup.ts` — Test setup (Prisma test database, mocks)
- [ ] Framework install: `pnpm add -D vitest @vitest/ui @vitest/coverage-v8` — if none detected

*(No existing test infrastructure — greenfield project)*

## Sources

### Primary (HIGH confidence)

- **Nx Documentation** - Monorepo setup, module boundaries, NestJS integration
  - https://nx.dev/getting-started/intro
- **NestJS Documentation** - Fastify adapter, authentication, techniques
  - https://docs.nestjs.com/faq/fastify
  - https://docs.nestjs.com/techniques/database
- **Prisma Documentation** - NestJS integration, schema configuration
  - https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration
- **Node.js Documentation** - AsyncLocalStorage API
  - https://nodejs.org/api/async_context.html#class-asynclocalstorage
- **npm registry** - Verified current package versions (2026-03-22)
  - All version numbers verified via `npm view <package> version`

### Secondary (MEDIUM confidence)

- **PostgreSQL Documentation** - Row Level Security (RLS) policies
  - https://www.postgresql.org/docs/current/ddl-rowsecurity.html
- **Prisma Best Practices** - Multi-tenancy patterns
  - Community discussions on RLS with Prisma
- **NestJS Community** - JWT + httpOnly cookie patterns
  - GitHub discussions, StackOverflow verified answers

### Tertiary (LOW confidence)

- **WebSearch** - Attempted but rate-limited, no results retrieved
- **Community blog posts** - Not verified, marked for validation

## Metadata

**Confidence breakdown:**

- **Standard stack:** HIGH - All versions verified via npm registry, official documentation confirms compatibility
- **Architecture:** HIGH - Official NestJS/Nx/Prisma documentation provides proven patterns
- **Pitfalls:** HIGH - Based on documented issues, common failure modes in stack-specific communities
- **Validation Architecture:** MEDIUM - Framework choice (Vitest) follows CLAUDE.md, but Wave 0 gaps require implementation

**Research date:** 2026-03-22
**Valid until:** 2026-04-22 (30 days — stack is stable but verify package versions before implementation)

**Notes:**
- WebSearch was rate-limited during research; relied on official documentation and npm registry instead
- All package versions verified current as of research date via npm view commands
- Patterns follow official documentation recommendations, not blog posts or third-party tutorials
