import { NextResponse } from 'next/server';
import { deletePageContent } from '@/firebase/db-actions';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const { pageId } = await request.json();
    if (!pageId || pageId === 'global' || pageId === 'home') {
      return NextResponse.json({ success: false, error: 'Invalid or protected page ID' }, { status: 400 });
    }

    // 1. Remove from database
    await deletePageContent(pageId);

    // 2. Try to remove directory in src/app if it exists
    const pagePath = path.join(process.cwd(), 'src/app', pageId);
    try {
      const stats = await fs.stat(pagePath);
      if (stats.isDirectory()) {
        await fs.rm(pagePath, { recursive: true, force: true });
      }
    } catch (e) {
      // Folder might not exist, that's fine if it's a dynamic page
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting page:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete page' }, { status: 500 });
  }
}
