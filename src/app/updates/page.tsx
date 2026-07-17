
"use client";

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SectionTitle } from '@/components/shared/SectionTitle';
import { CtaButtons } from '@/components/shared/CtaButtons';
import { TestimonialsSection } from '@/components/shared/TestimonialsSection';
import { FaqSection } from '@/components/shared/FaqSection';
import { Loader2, Heart, Sparkles, Orbit, Compass, Users, Star, MessageSquare, HelpCircle } from 'lucide-react';
import { usePageContent } from '@/hooks/use-page-content';
import { DynamicSections } from '@/components/shared/DynamicSections';

const ICON_MAP: Record<string, any> = {
  Heart, Sparkles, Orbit, Compass, Users, Star, MessageSquare, HelpCircle
};

export default function UpdatesPage() {
  const { content: pageContent, loading } = usePageContent('updates');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <Loader2 className="animate-spin text-primary size-12" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background text-right">
      <Navbar />
      <section className="pt-56 pb-32 px-4 md:px-8 xl:px-24">
        <div className="max-w-4xl mx-auto">
          <SectionTitle 
            subtitle="Journal" 
            title={pageContent.introTitle || "עדכונים והודעות"} 
          />
          
          <div className="space-y-12 mt-12">
            <div className="boutique-para space-y-8 text-stone-600">
              {pageContent.introContent ? (
                <div className="page-content-container" dangerouslySetInnerHTML={{ __html: pageContent.introContent.replace(/&nbsp;|\u00A0/g, ' ') }} />
              ) : (
                <p className="text-center italic opacity-30">אין עדכונים זמינים כרגע.</p>
              )}
            </div>
          </div>

          {/* Features as update items if any */}
          {pageContent.features.length > 0 && (
            <div className="space-y-16 mt-24">
              {pageContent.features.map((feat: any, i: number) => {
                const Icon = ICON_MAP[feat.icon] || Heart;
                return (
                  <div key={i} className="border-b border-stone-100 pb-12 group">
                    <div className="flex items-center gap-4 mb-4">
                       <span className="text-primary/40 group-hover:text-primary transition-colors">
                          <Icon size={24} />
                       </span>
                       <h3 className="text-3xl font-headline font-bold text-accent">{feat.title}</h3>
                    </div>
                    <p className="text-xl font-light text-stone-600 leading-relaxed">{feat.description}</p>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-24">
            <CtaButtons buttons={pageContent.ctaButtons} align={pageContent.ctaAlign} />
          </div>
        </div>
      </section>

      {/* Dynamic Testimonials */}
      {pageContent.testimonials.length > 0 && (
        <TestimonialsSection customTestimonials={pageContent.testimonials} />
      )}

      {/* Dynamic FAQs */}
      {pageContent.faqs.length > 0 && (
        <FaqSection items={pageContent.faqs} />
      )}

      {/* Dynamic Custom Blocks */}
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        <DynamicSections sections={pageContent.dynamicSections} className="mb-24" />
      </div>

      <Footer />
    </main>
  );
}
