import { NextResponse } from 'next/server'
import { db } from '@/db'
import { brandKits } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { generateBrandKitZIP } from '@/lib/download/zip-generator'
import { getSessionFromRequest } from '@/lib/auth-helpers'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const sess = await getSessionFromRequest(request)
    
    if (!sess) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params
    
    const [brandKit] = await db
      .select()
      .from(brandKits)
      .where(eq(brandKits.id, id))
      .limit(1)

    if (!brandKit) {
      return NextResponse.json(
        { error: 'Brand kit not found' },
        { status: 404 }
      )
    }

    const zip = await generateBrandKitZIP({
      ...brandKit,
      user_id: brandKit.userId,
      brand_name: brandKit.brandName,
      website_url: brandKit.websiteUrl,
      brand_description: brandKit.brandDescription,
      logo_url: brandKit.logoUrl,
      brand_analysis: brandKit.brandAnalysis,
      design_system: brandKit.designSystem,
      color_palette: brandKit.colorPalette,
      error_message: brandKit.errorMessage,
      created_at: brandKit.createdAt?.toISOString?.() || brandKit.createdAt,
      updated_at: brandKit.updatedAt?.toISOString?.() || brandKit.updatedAt,
    } as unknown as import('@/types/database').BrandKit)

    return new NextResponse(new Uint8Array(zip), {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${brandKit.brandName}-Brand-Kit.zip"`
      }
    })

  } catch (error) {
    console.error('Error generating ZIP:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}