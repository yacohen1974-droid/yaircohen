import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    const appPath = path.join(process.cwd(), 'src/app');
    const siteDataPath = path.join(process.cwd(), 'src/content/site-data.json');
    
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

    const filePages = await findPages(appPath);
    
    let dbPages: string[] = [];
    try {
      const content = await fs.readFile(siteDataPath, 'utf8');
      const data = JSON.parse(content);
      if (data.pages) {
        dbPages = Object.keys(data.pages);
      }
      
      // Extract pages from global menus
      if (data.global) {
        const menuKeys = ['navItems', 'footerItems', 'legalItems'];
        menuKeys.forEach((key) => {
          const items = data.global[key];
          if (Array.isArray(items)) {
            items.forEach((item: any) => {
              let href = item?.href;
              if (typeof href === 'string') {
                href = href.trim();
                // Ignore external links, anchor links, mail/phone links and default routes
                if (
                  !href.startsWith('http') &&
                  !href.startsWith('#') &&
                  !href.startsWith('tel:') &&
                  !href.startsWith('mailto:') &&
                  href !== '/' &&
                  href !== '/contact' &&
                  href !== '/blog' &&
                  href !== ''
                ) {
                  const cleanId = href.startsWith('/') ? href.slice(1) : href;
                  if (/^[a-zA-Z0-9-]+$/.test(cleanId)) {
                    dbPages.push(cleanId);
                  }
                }
              }
            });
          }
        });
      }
    } catch (e) {
      console.error('Error reading site-data.json in list-pages API:', e);
    }
    
    const uniquePages = Array.from(new Set([...filePages, ...dbPages]));
      
    return NextResponse.json({ pages: uniquePages });
  } catch (error) {
    console.error('List pages error:', error);
    return NextResponse.json({ error: 'Failed to list pages' }, { status: 500 });
  }
}
