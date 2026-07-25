"use client";

import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { UploadCloud, Trash2, Loader2, AlertCircle } from 'lucide-react';
import { hasDraftChanges, getDraftData, clearDraftData } from '@/lib/cms-draft';

export function PublishBanner() {
  const [hasChanges, setHasChanges] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
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
        toast({
          title: "✅ האתר פורסם בהצלחה!",
          description: "השינויים נשלחו ל-GitHub ויהיו זמינים באונליין תוך כדקה."
        });
        setTimeout(() => {
          window.location.reload();
        }, 1500);
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
          disabled={isPublishing}
          className="border-stone-700 text-stone-300 hover:bg-stone-800 hover:text-white h-9 rounded-none text-xs"
        >
          <Trash2 className="ml-1.5 size-3.5" />
          בטל שינויים
        </Button>
        <Button 
          size="sm"
          onClick={handlePublish}
          disabled={isPublishing}
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
