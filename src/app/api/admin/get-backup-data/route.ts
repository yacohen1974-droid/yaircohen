import { NextResponse } from 'next/server';
import { readDraftSiteData, readPublishedSiteData } from '@/firebase/firestore-cms';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Try to load draft first. If no draft exists, fall back to published.
    const draft = await readDraftSiteData();
    const hasDraft = draft && (Object.keys(draft.pages || {}).length > 0 || draft.global);

    if (hasDraft) {
      return NextResponse.json({ success: true, data: draft }, { headers: { 'Cache-Control': 'no-store' } });
    }

    // No draft; use published as base for a new draft
    const published = await readPublishedSiteData();
    return NextResponse.json({ success: true, data: published }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (e: any) {
    console.error('Failed to load backup data from Firestore:', e);
    return NextResponse.json(
      { success: false, error: e.message || 'Failed to load site data' },
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}
