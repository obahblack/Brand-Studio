-- Production-safe migration: Fix email_verified column type for Better Auth v1.6+
-- Better Auth expects emailVerified as BOOLEAN, not TIMESTAMP.
--
-- This migration:
-- 1. Converts email_verified from timestamp to boolean (non-null → true, null → false)
-- 2. Adds NOT NULL constraint with default false
-- 3. Is idempotent and safe to run on production
--
-- Run: psql $DATABASE_URL -f drizzle/production/0003_fix_email_verified_boolean.sql

BEGIN;

-- Step 1: Add a temporary boolean column
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "email_verified_tmp" boolean DEFAULT false;

-- Step 2: Migrate data: non-null timestamps become true, nulls become false
UPDATE "user" SET "email_verified_tmp" = CASE WHEN "email_verified" IS NOT NULL THEN true ELSE false END;

-- Step 3: Drop old column
ALTER TABLE "user" DROP COLUMN IF EXISTS "email_verified";

-- Step 4: Rename new column
ALTER TABLE "user" RENAME COLUMN "email_verified_tmp" TO "email_verified";

-- Step 5: Set NOT NULL and default
ALTER TABLE "user" ALTER COLUMN "email_verified" SET NOT NULL;
ALTER TABLE "user" ALTER COLUMN "email_verified" SET DEFAULT false;

COMMIT;
