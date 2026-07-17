
"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useAuth } from '@/firebase';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Layout, LogOut, Loader2, HelpCircle, Trash2 } from 'lucide-react';

export default function AdminDashboard() {
  const { user, loading } = useUser();
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/admin/login');
    }
  }, [user, loading, router]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-stone-50"><Loader2 className="animate-spin text-primary size-12" /></div>;
  if (!user) return null;

  return (
    <main className="min-h-screen bg-stone-50 text-right">
      <Navbar />
      <section className="pt-48 pb-32 px-6 max-w-6xl mx-auto">
        <div className="flex justify-between items-end mb-16 border-b border-stone-200 pb-8">
          <div>
            <span className="boutique-label text-primary mb-4 block">Control Center</span>
            <h1 className="text-6xl font-handwriting text-accent">לוח בקרה אדמין</h1>
          </div>
          <Button variant="ghost" onClick={() => auth?.signOut()} className="boutique-label text-stone-400">
            התנתקות <LogOut className="mr-2 size-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          <Card 
            className="hover:shadow-2xl transition-all cursor-pointer border-none bg-white p-8 group h-full flex flex-col"
            onClick={() => router.push('/admin/blog')}
          >
            <div className="mb-8 p-4 bg-primary/10 w-fit rounded-sm group-hover:bg-primary group-hover:text-white transition-colors">
              <FileText size={40} strokeWidth={1} />
            </div>
            <h3 className="text-3xl font-headline text-accent mb-4">Admin בלוג</h3>
            <p className="text-stone-500 font-headline leading-relaxed">העלאה, עריכה ומחיקה של מאמרים בבלוג "Blog".</p>
          </Card>

          <Card 
            className="hover:shadow-2xl transition-all cursor-pointer border-none bg-white p-8 group h-full flex flex-col"
            onClick={() => router.push('/admin/pages')}
          >
            <div className="mb-8 p-4 bg-primary/10 w-fit rounded-sm group-hover:bg-primary group-hover:text-white transition-colors">
              <Layout size={40} strokeWidth={1} />
            </div>
            <h3 className="text-3xl font-headline text-accent mb-4">Admin תוכן דפים</h3>
            <p className="text-stone-500 font-headline leading-relaxed">עריכת כותרות, תכנים, תמונות וכפתורים עבור דפי האתר.</p>
          </Card>

          <Card 
            className="hover:shadow-2xl transition-all cursor-pointer border-none bg-white p-8 group h-full flex flex-col md:col-span-2 lg:col-span-1"
            onClick={() => router.push('/admin/manage-pages')}
          >
            <div className="mb-8 p-4 bg-primary/10 w-fit rounded-sm group-hover:bg-primary group-hover:text-white transition-colors">
              <Trash2 size={40} strokeWidth={1} />
            </div>
            <h3 className="text-3xl font-headline text-accent mb-4">ניהול דפים</h3>
            <p className="text-stone-500 font-headline leading-relaxed">מחיקת דפי נחיתה ותיקיות לא רצויות ישירות מהפרויקט.</p>
          </Card>

          <Card 
            className="hover:shadow-2xl transition-all cursor-pointer border-none bg-white p-8 group h-full flex flex-col md:col-span-2 lg:col-span-1"
            onClick={() => router.push('/admin/help')}
          >
            <div className="mb-8 p-4 bg-primary/10 w-fit rounded-sm group-hover:bg-primary group-hover:text-white transition-colors">
              <HelpCircle size={40} strokeWidth={1} />
            </div>
            <h3 className="text-3xl font-headline text-accent mb-4">מרכז ידע ותמיכה</h3>
            <p className="text-stone-500 font-headline leading-relaxed">הסברים מפורטים, מדריכים וטיפים לAdmin האתר שלכם.</p>
          </Card>
        </div>
      </section>
      <Footer />
    </main>
  );
}
