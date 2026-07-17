
"use client";

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { BlockRenderer } from '@/components/shared/BlockRenderer';
import { usePageContent } from '@/hooks/use-page-content';
import { Loader2 } from 'lucide-react';

export default function AboutPage() {
  const { content: pageContent, loading } = usePageContent('about');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-primary size-12" />
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
          <p className="boutique-label text-slate-400">העמוד ריק. הוסיפו בלוקים בממשק הניהול.</p>
        </div>
      )}
      <Footer />
    </main>
  );
}
