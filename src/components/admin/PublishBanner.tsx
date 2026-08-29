"use client";

import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { ToastAction } from '@/components/ui/toast';
import { UploadCloud, Trash2, Loader2, AlertCircle, Eye, Smartphone } from 'lucide-react';
import { getDraftData, clearDraftData, summarizeChanges } from '@/lib/cms-draft';
import { getAdminIdToken } from '@/firebase';
import { ConfirmDialog, ConfirmDialogState, CONFIRM_DIALOG_CLOSED } from '@/components/admin/ConfirmDialog';

type PublishingStatus = 'idle' | 'publishing-request' | 'publishing-live' | 'publish-failed';

export function PublishBanner({ currentPath }: { currentPath?: string } = {}) {
  const [hasChanges, setHasChanges] = useState(false);
  const [publishingStatus, setPublishingStatus] = useState<PublishingStatus>('idle');
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [publishedDraft, setPublishedDraft] = useState<any>(null);
  const [publishStartTime, setPublishStartTime] = useState<number | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>(CONFIRM_DIALOG_CLOSED);
  const { toast } = useToast();
  const debounceTimerRef = React.useRef<NodeJS.Timeout | null>(null);
  const pollingTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  const checkDraft = async () => {
    const draft = getDraftData();
    if (!draft) {
      setHasChanges(false);
      return;
    }

    try {
      const statusRes = await fetch('/api/admin/publish-status');
      const statusData = await statusRes.json();
      if (statusData.success && statusData.data) {
        const { labels } = summarizeChanges(statusData.data, draft);
        if (labels.length === 0) {
          clearDraftData();
          setHasChanges(false);
          return;
        }
        setHasChanges(true);
      }
    } catch (e) {
      console.error("Error checking draft status:", e);
      // On error, assume we have changes to be safe
      setHasChanges(draft !== null);
    }
  };

  useEffect(() => {
    checkDraft();

    const debouncedCheck = () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = setTimeout(() => {
        checkDraft();
      }, 400);
    };

    window.addEventListener('cms_draft_updated', debouncedCheck);
    return () => {
      window.removeEventListener('cms_draft_updated', debouncedCheck);
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      if (pollingTimerRef.current) clearTimeout(pollingTimerRef.current);
    };
  }, []);

  const pollForPublish = async (draft: any, linkPath: string) => {
    if (pollingTimerRef.current) clearTimeout(pollingTimerRef.current);

    const maxWaitMs = 3 * 60 * 1000; // 3 minutes
    const pollIntervalMs = 15 * 1000; // 15 seconds
    const startTime = Date.now();

    const poll = async () => {
      try {
        const statusRes = await fetch('/api/admin/publish-status');
        const statusData = await statusRes.json();

        if (statusData.success && statusData.data) {
          const { labels } = summarizeChanges(statusData.data, draft);
          if (labels.length === 0) {
            // Content now matches live, publish complete
            toast({
              title: "✅ האתר עודכן!",
              description: "הפרסום הושלם והאתר החי תואם לגרסה החדשה.",
              action: (
                <ToastAction
                  altText="צפייה באתר"
                  onClick={() => window.open(`${window.location.origin}${linkPath}`, '_blank', 'noopener')}
                >
                  צפייה באתר
                </ToastAction>
              )
            });
            setPublishingStatus('idle');
            setTimeout(() => {
              window.location.reload();
            }, 2000);
            return;
          }
        }

        // Check timeout
        if (Date.now() - startTime > maxWaitMs) {
          toast({
            title: "⏱️ זמן ההמתנה חלף",
            description: "הפרסום נשלח, אבל עדכון האתר לוקח יותר זמן מהצפוי. בדוק בעוד כמה דקות.",
          });
          setPublishingStatus('idle');
          return;
        }

        // Schedule next poll
        pollingTimerRef.current = setTimeout(poll, pollIntervalMs);
      } catch (e) {
        console.error('Error polling publish status:', e);
        pollingTimerRef.current = setTimeout(poll, pollIntervalMs);
      }
    };

    pollingTimerRef.current = setTimeout(poll, pollIntervalMs);
  };

  const executePublish = async (draft: any, changedPagePaths: string[]) => {
    setPublishingStatus('publishing-request');
    try {
      const idToken = await getAdminIdToken();
      const res = await fetch('/api/admin/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(idToken ? { Authorization: `Bearer ${idToken}` } : {}) },
        body: JSON.stringify(draft)
      });
      const data = await res.json();

      if (data.success) {
        clearDraftData();
        const linkPath = changedPagePaths.length === 1 ? changedPagePaths[0] : '/';
        setPublishedDraft(draft);
        setPublishStartTime(Date.now());
        setPublishingStatus('publishing-live');
        toast({
          title: "✅ הפרסום נשלח בהצלחה!",
          description: "בדקת את התצוגה ביד שלך או המתן לעדכון האתר (עד ~2 דקות).",
        });
        pollForPublish(draft, linkPath);
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "❌ פרסום נכשל",
        description: err.message || "שגיאה במהלך שליחת העדכון ל-GitHub."
      });
      setPublishingStatus('publish-failed');
    }
  };

  const handlePublish = async () => {
    const draft = getDraftData();
    if (!draft) return;

    // Best-effort plain-language summary of what's about to go live
    let changedPagePaths: string[] = [];
    let description = 'לפרסם את השינויים לאתר החי?';
    try {
      const statusRes = await fetch('/api/admin/publish-status');
      const statusData = await statusRes.json();
      const published = statusData.success ? statusData.data : null;
      const { labels, changedPagePaths: paths } = summarizeChanges(published, draft);
      changedPagePaths = paths;
      if (labels.length > 0) {
        description = `שיניתם:\n${labels.map(l => `• ${l}`).join('\n')}\n\nלפרסם את השינויים האלה לאתר החי?`;
      }
    } catch {
      // fall back to the generic confirmation message above
    }

    setConfirmDialog({
      open: true,
      title: 'פרסום לאתר החי',
      description,
      confirmLabel: 'פרסם',
      onConfirm: () => {
        setConfirmDialog(CONFIRM_DIALOG_CLOSED);
        executePublish(draft, changedPagePaths);
      },
    });
  };

  const handlePreview = async (device: 'desktop' | 'mobile') => {
    const draft = getDraftData();
    if (!draft) return;

    setIsPreviewing(true);
    try {
      const idToken = await getAdminIdToken();
      const res = await fetch('/api/admin/save-draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(idToken ? { Authorization: `Bearer ${idToken}` } : {}) },
        body: JSON.stringify(draft)
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      const url = `${window.location.origin}/api/admin/preview?path=${encodeURIComponent(currentPath || '/')}`;
      if (device === 'mobile') {
        window.open(url, '_blank', 'noopener,width=390,height=844');
      } else {
        window.open(url, '_blank', 'noopener');
      }
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
    setConfirmDialog({
      open: true,
      title: 'ביטול שינויים',
      description: 'האם אתה בטוח שברצונך לבטל את כל השינויים הלא שמורים? טיוטה זו תימחק לצמיתות והאתר יחזור לגרסה המפורסמת שלו.',
      confirmLabel: 'בטל שינויים',
      destructive: true,
      onConfirm: () => {
        setConfirmDialog(CONFIRM_DIALOG_CLOSED);
        clearDraftData();
        toast({
          title: "הטיוטה נמחקה",
          description: "האתר שוחזר למצב המפורסם הנוכחי שלו."
        });
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      },
    });
  };

  if (!hasChanges && publishingStatus === 'idle') return null;

  const isPublishing = publishingStatus === 'publishing-request' || publishingStatus === 'publishing-live';

  return (
    <>
    <div className={`h-14 border-b shadow-md flex items-center justify-between px-4 md:px-8 text-sm ${
      publishingStatus === 'publishing-live'
        ? 'bg-green-900/40 text-green-100 border-green-500/20'
        : 'bg-stone-900 text-stone-100 border-amber-500/20'
    }`}>
      <div className="flex items-center gap-2">
        {publishingStatus === 'publishing-live' ? (
          <Loader2 className="text-green-500 size-5 animate-spin" />
        ) : (
          <AlertCircle className="text-amber-500 size-5 animate-pulse" />
        )}
        {publishingStatus === 'publishing-live' ? (
          <>
            <span className="hidden md:inline font-medium">✅ הפרסום בעיצומו — האתר מתעדכן (עד ~2 דקות).</span>
            <span className="md:hidden font-medium">האתר מתעדכן...</span>
          </>
        ) : (
          <>
            <span className="hidden md:inline font-medium">✏️ ישנם שינויים בטיוטה שעדיין לא פורסמו לאתר החי.</span>
            <span className="md:hidden font-medium">ישנם שינויים שלא פורסמו.</span>
          </>
        )}
      </div>
      <div className="flex items-center gap-3">
        {publishingStatus === 'publishing-live' ? (
          <Button
            size="sm"
            onClick={() => {
              if (publishedDraft) {
                const changedPagePaths = ['/'];
                window.open(`${window.location.origin}${changedPagePaths[0]}`, '_blank', 'noopener');
              }
            }}
            className="bg-green-600 hover:bg-green-700 text-white font-bold h-9 rounded-none text-xs"
          >
            <Eye className="ml-1.5 size-3.5" />
            צפייה באתר
          </Button>
        ) : (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDiscard}
              disabled={isPublishing || isPreviewing}
              className="bg-transparent border-stone-700 text-stone-300 hover:bg-stone-800 hover:text-white h-9 rounded-none text-xs"
            >
              <Trash2 className="ml-1.5 size-3.5" />
              בטל שינויים
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePreview('desktop')}
              disabled={isPublishing || isPreviewing}
              className="bg-transparent border-stone-700 text-stone-300 hover:bg-stone-800 hover:text-white h-9 rounded-none text-xs"
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
              variant="outline"
              size="sm"
              onClick={() => handlePreview('mobile')}
              disabled={isPublishing || isPreviewing}
              title="תצוגה מקדימה בגודל מסך נייד"
              className="bg-transparent border-stone-700 text-stone-300 hover:bg-stone-800 hover:text-white h-9 w-9 p-0 rounded-none"
            >
              <Smartphone className="size-3.5" />
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
          </>
        )}
      </div>
    </div>
    <ConfirmDialog
      state={confirmDialog}
      onOpenChange={(open) => !open && setConfirmDialog(CONFIRM_DIALOG_CLOSED)}
    />
    </>
  );
}
