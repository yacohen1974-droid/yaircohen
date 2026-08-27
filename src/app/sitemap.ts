import { SITE_URL } from '@/lib/site-config';
import type { MetadataRoute } from 'next';
import fs from 'fs/promises';
import path from 'path';

const BASE_URL = SITE_URL;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];

  let dynamicRoutes: MetadataRoute.Sitemap = [];
  try {
    const siteDataPath = path.join(process.cwd(), 'src/content/site-data.json');
    const content = await fs.readFile(siteDataPath, 'utf8');
    const data = JSON.parse(content);
    if (data.pages) {
      Object.keys(data.pages).forEach((pageId) => {
        if (pageId !== 'home' && pageId !== 'contact') {
          dynamicRoutes.push({
            url: `${BASE_URL}/${pageId}`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.7,
          });
        }
      });
    }
  } catch (e) {
    console.error('Error generating dynamic pages for sitemap:', e);
  }

  return [...staticRoutes, ...dynamicRoutes];
}
