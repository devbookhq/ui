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

const subdomainMatcher = /^([\w-]+)\.[\w-]+\.([\w-]+)\.[\w-]+$/

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl

  // Get hostname of request (e.g. demo.vercel.pub, demo.localhost:3000)
  const hostname = req.headers.get('host') || 'demo.localhost:3000'

  // Get the pathname of the request (e.g. /, /about, /blog/first-post)
  const path = url.pathname

  const subdomainMatch = subdomainMatcher.exec(hostname)

  if (subdomainMatch) {
    const subdomain = subdomainMatch[1]
    const domain = subdomainMatch[2]
    if (domain !== 'gitpod') {
      return NextResponse.rewrite(
        new URL(`/_sites/${subdomain}${path}`, req.url)
      )
    }
  }
}
