#!/bin/bash
# Apply RLS policies to database
# Usage: ./scripts/apply-rls.sh

set -e

DB_URL="${DATABASE_URL:-postgresql://pms:pms_password@localhost:5432/pms}"

echo "Applying RLS policies..."

psql "$DB_URL" -f libs/data-access/prisma/migrations/rls_policies/migration.sql

echo "RLS policies applied successfully"
