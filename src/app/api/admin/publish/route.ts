import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { SITE_CONTENT_CACHE_TAG } from '@/firebase/db-actions';
import { publishSiteData } from '@/firebase/firestore-cms';
import { requireAdmin } from '@/lib/verify-admin';

export async function POST(request: Request) {
  try {
    if (!(await requireAdmin(request))) {
      return NextResponse.json({ success: false, error: 'לא מורשה' }, { status: 401 });
    }

    const data = await request.json();

    // Validate request body
    if (!data || typeof data !== 'object') {
      return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 });
    }

    // Publish to Firestore (now the single source of truth)
    await publishSiteData(data);

    // Revalidate Next.js cache to refresh published content on the live site
    revalidateTag(SITE_CONTENT_CACHE_TAG);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error publishing site content:', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to publish site content' }, { status: 500 });
  }
}
