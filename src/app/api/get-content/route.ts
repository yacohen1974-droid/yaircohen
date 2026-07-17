import { NextResponse } from 'next/server';
import { getPageContent } from '@/firebase/db-actions';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const pageId = searchParams.get('pageId');
    if (!pageId) return NextResponse.json({ success: false, error: 'Missing pageId' }, { status: 400 });

    const content = await getPageContent(pageId);
    
    return NextResponse.json({ success: true, content });
  } catch (error) {
    console.error('Error in get-content:', error);
    return NextResponse.json({ success: false, error: 'Failed to get content' }, { status: 500 });
  }
}
