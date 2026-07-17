import { SITE_URL } from '@/lib/site-config';
import type { Metadata } from 'next';

// Note: dynamic per-post metadata requires migrating BlogPostPage to a server component.
// This layout provides a generic fallback until that migration happens.
export const metadata: Metadata = {
  title: {
    default: 'מאמר | Brand Name — Brand Name',
    template: '%s | Brand Name',
  },
  description: 'מאמר מאת Brand Name — יועצת אסטרטגית. עבודה עם גוף, נפש ורוח לשיפור מקצועי עמוק.',
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  author: {
    '@type': 'Person',
    name: 'Brand Name',
    jobTitle: 'יועצת אסטרטגית',
    url: 'https://www.yourdomain.com/about',
  },
  publisher: {
    '@type': 'Organization',
    name: 'YourBrand',
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: 'https://www.yourdomain.com/logo.png',
    },
  },
  inLanguage: 'he',
  isPartOf: {
    '@type': 'Blog',
    name: 'בלוג Brand Name',
    url: 'https://www.yourdomain.com/blog',
  },
};

export default function BlogPostLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {children}
    </>
  );
}
