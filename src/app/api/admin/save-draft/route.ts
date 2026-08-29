import { NextResponse } from 'next/server';
import { commitDraftSiteData } from '@/firebase/db-actions';
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

    await commitDraftSiteData(data);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error saving draft:', error);
    return NextResponse.json({ success: false, error: error.message || 'שמירת הטיוטה נכשלה' }, { status: 500 });
  }
}
