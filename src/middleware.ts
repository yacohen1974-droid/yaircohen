import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import siteData from './content/site-data.json';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isUnderConstruction = !!(siteData as any)?.global?.underConstruction;
  const isAdminRoute = pathname.startsWith('/admin') || pathname.startsWith('/api') || pathname.startsWith('/under-construction');

  console.log("Middleware: pathname =", pathname, "| isUnderConstruction =", isUnderConstruction, "| isAdminRoute =", isAdminRoute);

  if (isUnderConstruction && !isAdminRoute) {
    console.log("Middleware: Rewriting request to /under-construction");
    const response = NextResponse.rewrite(new URL('/under-construction', request.url));
    response.headers.set('x-pathname', '/under-construction');
    return response;
  }

  if (!isUnderConstruction && pathname === '/under-construction') {
    console.log("Middleware: Redirecting /under-construction to / because maintenance is disabled");
    return NextResponse.redirect(new URL('/', request.url));
  }

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
