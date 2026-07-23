import { NextResponse } from 'next/server'
import { db } from '@/db'
import { brandKits, assets } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { renderAllTemplates } from '@/lib/generators/templates/template-renderer'
import { getSessionFromRequest } from '@/lib/auth-helpers'
import type { DesignSystem } from '@/types/database'

const platformToTemplate: Record<string, string> = {
  instagram: 'instagram-post',
  x: 'twitter-card',
  facebook: 'facebook-post',
  linkedin: 'linkedin-post',
  tiktok: 'tiktok-post',
  youtube: 'youtube-thumbnail',
  snapchat: 'instagram-post',
  reddit: 'twitter-card',
  discord: 'twitter-card',
  telegram: 'twitter-card',
  whatsapp: 'instagram-post',
  mastodon: 'twitter-card',
  bluesky: 'twitter-card',
  twitch: 'youtube-thumbnail',
  medium: 'twitter-card',
  substack: 'twitter-card',
}

export async function POST(request: Request) {
  try {
    const sess = await getSessionFromRequest(request)
    
    if (!sess) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { brandKitId, platforms, campaignName, description } = body

    if (!brandKitId) {
      return NextResponse.json(
        { error: 'Brand kit ID is required' },
        { status: 400 }
      )
    }

    if (!platforms || !Array.isArray(platforms) || platforms.length === 0) {
      return NextResponse.json(
        { error: 'At least one platform is required' },
        { status: 400 }
      )
    }

    const [brandKit] = await db
      .select()
      .from(brandKits)
      .where(eq(brandKits.id, brandKitId))
      .limit(1)

    if (!brandKit) {
      return NextResponse.json(
        { error: 'Brand kit not found' },
        { status: 404 }
      )
    }

    if (!brandKit.designSystem) {
      return NextResponse.json(
        { error: 'Brand kit must be completed before generating assets' },
        { status: 400 }
      )
    }

    const templateNames = platforms
      .map((p: string) => platformToTemplate[p])
      .filter(Boolean)

    if (templateNames.length === 0) {
      return NextResponse.json(
        { error: 'No valid platforms selected' },
        { status: 400 }
      )
    }

    generateAssets(brandKitId, brandKit.designSystem as DesignSystem, brandKit.brandName, brandKit.websiteUrl, templateNames, campaignName, description).catch(console.error)

    return NextResponse.json({ 
      message: 'Asset generation started',
      platforms: templateNames
    })

  } catch (error) {
    console.error('Error in generate assets API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function generateAssets(
  brandKitId: string,
  designSystem: DesignSystem,
  brandName: string,
  websiteUrl: string | null,
  templateNames: string[],
  campaignName?: string,
  description?: string
) {
  try {
    const results = await renderAllTemplates(designSystem, brandName, templateNames, description, websiteUrl || undefined)

    for (const [templateType, buffer] of results) {
      const fileName = `${templateType}.png`
      const base64 = buffer.toString('base64')

      const [asset] = await db.insert(assets).values({
        brandKitId,
        assetType: templateType,
        assetName: fileName,
        fileType: 'image/png',
        fileData: base64,
        metadata: {
          campaign: campaignName || 'Untitled',
          template: templateType,
          description: description || '',
          width: getTemplateWidth(templateType),
          height: getTemplateHeight(templateType)
        }
      }).returning({ id: assets.id })

      await db.update(assets).set({ fileUrl: `/api/serve/${asset.id}` }).where(eq(assets.id, asset.id))
    }

    console.log(`Assets generated for brand kit ${brandKitId}: ${templateNames.join(', ')}`)

  } catch (error) {
    console.error('Error generating assets:', error)
  }
}

function getTemplateWidth(template: string): number {
  const widths: Record<string, number> = {
    'linkedin-post': 1200,
    'instagram-post': 1080,
    'instagram-story': 1080,
    'twitter-card': 1200,
    'youtube-thumbnail': 1280,
    'facebook-post': 1200,
    'tiktok-post': 1080,
  }
  return widths[template] || 1200
}

function getTemplateHeight(template: string): number {
  const heights: Record<string, number> = {
    'linkedin-post': 627,
    'instagram-post': 1080,
    'instagram-story': 1920,
    'twitter-card': 675,
    'youtube-thumbnail': 720,
    'facebook-post': 630,
    'tiktok-post': 1080,
  }
  return heights[template] || 630
}
