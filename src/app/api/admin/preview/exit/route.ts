import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const res = NextResponse.redirect(new URL('/', request.url));
  res.cookies.set('cms_preview', '', { path: '/', maxAge: 0 });
  return res;
}
