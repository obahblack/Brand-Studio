import { NextResponse } from 'next/server'
import { db } from '@/db'
import { assets } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const [asset] = await db
      .select()
      .from(assets)
      .where(eq(assets.id, id))
      .limit(1)

    if (!asset || !asset.fileData) {
      return new NextResponse('Not found', { status: 404 })
    }

    const buffer = Buffer.from(asset.fileData, 'base64')
    const contentType = asset.fileType || 'image/png'

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error) {
    console.error('Error serving asset:', error)
    return new NextResponse('Internal server error', { status: 500 })
  }
}
