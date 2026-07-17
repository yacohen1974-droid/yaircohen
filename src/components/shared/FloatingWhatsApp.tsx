
"use client";

import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { usePageContent } from '@/hooks/use-page-content';

export function FloatingWhatsApp() {
  const { content: globalSettings } = usePageContent('global');
  const sitePhone = globalSettings?.sitePhone || '050-628-5476';
  const whatsappMsg = globalSettings?.whatsappMsg || 'היי יאיר, הגעתי מהאתר ומעוניין בייעוץ ראשוני בנושא משכנתא. תודה!';
  const whatsappLink = `https://wa.me/${sitePhone.replace(/-/g, '').replace(/^0/, '972')}?text=${encodeURIComponent(whatsappMsg)}`;

  return (
    <a 
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "fixed bottom-24 left-6 sm:bottom-8 sm:left-8 z-[140]",
        "opacity-60 hover:opacity-100 hover:scale-110 transition-all duration-700 group flex items-center justify-center"
      )}
      aria-label="WhatsApp"
    >
      <div className="relative group-hover:rotate-12 transition-transform duration-300 pointer-events-auto">
        <Image
          src="/whatsapp.png"
          alt="WhatsApp"
          width={45}
          height={45}
          className="object-contain"
        />
      </div>
      <span className="absolute left-full ml-4 bg-white/90 backdrop-blur-sm text-accent px-4 py-2 rounded-sm text-[10px] font-bold tracking-widest whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-xl pointer-events-none hidden sm:block border border-primary/10">
        דברו איתי בוואטסאפ
      </span>
    </a>
  );
}
