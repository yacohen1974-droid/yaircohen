"use client";

import React, { useState, useEffect } from 'react';
import { AdminShell } from '@/components/admin/AdminShell';
import { ConfirmDialog, ConfirmDialogState, CONFIRM_DIALOG_CLOSED } from '@/components/admin/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Trash2, Loader2, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { getDraftData, saveDraftData, initializeDraft } from '@/lib/cms-draft';

export default function ManagePagesPage() {
  const [pages, setPages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>(CONFIRM_DIALOG_CLOSED);
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
      if (data.pages) {
        const combined = [...data.pages];
        const draft = getDraftData();
        if (draft && draft.pages) {
          Object.keys(draft.pages).forEach((p: string) => {
            if (!combined.includes(p)) {
              combined.push(p);
            }
          });
        }
        // Filter out default pages that shouldn't be deleted here
        const deletablePages = combined.filter(p => p !== 'home' && p !== 'contact');
        setPages(deletablePages);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const handleDelete = (pageId: string) => {
    setConfirmDialog({
      open: true,
      title: 'מחיקת עמוד',
      description: `האם אתם בטוחים שברצונכם למחוק את הדף "${pageId}"?`,
      confirmLabel: 'מחק',
      destructive: true,
      onConfirm: () => {
        setConfirmDialog(CONFIRM_DIALOG_CLOSED);
        executeDelete(pageId);
      },
    });
  };

  const executeDelete = async (pageId: string) => {
    setDeleting(pageId);
    try {
      let draft = getDraftData();
      if (!draft) {
        draft = await initializeDraft();
      }
      
      if (draft.pages?.[pageId]) {
        delete draft.pages[pageId];
      }
      if (draft[pageId]) {
        delete draft[pageId];
      }
      
      saveDraftData(draft);
      
      toast({ title: "הדף נמחק בהצלחה", description: "הדף הוסר מהטיוטה הנוכחית." });
      setPages(pages.filter(p => p !== pageId));
    } catch (error: any) {
      toast({ variant: "destructive", title: "שגיאה במחיקה", description: error.message });
    } finally {
      setDeleting(null);
    }
  };

  if (authLoading || loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><Loader2 className="animate-spin text-primary size-12" /></div>;
  if (!user) return null;

  return (
    <AdminShell>
      <section className="pt-20 pb-32 px-6 max-w-4xl mx-auto">
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
            <strong>שימו לב:</strong> מחיקת דף מכאן מסירה אותו מהטיוטה הנוכחית בלבד — הוא לא יימחק סופית מהאתר החי עד שתלחצו "פרסם שינויים".
          </p>
        </div>
      </section>
      <ConfirmDialog
        state={confirmDialog}
        onOpenChange={(open) => !open && setConfirmDialog(CONFIRM_DIALOG_CLOSED)}
      />
    </AdminShell>
  );
}
