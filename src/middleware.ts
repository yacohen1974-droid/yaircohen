import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Under-construction mode is decided at request time in the root layout
// (which reads live Firestore data) instead of here, since middleware can
// only see data bundled at build time and would otherwise go stale as soon
// as an admin toggles the setting without a full redeploy.
export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', pathname);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - sitemap.xml, robots.txt (search engine files)
     * - public files (images, fonts, etc with extensions)
     */
    '/((?!_next/static|_next/image|favicon\\.ico|sitemap\\.xml|robots\\.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2|ttf|otf)$).*)',
  ],
};
