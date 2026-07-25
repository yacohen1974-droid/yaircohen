"use client";

import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { ToastAction } from '@/components/ui/toast';
import { UploadCloud, Trash2, Loader2, AlertCircle, Eye } from 'lucide-react';
import { hasDraftChanges, getDraftData, clearDraftData, summarizeChanges } from '@/lib/cms-draft';

export function PublishBanner() {
  const [hasChanges, setHasChanges] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const { toast } = useToast();

  const checkDraft = () => {
    setHasChanges(hasDraftChanges());
  };

  useEffect(() => {
    checkDraft();
    window.addEventListener('cms_draft_updated', checkDraft);
    return () => {
      window.removeEventListener('cms_draft_updated', checkDraft);
    };
  }, []);

  const handlePublish = async () => {
    const draft = getDraftData();
    if (!draft) return;

    // Best-effort plain-language summary of what's about to go live
    let changedPagePaths: string[] = [];
    try {
      const backupRes = await fetch('/api/admin/get-backup-data');
      const backupData = await backupRes.json();
      const published = backupData.success ? backupData.data : null;
      const { labels, changedPagePaths: paths } = summarizeChanges(published, draft);
      changedPagePaths = paths;

      const confirmMsg = labels.length > 0
        ? `שיניתם:\n${labels.map(l => `• ${l}`).join('\n')}\n\nלפרסם את השינויים האלה לאתר החי?`
        : 'לפרסם את השינויים לאתר החי?';
      if (!window.confirm(confirmMsg)) return;
    } catch {
      if (!window.confirm('לפרסם את השינויים לאתר החי?')) return;
    }

    setIsPublishing(true);
    try {
      const res = await fetch('/api/admin/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draft)
      });
      const data = await res.json();

      if (data.success) {
        clearDraftData();
        const linkPath = changedPagePaths.length === 1 ? changedPagePaths[0] : '/';
        toast({
          title: "✅ האתר פורסם בהצלחה!",
          description: "השינויים נשלחו ל-GitHub ויהיו זמינים באונליין תוך כדקה.",
          action: (
            <ToastAction
              altText="צפייה באתר"
              onClick={() => window.open(`${window.location.origin}${linkPath}`, '_blank', 'noopener')}
            >
              צפייה באתר
            </ToastAction>
          )
        });
        setTimeout(() => {
          window.location.reload();
        }, 4000);
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "❌ פרסום נכשל",
        description: err.message || "שגיאה במהלך שליחת העדכון ל-GitHub."
      });
    } finally {
      setIsPublishing(false);
    }
  };

  const handlePreview = async () => {
    const draft = getDraftData();
    if (!draft) return;

    setIsPreviewing(true);
    try {
      const res = await fetch('/api/admin/save-draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draft)
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      window.open(`${window.location.origin}/api/admin/preview`, '_blank', 'noopener');
      toast({
        title: "🔍 תצוגה מקדימה מוכנה",
        description: "נפתחה בכרטיסייה חדשה. אפשר לגלוש בכל עמודי האתר ולראות את הטיוטה, ואף לשתף את הקישור למישהו אחר לבדיקה (בתוקף ל-24 שעות)."
      });
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "❌ יצירת תצוגה מקדימה נכשלה",
        description: err.message || "שגיאה בשמירת הטיוטה לצורך תצוגה מקדימה."
      });
    } finally {
      setIsPreviewing(false);
    }
  };

  const handleDiscard = () => {
    if (!window.confirm("האם אתה בטוח שברצונך לבטל את כל השינויים הלא שמורים? טיוטה זו תימחק לצמיתות והאתר יחזור לגרסה המפורסמת שלו.")) return;
    clearDraftData();
    toast({
      title: "הטיוטה נמחקה",
      description: "האתר שוחזר למצב המפורסם הנוכחי שלו."
    });
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  if (!hasChanges) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] bg-stone-900 text-stone-100 h-14 border-b border-amber-500/20 shadow-md flex items-center justify-between px-4 md:px-8 text-sm">
      <div className="flex items-center gap-2">
        <AlertCircle className="text-amber-500 size-5 animate-pulse" />
        <span className="hidden md:inline font-medium">✏️ ישנם שינויים בטיוטה שעדיין לא פורסמו לאתר החי.</span>
        <span className="md:hidden font-medium">ישנם שינויים שלא פורסמו.</span>
      </div>
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={handleDiscard}
          disabled={isPublishing || isPreviewing}
          className="border-stone-700 text-stone-300 hover:bg-stone-800 hover:text-white h-9 rounded-none text-xs"
        >
          <Trash2 className="ml-1.5 size-3.5" />
          בטל שינויים
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handlePreview}
          disabled={isPublishing || isPreviewing}
          className="border-stone-700 text-stone-300 hover:bg-stone-800 hover:text-white h-9 rounded-none text-xs"
        >
          {isPreviewing ? (
            <>
              <Loader2 className="ml-1.5 size-3.5 animate-spin" />
              מכין תצוגה...
            </>
          ) : (
            <>
              <Eye className="ml-1.5 size-3.5" />
              תצוגה מקדימה
            </>
          )}
        </Button>
        <Button
          size="sm"
          onClick={handlePublish}
          disabled={isPublishing || isPreviewing}
          className="bg-amber-500 hover:bg-amber-600 text-stone-900 font-bold h-9 rounded-none text-xs"
        >
          {isPublishing ? (
            <>
              <Loader2 className="ml-1.5 size-3.5 animate-spin" />
              מפרסם...
            </>
          ) : (
            <>
              <UploadCloud className="ml-1.5 size-3.5" />
              פרסם שינויים
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
