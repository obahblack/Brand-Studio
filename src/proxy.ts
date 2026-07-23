import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const publicRoutes = ['/login', '/signup', '/']

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (publicRoutes.some(route => pathname === route) || pathname.startsWith('/api') || pathname.startsWith('/_next')) {
    return NextResponse.next()
  }

  const cookieHeader = request.headers.get('cookie') || ''
  const hasSessionCookie = cookieHeader.includes('better-auth.session_token')

  if (!hasSessionCookie) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}