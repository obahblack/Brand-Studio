import { NextResponse } from 'next/server'
import { db } from '@/db'
import { assets, brandKits } from '@/db/schema'
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

    const [brandKit] = await db
      .select({ id: brandKits.id })
      .from(brandKits)
      .where(and(eq(brandKits.id, id), eq(brandKits.userId, sess.user.id)))
      .limit(1)

    if (!brandKit) {
      return NextResponse.json({ error: 'Brand kit not found' }, { status: 404 })
    }

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
