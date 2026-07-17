import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'תנאי שימוש | Brand Name Brand Name',
  description: 'תנאי השימוש באתר Brand Name — Brand Name. הגדרת הסכמים, אחריות ומגבלות שימוש בשירותי האתר.',
  robots: { index: false },
  alternates: { canonical: 'https://www.yourdomain.com/terms' },
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
