
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, Lock, Instagram, Linkedin, Youtube, Music } from 'lucide-react';

/** Minimal Facebook "f" mark — avoids the deprecated lucide Facebook icon */
function FacebookIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}
import { WhatsAppIcon } from '@/components/shared/WhatsAppIcon';
import { usePageContent } from '@/hooks/use-page-content';

export function Footer() {
  const [year, setYear] = useState(new Date().getFullYear());
  const { content: globalSettings } = usePageContent('global');

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  const phone = globalSettings?.sitePhone || '050-628-5476';
  const email = globalSettings?.siteEmail || 'yairmashkantaot@gmail.com';
  const telHref = `tel:${phone.replace(/-/g, '')}`;
  const waHref = `https://wa.me/${phone.replace(/-/g, '').replace(/^0/, '972')}`;
  const youtubeUrl = globalSettings?.youtubeLink || 'https://www.youtube.com/channel/UCIU3xxQ5o4nDttcVD17q8QQ';

  return (
    <footer className="bg-[#0D2347] text-white" dir="rtl">

      {/* Top strip — tagline */}
      <div className="bg-[hsl(220,60%,13%)] border-b border-white/10 py-3 px-6 text-center">
        <p className="text-sm text-white/60 tracking-wide">
          ליווי מקצועי ואישי בכל תהליך המשכנתא — מהייעוץ הראשון ועד לחתימה על ההסכם
        </p>
      </div>

      {/* Main grid */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

          <div className="sm:col-span-2 lg:col-span-1 flex flex-col gap-5">
            <Link href="/" className="flex flex-col gap-3 group">
              <div className="relative w-12 h-12">
                <Image 
                  src="/logo.png" 
                  alt={globalSettings?.siteName || 'לוגו'} 
                  fill 
                  className="object-contain brightness-0 invert group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div>
                <h3 className="text-2xl font-bold tracking-wide text-white leading-snug">
                  {globalSettings?.siteName || 'יאיר כהן'}
                </h3>
                <p className="text-sm text-white/50 mt-1">
                  {globalSettings?.siteSubtitle || 'יועץ משכנתאות מוסמך'}
                </p>
              </div>
            </Link>

            <p className="text-sm text-white/70 leading-relaxed">
              {globalSettings?.siteDescription ||
                'מעל 15 שנות ניסיון בייעוץ משכנתאות. עוזרים לכם לקבל את ההחלטה הפיננסית הנכונה ולחסוך עשרות אלפי שקלים לאורך חיי ההלוואה.'}
            </p>

            {/* Social icons */}
            <div className="flex gap-3 mt-1">
              {globalSettings?.facebookLink && (
                <a
                  href={globalSettings.facebookLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="bg-white/10 hover:bg-white/20 rounded-full p-2 transition-all"
                >
                  <FacebookIcon size={18} />
                </a>
              )}
              {globalSettings?.instagramLink && (
                <a
                  href={globalSettings.instagramLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="bg-white/10 hover:bg-white/20 rounded-full p-2 transition-all"
                >
                  <Instagram size={18} />
                </a>
              )}
              {globalSettings?.linkedinLink && (
                <a
                  href={globalSettings.linkedinLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="bg-white/10 hover:bg-white/20 rounded-full p-2 transition-all"
                >
                  <Linkedin size={18} />
                </a>
              )}
              {youtubeUrl && (
                <a
                  href={youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="bg-white/10 hover:bg-white/20 rounded-full p-2 transition-all"
                >
                  <Youtube size={18} />
                </a>
              )}
              {globalSettings?.tiktokLink && (
                <a
                  href={globalSettings.tiktokLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok"
                  className="bg-white/10 hover:bg-white/20 rounded-full p-2 transition-all"
                >
                  <Music size={18} />
                </a>
              )}
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="bg-white/10 hover:bg-white/20 rounded-full p-2 transition-all hover:scale-110 active:scale-95 shadow-lg"
              >
                <WhatsAppIcon size={18} variant="solid" />
              </a>
            </div>
          </div>

          {/* Col 2 — Quick nav */}
          <div>
            <h4 className="text-xs uppercase tracking-widest font-bold text-white/50 mb-4">
              ניווט מהיר
            </h4>
            <nav className="flex flex-col gap-3">
              {(globalSettings?.navItems?.length > 0
                ? globalSettings.navItems
                : [
                    { label: 'בית', href: '/' },
                    { label: 'אודות', href: '/about' },
                    { label: 'התהליך שלנו', href: '/process' },
                    { label: 'בלוג', href: '/blog' },
                    { label: 'צור קשר', href: '/contact' },
                  ]
              ).map((item: { label: string; href: string }) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-white/80 hover:text-white transition-colors text-sm"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Col 3 — Services / footer pages */}
          <div>
            <h4 className="text-xs uppercase tracking-widest font-bold text-white/50 mb-4">
              שירותים
            </h4>
            <nav className="flex flex-col gap-3">
              {(globalSettings?.footerItems?.length > 0
                ? globalSettings.footerItems
                : [
                    { label: 'משכנתא לדירה ראשונה', href: '/first-apartment' },
                    { label: 'מחזור משכנתא', href: '/refinance' },
                    { label: 'משכנתא לדירה שנייה', href: '/second-apartment' },
                    { label: 'ייעוץ לזכאים', href: '/eligible' },
                  ]
              ).map((item: { label: string; href: string }) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-white/80 hover:text-white transition-colors text-sm"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Col 4 — Contact */}
          <div>
            <h4 className="text-xs uppercase tracking-widest font-bold text-white/50 mb-4">
              יצירת קשר
            </h4>
            <div className="flex flex-col gap-4">

              <a
                href={telHref}
                className="flex items-center gap-3 text-white/80 hover:text-white transition-colors text-sm"
              >
                <Phone size={15} className="shrink-0 text-white/50" />
                <span dir="ltr">{phone}</span>
              </a>

              <a
                href={`mailto:${email}`}
                className="flex items-center gap-3 text-white/80 hover:text-white transition-colors text-sm"
              >
                <Mail size={15} className="shrink-0 text-white/50" />
                <span>{email}</span>
              </a>

              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center justify-center gap-2 bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/40 text-white text-sm font-medium rounded-lg px-4 py-2.5 transition-all w-full"
              >
                <WhatsAppIcon size={16} variant="solid" />
                שלח הודעה ב-WhatsApp
              </a>

            </div>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 px-6 md:px-12 py-5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/40">

          <p>© {year} {globalSettings?.siteName || 'יאיר כהן יועץ משכנתאות'} — כל הזכויות שמורות</p>

          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            <Link href="/privacy" className="hover:text-white transition-colors">מדיניות פרטיות</Link>
            <Link href="/terms" className="hover:text-white transition-colors">תנאי שימוש</Link>
            <Link href="/accessibility" className="hover:text-white transition-colors">נגישות</Link>
            <Link
              href="/admin/login"
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Lock size={10} />
              <span>כניסת מנהל</span>
            </Link>
          </div>

        </div>
      </div>

    </footer>
  );
}
