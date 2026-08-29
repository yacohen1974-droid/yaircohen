import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'src/content/site-data.json');
    const contentString = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(contentString);

    return NextResponse.json(
      {
        success: true,
        data,
        updatedAt: new Date().toISOString()
      },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (error: any) {
    console.error('Error fetching local publish status:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch publish status' },
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}
