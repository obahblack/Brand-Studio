// Run: npx tsx scripts/migrate-email-verified.ts
import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(process.cwd(), ".env.local") });
import { neon } from "@neondatabase/serverless";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("DATABASE_URL not set");
    process.exit(1);
  }

  const sql = neon(url);

  console.log("Checking current column type...");
  const cols = await sql`
    SELECT column_name, data_type, is_nullable, column_default
    FROM information_schema.columns
    WHERE table_name = 'user' AND column_name = 'email_verified'
  `;

  if (cols.length === 0) {
    console.error("email_verified column not found in user table!");
    process.exit(1);
  }

  const col = cols[0];
  console.log(`Current: type=${col.data_type}, nullable=${col.is_nullable}, default=${col.column_default}`);

  if (col.data_type === "boolean") {
    console.log("Already boolean — no migration needed.");
    process.exit(0);
  }

  console.log("Migrating email_verified from timestamp to boolean...");

  await sql`BEGIN`;
  try {
    await sql`ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "email_verified_tmp" boolean DEFAULT false`;
    await sql`UPDATE "user" SET "email_verified_tmp" = CASE WHEN "email_verified" IS NOT NULL THEN true ELSE false END`;
    await sql`ALTER TABLE "user" DROP COLUMN IF EXISTS "email_verified"`;
    await sql`ALTER TABLE "user" RENAME COLUMN "email_verified_tmp" TO "email_verified"`;
    await sql`ALTER TABLE "user" ALTER COLUMN "email_verified" SET NOT NULL`;
    await sql`ALTER TABLE "user" ALTER COLUMN "email_verified" SET DEFAULT false`;
    await sql`COMMIT`;
    console.log("Migration complete.");
  } catch (err) {
    await sql`ROLLBACK`;
    console.error("Migration failed, rolled back:", err);
    process.exit(1);
  }

  const after = await sql`
    SELECT column_name, data_type, is_nullable, column_default
    FROM information_schema.columns
    WHERE table_name = 'user' AND column_name = 'email_verified'
  `;
  console.log(`After: type=${after[0].data_type}, nullable=${after[0].is_nullable}, default=${after[0].column_default}`);

  process.exit(0);
}

main();
