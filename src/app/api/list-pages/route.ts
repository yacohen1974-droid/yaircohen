import { NextResponse } from 'next/server';
import { readPublishedSiteData } from '@/firebase/firestore-cms';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Read published site data from Firestore (single source of truth)
    const data = await readPublishedSiteData();

    const dbPages: string[] = [];

    // Get all published pages
    if (data.pages) {
      dbPages.push(...Object.keys(data.pages));
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

    const uniquePages = Array.from(new Set(dbPages));

    return NextResponse.json({ pages: uniquePages });
  } catch (error) {
    console.error('List pages error:', error);
    return NextResponse.json({ error: 'Failed to list pages' }, { status: 500 });
  }
}
