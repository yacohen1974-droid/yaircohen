import type { Metadata } from 'next';
import { fetchPageMeta } from '@/lib/page-meta';

const DEFAULTS = {
  title: 'על Brand Name | יועצת אסטרטגית Brand Name',
  description: 'Brand Name — יועצת אסטרטגית M.A. מלווה נשים ונוער בשיטת גוף-נפש-רוח. עבודת צללים, ילדה פנימית, פוקוסינג ומיינדפולנס.',
};

export async function generateMetadata(): Promise<Metadata> {
  const meta = await fetchPageMeta('about', DEFAULTS);
  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: 'https://www.yourdomain.com/about' },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: 'https://www.yourdomain.com/about',
      type: 'profile',
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.description,
    },
  };
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
