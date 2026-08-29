import { NextResponse } from 'next/server';
import { saveDraftSiteData } from '@/firebase/firestore-cms';
import { requireAdmin } from '@/lib/verify-admin';

export async function POST(request: Request) {
  try {
    if (!(await requireAdmin(request))) {
      return NextResponse.json({ success: false, error: 'לא מורשה' }, { status: 401 });
    }

    const data = await request.json();
    if (!data || typeof data !== 'object') {
      return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 });
    }

    // Save draft changes to Firestore (not published yet)
    await saveDraftSiteData(data);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error saving draft:', error);
    return NextResponse.json({ success: false, error: error.message || 'שמירת הטיוטה נכשלה' }, { status: 500 });
  }
}
