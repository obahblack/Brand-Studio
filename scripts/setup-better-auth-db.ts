import { neon } from '@neondatabase/serverless'
import { config } from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

config({ path: resolve(__dirname, '../.env.local') })

const sql = neon(process.env.DATABASE_URL!)

async function setupBetterAuthDatabase() {
  console.log('Setting up Better Auth tables in Neon database...')

  try {
    // Drop old tables if they exist
    await sql`DROP TABLE IF EXISTS assets CASCADE`
    await sql`DROP TABLE IF EXISTS brand_kits CASCADE`
    await sql`DROP TABLE IF EXISTS verification CASCADE`
    await sql`DROP TABLE IF EXISTS session CASCADE`
    await sql`DROP TABLE IF EXISTS account CASCADE`
    await sql`DROP TABLE IF EXISTS "user" CASCADE`
    console.log('✓ Dropped old tables')

    // User table (Better Auth)
    await sql`
      CREATE TABLE "user" (
        "id" text PRIMARY KEY,
        "name" text NOT NULL,
        "email" text NOT NULL UNIQUE,
        "email_verified" boolean NOT NULL DEFAULT false,
        "image" text,
        "created_at" timestamp with time zone NOT NULL DEFAULT now(),
        "updated_at" timestamp with time zone NOT NULL DEFAULT now()
      )
    `
    console.log('✓ User table created')

    // Session table (Better Auth)
    await sql`
      CREATE TABLE "session" (
        "id" text PRIMARY KEY,
        "expires_at" timestamp with time zone NOT NULL,
        "token" text NOT NULL UNIQUE,
        "ip_address" text,
        "user_agent" text,
        "user_id" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
        "created_at" timestamp with time zone NOT NULL DEFAULT now(),
        "updated_at" timestamp with time zone NOT NULL DEFAULT now()
      )
    `
    console.log('✓ Session table created')

    // Account table (Better Auth)
    await sql`
      CREATE TABLE "account" (
        "id" text PRIMARY KEY,
        "account_id" text NOT NULL,
        "provider_id" text NOT NULL,
        "user_id" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
        "access_token" text,
        "refresh_token" text,
        "id_token" text,
        "access_token_expires_at" timestamp with time zone,
        "refresh_token_expires_at" timestamp with time zone,
        "scope" text,
        "password" text,
        "created_at" timestamp with time zone NOT NULL DEFAULT now(),
        "updated_at" timestamp with time zone NOT NULL DEFAULT now(),
        UNIQUE("provider_id", "account_id")
      )
    `
    console.log('✓ Account table created')

    // Verification table (Better Auth)
    await sql`
      CREATE TABLE "verification" (
        "id" text PRIMARY KEY,
        "identifier" text NOT NULL,
        "value" text NOT NULL,
        "expires_at" timestamp with time zone NOT NULL,
        "created_at" timestamp with time zone NOT NULL DEFAULT now(),
        "updated_at" timestamp with time zone NOT NULL DEFAULT now()
      )
    `
    console.log('✓ Verification table created')

    // Brand Kits table
    await sql`
      CREATE TABLE "brand_kits" (
        "id" uuid DEFAULT gen_random_uuid() PRIMARY KEY,
        "user_id" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
        "brand_name" text NOT NULL,
        "website_url" text,
        "brand_description" text,
        "logo_url" text,
        "brand_analysis" jsonb,
        "design_system" jsonb,
        "color_palette" jsonb,
        "typography" jsonb,
        "design_tokens" jsonb,
        "status" text DEFAULT 'pending',
        "error_message" text,
        "created_at" timestamp with time zone NOT NULL DEFAULT now(),
        "updated_at" timestamp with time zone NOT NULL DEFAULT now()
      )
    `
    console.log('✓ Brand Kits table created')

    // Assets table
    await sql`
      CREATE TABLE "assets" (
        "id" uuid DEFAULT gen_random_uuid() PRIMARY KEY,
        "brand_kit_id" uuid NOT NULL REFERENCES "brand_kits"("id") ON DELETE CASCADE,
        "asset_type" text NOT NULL,
        "asset_name" text NOT NULL,
        "file_url" text,
        "file_type" text,
        "metadata" jsonb,
        "created_at" timestamp with time zone NOT NULL DEFAULT now()
      )
    `
    console.log('✓ Assets table created')

    // Create indexes
    await sql`CREATE INDEX IF NOT EXISTS "session_token_idx" ON "session"("token")`
    await sql`CREATE INDEX IF NOT EXISTS "session_user_id_idx" ON "session"("user_id")`
    await sql`CREATE INDEX IF NOT EXISTS "account_user_id_idx" ON "account"("user_id")`
    await sql`CREATE INDEX IF NOT EXISTS "brand_kits_user_id_idx" ON "brand_kits"("user_id")`
    await sql`CREATE INDEX IF NOT EXISTS "assets_brand_kit_id_idx" ON "assets"("brand_kit_id")`
    await sql`CREATE INDEX IF NOT EXISTS "verification_identifier_idx" ON "verification"("identifier")`
    console.log('✓ Indexes created')

    // Verify table structure
    const userColumns = await sql`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'user'
      ORDER BY ordinal_position
    `
    console.log('\nUser table columns:')
    for (const col of userColumns) {
      console.log(`  ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable}, default: ${col.column_default})`)
    }

    console.log('\nBetter Auth database setup complete!')
  } catch (error) {
    console.error('Error setting up database:', error)
    process.exit(1)
  }
}

setupBetterAuthDatabase()
