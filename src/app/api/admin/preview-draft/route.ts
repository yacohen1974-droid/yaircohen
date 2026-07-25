import { NextResponse } from 'next/server';
import { fetchDraftSiteData } from '@/firebase/db-actions';

export async function GET() {
  try {
    const data = await fetchDraftSiteData();
    return NextResponse.json(
      { success: !!data, data },
      { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
    );
  } catch (error) {
    console.error('Error fetching draft for preview:', error);
    return NextResponse.json({ success: false, data: null }, { status: 500 });
  }
}
