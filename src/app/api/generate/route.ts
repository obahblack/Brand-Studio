import { NextResponse } from 'next/server'
import { db } from '@/db'
import { brandKits } from '@/db/schema'
import { scrapeWebsite } from '@/lib/scraper'
import { generateBrandKit } from '@/lib/ai/brand-generator'
import { generateFallbackPalette, generateFallbackDesignSystem, generateFallbackBrandAnalysis } from '@/lib/ai/fallback'
import { generateFallbackColorSystem } from '@/lib/ai/color-system-generator'
import { getSessionFromRequest } from '@/lib/auth-helpers'
import { eq } from 'drizzle-orm'

export const maxDuration = 120

const PRIVATE_IP_RANGES = [
  /^127\./,
  /^10\./,
  /^172\.(1[6-9]|2\d|3[01])\./,
  /^192\.168\./,
  /^0\./,
  /^169\.254\./,
  /^::1$/,
  /^fc00:/,
  /^fe80:/,
]

function sanitizeUrl(url: string): string | null {
  try {
    const trimmed = url.trim()
    if (!trimmed) return null
    const parsed = new URL(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`)
    if (!['http:', 'https:'].includes(parsed.protocol)) return null
    const hostname = parsed.hostname.toLowerCase()
    if (hostname === 'localhost' || hostname === '0.0.0.0') return null
    for (const pattern of PRIVATE_IP_RANGES) {
      if (pattern.test(hostname)) return null
    }
    return parsed.origin + parsed.pathname.replace(/\/+$/, '') || parsed.origin
  } catch {
    return null
  }
}

export async function POST(request: Request) {
  try {
    const sess = await getSessionFromRequest(request)
    if (!sess) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = sess.user.id
    const body = await request.json()
    const { brandName, websiteUrl, brandDescription, logoUrl } = body

    if (!brandName?.trim()) {
      return NextResponse.json({ error: 'Brand name is required' }, { status: 400 })
    }

    const safeUrl = websiteUrl ? sanitizeUrl(websiteUrl) : null
    if (websiteUrl?.trim() && !safeUrl) {
      return NextResponse.json({ error: 'Invalid or disallowed website URL' }, { status: 400 })
    }

    const [brandKit] = await db.insert(brandKits).values({
      userId,
      brandName: brandName.trim(),
      websiteUrl: safeUrl,
      brandDescription: brandDescription?.trim() || null,
      logoUrl: logoUrl || null,
      status: 'processing',
    }).returning({ id: brandKits.id })

    if (!brandKit) {
      return NextResponse.json({ error: 'Failed to create brand kit' }, { status: 500 })
    }

    // Run processing synchronously so Vercel keeps the function alive
    try {
      await processBrandKit(brandKit.id, {
        brandName: brandName.trim(),
        websiteUrl: safeUrl,
        brandDescription: brandDescription?.trim() || null,
        logoUrl: logoUrl || null
      })
    } catch (processError) {
      console.error('Background processing failed:', processError)
      // Ensure project reaches a terminal state even if processing crashes
      try {
        await db.update(brandKits).set({
          brandAnalysis: generateFallbackBrandAnalysis(brandName.trim()),
          designSystem: generateFallbackDesignSystem(brandName.trim()),
          colorPalette: generateFallbackPalette(brandName.trim()),
          colorSystem: generateFallbackColorSystem(brandName.trim()),
          typography: generateFallbackDesignSystem(brandName.trim()).typography,
          designTokens: {
            colors: generateFallbackPalette(brandName.trim()),
            typography: generateFallbackDesignSystem(brandName.trim()).typography,
            spacing: generateFallbackDesignSystem(brandName.trim()).spacing,
            borderRadius: generateFallbackDesignSystem(brandName.trim()).borderRadius,
            shadows: generateFallbackDesignSystem(brandName.trim()).shadows,
          },
          status: 'completed',
          errorMessage: processError instanceof Error ? processError.message : 'Processing failed',
          updatedAt: new Date(),
        }).where(eq(brandKits.id, brandKit.id))
      } catch (fallbackError) {
        console.error('Even fallback update failed:', fallbackError)
      }
    }

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
    colorSystem: result.colorSystem,
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
}
