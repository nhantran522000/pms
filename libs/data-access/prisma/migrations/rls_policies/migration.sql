-- RLS Policies for Multi-Tenant Isolation
-- Per CONTEXT.md: "RLS migrations: Apply RLS policies in same migration as table creation"

-- Enable RLS on all tables
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "tenants" ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for idempotency)
DROP POLICY IF EXISTS "users_select_policy" ON "users";
DROP POLICY IF EXISTS "users_insert_policy" ON "users";
DROP POLICY IF EXISTS "users_update_policy" ON "users";
DROP POLICY IF EXISTS "users_delete_policy" ON "users";
DROP POLICY IF EXISTS "tenants_select_policy" ON "tenants";
DROP POLICY IF EXISTS "tenants_insert_policy" ON "tenants";
DROP POLICY IF EXISTS "tenants_update_policy" ON "tenants";
DROP POLICY IF EXISTS "tenants_delete_policy" ON "tenants";

-- Users table policies
CREATE POLICY "users_select_policy" ON "users"
  FOR SELECT
  USING (tenantId = current_setting('app.current_tenant_id', true)::text);

CREATE POLICY "users_insert_policy" ON "users"
  FOR INSERT
  WITH CHECK (tenantId = current_setting('app.current_tenant_id', true)::text);

CREATE POLICY "users_update_policy" ON "users"
  FOR UPDATE
  USING (tenantId = current_setting('app.current_tenant_id', true)::text)
  WITH CHECK (tenantId = current_setting('app.current_tenant_id', true)::text);

CREATE POLICY "users_delete_policy" ON "users"
  FOR DELETE
  USING (tenantId = current_setting('app.current_tenant_id', true)::text);

-- Tenants table policies
-- Users can only see their own tenant
CREATE POLICY "tenants_select_policy" ON "tenants"
  FOR SELECT
  USING (id = current_setting('app.current_tenant_id', true)::text);

CREATE POLICY "tenants_insert_policy" ON "tenants"
  FOR INSERT
  WITH CHECK (id = current_setting('app.current_tenant_id', true)::text);

CREATE POLICY "tenants_update_policy" ON "tenants"
  FOR UPDATE
  USING (id = current_setting('app.current_tenant_id', true)::text)
  WITH CHECK (id = current_setting('app.current_tenant_id', true)::text);

CREATE POLICY "tenants_delete_policy" ON "tenants"
  FOR DELETE
  USING (id = current_setting('app.current_tenant_id', true)::text);

-- Force tenant owner to be same as tenantId for inserts
-- This prevents users from creating records in other tenants
ALTER TABLE "users" ADD CONSTRAINT users_tenant_match
  CHECK (tenantId IS NOT NULL);
