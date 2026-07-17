import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | Brand Name Brand Name',
  description: 'לתיאום שיחת היכרות עם Brand Name — יועצת אסטרטגית בטבעון, עמק יזרעאל ואונליין. ניתן לפנות בוואטסאפ או בטופס.',
  alternates: { canonical: 'https://www.yourdomain.com/contact' },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
