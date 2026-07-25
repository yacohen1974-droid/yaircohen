import { NextResponse } from 'next/server';
import { getPublishHistory } from '@/firebase/db-actions';

export async function GET() {
  try {
    const history = await getPublishHistory(5);
    return NextResponse.json(
      { success: true, history },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (error) {
    console.error('Error fetching publish history:', error);
    return NextResponse.json({ success: false, history: [] }, { status: 500 });
  }
}
