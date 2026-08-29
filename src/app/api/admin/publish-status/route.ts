import { NextResponse } from 'next/server';
import { readPublishedSiteData, readDraftSiteData } from '@/firebase/firestore-cms';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Read both published and draft from Firestore
    const publishedData = await readPublishedSiteData();
    const draftData = await readDraftSiteData();

    return NextResponse.json(
      {
        success: true,
        published: publishedData,
        draft: draftData,
        updatedAt: new Date().toISOString()
      },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (error: any) {
    console.error('Error fetching publish status from Firestore:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch publish status' },
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}
