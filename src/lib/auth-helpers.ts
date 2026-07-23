import { db } from '@/db'
import { session, user } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { createHMAC } from '@better-auth/utils/hmac'

const hmac = createHMAC('SHA-256', 'base64urlnopad')
const secret = process.env.BETTER_AUTH_SECRET!

function parseCookies(cookieHeader: string): Record<string, string> {
  return Object.fromEntries(
    cookieHeader.split(';').map(c => {
      const [key, ...val] = c.trim().split('=')
      return [key, val.join('=')]
    })
  )
}

async function verifySignedCookie(signedValue: string): Promise<string | null> {
  const lastDot = signedValue.lastIndexOf('.')
  if (lastDot === -1) return null
  const value = signedValue.slice(0, lastDot)
  const signature = signedValue.slice(lastDot + 1)
  const valid = await hmac.verify(secret, value, signature)
  return valid ? value : null
}

export async function getSessionFromRequest(request: Request) {
  try {
    const cookieHeader = request.headers.get('cookie') || ''
    if (!cookieHeader) return null
    const cookies = parseCookies(cookieHeader)

    const signedToken = cookies['better-auth.session_token']
    if (!signedToken) {
      console.log('[auth] No session cookie found. Available:', Object.keys(cookies))
      return null
    }

    const decoded = decodeURIComponent(signedToken)
    const token = await verifySignedCookie(decoded)
    if (!token) {
      console.log('[auth] Cookie signature verification failed')
      return null
    }

    const [sessionRow] = await db
      .select()
      .from(session)
      .where(eq(session.token, token))
      .limit(1)

    if (!sessionRow) {
      console.log('[auth] No session found for token')
      return null
    }
    if (new Date(sessionRow.expiresAt) < new Date()) {
      console.log('[auth] Session expired')
      return null
    }

    const [userRow] = await db
      .select()
      .from(user)
      .where(eq(user.id, sessionRow.userId))
      .limit(1)

    if (!userRow) {
      console.log('[auth] No user found for session')
      return null
    }

    return { session: sessionRow, user: userRow }
  } catch (err) {
    console.error('[auth] Error in getSessionFromRequest:', err)
    return null
  }
}
