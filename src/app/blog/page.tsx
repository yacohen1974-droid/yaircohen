"use client";
import React from 'react';
import { BlockRenderer } from '@/components/shared/BlockRenderer';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { usePageContent } from '@/hooks/use-page-content';
import { Loader2 } from 'lucide-react';

export default function BlogPage() {
  const { content: pageContent, loading } = usePageContent('blog');

  if (loading) return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center bg-stone-50">
        <Loader2 className="animate-spin text-primary size-12" />
      </div>
      <Footer />
    </div>
  );

  return (
    <main className="min-h-screen bg-background text-right overflow-x-hidden">
      <Navbar />
      <BlockRenderer blocks={pageContent?.blocks || []} />
      <Footer />
    </main>
  );
}
