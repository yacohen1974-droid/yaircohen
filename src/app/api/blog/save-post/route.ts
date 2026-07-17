import { NextResponse } from 'next/server';
import { saveBlogPost } from '@/firebase/db-actions';

export async function POST(request: Request) {
  try {
    const post = await request.json();
    await saveBlogPost(post);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving blog post:', error);
    return NextResponse.json({ success: false, error: 'Failed to save post' }, { status: 500 });
  }
}
