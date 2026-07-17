
"use client";

import React, { useState, useEffect } from 'react';
import NextLink from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePageContent } from '@/hooks/use-page-content';

export function Navbar() {
  const { content: globalSettings } = usePageContent('global');

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin');

  const sitePhone = globalSettings?.sitePhone || "000-000-0000";
  const whatsappMsg = globalSettings?.whatsappMsg || "היי, הגעתי מהאתר ומעוניין לקבל פרטים נוספים. תודה!";
  const whatsappLink = `https://wa.me/${sitePhone.replace(/-/g, '').replace(/^0/, '972')}?text=${encodeURIComponent(whatsappMsg)}`;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [mobileMenuOpen]);

  // Close menu on navigation
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const defaultNavItems = [
    { label: 'בית', href: '/' },
    { label: 'אודות', href: '/about' },
    { label: 'התהליך', href: '/practice' },
    { label: 'בלוג', href: '/blog' },
    { label: 'צור קשר', href: '/contact' },
  ];

  const navItems =
    globalSettings?.navItems && globalSettings.navItems.length > 0
      ? globalSettings.navItems
      : defaultNavItems;

  // Use solid look when scrolled or on admin pages
  const useSolidLook = isScrolled || isAdminPage;

  return (
    <>
      {/* ── Main Nav Bar ── */}
      <nav
        dir="rtl"
        className={cn(
          'fixed w-full z-[200] transition-all duration-500',
          'px-6 md:px-12 lg:px-20 xl:px-32',
          'py-5 md:py-7',
          useSolidLook
            ? 'bg-white shadow-lg border-b border-slate-100 py-3 md:py-4'
            : 'bg-transparent'
        )}
      >
        <div className="flex items-center justify-between gap-4">

          {/* ── RIGHT: Logo (RTL so this renders on the right) ── */}
          <NextLink
            href="/"
            className="flex items-center gap-4 shrink-0 group z-[220]"
          >
            <div className="relative w-14 h-14 md:w-20 md:h-20 flex-shrink-0 transition-transform duration-300 group-hover:scale-105">
              <Image
                src="/logo.png"
                alt={globalSettings?.siteName || 'לוגו'}
                fill
                className={cn(
                  'object-contain transition-all duration-500',
                  !useSolidLook && 'brightness-0 invert drop-shadow-md'
                )}
                priority
              />
            </div>
            <div className="flex flex-col leading-tight text-right">
              <span
                className={cn(
                  'text-2xl sm:text-3xl font-bold tracking-wide transition-colors duration-500',
                  useSolidLook ? 'text-slate-800' : 'text-white drop-shadow'
                )}
              >
                {globalSettings?.siteName || 'יאיר כהן'}
              </span>
              <span
                className={cn(
                  'text-sm sm:text-base tracking-widest transition-colors duration-500',
                  useSolidLook ? 'text-primary' : 'text-white/80 drop-shadow-sm'
                )}
              >
                {globalSettings?.siteSubtitle || 'יעוץ משכנתאות'}
              </span>
            </div>
          </NextLink>

          {/* ── CENTER: Desktop Nav Links ── */}
          <div className="hidden xl:flex items-center gap-10">
            {navItems.map((item: { label: string; href: string }) => (
              <NextLink
                key={item.href}
                href={item.href}
                className={cn(
                  'relative py-1 whitespace-nowrap text-lg font-bold transition-colors duration-300',
                  useSolidLook
                    ? pathname === item.href
                      ? 'text-primary'
                      : 'text-slate-700 hover:text-primary'
                    : pathname === item.href
                    ? 'text-white'
                    : 'text-white/95 drop-shadow hover:text-white'
                )}
              >
                {item.label}
                {/* Active underline */}
                {pathname === item.href && (
                  <span
                    className={cn(
                      'absolute bottom-0 right-0 w-full h-[3px] rounded-full transition-colors duration-300',
                      useSolidLook ? 'bg-primary' : 'bg-white'
                    )}
                  />
                )}
              </NextLink>
            ))}
          </div>

          {/* ── LEFT: Phone + CTA (RTL so this renders on the left) ── */}
          <div className="hidden xl:flex items-center gap-8 shrink-0">
            {/* Phone number */}
            <a
              href={`tel:${sitePhone}`}
              className={cn(
                'flex items-center gap-2.5 text-lg font-bold transition-colors duration-300',
                useSolidLook
                  ? 'text-slate-700 hover:text-primary'
                  : 'text-white/95 drop-shadow hover:text-white'
              )}
            >
              <Phone className="w-6 h-6 flex-shrink-0" />
              <span dir="ltr">{sitePhone}</span>
            </a>

            {/* CTA Button */}
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full px-8 py-4 bg-primary text-white text-lg font-extrabold hover:bg-accent transition-all duration-300 shadow-xl whitespace-nowrap hover:scale-105 active:scale-95"
            >
              {globalSettings?.ctaLabel || 'לקביעת פגישה'}
            </a>
          </div>

          {/* ── Mobile: Hamburger ── */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className={cn(
              'xl:hidden p-2 z-[230] relative',
              mobileMenuOpen && 'hidden'
            )}
            aria-label="פתח תפריט"
          >
            <Menu
              strokeWidth={1.5}
              className={cn(
                'size-7 transition-colors duration-300',
                useSolidLook ? 'text-slate-800' : 'text-white drop-shadow-md'
              )}
            />
          </button>
        </div>
      </nav>

      {/* ── Mobile Full-Screen Overlay ── */}
      <div
        dir="rtl"
        className={cn(
          'fixed inset-0 z-[300] flex flex-col h-screen w-full transition-all duration-500 ease-in-out',
          'bg-[hsl(220,60%,18%)] text-white',
          mobileMenuOpen
            ? 'opacity-100 translate-y-0 visible pointer-events-auto'
            : 'opacity-0 -translate-y-full pointer-events-none invisible'
        )}
      >
        {/* Close button */}
        <button
          onClick={() => setMobileMenuOpen(false)}
          className="absolute top-5 left-5 p-3 z-[310]"
          aria-label="סגור תפריט"
        >
          <X
            strokeWidth={1.5}
            className="size-7 text-white/70 hover:text-white transition-colors"
          />
        </button>

        {/* Logo inside overlay */}
        <div className="pt-16 pb-8 flex justify-center border-b border-white/10">
          <NextLink href="/" className="flex items-center gap-3">
            <div className="relative w-10 h-10 flex-shrink-0">
              <Image
                src="/logo.png"
                alt={globalSettings?.siteName || 'לוגו'}
                fill
                className="object-contain brightness-0 invert"
              />
            </div>
            <div className="flex flex-col leading-tight text-right">
              <span className="text-lg font-bold tracking-wide text-white">
                {globalSettings?.siteName || 'יאיר כהן'}
              </span>
              <span className="text-xs tracking-widest text-white/60">
                {globalSettings?.siteSubtitle || 'יעוץ משכנתאות'}
              </span>
            </div>
          </NextLink>
        </div>

        {/* Nav Links */}
        <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center gap-0 px-6 py-8">
          {navItems.map((item: { label: string; href: string }, i: number) => (
            <NextLink
              key={item.href}
              href={item.href}
              className={cn(
                'w-full text-center py-4 text-xl font-semibold tracking-wide transition-all duration-300 border-b border-white/10',
                pathname === item.href
                  ? 'text-white'
                  : 'text-white/60 hover:text-white'
              )}
              style={{ transitionDelay: `${i * 40}ms` }}
            >
              {item.label}
            </NextLink>
          ))}
        </div>

        {/* Bottom: phone + CTA */}
        <div className="px-6 pb-10 flex flex-col items-center gap-4">
          <a
            href={`tel:${sitePhone}`}
            className="flex items-center gap-2 text-white/80 hover:text-white text-base font-semibold transition-colors"
          >
            <Phone className="w-4 h-4" />
            <span dir="ltr">{sitePhone}</span>
          </a>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full text-center rounded-full px-6 py-3 bg-primary text-white text-base font-bold hover:bg-accent transition-all duration-300 shadow-lg"
          >
            {globalSettings?.ctaLabel || 'לקביעת פגישה'}
          </a>
        </div>
      </div>
    </>
  );
}
