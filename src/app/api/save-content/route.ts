import { NextResponse } from 'next/server';
import { savePageContent } from '@/firebase/db-actions';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // The body is { [pageId]: content }
    const pageId = Object.keys(data)[0];
    const content = data[pageId];

    if (!pageId) {
      return NextResponse.json({ success: false, error: 'Missing pageId or content' }, { status: 400 });
    }

    await savePageContent(pageId, content);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving content:', error);
    return NextResponse.json({ success: false, error: 'Failed to save content' }, { status: 500 });
  }
}
