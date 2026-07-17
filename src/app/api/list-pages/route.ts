import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    const appPath = path.join(process.cwd(), 'src/app');
    
    async function findPages(dir: string, base: string = ''): Promise<string[]> {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      let results: string[] = [];
      
      for (const entry of entries) {
        if (entry.isDirectory()) {
          const fullPath = path.join(dir, entry.name);
          const relativePath = path.join(base, entry.name);
          
          // Skip internal next.js or admin/api
          if (['api', 'admin', 'lib', '_', '.', 'fonts'].some(skip => entry.name.startsWith(skip))) continue;
          
          try {
            const hasPage = await fs.access(path.join(fullPath, 'page.tsx')).then(() => true).catch(() => false);
            if (hasPage && entry.name !== '[slug]') {
              results.push(relativePath);
            }
          } catch (e) {}
          
          results = results.concat(await findPages(fullPath, relativePath));
        }
      }
      return results;
    }

    const pages = await findPages(appPath);
      
    return NextResponse.json({ pages });
  } catch (error) {
    console.error('List pages error:', error);
    return NextResponse.json({ error: 'Failed to list pages' }, { status: 500 });
  }
}
