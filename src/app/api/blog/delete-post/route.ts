import { NextResponse } from 'next/server';
import { deleteBlogPost } from '@/firebase/db-actions';

export async function POST(request: Request) {
  try {
    const { id } = await request.json();
    await deleteBlogPost(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete post' }, { status: 500 });
  }
}
