import { SITE_URL } from '@/lib/site-config';
import type { MetadataRoute } from 'next';

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
    // Core mortgage service pages
    {
      url: `${BASE_URL}/services`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/mortgage-calculator`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/refinance`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    // Core pages
    {
      url: `${BASE_URL}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    // Blog index
    {
      url: `${BASE_URL}/blog`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/accessibility`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.2,
    },
  ];

  try {
    const { getBlogPosts } = await import('@/firebase/db-actions');
    const posts = await getBlogPosts();
    const dynamicRoutes = (posts || []).map((post: any) => ({
      url: `${BASE_URL}/blog/${post.id}`,
      lastModified: post.updatedAt ? new Date(post.updatedAt) : now,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    }));
    return [...staticRoutes, ...dynamicRoutes];
  } catch (e) {
    console.error('Error generating dynamic routes for sitemap:', e);
    return staticRoutes;
  }
}
