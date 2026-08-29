"use client";

import React from 'react';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, Newspaper, HelpCircle, LogOut, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/firebase';

const NAV_ITEMS = [
  { label: 'לוח בקרה', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'עריכת דפים', href: '/admin/pages', icon: FileText },
  { label: 'בלוג', href: '/admin/blog', icon: Newspaper },
  { label: 'עזרה', href: '/admin/help', icon: HelpCircle },
];

/**
 * The admin shell's own header — deliberately not the public site's <Navbar>.
 * That component fetches site content just to show a logo/phone/CTA meant for
 * visitors, and its fixed height forces every admin screen into a matching
 * pt-48 padding hack. This is a fixed, lightweight bar sized for itself.
 */
export function AdminHeader() {
  const pathname = usePathname();
  const auth = useAuth();

  return (
    <header
      dir="rtl"
      className="h-14 bg-stone-900 text-stone-100 border-b border-stone-800 flex items-center justify-between px-4 md:px-8"
    >
      <div className="flex items-center gap-6 min-w-0">
        <NextLink href="/admin/dashboard" className="font-handwriting text-2xl text-white shrink-0">
          ניהול האתר
        </NextLink>
        <nav className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
            const active = pathname === href;
            return (
              <NextLink
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 text-xs font-headline transition-colors',
                  active ? 'bg-stone-800 text-white' : 'text-stone-400 hover:text-white hover:bg-stone-800/60'
                )}
              >
                <Icon size={14} />
                {label}
              </NextLink>
            );
          })}
        </nav>
      </div>

      <div className="flex items-center gap-4 shrink-0">
        <NextLink
          href="/api/admin/preview?path=/"
          className="flex items-center gap-1.5 text-xs text-stone-300 hover:text-white hover:bg-stone-800/80 px-2.5 py-1.5 rounded border border-stone-700/50 transition-colors"
        >
          <Globe size={14} />
          <span>מעבר לאתר</span>
        </NextLink>
        {auth.user?.email && (
          <span className="hidden sm:inline text-xs text-stone-400 truncate max-w-[160px]" dir="ltr">
            {auth.user.email}
          </span>
        )}
        <button
          onClick={() => auth.signOut()}
          className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-white transition-colors"
        >
          <LogOut size={14} />
          <span className="hidden sm:inline">התנתקות</span>
        </button>
      </div>
    </header>
  );
}
