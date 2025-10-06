import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const protectedPrefixes = ['/admin', '/katie-export'];
  const isProtected = protectedPrefixes.some(p => pathname.startsWith(p));
  if (!isProtected) return NextResponse.next();

  // Check NextAuth session cookies (dev/prod names, also for edge)
  const hasSession = req.cookies.has('next-auth.session-token') || req.cookies.has('__Secure-next-auth.session-token');
  if (!hasSession) {
    const url = req.nextUrl.clone();
    url.pathname = '/auth';
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/katie-export'],
};
