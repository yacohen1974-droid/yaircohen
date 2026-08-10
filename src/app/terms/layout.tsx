import type { Metadata } from 'next';
import { SITE_NAME, SITE_URL } from '@/lib/site-config';

export const metadata: Metadata = {
  title: `תנאי שימוש | ${SITE_NAME}`,
  description: `תנאי השימוש באתר ${SITE_NAME}. הגדרת הסכמים, אחריות ומגבלות שימוש בשירותי האתר.`,
  robots: { index: false },
  alternates: { canonical: `${SITE_URL}/terms` },
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
