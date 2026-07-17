import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'הצהרת Accessibility | Brand Name Brand Name',
  description: 'הצהרת הAccessibility של אתר Brand Name — Brand Name. האתר פועל לפי תקן Accessibility ישראלי WCAG 2.1 AA.',
  alternates: { canonical: 'https://www.yourdomain.com/accessibility' },
};

export default function AccessibilityLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
