import { useMemo, useState, useEffect } from 'react';
import { ContentState, getInitialPageContent } from '@/config/page-defaults';
import { useInitialData } from '@/components/providers/InitialDataProvider';
import { getDraftData } from '@/lib/cms-draft';

export function usePageContent(pageId: string) {
  const initialDataMap = useInitialData();
  
  // Use server-side data for initial state if available
  const initialContent = useMemo(() => {
    // 1. Check client-side draft first if window exists
    if (typeof window !== 'undefined') {
      const draft = getDraftData();
      const pageData = (pageId === 'global' || pageId === 'blog')
        ? draft?.[pageId]
        : draft?.pages?.[pageId];
      if (pageData) {
        return {
          ...getInitialPageContent(pageId),
          ...pageData
        };
      }
    }

    if (!initialDataMap) return getInitialPageContent(pageId);
    
    const pageData = (pageId === 'global' || pageId === 'blog')
      ? initialDataMap[pageId]
      : initialDataMap.pages?.[pageId];
      
    if (pageData) {
      return {
        ...getInitialPageContent(pageId),
        ...pageData
      };
    }
    // Fallback to defaults
    return getInitialPageContent(pageId);
  }, [pageId, initialDataMap]);

  const hasInitialData = !!((pageId === 'global' || pageId === 'blog')
    ? initialDataMap?.[pageId]
    : initialDataMap?.pages?.[pageId]);

  const [content, setContent] = useState<ContentState>(initialContent);
  const [loading, setLoading] = useState(!hasInitialData);

  useEffect(() => {
    // Sync with draft changes if any
    const syncDraft = () => {
      const draft = getDraftData();
      const pageData = (pageId === 'global' || pageId === 'blog')
        ? draft?.[pageId]
        : draft?.pages?.[pageId];
      if (pageData) {
        setContent({
          ...getInitialPageContent(pageId),
          ...pageData
        });
        setLoading(false);
      }
    };
    
    syncDraft();
    window.addEventListener('cms_draft_updated', syncDraft);
    return () => {
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
    const pageData = (pageId === 'global' || pageId === 'blog')
      ? draft?.[pageId]
      : draft?.pages?.[pageId];
    if (pageData) {
      setLoading(false);
      return;
    }

    async function load() {
      try {
        const res = await fetch(`/api/get-content?pageId=${pageId}`, { cache: 'no-store' });
        const data = await res.json();
        if (data.success && data.content) {
          setContent({
             ...getInitialPageContent(pageId),
             ...data.content
          });
        }
      } catch (e) {
        console.error('Error fetching content:', e);
      } finally {
        setLoading(false);
      }
    }
    
    // Only fetch if we don't already have initial data or to refresh
    load();
  }, [pageId, hasInitialData]);

  return {
    content,
    loading,
    error: null,
    isRaw: false
  };
}
