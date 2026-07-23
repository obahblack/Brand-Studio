import { neon } from '@neondatabase/serverless'
import { config } from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

config({ path: resolve(__dirname, '../.env.local') })

const sql = neon(process.env.DATABASE_URL!)

async function setupDatabase() {
  console.log('Setting up Neon database...')

  try {
    // Enable UUID extension
    await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`
    console.log('✓ UUID extension enabled')

    // Profiles table
    await sql`
      CREATE TABLE IF NOT EXISTS profiles (
        id UUID PRIMARY KEY,
        email TEXT NOT NULL,
        full_name TEXT,
        avatar_url TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `
    console.log('✓ Profiles table created')

    // Brand Kits table
    await sql`
      CREATE TABLE IF NOT EXISTS brand_kits (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
        brand_name TEXT NOT NULL,
        website_url TEXT,
        brand_description TEXT,
        logo_url TEXT,
        brand_analysis JSONB,
        design_system JSONB,
        color_palette JSONB,
        typography JSONB,
        design_tokens JSONB,
        status TEXT DEFAULT 'pending',
        error_message TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `
    console.log('✓ Brand Kits table created')

    // Assets table
    await sql`
      CREATE TABLE IF NOT EXISTS assets (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        brand_kit_id UUID REFERENCES brand_kits(id) ON DELETE CASCADE NOT NULL,
        asset_type TEXT NOT NULL,
        asset_name TEXT NOT NULL,
        file_url TEXT,
        file_type TEXT,
        metadata JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `
    console.log('✓ Assets table created')

    // Create indexes
    await sql`CREATE INDEX IF NOT EXISTS idx_brand_kits_user_id ON brand_kits(user_id)`
    await sql`CREATE INDEX IF NOT EXISTS idx_assets_brand_kit_id ON assets(brand_kit_id)`
    console.log('✓ Indexes created')

    console.log('\nDatabase setup complete!')
  } catch (error) {
    console.error('Error setting up database:', error)
    process.exit(1)
  }
}

setupDatabase()
