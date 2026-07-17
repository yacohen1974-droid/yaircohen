"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Loader2 } from 'lucide-react';
import { usePageContent } from '@/hooks/use-page-content';
import { BlockRenderer } from '@/components/shared/BlockRenderer';

export default function DynamicPage() {
  const { slug } = useParams();
  const { content: pageContent, loading } = usePageContent(slug as string);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <Loader2 className="animate-spin text-primary size-12" />
      </div>
    );
  }

  if (!pageContent && slug) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center text-right p-8">
        <Navbar />
        <h1 className="text-4xl font-headline text-accent mb-6">העמוד לא נמצא</h1>
        <p className="boutique-para text-stone-400">ייתכן שהקישור שגוי או שהעמוד הוסר.</p>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-right overflow-x-hidden" style={{ '--primary': pageContent?.primaryColor } as any}>
      <Navbar />
      
      {pageContent?.blocks && pageContent.blocks.length > 0 ? (
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
