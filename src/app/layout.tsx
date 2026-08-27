import { SITE_URL, SITE_PHONE, SITE_THEME } from '@/lib/site-config';
import { cn } from '@/lib/utils';
import { getDbInitialData } from '@/firebase/db-actions';
import Script from 'next/script';
import { Rubik, Nunito, Amatic_SC } from 'next/font/google';
import { headers } from 'next/headers';
import { UnderConstructionPage } from '@/components/shared/UnderConstructionPage';

import type { Metadata } from 'next';
import './globals.css';

const rubik = Rubik({
  subsets: ['latin', 'hebrew'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-rubik',
  display: 'swap',
});

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-nunito',
  display: 'swap',
});



const amaticSC = Amatic_SC({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-amatic',
  display: 'swap',
});

import { Toaster } from '@/components/ui/toaster';
import { InitialDataProvider } from '@/components/providers/InitialDataProvider';
import { FloatingWhatsApp } from '@/components/shared/FloatingWhatsApp';
import { ScrollToTop } from '@/components/shared/ScrollToTop';
import { PreviewModeBanner } from '@/components/shared/PreviewModeBanner';
import { CookieConsent } from '@/components/shared/CookieConsent';
import { AccessibilityWidget } from '@/components/shared/AccessibilityWidget';

async function getInitialData() {
  return getDbInitialData();
}

export async function generateMetadata(): Promise<Metadata> {
  const initialData = await getInitialData();
  const customFavicon = initialData?.global?.siteFavicon;

  return {
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
    icons: customFavicon ? {
      icon: [{ url: customFavicon }],
      apple: [{ url: customFavicon }],
    } : {
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
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialData = await getInitialData();
  const headerList = await headers();
  const pathname = headerList.get('x-pathname') || '';

  const isUnderConstruction = !!initialData?.global?.underConstruction;
  const isAdminRoute = pathname.startsWith('/admin') || pathname.startsWith('/api');

  console.log("RootLayout: isUnderConstruction =", isUnderConstruction, "| pathname =", pathname, "| isAdminRoute =", isAdminRoute);

  if (isUnderConstruction && !isAdminRoute) {
    return (
      <html lang="he" dir="rtl" suppressHydrationWarning className={cn(rubik.variable, nunito.variable, amaticSC.variable)}>
        <head>
          <meta name="google-site-verification" content="uZtRayPCUnA35YVD2gPquUAz34V0WlSF1jaUI3kYYnM" />
          <meta name="google-site-verification" content="Z7Bp-hEfMFwQYW9oYF0qdSdhJumMFlhsp246MOYQFP0" />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function() {
                  try {
                    var contrast = localStorage.getItem('acc-contrast');
                    if (contrast === 'true') document.documentElement.classList.add('high-contrast');
                    var font = localStorage.getItem('acc-font');
                    if (font === 'true') document.documentElement.classList.add('readable-font');
                    var anim = localStorage.getItem('acc-anim');
                    if (anim === 'true') document.documentElement.classList.add('disable-animations');
                    var cursor = localStorage.getItem('acc-cursor');
                    if (cursor === 'true') document.documentElement.classList.add('large-cursor');
                    var links = localStorage.getItem('acc-links');
                    if (links === 'true') document.documentElement.classList.add('highlight-links');
                    var size = localStorage.getItem('acc-size');
                    if (size) document.documentElement.setAttribute('data-text-size', size);
                  } catch (e) {}
                })();
              `
            }}
          />
        </head>
        <body className={cn(
          "font-body antialiased bg-background text-foreground overflow-x-hidden",
          SITE_THEME === 'masculine' && "theme-masculine"
        )}>
          <UnderConstructionPage globalData={initialData?.global} />
        </body>
      </html>
    );
  }

  return (
    <html lang="he" dir="rtl" suppressHydrationWarning className={cn(rubik.variable, nunito.variable, amaticSC.variable)}>
      <head>
        <meta name="google-site-verification" content="uZtRayPCUnA35YVD2gPquUAz34V0WlSF1jaUI3kYYnM" />
        <meta name="google-site-verification" content="Z7Bp-hEfMFwQYW9oYF0qdSdhJumMFlhsp246MOYQFP0" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var contrast = localStorage.getItem('acc-contrast');
                  if (contrast === 'true') document.documentElement.classList.add('high-contrast');
                  var font = localStorage.getItem('acc-font');
                  if (font === 'true') document.documentElement.classList.add('readable-font');
                  var anim = localStorage.getItem('acc-anim');
                  if (anim === 'true') document.documentElement.classList.add('disable-animations');
                  var cursor = localStorage.getItem('acc-cursor');
                  if (cursor === 'true') document.documentElement.classList.add('large-cursor');
                  var links = localStorage.getItem('acc-links');
                  if (links === 'true') document.documentElement.classList.add('highlight-links');
                  var size = localStorage.getItem('acc-size');
                  if (size) document.documentElement.setAttribute('data-text-size', size);
                } catch (e) {}
              })();
            `
          }}
        />
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
        "font-body antialiased bg-background text-foreground overflow-x-hidden pt-[56px] xl:pt-[80px]",
        SITE_THEME === 'masculine' && "theme-masculine"
      )}>
        <InitialDataProvider initialData={initialData}>
          {children}
          <FloatingWhatsApp />
          <ScrollToTop />
          <PreviewModeBanner />
          <CookieConsent />
          <AccessibilityWidget />
        </InitialDataProvider>
        <Toaster />
      </body>
    </html>
  );
}
