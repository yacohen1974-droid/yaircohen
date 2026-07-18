import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { saveBlogPost, SITE_CONTENT_CACHE_TAG } from '@/firebase/db-actions';

export async function POST(request: Request) {
  try {
    const post = await request.json();
    await saveBlogPost(post);
    revalidateTag(SITE_CONTENT_CACHE_TAG);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving blog post:', error);
    return NextResponse.json({ success: false, error: 'Failed to save post' }, { status: 500 });
  }
}
