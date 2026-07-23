import { NextResponse } from 'next/server'
import { db } from '@/db'
import { brandKits } from '@/db/schema'
import { eq, desc } from 'drizzle-orm'
import { getSessionFromRequest } from '@/lib/auth-helpers'

export async function GET(request: Request) {
  try {
    const sess = await getSessionFromRequest(request)
    if (!sess) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const result = await db
      .select()
      .from(brandKits)
      .where(eq(brandKits.userId, sess.user.id))
      .orderBy(desc(brandKits.createdAt))

    return NextResponse.json({ brandKits: result })

  } catch (error) {
    console.error('Error fetching brand kits:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}