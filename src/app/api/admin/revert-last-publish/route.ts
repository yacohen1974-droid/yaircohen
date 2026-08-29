import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { revertToPreviousPublish, SITE_CONTENT_CACHE_TAG } from '@/firebase/db-actions';
import { requireAdmin } from '@/lib/verify-admin';

export async function POST(request: Request) {
  try {
    if (!(await requireAdmin(request))) {
      return NextResponse.json({ success: false, error: 'לא מורשה' }, { status: 401 });
    }

    const result = await revertToPreviousPublish();
    revalidateTag(SITE_CONTENT_CACHE_TAG);
    return NextResponse.json({ success: true, ...result });
  } catch (error: any) {
    console.error('Error reverting to previous publish:', error);
    return NextResponse.json({ success: false, error: error.message || 'שחזור הגרסה נכשל' }, { status: 500 });
  }
}
