"use client";
import React, { useState, useEffect } from 'react';
import { BlockRenderer } from '@/components/shared/BlockRenderer';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Loader2 } from 'lucide-react';

export default function BlogPage() {
  const [pageContent, setPageContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const pageRes = await fetch('/api/get-content?pageId=blog');
        const pageData = await pageRes.json();
        if (pageData.success) setPageContent(pageData.content);
      } catch (err) {
        console.error("Error fetching blog data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

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
