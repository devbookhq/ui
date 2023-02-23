import { NextRequest, NextResponse } from 'next/server'

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /examples (inside /public)
     * 4. all root files inside /public (e.g. /favicon.ico)
     */
    '/((?!api/|_next/|_static/|examples/|[\\w-]+\\.\\w+).*)',
  ],
}

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl

  // Get the pathname of the request (e.g. /, /about, /blog/first-post)
  const path = url.pathname

  if (path === '/') {
    return NextResponse.rewrite(
      new URL('/projects', req.url)
    )
  }
}
