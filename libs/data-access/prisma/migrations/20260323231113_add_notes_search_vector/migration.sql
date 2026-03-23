-- Full-Text Search for Notes
-- Per PLAN 06-03: PostgreSQL tsvector with GIN index for fast relevance-ranked search

-- Create GIN index for fast full-text search on the search_vector column
-- Note: search_vector column already exists in schema.prisma as Unsupported("tsvector")
CREATE INDEX IF NOT EXISTS "notes_search_vector_idx" ON "notes" USING GIN ("search_vector");

-- Create trigger function for auto-updating search_vector on INSERT/UPDATE
CREATE OR REPLACE FUNCTION notes_search_vector_update() RETURNS TRIGGER AS $$
BEGIN
  NEW."search_vector" :=
    setweight(to_tsvector('english', coalesce(NEW."title", '')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW."content"::text, '')), 'B');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger on notes table
DROP TRIGGER IF EXISTS notes_search_vector_trigger ON "notes";
CREATE TRIGGER notes_search_vector_trigger
  BEFORE INSERT OR UPDATE ON "notes"
  FOR EACH ROW
  EXECUTE FUNCTION notes_search_vector_update();

-- Update existing notes to populate search_vector
UPDATE "notes"
SET "search_vector" =
  setweight(to_tsvector('english', coalesce("title", '')), 'A') ||
  setweight(to_tsvector('english', coalesce("content"::text, '')), 'B')
WHERE "search_vector" IS NULL OR "deletedAt" IS NULL;
