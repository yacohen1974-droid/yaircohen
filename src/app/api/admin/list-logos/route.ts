import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.svg', '.webp', '.gif', '.avif', '.ico'];

export async function GET() {
  try {
    const dir = path.join(process.cwd(), 'public', 'logos');
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const files = entries
      .filter(e => e.isFile() && IMAGE_EXTENSIONS.includes(path.extname(e.name).toLowerCase()))
      .map(e => `/logos/${e.name}`)
      .sort();
    return NextResponse.json({ success: true, files });
  } catch (error) {
    console.error('Error listing logos:', error);
    return NextResponse.json({ success: false, error: 'Failed to list logos', files: [] }, { status: 500 });
  }
}
