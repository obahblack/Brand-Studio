import { auth } from '@/lib/auth'

export async function getSessionFromRequest(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    })
    return session
  } catch (err) {
    return null
  }
}
