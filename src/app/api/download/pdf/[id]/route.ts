import { NextResponse } from 'next/server'
import { db } from '@/db'
import { brandKits } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { generateBrandGuidelinesPDF } from '@/lib/generators/pdf/brand-guidelines'
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

    const pdf = await generateBrandGuidelinesPDF({
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

    return new NextResponse(new Uint8Array(pdf), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${brandKit.brandName}-Guidelines.pdf"`
      }
    })

  } catch (error) {
    console.error('Error generating PDF:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}