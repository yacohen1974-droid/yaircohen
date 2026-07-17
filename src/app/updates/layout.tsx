import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'עדכונים ומאמרים | Brand Name Brand Name',
  description: 'עדכונים, תובנות ומאמרים מאת Brand Name על שירות מקצועי, שיפור מקצועי וצמיחה אישית.',
  alternates: { canonical: 'https://www.yourdomain.com/updates' },
};

export default function UpdatesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
