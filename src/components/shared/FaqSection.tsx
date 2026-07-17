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
    <section className="py-32 px-6 md:px-20 bg-transparent relative overflow-hidden">
      {/* SEO Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-accent/5 rounded-full blur-3xl pointer-events-none" />

      <div ref={revealRef} className="max-w-5xl mx-auto reveal relative z-10">
        <SectionTitle 
          title={titleSettings?.text || title} 
          subtitle={titleSettings?.subtitle || subtitle} 
          className="flex flex-col items-center text-center mb-16 md:mb-24" 
          fontSize={titleSettings?.fontSize}
          fontFamily={titleSettings?.fontFamily}
          color={titleSettings?.color}
          align={titleSettings?.align || 'center'}
        />
        
        <div className="grid grid-cols-1 gap-6">
          <Accordion 
            type="single" 
            collapsible 
            defaultValue="item-0" // First item open by default as requested
            className="w-full space-y-6"
          >
            {items.map((item, i) => (
              <AccordionItem 
                key={i} 
                value={`item-${i}`} 
                className="faq-glass-card group border-none"
              >
                <AccordionTrigger className="flex items-center gap-4 px-8 py-7 hover:no-underline transition-all duration-300">
                  <div className="flex items-center gap-5 flex-1 text-right">
                    <div className="shrink-0 w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary group-data-[state=open]:bg-primary group-data-[state=open]:text-white transition-all duration-500 shadow-inner">
                      <HelpCircle size={22} className="group-data-[state=open]:rotate-[360deg] transition-transform duration-700" />
                    </div>
                    <span className="text-xl md:text-2xl font-headline font-bold text-accent group-data-[state=open]:text-primary transition-colors duration-300">
                      {item.question}
                    </span>
                  </div>
                  <div className="faq-arrow-wrapper shrink-0 w-10 h-10 rounded-full border border-primary/10 flex items-center justify-center text-primary/40 group-data-[state=open]:rotate-90 group-data-[state=open]:bg-primary group-data-[state=open]:text-white transition-all duration-500">
                    <ChevronLeft size={20} strokeWidth={3} className="mr-0.5" />
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-8 pb-10">
                  <div className="pt-2 pr-[68px]">
                    <div className="w-full h-px bg-gradient-to-l from-primary/10 via-primary/5 to-transparent mb-8" />
                    <p className="text-lg md:text-xl font-light text-slate-600 leading-relaxed text-right animate-in fade-in slide-in-from-top-4 duration-700">
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
