import { SITE_URL, SITE_PHONE, SITE_THEME } from '@/lib/site-config';
import { cn } from '@/lib/utils';
import { getDbInitialData } from '@/firebase/db-actions';
import Script from 'next/script';

import type { Metadata } from 'next';
import './globals.css';

import { Toaster } from '@/components/ui/toaster';
import { InitialDataProvider } from '@/components/providers/InitialDataProvider';
import { FloatingWhatsApp } from '@/components/shared/FloatingWhatsApp';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'יאיר כהן – יועץ משכנתאות ופיננסים | ליווי אישי לרכישת הבית שלכם',
    template: '%s | יאיר כהן – יועץ משכנתאות'
  },
  description: 'יאיר כהן, יועץ משכנתאות ופיננסים בלתי תלוי – מלווה אתכם בכל שלבי תהליך המשכנתא, ממשא ומתן עם הבנקים ועד לחיסכון מרבי בריבית. קבלו ייעוץ ראשוני ללא עלות.',
  keywords: ['יאיר כהן', 'יעוץ משכנתאות', 'יועץ משכנתאות', 'משכנתא', 'רכישת דירה', 'מחזור משכנתא', 'ריבית משכנתא', 'בנק למשכנתאות'],
  openGraph: {
    type: 'website',
    locale: 'he_IL',
    url: SITE_URL,
    siteName: 'יאיר כהן – יועץ משכנתאות ופיננסים',
    title: 'יאיר כהן – יועץ משכנתאות ופיננסים | ליווי אישי',
    description: 'יועץ משכנתאות בלתי תלוי – חסכו עשרות אלפי שקלים עם ייעוץ מקצועי.',
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large' },
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
  alternates: {
    canonical: SITE_URL,
  },
};

async function getInitialData() {
  return getDbInitialData();
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialData = await getInitialData();

  return (
    <html lang="he" dir="rtl" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Assistant:wght@200;300;400;500;600;700;800&family=Amatic+SC:wght@400;700&display=swap" rel="stylesheet" />
        <meta name="google-site-verification" content="uZtRayPCUnA35YVD2gPquUAz34V0WlSF1jaUI3kYYnM" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FinancialService",
              "name": "יאיר כהן – יועץ משכנתאות ופיננסים",
              "url": SITE_URL,
              "telephone": SITE_PHONE,
              "priceRange": "$$",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "IL"
              },
              "serviceType": "יעוץ משכנתאות",
              "areaServed": {
                "@type": "Country",
                "name": "Israel"
              }
            })
          }}
        />
      </head>
      <body className={cn(
        "font-body antialiased bg-background text-foreground selection:bg-primary/20 overflow-x-hidden",
        SITE_THEME === 'masculine' && "theme-masculine"
      )}>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-CTGVLV3791"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-CTGVLV3791');
          `}
        </Script>
        <InitialDataProvider initialData={initialData}>
          {children}
          <FloatingWhatsApp />
        </InitialDataProvider>
        <Toaster />
      </body>
    </html>
  );
}
