import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get('path') || '/';
  const target = path.startsWith('/') ? path : `/${path}`;

  const res = NextResponse.redirect(new URL(target, request.url));
  res.cookies.set('cms_preview', '1', {
    path: '/',
    maxAge: 60 * 60 * 24, // 24h
    sameSite: 'lax',
  });
  return res;
}
