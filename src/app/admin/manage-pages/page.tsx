"use client";

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Trash2, Loader2, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';

export default function ManagePagesPage() {
  const [pages, setPages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();
  const { user, loading: authLoading } = useUser();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/admin/login');
    }
  }, [user, authLoading, router]);

  const fetchPages = async () => {
    try {
      const res = await fetch('/api/list-pages');
      const data = await res.json();
      if (data.pages) setPages(data.pages);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const handleDelete = async (pageId: string) => {
    if (!confirm(`האם אתם בטוחים שברצונכם למחוק את הדף "${pageId}"? פעולה זו תמחק את התיקייה מהפרויקט לצמיתות.`)) return;
    
    setDeleting(pageId);
    try {
      const res = await fetch('/api/delete-page', {
        method: 'POST',
        body: JSON.stringify({ pageId }),
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      if (data.success) {
        toast({ title: "הדף נמחק בהצלחה", description: "התיקייה הוסרה מהפרויקט." });
        setPages(pages.filter(p => p !== pageId));
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      toast({ variant: "destructive", title: "שגיאה במחיקה", description: error.message });
    } finally {
      setDeleting(null);
    }
  };

  if (authLoading || loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><Loader2 className="animate-spin text-primary size-12" /></div>;
  if (!user) return null;

  return (
    <main className="min-h-screen bg-slate-50 text-right">
      <Navbar />
      <section className="pt-48 pb-32 px-6 max-w-4xl mx-auto">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-400 hover:text-primary transition-colors mb-8 boutique-label">
           חזרה <ArrowRight size={14} />
        </button>
        
        <div className="mb-16">
          <span className="boutique-label text-primary mb-4 block">System Management</span>
          <h1 className="text-6xl font-handwriting text-accent">ניהול דפי האתר</h1>
          <p className="text-slate-500 mt-4 text-xl font-light">כאן תוכלו לראות את כל דפי הנחיתה והשירותים ולמחוק תיקיות שאינן רצויות מהפרויקט.</p>
        </div>

        <div className="space-y-6">
          {pages.length === 0 ? (
            <div className="text-center py-20 space-y-6">
              <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 flex items-center justify-center">
                <Trash2 size={28} className="text-slate-300" />
              </div>
              <div className="space-y-2">
                <p className="text-slate-600 font-headline text-xl">אין דפים למחיקה כרגע</p>
                <p className="text-slate-400 text-sm max-w-md mx-auto leading-relaxed">
                  כאן יופיעו דפי נחיתה ושירותים שנוצרו ידנית כתיקיות קוד בפרויקט (מחוץ לדפים הקבועים כמו בית, אודות, שירותים וכו׳). 
                  ניתן למחוק אותם מכאן כאשר הם כבר אינם נדרשים.
                </p>
              </div>
            </div>
          ) : (
            pages.map(page => (
              <Card key={page} className="p-6 flex justify-between items-center bg-white border-none shadow-sm hover:shadow-md transition-all">
                <div>
                  <h3 className="text-2xl font-headline text-accent uppercase tracking-wider">{page}</h3>
                  <p className="text-sm text-slate-400">path: src/app/{page}</p>
                </div>
                <Button 
                  variant="destructive" 
                  size="icon" 
                  onClick={() => handleDelete(page)}
                  disabled={deleting === page}
                  className="rounded-none bg-slate-50 text-slate-400 hover:bg-destructive hover:text-white transition-all"
                >
                  {deleting === page ? <Loader2 className="animate-spin size-4" /> : <Trash2 size={20} strokeWidth={1.5} />}
                </Button>
              </Card>
            ))
          )}
        </div>

        <div className="mt-12 p-8 bg-amber-50 border border-amber-100 rounded-sm">
          <p className="text-amber-800 text-sm leading-relaxed">
            <strong>אזהרה:</strong> מחיקת דף מכאן מוחקת פיזית את התיקייה שלו מהקוד שלכם. ודאו שיש לכם גיבוי או שאתם בטוחים שאינכם זקוקים לדף זה.
          </p>
        </div>
      </section>
      <Footer />
    </main>
  );
}
