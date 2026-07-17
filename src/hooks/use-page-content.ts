import { useMemo, useState, useEffect } from 'react';
import { ContentState, getInitialPageContent } from '@/config/page-defaults';
import { useInitialData } from '@/components/providers/InitialDataProvider';

export function usePageContent(pageId: string) {
  const initialDataMap = useInitialData();
  
  // Use server-side data for initial state if available
  const initialContent = useMemo(() => {
    if (initialDataMap && initialDataMap[pageId]) {
      return {
        ...getInitialPageContent(pageId),
        ...initialDataMap[pageId]
      };
    }
    // Fallback to defaults
    return getInitialPageContent(pageId);
  }, [pageId, initialDataMap]);

  const [content, setContent] = useState<ContentState>(initialContent);
  const [loading, setLoading] = useState(!initialDataMap?.[pageId]);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/get-content?pageId=${pageId}`);
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
  }, [pageId]);

  return {
    content,
    loading,
    error: null,
    isRaw: false
  };
}
