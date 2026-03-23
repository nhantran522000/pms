# Phase 6: Notes & Journal - Research

**Researched:** 2026-03-23
**Domain:** Note-taking with Tiptap rich text editor, PostgreSQL full-text search, mood tracking
**Confidence:** HIGH

## Summary

Phase 6 implements a Notes & Journal module with Tiptap rich text editor, PostgreSQL full-text search, organization features (folders/tags), journaling with mood tracking, and auto-save functionality. This phase builds on the established DDD patterns from previous phases (Habits, Health, Tasks) and introduces Tiptap as the rich text editing solution.

**Primary recommendation:** Use Tiptap 3.20.4 with StarterKit for rich text editing, PostgreSQL tsvector with GIN index for full-text search, and follow the established DDD layering pattern (domain/application/infrastructure/presentation) for the feature module structure.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **Content Storage:** Store Tiptap content as JSONB column to preserve document structure and enable querying
- **No versioning in v1:** Auto-save overwrites content, keep implementation simple
- **100KB JSON limit per note:** Sufficient for long-form content, prevents abuse
- **Search Strategy:** Use PostgreSQL tsvector with GIN index for full-text search
- **English language configuration:** For better stemming in full-text search
- **Search both title and content:** Single index for both fields
- **Single-level folder hierarchy:** Simpler UX, use tags for "sub-folders"
- **Many-to-many junction table for tags:** Flexible, standard pattern
- **Maximum 20 tags per note:** Prevents tag spam
- **One folder per note:** Simpler mental model like file system
- **Separate journal entry entity:** Different use case (daily reflection vs reference)
- **1-5 numeric mood scale with emoji:** Quick visual reference
- **Mood trends via line chart + emoji grid:** For quick scan
- **500ms auto-save debounce:** Per NOTE-08 requirement

### Claude's Discretion
- Follow established DDD patterns from prior phases
- Feature module structure: `libs/feature-notes` with domain/application/infrastructure/presentation layers
- Reuse AI Gateway for potential future summarization features

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| NOTE-01 | User can create notes with title and content | Tiptap useEditor hook with content storage as JSONB |
| NOTE-02 | User can edit and delete their own notes | Standard CRUD operations with tenant isolation |
| NOTE-03 | Notes content uses Tiptap rich text editor | Tiptap 3.20.4 with StarterKit extension |
| NOTE-04 | User can search notes by title and content (full-text search) | PostgreSQL tsvector with GIN index, to_tsquery for search |
| NOTE-05 | User can organize notes with folders and tags | Single-level folders + many-to-many tags junction table |
| NOTE-06 | User can create journal entries with mood indicator | Separate JournalEntry entity with mood 1-5 |
| NOTE-07 | System tracks mood trends over time | Aggregate journal entries by date, line chart + emoji grid |
| NOTE-08 | Notes auto-save with debounce (500ms) | React debounce hook with useEffect trigger |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| @tiptap/react | 3.20.4 | React bindings for Tiptap editor | Official React integration, headless editor |
| @tiptap/pm | 3.20.4 | ProseMirror dependencies | Required for Tiptap functionality |
| @tiptap/starter-kit | 3.20.4 | Common extensions (headings, bold, italic, lists) | Official bundle of essential features |
| @tiptap/extension-placeholder | 3.20.4 | Placeholder text for empty editor | UX enhancement for note creation |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @tiptap/react/menus | 3.20.4 | FloatingMenu, BubbleMenu components | For formatting toolbar UX |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Tiptap | Quill, Slate.js | Tiptap has better React integration, more extensible |
| JSONB storage | HTML storage | JSONB preserves structure, enables querying |
| tsvector | pgvector | tsvector built into PostgreSQL, pgvector requires extension |
| Separate tables | Single table with type discriminator | Separate tables aligns with different use cases |

**Installation:**
```bash
npm install @tiptap/react @tiptap/pm @tiptap/starter-kit @tiptap/extension-placeholder
```

**Version verification:**
```bash
npm view @tiptap/react version  # 3.20.4 (verified 2026-03-23)
npm view @tiptap/starter-kit version  # 3.20.4 (verified 2026-03-23)
```

## Architecture Patterns

### Recommended Project Structure
```
libs/feature-notes/
├── src/
│   ├── domain/
│   │   ├── entities/
│   │   │   ├── note.entity.ts
│   │   │   ├── journal-entry.entity.ts
│   │   │   ├── folder.entity.ts
│   │   │   └── tag.entity.ts
│   │   └── value-objects/
│   │       └── mood.vo.ts
│   ├── application/
│   │   ├── services/
│   │   │   ├── note.service.ts
│   │   │   ├── journal.service.ts
│   │   │   ├── folder.service.ts
│   │   │   ├── tag.service.ts
│   │   │   └── search.service.ts
│   │   └── dto/
│   │       ├── create-note.dto.ts
│   │       ├── update-note.dto.ts
│   │       └── search-notes.dto.ts
│   ├── infrastructure/
│   │   ├── repositories/
│   │   │   ├── note.repository.ts
│   │   │   ├── journal-entry.repository.ts
│   │   │   ├── folder.repository.ts
│   │   │   └── tag.repository.ts
│   │   └── services/
│   │       └── full-text-search.service.ts
│   ├── presentation/
│   │   ├── controllers/
│   │   │   ├── note.controller.ts
│   │   │   ├── journal.controller.ts
│   │   │   └── folder.controller.ts
│   │   └── dto/
│   │       └── note-response.dto.ts
│   ├── notes.module.ts
│   └── index.ts
```

### Pattern 1: Tiptap Editor Integration
**What:** Headless ProseMirror-based editor with React bindings
**When to use:** Rich text content editing for notes
**Example:**
```typescript
// Source: https://tiptap.dev/docs/editor/getting-started/install/react
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'

const TiptapEditor = () => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Start writing your note...',
      }),
    ],
    content: '<p>Hello World!</p>',
    immediatelyRender: false, // Important for SSR
  })

  return <EditorContent editor={editor} />
}
```

### Pattern 2: PostgreSQL Full-Text Search with tsvector
**What:** Preprocessed document storage with GIN index for fast search
**When to use:** Search across title and content fields
**Example:**
```sql
-- Add tsvector column to notes table
ALTER TABLE notes ADD COLUMN search_vector tsvector;

-- Create GIN index for fast search
CREATE INDEX notes_search_vector_idx ON notes USING GIN (search_vector);

-- Trigger to auto-update search_vector
CREATE OR REPLACE FUNCTION notes_search_vector_update() RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', coalesce(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW.content::text, '')), 'B');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER notes_search_vector_trigger
  BEFORE INSERT OR UPDATE ON notes
  FOR EACH ROW EXECUTE FUNCTION notes_search_vector_update();

-- Search query
SELECT * FROM notes
WHERE search_vector @@ to_tsquery('english', 'search & terms')
ORDER BY ts_rank(search_vector, to_tsquery('english', 'search & terms')) DESC;
```

### Pattern 3: Auto-Save with Debounce
**What:** Client-side debounced auto-save to reduce API calls
**When to use:** Note content changes, 500ms debounce per NOTE-08
**Example:**
```typescript
import { useEffect, useState } from 'react'

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => clearTimeout(handler)
  }, [value, delay])

  return debouncedValue
}

// Usage in note component
function NoteEditor() {
  const [content, setContent] = useState(initialContent)
  const debouncedContent = useDebounce(content, 500) // 500ms per NOTE-08

  useEffect(() => {
    if (debouncedContent && debouncedContent !== initialContent) {
      saveNote(debouncedContent)
    }
  }, [debouncedContent])

  return <TiptapEditor content={content} onUpdate={setContent} />
}
```

### Pattern 4: Many-to-Many Tags Junction Table
**What:** Junction table for flexible note-tag relationships
**When to use:** Tags can be applied to multiple notes, notes can have multiple tags
**Example:**
```prisma
model Note {
  id       String    @id @default(cuid())
  tenantId String
  title    String
  content  Json      // Tiptap JSON
  // ...
  tags     NoteTag[]
}

model Tag {
  id    String    @id @default(cuid())
  name  String
  // ...
  notes NoteTag[]
}

model NoteTag {
  noteId String
  tagId  String
  note   Note   @relation(fields: [noteId], references: [id], onDelete: Cascade)
  tag    Tag    @relation(fields: [tagId], references: [id], onDelete: Cascade)

  @@id([noteId, tagId])
  @@map("note_tags")
}
```

### Anti-Patterns to Avoid
- **Storing HTML directly:** Loses document structure, hard to query — use Tiptap JSON instead
- **Client-side search:** Doesn't scale, poor performance — use PostgreSQL tsvector
- **Nested folder hierarchies:** Complex UX, unnecessary for v1 — use single-level + tags
- **Separate versioning table:** Adds complexity, not in scope for v1 — auto-save overwrites
- **Real-time collaboration:** Out of scope for v1, adds significant complexity — defer to v2

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Rich text editor | Custom contenteditable | Tiptap | Handles edge cases, browser differences, ProseMirror battle-tested |
| Full-text search | LIKE/ILIKE queries | PostgreSQL tsvector | Performance, linguistic support, ranking |
| Debounce | Custom setTimeout logic | useDebounce hook pattern | Cleanup, race conditions, React lifecycle |
| Auto-save | Manual interval | Debounced useEffect | Reduces API calls, respects user input flow |

**Key insight:** Tiptap and PostgreSQL full-text search are mature, well-maintained solutions. Custom implementations would introduce bugs and maintenance burden.

## Common Pitfalls

### Pitfall 1: Storing HTML Instead of JSON
**What goes wrong:** Tiptap produces structured JSON that enables querying and reconstruction. Storing HTML loses this structure.
**Why it happens:** Tiptap can output HTML, seems simpler at first.
**How to avoid:** Always store Tiptap's `editor.getJSON()` output in JSONB column, not `editor.getHTML()`.
**Warning signs:** Content cannot be searched or structured queries fail.

### Pitfall 2: Full-Text Search Not Updating
**What goes wrong:** search_vector column not synchronized with content changes.
**Why it happens:** Forgetting to create/update trigger, or manual updates bypass trigger.
**How to avoid:** Always use trigger to update search_vector on INSERT/UPDATE. Test search after content changes.
**Warning signs:** Search returns stale results or misses recent changes.

### Pitfall 3: Too Many API Calls from Auto-Save
**What goes wrong:** Every keystroke triggers API call, overwhelms server.
**Why it happens:** Missing debounce or delay too short.
**How to avoid:** Use 500ms debounce per NOTE-08 requirement. Test rapid typing scenario.
**Warning signs:** Network tab shows excessive requests, server CPU spikes.

### Pitfall 4: Tenant Isolation Breach
**What goes wrong:** User can access notes from other tenants.
**Why it happens:** Forgetting to filter by tenantId in queries.
**How to avoid:** Always include tenantId in WHERE clauses. Use Prisma middleware for RLS enforcement.
**Warning signs:** Cross-tenant data appears in search results.

### Pitfall 5: JSONB Size Limit Exceeded
**What goes wrong:** Note content exceeds 100KB, storage/performance issues.
**Why it happens:** No validation on content size.
**How to avoid:** Validate JSONB size before save. Enforce 100KB limit per CONTEXT.md decision.
**Warning signs:** Slow queries, storage bloat, errors on large content.

## Code Examples

Verified patterns from official sources:

### Tiptap Editor Setup
```typescript
// Source: https://tiptap.dev/docs/editor/getting-started/install/react
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'

export function NoteEditor() {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        bulletList: {},
        orderedList: {},
        blockquote: {},
        codeBlock: {},
      }),
      Placeholder.configure({
        placeholder: 'Start writing your note...',
        emptyEditorClass: 'is-editor-empty',
      }),
    ],
    content: '<p>Hello World!</p>',
    immediatelyRender: false, // SSR-safe
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none',
      },
    },
  })

  if (!editor) {
    return null
  }

  return <EditorContent editor={editor} />
}
```

### Debounced Auto-Save Hook
```typescript
// Source: Standard React pattern
import { useEffect, useState, useRef } from 'react'

export function useAutoSave<T>(
  data: T,
  saveFn: (data: T) => Promise<void>,
  delay: number = 500,
) {
  const [isSaving, setIsSaving] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout>()
  const previousDataRef = useRef<T>(data)

  useEffect(() => {
    // Skip if data hasn't changed
    if (data === previousDataRef.current) {
      return
    }

    previousDataRef.current = data

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Set new timeout
    timeoutRef.current = setTimeout(async () => {
      setIsSaving(true)
      try {
        await saveFn(data)
      } finally {
        setIsSaving(false)
      }
    }, delay)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [data, saveFn, delay])

  return { isSaving }
}
```

### PostgreSQL Full-Text Search Query
```sql
-- Source: PostgreSQL documentation https://www.postgresql.org/docs/current/textsearch-intro.html
-- Search with ranking
SELECT
  id,
  title,
  ts_rank(search_vector, to_tsquery('english', 'search & terms')) AS rank
FROM notes
WHERE search_vector @@ to_tsquery('english', 'search & terms')
  AND tenantId = current_setting('app.current_tenant_id')::text
ORDER BY rank DESC;

-- Phrase search with proximity
SELECT * FROM notes
WHERE search_vector @@ phraseto_tsquery('english', 'exact phrase match');

-- Search with OR logic
SELECT * FROM notes
WHERE search_vector @@ to_tsquery('english', 'term1 | term2');
```

### Prisma Full-Text Search
```typescript
// Source: Prisma fullTextSearch preview feature
const results = await prisma.$queryRaw`
  SELECT id, title, content
  FROM notes
  WHERE search_vector @@ to_tsquery('english', ${searchQuery})
    AND "tenantId" = ${tenantId}
  ORDER BY ts_rank(search_vector, to_tsquery('english', ${searchQuery})) DESC
  LIMIT 20
`
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| ContentEditable | Tiptap/ProseMirror | 2020+ | Reliable rich text, extensible |
| LIKE/ILIKE search | PostgreSQL tsvector | PostgreSQL 8.3+ | Fast, linguistic support |
| Manual save interval | Debounced auto-save | Modern React UX | Better UX, fewer API calls |
| Nested folders | Single-level + tags | Current trend | Simpler mental model |

**Deprecated/outdated:**
- **WYSIWYG editors (TinyMCE, CKEditor):** Heavy, hard to customize — Tiptap headless approach preferred
- **Client-side search libraries (Lunr.js, FlexSearch):** Unnecessary with PostgreSQL tsvector
- **Manual debounce implementations:** React hooks pattern is cleaner, more maintainable

## Open Questions

None — all technical decisions are clear from CONTEXT.md and official documentation.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Jest (via Nx) |
| Config file | None detected — likely using Nx defaults |
| Quick run command | `nx test feature-notes` |
| Full suite command | `nx run-many --target=test --all` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| NOTE-01 | Create notes with title and content | integration | `nx test feature-notes --testFile=note.service.spec` | ❌ Wave 0 |
| NOTE-02 | Edit and delete notes | integration | `nx test feature-notes --testFile=note.service.spec` | ❌ Wave 0 |
| NOTE-03 | Tiptap rich text editor | unit | `nx test feature-notes --testFile=note-editor.component.spec` | ❌ Wave 0 |
| NOTE-04 | Full-text search | integration | `nx test feature-notes --testFile=search.service.spec` | ❌ Wave 0 |
| NOTE-05 | Folders and tags organization | integration | `nx test feature-notes --testFile=folder.service.spec` | ❌ Wave 0 |
| NOTE-06 | Journal entries with mood | integration | `nx test feature-notes --testFile=journal.service.spec` | ❌ Wave 0 |
| NOTE-07 | Mood trends over time | unit | `nx test feature-notes --testFile=mood-trends.service.spec` | ❌ Wave 0 |
| NOTE-08 | Auto-save with 500ms debounce | unit | `nx test feature-notes --testFile=auto-save.hook.spec` | ❌ Wave 0 |

### Sampling Rate
- **Per task commit:** `nx test feature-notes`
- **Per wave merge:** `nx run-many --target=test --all`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `libs/feature-notes/src/application/services/note.service.spec.ts` — covers NOTE-01, NOTE-02
- [ ] `libs/feature-notes/src/infrastructure/services/full-text-search.service.spec.ts` — covers NOTE-04
- [ ] `libs/feature-notes/src/application/services/journal.service.spec.ts` — covers NOTE-06, NOTE-07
- [ ] `libs/feature-notes/src/presentation/hooks/use-auto-save.spec.ts` — covers NOTE-08
- [ ] Test framework setup: Ensure Jest is configured for the feature-notes lib

## Sources

### Primary (HIGH confidence)
- [Tiptap React Documentation](https://tiptap.dev/docs/editor/getting-started/install/react) - Verified 2026-03-23
- [PostgreSQL Full Text Search Documentation](https://www.postgresql.org/docs/current/textsearch-intro.html) - Verified 2026-03-23
- [Project CONTEXT.md](.planning/phases/06-notes-journal/06-CONTEXT.md) - User decisions
- [Project Prisma Schema](libs/data-access/prisma/schema.prisma) - Existing patterns
- [Feature Habits Module](libs/feature-habits/src/habits.module.ts) - DDD pattern reference

### Secondary (MEDIUM confidence)
- [Tiptap GitHub Repository](https://github.com/ueberdauth/tiptap) - Active maintenance, 45k+ stars
- [PostgreSQL GIN Index Documentation](https://www.postgresql.org/docs/current/indexes-types.html#INDEXES-TYPES-GIN) - Index strategy

### Tertiary (LOW confidence)
- None — all research based on official documentation and project context

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Official Tiptap docs, verified versions
- Architecture: HIGH - Established DDD patterns in codebase, PostgreSQL docs
- Pitfalls: HIGH - Common issues documented in community, project experience

**Research date:** 2026-03-23
**Valid until:** 2026-04-23 (30 days - Tiptap and PostgreSQL are stable)
