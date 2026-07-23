import { NextResponse } from 'next/server'
import { db } from '@/db'
import { brandKits, assets } from '@/db/schema'
import { eq, asc } from 'drizzle-orm'
import { getSessionFromRequest } from '@/lib/auth-helpers'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const sess = await getSessionFromRequest(request)
    if (!sess) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const [brandKit] = await db
      .select()
      .from(brandKits)
      .where(eq(brandKits.id, id))
      .limit(1)

    if (!brandKit) {
      return NextResponse.json({ error: 'Brand kit not found' }, { status: 404 })
    }

    const assetList = await db
      .select()
      .from(assets)
      .where(eq(assets.brandKitId, id))
      .orderBy(asc(assets.createdAt))

    return NextResponse.json({ brandKit, assets: assetList })
  } catch (error) {
    console.error('Error fetching brand kit:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const sess = await getSessionFromRequest(request)
    if (!sess) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    await db.delete(brandKits).where(eq(brandKits.id, id))

    return NextResponse.json({ message: 'Brand kit deleted' })
  } catch (error) {
    console.error('Error deleting brand kit:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}