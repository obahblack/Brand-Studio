-- Fix email_verified column type from boolean to timestamp with time zone
-- Step 1: Add a temporary column with the correct type
ALTER TABLE "user" ADD COLUMN "email_verified_new" timestamp with time zone DEFAULT '1970-01-01T00:00:00Z'::timestamp;

-- Step 2: Copy data (boolean values are lost, defaulting to epoch)
UPDATE "user" SET "email_verified_new" = '1970-01-01T00:00:00Z'::timestamp;

-- Step 3: Drop the old boolean column
ALTER TABLE "user" DROP COLUMN "email_verified";

-- Step 4: Rename the new column
ALTER TABLE "user" RENAME COLUMN "email_verified_new" TO "email_verified";

-- Step 5: Set NOT NULL constraint
ALTER TABLE "user" ALTER COLUMN "email_verified" SET NOT NULL;