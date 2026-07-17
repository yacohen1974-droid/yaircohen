
"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SectionTitle } from '@/components/shared/SectionTitle';
import { ContactForm } from '@/components/shared/ContactForm';
import { TestimonialsSection } from '@/components/shared/TestimonialsSection';
import { FaqSection } from '@/components/shared/FaqSection';
import { CtaButtons } from '@/components/shared/CtaButtons';
import { useReveal } from '@/hooks/use-reveal';
import { PortraitImage } from '@/components/shared/PortraitImage';
import { Orbit, Heart, Sparkles, Compass, Users, Star, MessageSquare, HelpCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePageContent } from '@/hooks/use-page-content';
import { DynamicSections } from '@/components/shared/DynamicSections';
import { BlockRenderer } from '@/components/shared/BlockRenderer';

const ICON_MAP: Record<string, React.ElementType> = { Orbit, Heart, Sparkles, Compass, Users, Star, MessageSquare, HelpCircle };

export default function Home() {
  const { content: pageContent, loading } = usePageContent('home');

  const heroReveal = useReveal();
  const introReveal = useReveal();
  const uniquenessReveal = useReveal();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-primary size-12" />
          <p className="boutique-label text-stone-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background text-right overflow-x-hidden">
      <Navbar />
      
      {pageContent.blocks && pageContent.blocks.length > 0 ? (
        <BlockRenderer blocks={pageContent.blocks} />
      ) : (
        <div className="py-40 text-center">
          <p className="boutique-label text-stone-400">העמוד ריק. הוסיפו בלוקים בממשק הניהול.</p>
        </div>
      )}

      <Footer />
    </main>
  );
}
