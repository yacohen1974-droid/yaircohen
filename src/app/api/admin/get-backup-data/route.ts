import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    const jsonPath = path.join(process.cwd(), 'src/content/site-data.json');
    const fileContent = await fs.readFile(jsonPath, 'utf-8');
    const data = JSON.parse(fileContent);
    return NextResponse.json({ success: true, data });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
