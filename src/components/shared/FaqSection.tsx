"use client";

import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SectionTitle } from './SectionTitle';
import { useReveal } from '@/hooks/use-reveal';
import { HelpCircle, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqSectionProps {
  items: FaqItem[];
  title?: string;
  subtitle?: string;
  titleSettings?: any;
}

export function FaqSection({ 
  items, 
  title = "שאלות נפוצות", 
  subtitle = "FAQ",
  titleSettings
}: FaqSectionProps) {
  const revealRef = useReveal();

  // ── SEO: JSON-LD for Google FAQ Discovery ──
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": items.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };

  return (
    <section className="py-16 md:py-24 px-6 bg-transparent relative overflow-hidden">
      {/* SEO Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div ref={revealRef} className="max-w-4xl mx-auto reveal relative z-10">
        <SectionTitle 
          title={titleSettings?.text || title} 
          subtitle={titleSettings?.subtitle || subtitle} 
          className="flex flex-col items-center text-center mb-12 md:mb-16" 
          fontSize={titleSettings?.fontSize}
          fontFamily={titleSettings?.fontFamily}
          color={titleSettings?.color}
          align={titleSettings?.align || 'center'}
        />
        
        <div className="grid grid-cols-1 gap-4">
          <Accordion 
            type="single" 
            collapsible 
            defaultValue="item-0" // First item open by default as requested
            className="w-full space-y-4"
          >
            {items.map((item, i) => (
              <AccordionItem 
                key={i} 
                value={`item-${i}`} 
                className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm border-none"
              >
                <AccordionTrigger className="flex items-center gap-4 px-6 py-5 hover:no-underline transition-all duration-300">
                  <div className="flex items-center gap-4 flex-1 text-right">
                    <div className="shrink-0 w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 font-serif font-bold text-sm transition-colors group-data-[state=open]:bg-primary group-data-[state=open]:text-white shadow-inner">
                      {String(i + 1).padStart(2, '0')}
                    </div>
                    <span className="text-lg md:text-xl font-serif font-bold text-accent group-data-[state=open]:text-primary transition-colors duration-300">
                      {item.question}
                    </span>
                  </div>
                  <div className="faq-arrow-wrapper shrink-0 w-8 h-8 rounded-full border border-slate-200/80 flex items-center justify-center text-slate-400 group-data-[state=open]:rotate-90 transition-all duration-300">
                    <ChevronLeft size={16} strokeWidth={2.5} className="mr-0.5" />
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="pt-2 pr-14">
                    <div className="w-full h-[1px] bg-slate-100 mb-6" />
                    <p className="text-base md:text-lg font-light text-slate-500 leading-relaxed text-right animate-in fade-in slide-in-from-top-2 duration-500 font-sans">
                      {item.answer}
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
