import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'מדיניות Privacy | Brand Name Brand Name',
  description: 'מדיניות הPrivacy של אתר Brand Name — Brand Name. מידע על איסוף נתונים, שמירת Privacy המטופלים וזכויות המשתמש.',
  robots: { index: false },
  alternates: { canonical: 'https://www.yourdomain.com/privacy' },
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
