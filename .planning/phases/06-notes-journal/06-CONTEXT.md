# Phase 6: Notes & Journal - Context

**Gathered:** 2026-03-23
**Status:** Ready for planning

<domain>
## Phase Boundary

Note-taking with Tiptap rich text editor, search, organization, journaling, mood tracking, and auto-save. This phase delivers the Notes & Journal Module that users interact with for personal note management and daily journaling.

</domain>

<decisions>
## Implementation Decisions

### Content Storage
- Store Tiptap content as JSONB column to preserve document structure and enable querying
- No versioning in v1 — auto-save overwrites content, keep implementation simple
- 100KB JSON limit per note — sufficient for long-form content, prevents abuse

### Search Strategy
- Use PostgreSQL tsvector with GIN index for full-text search
- English language configuration for better stemming
- Search both title and content in single index

### Organization Model
- Single-level folder hierarchy — simpler UX, use tags for "sub-folders"
- Many-to-many junction table for tags — flexible, standard pattern
- Maximum 20 tags per note — prevents tag spam
- One folder per note — simpler mental model like file system

### Journal & Mood
- Separate journal entry entity from notes — different use case (daily reflection vs reference)
- 1-5 numeric mood scale with emoji for quick visual reference
- Mood trends via line chart + emoji grid for quick scan
- 500ms auto-save debounce per NOTE-08 requirement

### Claude's Discretion
- Follow established DDD patterns from prior phases
- Feature module structure: `libs/feature-notes` with domain/application/infrastructure/presentation layers
- Reuse AI Gateway for potential future summarization features

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `libs/shared-kernel` — Core utilities, guards, interceptors, middleware
- `libs/shared-types` — Zod schemas and DTOs
- `libs/data-access/prisma` — Prisma client with RLS middleware
- `libs/data-access/tenant-context` — AsyncLocalStorage tenant context
- `libs/shared-kernel/src/ai` — AI Gateway for potential note summarization

### Established Patterns
- NestJS 11.1 with Fastify adapter
- Prisma 7.3 with moduleFormat: cjs
- PostgreSQL 17 with RLS
- AsyncLocalStorage for tenant context
- httpOnly cookies for session management
- DDD layers: domain/application/infrastructure/presentation
- Feature module naming: `@pms/feature-*`

### Integration Points
- All notes/journals must include tenantId for RLS
- Prisma middleware handles tenant context injection
- Standard API response format: `{ success, data?, error? }`

</code_context>

<specifics>
## Specific Ideas

- Follow hexagonal architecture pattern for domain purity
- Use Tiptap StarterKit for basic rich text features
- Consider debounced save on client-side, not server-side
- Implement soft deletes for notes (audit trail)
- Cache folder/tag lists for performance

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>
