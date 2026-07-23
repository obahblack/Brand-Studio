import { NextResponse } from 'next/server'
import { db } from '@/db'
import { brandKits } from '@/db/schema'
import { scrapeWebsite } from '@/lib/scraper'
import { generateBrandKit } from '@/lib/ai/brand-generator'
import { generateFallbackPalette, generateFallbackDesignSystem, generateFallbackBrandAnalysis } from '@/lib/ai/fallback'
import { getSessionFromRequest } from '@/lib/auth-helpers'
import { eq } from 'drizzle-orm'

export async function POST(request: Request) {
  try {
    const sess = await getSessionFromRequest(request)
    
    if (!sess) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const userId = sess.user.id
    const body = await request.json()
    const { brandName, websiteUrl, brandDescription, logoUrl } = body

    if (!brandName?.trim()) {
      return NextResponse.json(
        { error: 'Brand name is required' },
        { status: 400 }
      )
    }

    const [brandKit] = await db.insert(brandKits).values({
      userId,
      brandName: brandName.trim(),
      websiteUrl: websiteUrl?.trim() || null,
      brandDescription: brandDescription?.trim() || null,
      logoUrl: logoUrl || null,
      status: 'processing',
    }).returning({ id: brandKits.id })

    if (!brandKit) {
      return NextResponse.json(
        { error: 'Failed to create brand kit' },
        { status: 500 }
      )
    }

    processBrandKit(brandKit.id, {
      brandName: brandName.trim(),
      websiteUrl: websiteUrl?.trim() || null,
      brandDescription: brandDescription?.trim() || null,
      logoUrl: logoUrl || null
    }).catch(console.error)

    return NextResponse.json({ 
      brandKitId: brandKit.id,
      message: 'Brand kit generation started' 
    })

  } catch (error) {
    console.error('Error in generate API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function processBrandKit(
  brandKitId: string, 
  input: {
    brandName: string
    websiteUrl: string | null
    brandDescription: string | null
    logoUrl: string | null
  }
) {
  try {
    let scrapedData = null

    if (input.websiteUrl) {
      try {
        scrapedData = await scrapeWebsite(input.websiteUrl)
      } catch (scrapeError) {
        console.error('Scraping failed, continuing with description only:', scrapeError)
      }
    }

    const result = await generateBrandKit({
      brandName: input.brandName,
      websiteUrl: input.websiteUrl,
      brandDescription: input.brandDescription,
      scrapedData
    })

    await db.update(brandKits).set({
      brandAnalysis: result.brandAnalysis,
      designSystem: result.designSystem,
      colorPalette: result.designSystem.colors,
      typography: result.designSystem.typography,
      designTokens: {
        colors: result.designSystem.colors,
        typography: result.designSystem.typography,
        spacing: result.designSystem.spacing,
        borderRadius: result.designSystem.borderRadius,
        shadows: result.designSystem.shadows
      },
      status: 'completed',
      updatedAt: new Date(),
    }).where(eq(brandKits.id, brandKitId))

  } catch (error) {
    console.error('Error processing brand kit:', error)

    const fallbackPalette = generateFallbackPalette(input.brandName)
    const fallbackDesignSystem = generateFallbackDesignSystem(input.brandName)
    const fallbackTypography = fallbackDesignSystem.typography
    const fallbackTokens = {
      colors: fallbackPalette,
      typography: fallbackTypography,
      spacing: fallbackDesignSystem.spacing,
      borderRadius: fallbackDesignSystem.borderRadius,
      shadows: fallbackDesignSystem.shadows,
    }

    await db.update(brandKits).set({
      brandAnalysis: generateFallbackBrandAnalysis(input.brandName),
      designSystem: fallbackDesignSystem,
      colorPalette: fallbackPalette,
      typography: fallbackTypography,
      designTokens: fallbackTokens,
      status: 'completed',
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
      updatedAt: new Date(),
    }).where(eq(brandKits.id, brandKitId))
  }
}

