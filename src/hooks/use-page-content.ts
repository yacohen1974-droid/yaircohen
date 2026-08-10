import { useMemo, useState, useEffect } from 'react';
import { ContentState, getInitialPageContent } from '@/config/page-defaults';
import { useInitialData } from '@/components/providers/InitialDataProvider';
import { getDraftData, SiteData } from '@/lib/cms-draft';

// Module-level cache so every usePageContent() instance on a page shares one
// fetch instead of each hitting the API separately.
let remoteDraftPromise: Promise<SiteData | null> | null = null;

function isPreviewMode(): boolean {
  if (typeof document === 'undefined') return false;
  return document.cookie.split('; ').some(c => c.trim() === 'cms_preview=1');
}

function loadRemoteDraft(): Promise<SiteData | null> {
  if (!remoteDraftPromise) {
    remoteDraftPromise = fetch('/api/admin/preview-draft', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => (data.success ? data.data : null))
      .catch(() => null);
  }
  return remoteDraftPromise;
}

function pickPageData(source: SiteData | null | undefined, pageId: string): any {
  if (!source) return null;
  return (pageId === 'global' || pageId === 'blog') ? source[pageId] : source.pages?.[pageId];
}

export function usePageContent(pageId: string) {
  const initialDataMap = useInitialData();

  // Use server-side data for initial state if available
  const initialContent = useMemo(() => {
    if (!initialDataMap) return getInitialPageContent(pageId);

    const pageData = pickPageData(initialDataMap, pageId);

    if (pageData) {
      return {
        ...getInitialPageContent(pageId),
        ...pageData
      };
    }
    // Fallback to defaults
    return getInitialPageContent(pageId);
  }, [pageId, initialDataMap]);

  const hasInitialData = !!pickPageData(initialDataMap, pageId);

  const [content, setContent] = useState<ContentState>(initialContent);
  const [loading, setLoading] = useState(!hasInitialData);

  useEffect(() => {
    let cancelled = false;

    // Sync with draft changes if any (same-browser edits), and fall back to
    // the remote draft branch when in preview mode (other device/browser).
    const syncDraft = async () => {
      const draft = getDraftData();
      const localPageData = pickPageData(draft, pageId);
      if (localPageData) {
        setContent({
          ...getInitialPageContent(pageId),
          ...localPageData
        });
        setLoading(false);
        return;
      }

      if (isPreviewMode()) {
        const remote = await loadRemoteDraft();
        if (cancelled) return;
        const remotePageData = pickPageData(remote, pageId);
        if (remotePageData) {
          setContent({
            ...getInitialPageContent(pageId),
            ...remotePageData
          });
          setLoading(false);
        }
      }
    };

    syncDraft();
    window.addEventListener('cms_draft_updated', syncDraft);
    return () => {
      cancelled = true;
      window.removeEventListener('cms_draft_updated', syncDraft);
    };
  }, [pageId]);

  useEffect(() => {
    if (hasInitialData) {
      setLoading(false);
      return;
    }

    // Check if we have draft data, if so no need to fetch
    const draft = getDraftData();
    const localPageData = pickPageData(draft, pageId);
    if (localPageData) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function load() {
      if (isPreviewMode()) {
        const remote = await loadRemoteDraft();
        if (cancelled) return;
        const remotePageData = pickPageData(remote, pageId);
        if (remotePageData) {
          setContent({
            ...getInitialPageContent(pageId),
            ...remotePageData
          });
          setLoading(false);
          return;
        }
      }

      try {
        const res = await fetch(`/api/get-content?pageId=${pageId}`, { cache: 'no-store' });
        const data = await res.json();
        if (!cancelled && data.success && data.content) {
          setContent({
             ...getInitialPageContent(pageId),
             ...data.content
          });
        }
      } catch (e) {
        console.error('Error fetching content:', e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    // Only fetch if we don't already have initial data or to refresh
    load();
    return () => { cancelled = true; };
  }, [pageId, hasInitialData]);

  return {
    content,
    loading,
    error: null,
    isRaw: false
  };
}
