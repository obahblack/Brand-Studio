import { NextResponse } from 'next/server'
import { db } from '@/db'
import { assets } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import { getSessionFromRequest } from '@/lib/auth-helpers'

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; assetId: string }> }
) {
  try {
    const sess = await getSessionFromRequest(request)
    if (!sess) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id, assetId } = await params

    const [asset] = await db
      .select()
      .from(assets)
      .where(and(eq(assets.id, assetId), eq(assets.brandKitId, id)))
      .limit(1)

    if (!asset) {
      return NextResponse.json({ error: 'Asset not found' }, { status: 404 })
    }

    await db.delete(assets).where(eq(assets.id, assetId))

    return NextResponse.json({ message: 'Asset deleted' })
  } catch (error) {
    console.error('Error deleting asset:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
