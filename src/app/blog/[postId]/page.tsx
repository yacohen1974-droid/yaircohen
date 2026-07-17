
"use client";

import React, { useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useFirestore, useCollection } from '@/firebase';
import { collection, query, where, limit } from 'firebase/firestore';
import { Loader2, ArrowRight, Calendar, Tag, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { safeEncodeURI } from '@/lib/utils';

export default function BlogPostPage() {
  const { postId } = useParams();
  const router = useRouter();
  const [post, setPost] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchPost() {
      try {
        const res = await fetch('/api/blog/list-posts', { cache: 'no-store' });
        const data = await res.json();
        if (data.success) {
          const found = data.posts?.find((p: any) => p.slug === postId || p.id === postId);
          setPost(found);
        }
      } catch (e) {
        console.error("Error fetching post:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchPost();
  }, [postId]);

  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <Loader2 className="animate-spin text-primary size-12" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50 text-right p-8">
        <Navbar />
        <div className="text-center space-y-6 mt-20">
          <h1 className="text-4xl md:text-6xl font-handwriting text-accent mb-4">המאמר לא נמצא</h1>
          <p className="text-lg md:text-xl font-headline text-stone-500 mb-8 max-w-md mx-auto">מצטערים, המאמר שחיפשתם לא קיים או שהועבר לכתובת אחרת.</p>
          <Button onClick={() => router.push('/blog')} className="bg-primary text-white font-headline h-12 px-10 rounded-none shadow-lg">חזרה למדריכי המשכנתא</Button>
        </div>
        <div className="mt-auto w-full">
          <Footer />
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background text-right overflow-x-hidden">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[50vh] md:h-[60vh] lg:h-[70vh] w-full flex flex-col items-center justify-center px-6 overflow-hidden bg-stone-900">
        <div className="absolute inset-0">
          {post.heroImageUrlDesktop ? (
            <>
              <div className="hidden md:block absolute inset-0">
                <Image 
                  src={safeEncodeURI(post.heroImageUrlDesktop)} 
                  alt={post.title} 
                  fill 
                  className="object-cover opacity-60 brightness-75"
                  priority
                />
              </div>
              <div className="md:hidden absolute inset-0">
                <Image 
                  src={safeEncodeURI(post.heroImageUrlMobile || post.heroImageUrlDesktop)} 
                  alt={post.title} 
                  fill 
                  className="object-cover opacity-60 brightness-75"
                  priority
                />
              </div>
            </>
          ) : (
            <div className="absolute inset-0 bg-stone-800 flex items-center justify-center opacity-40">
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-background"></div>
        </div>
        <div className="relative z-10 text-center max-w-5xl px-4 mt-12 md:mt-20">
           <span className="boutique-label text-white/80 mb-4 md:mb-6 block drop-shadow-md uppercase tracking-[0.4em] text-[10px] md:text-xs">{post.category}</span>
           <h1 className="text-3xl md:text-5xl lg:text-7xl font-handwriting text-white mb-6 md:mb-8 font-bold hero-title-shadow leading-tight">{post.title}</h1>
           {post.subtitle && <p className="text-lg md:text-2xl lg:text-3xl font-headline italic text-white/90 leading-relaxed font-light hero-para-shadow">{post.subtitle}</p>}
        </div>
      </section>

      {/* Content Section */}
      <article className="py-16 md:py-24 lg:py-32 px-6 bg-white flex flex-col items-center">
        <div className="max-w-3xl w-full mx-auto">
          {/* Metadata Bar */}
          <div className="flex flex-col items-center gap-4 md:gap-6 mb-12 md:mb-16 pb-6 md:pb-8 border-b border-stone-100 text-stone-400 boutique-label !text-[10px] md:!text-[11px]">
             <div className="flex items-center gap-6 md:gap-8">
                <div className="flex items-center gap-2">
                    <Calendar size={14} />
                    <span>{formatDisplayDate(post.date)}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Tag size={14} />
                    <span>{post.category}</span>
                </div>
             </div>
             <Button variant="ghost" size="sm" onClick={() => router.push('/blog')} className="text-primary hover:text-accent font-bold gap-2 text-xs">
               <ChevronRight size={14} /> חזרה לבלוג
             </Button>
          </div>

          {/* Article Summary */}
          {post.summary && (
            <div className="mb-12 md:mb-16 p-6 md:p-8 bg-stone-50 border-r-4 border-primary/20 italic">
              <p className="text-xl md:text-2xl lg:text-3xl font-headline text-accent leading-relaxed">
                {post.summary}
              </p>
            </div>
          )}

          {/* Main Content Body */}
          <div 
            className="blog-content-container font-headline text-stone-700 w-full"
            dangerouslySetInnerHTML={{ __html: post.content.replace(/&nbsp;|\u00A0/g, ' ') }}
          />
          
          <div className="mt-20 md:mt-24 pt-12 md:pt-16 border-t border-stone-100 flex flex-col items-center text-center space-y-6 md:space-y-8">
             <div className="w-16 h-16 md:w-20 md:h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-2 md:mb-4">
                <ArrowRight size={24} className="md:size-8" />
             </div>
             <h4 className="text-4xl md:text-6xl font-handwriting text-accent">
               {post.ctaTitle || 'תודה שקראתם. יש לכם שאלות נוספות?'}
             </h4>
             <p className="text-lg md:text-2xl font-headline font-light text-stone-500 max-w-xl">
               {post.ctaSubtitle || 'אני מזמין אתכם לפנות אליי לשיחת היכרות אישית ולגלות איך לחסוך עשרות אלפי שקלים במשכנתא שלכם.'}
             </p>
             <Button 
               onClick={() => router.push(post.ctaLink || '/contact')} 
               className="bg-accent hover:bg-primary text-white h-12 md:h-14 px-10 md:px-16 boutique-label rounded-none shadow-xl transition-all duration-700 text-sm md:text-base"
             >
               {post.ctaLabel || 'צרו קשר לייעוץ ראשוני'}
             </Button>
          </div>
        </div>
      </article>

      <Footer />
    </main>
  );
}
