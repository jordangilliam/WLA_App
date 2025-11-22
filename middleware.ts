import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { hasRequiredRole, UserRole } from '@/lib/auth/roles'

type RoutePolicy = {
  pattern: RegExp
  requiredRole: UserRole
  redirect?: string
}

const routePolicies: RoutePolicy[] = [
  { pattern: /^\/admin(\/.*)?$/, requiredRole: 'admin' },
  { pattern: /^\/katie-export(\/.*)?$/, requiredRole: 'admin' },
  { pattern: /^\/dashboard\/teacher(\/.*)?$/, requiredRole: 'educator' },
  { pattern: /^\/dashboard\/student(\/.*)?$/, requiredRole: 'student' },
  { pattern: /^\/app\/admin(\/.*)?$/, requiredRole: 'admin' },
  { pattern: /^\/app\/exports(\/.*)?$/, requiredRole: 'educator' },
]

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const policy = routePolicies.find((route) => route.pattern.test(pathname))

  if (!policy) {
    return NextResponse.next()
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  if (!token) {
    const url = req.nextUrl.clone()
    url.pathname = '/auth'
    url.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(url)
  }

  const userRole = (token.role || 'student') as UserRole

  if (!hasRequiredRole(userRole, policy.requiredRole)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/katie-export/:path*',
    '/dashboard/:path*',
    '/app/admin/:path*',
    '/app/exports/:path*',
  ],
}
