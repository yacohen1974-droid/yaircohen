import { SITE_URL } from '@/lib/site-config';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'בלוג | Brand Name Brand Name — מאמרים על שיפור מקצועי',
  description: 'מאמרים בעברית על שירות מקצועי, עבודה עם גוף-נפש-רוח, חרדה, סמכות פנימית וצמיחה מקצועית. מאת Brand Name.',
  alternates: { canonical: 'https://www.yourdomain.com/blog' },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Blog',
  name: 'בלוג Brand Name — Brand Name',
  description: 'מאמרים על שירות מקצועי, שיפור מקצועי וצמיחה אישית',
  url: 'https://www.yourdomain.com/blog',
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
  },
  inLanguage: 'he',
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
