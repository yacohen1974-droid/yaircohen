import type { Metadata } from 'next';
import { SITE_NAME, SITE_URL } from '@/lib/site-config';

export const metadata: Metadata = {
  title: `מדיניות פרטיות | ${SITE_NAME}`,
  description: `מדיניות הפרטיות של אתר ${SITE_NAME}. מידע על איסוף נתונים, שמירת פרטיות הגולשים וזכויות המשתמש.`,
  robots: { index: false },
  alternates: { canonical: `${SITE_URL}/privacy` },
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
