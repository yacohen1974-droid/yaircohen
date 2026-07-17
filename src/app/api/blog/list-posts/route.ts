import { NextResponse } from 'next/server';
import { getBlogPosts } from '@/firebase/db-actions';

export async function GET() {
  try {
    const posts = await getBlogPosts();
    return NextResponse.json({ success: true, posts });
  } catch (error) {
    console.error('Error listing blog posts:', error);
    return NextResponse.json({ success: false, error: 'Failed to list posts' }, { status: 500 });
  }
}
