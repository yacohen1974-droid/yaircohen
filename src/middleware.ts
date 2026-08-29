import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import siteData from './content/site-data.json';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isUnderConstruction = !!(siteData as any)?.global?.underConstruction;
  const isPreview = request.cookies.get('cms_preview')?.value === '1';
  const isAdminRoute = pathname.startsWith('/admin') || pathname.startsWith('/api') || pathname.startsWith('/under-construction') || isPreview;

  if (isUnderConstruction && !isAdminRoute) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-pathname', '/under-construction');
    return NextResponse.rewrite(new URL('/under-construction', request.url), {
      request: { headers: requestHeaders },
    });
  }

  if (!isUnderConstruction && pathname === '/under-construction') {
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
