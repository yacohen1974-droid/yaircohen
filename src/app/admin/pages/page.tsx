"use client";

import React, { useState, useEffect } from 'react';
import { useUser, getAdminIdToken } from '@/firebase';
import { getDraftData, saveDraftData, initializeDraft, hasDraftChanges } from '@/lib/cms-draft';
import { listAllPages } from '@/lib/cms-pages';
import { hrefToPageId } from '@/lib/slug';
import { publishSiteData } from '@/firebase/firestore-cms';
import { AdminShell } from '@/components/admin/AdminShell';
import { GlobalSettingsEditor } from '@/components/admin/GlobalSettingsEditor';
import { PageSelector } from '@/components/admin/PageSelector';
import { PageEditor } from '@/components/admin/PageEditor';
import { BlockEditor } from '@/components/admin/BlockEditor';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export default function AdminPages() {
  const auth = useUser();
  const { toast } = useToast();

  const [pages, setPages] = useState<Array<{ id: string; name: string }>>([]);
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);
  const [content, setContent] = useState<any>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isDraft, setIsDraft] = useState(false);

  // Load pages list
  useEffect(() => {
    const loadPages = async () => {
      try {
        const allPages = await listAllPages();
        setPages(allPages);
        if (allPages.length > 0 && !selectedPageId) {
          setSelectedPageId(allPages[0].id);
        }
      } catch (error) {
        console.error('Failed to load pages:', error);
      }
    };
    loadPages();
  }, [selectedPageId]);

  // Load page-specific content from draft when selectedPageId changes
  useEffect(() => {
    if (!selectedPageId) return;
    const loadContent = async () => {
      try {
        let draft = getDraftData();
        if (!draft) {
          draft = await initializeDraft();
        }
        const pageData = draft.pages?.[selectedPageId] || {
          primaryColor: '213 75% 35%',
          metaTitle: '',
          metaDescription: '',
          blocks: [],
          pageId: selectedPageId
        };
        setContent({
          ...pageData,
          global: draft.global || {},
          blog: draft.blog || {},
        });
      } catch (e) {
        console.error('Load failed:', e);
      }
    };
    loadContent();
  }, [selectedPageId]);

  // Auto-save draft changes every 1s
  useEffect(() => {
    if (!content || !selectedPageId) return;
    const timer = setTimeout(async () => {
      try {
        let draft = getDraftData();
        if (!draft) {
          draft = await initializeDraft();
        }
        if (!draft.pages) draft.pages = {};

        // Split global/blog from page-level content before saving
        const { global, blog, ...pageData } = content;
        if (selectedPageId !== 'global') {
          draft.pages[selectedPageId] = pageData;
        }
        if (global) draft.global = global;
        if (blog) draft.blog = blog;

        saveDraftData(draft);
      } catch (e) {
        console.error('Auto-save failed:', e);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [content, selectedPageId]);

  // Listen to draft updates to keep draft status badge in sync
  useEffect(() => {
    const syncDraftStatus = () => {
      setIsDraft(hasDraftChanges());
    };
    window.addEventListener('cms_draft_updated', syncDraftStatus);
    syncDraftStatus();
    return () => {
      window.removeEventListener('cms_draft_updated', syncDraftStatus);
    };
  }, []);

  const handlePublish = async () => {
    if (!auth.user || !selectedPageId || !content) return;
    setIsPublishing(true);
    try {
      const token = await getAdminIdToken();
      const draft = getDraftData();
      if (!draft) {
        toast({ description: '❌ אין שינויים לפרסום', variant: 'destructive' });
        return;
      }

      // Write directly to Firestore using client-side SDK (authenticated)
      await publishSiteData(draft);

      const res = await fetch('/api/admin/publish', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ revalidateOnly: true })
      });
      if (res.ok) {
        toast({ description: '✅ פורסם בהצלחה!' });
        setIsDraft(false);
      } else {
        const errData = await res.json().catch(() => ({}));
        toast({ description: `❌ פרסום נכשל: ${errData.error || 'שגיאה כללית'}`, variant: 'destructive' });
      }
    } catch (error: any) {
      toast({ description: `❌ שגיאה בשרת: ${error.message || error}`, variant: 'destructive' });
    } finally {
      setIsPublishing(false);
    }
  };

  const handleCreatePage = async (pageId: string, addToNav: boolean) => {
    try {
      let draft = getDraftData();
      if (!draft) {
        draft = await initializeDraft();
      }

      if (!draft.pages) draft.pages = {};
      if (!draft.pages[pageId]) {
        draft.pages[pageId] = {
          primaryColor: draft.global?.primaryColor || '213 75% 35%',
          metaTitle: '',
          metaDescription: '',
          blocks: [],
          pageId
        };
      }

      if (addToNav && draft.global) {
        if (!draft.global.navItems) draft.global.navItems = [];
        const exists = draft.global.navItems.some((item: any) => item.href === `/${pageId}`);
        if (!exists) {
          draft.global.navItems.push({
            label: pageId,
            href: `/${pageId}`
          });
        }
      }

      saveDraftData(draft);

      // Refresh pages list
      const allPages = await listAllPages();
      setPages(allPages);

      setSelectedPageId(pageId);
      toast({ description: `✅ עמוד ${pageId} נוצר!` });
    } catch (error) {
      toast({ description: '❌ יצירת עמוד נכשלה', variant: 'destructive' });
    }
  };

  if (!auth.user) return <AdminShell><div className="text-center">טוען...</div></AdminShell>;
  if (!content) return <AdminShell><div className="flex items-center justify-center gap-2"><Loader2 className="animate-spin size-5" /> טוען...</div></AdminShell>;

  const getPageDisplayName = (id: string, name: string) => {
    if (id === 'home') return '🏠 ראשי';
    if (id === 'contact') return '📩 צור קשר';
    if (id === 'global') return '⚙️ הגדרות כלליות';

    const globalSettings = content?.global;
    if (globalSettings) {
      const menuKeys = ['navItems', 'footerItems', 'legalItems'];
      for (const key of menuKeys) {
        const items = globalSettings[key];
        if (Array.isArray(items)) {
          const match = items.find((item: any) => {
            const rawId = typeof item?.href === 'string' ? hrefToPageId(item.href) : null;
            return rawId?.toLowerCase() === id;
          });
          if (match && match.label) {
            const suffix = name.includes('(טיוטה)') ? ' (טיוטה)' : '';
            return `📄 ${match.label}${suffix}`;
          }
        }
      }
    }

    return name;
  };

  const availablePages = pages.map(p => ({
    id: p.id,
    name: getPageDisplayName(p.id, p.name)
  }));

  return (
    <AdminShell>
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-4">
            <PageSelector
              pages={availablePages}
              selectedPageId={selectedPageId}
              onSelectPage={setSelectedPageId}
              onCreatePage={handleCreatePage}
              onPublish={handlePublish}
              onRevert={async () => {}}
              isDraft={isDraft}
              isPublishing={isPublishing}
              isLoading={false}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-8 space-y-6">
            {selectedPageId === 'global' ? (
              <GlobalSettingsEditor
                settings={content.global || {}}
                onChange={(global) => setContent({ ...content, global })}
                availablePages={availablePages.filter(p => p.id !== 'global')}
              />
            ) : (
              <>
                {/* Page-level Settings */}
                <PageEditor
                  content={content}
                  onChange={setContent}
                  onAddBlock={(type) => {
                    const id = Math.random().toString(36).slice(2, 9);
                    const newBlock = { id, type, title: '', content: '' };
                    setContent({
                      ...content,
                      blocks: [...(content.blocks || []), newBlock]
                    });
                  }}
                />

                {/* Block Editors */}
                <div className="space-y-2">
                  <h3 className="font-headline text-lg">עריכת בלוקים</h3>
                  {(content.blocks || []).map((block: any, idx: number) => (
                    <div id={`block-editor-${block.id || idx}`} key={block.id || idx} className="scroll-mt-6 rounded-2xl transition-all duration-300">
                      <BlockEditor
                        section={block}
                        onChange={(updated) => {
                          const blocks = [...(content.blocks || [])];
                          blocks[idx] = updated;
                          setContent({ ...content, blocks });
                        }}
                        onRemove={() => {
                          const blocks = [...(content.blocks || [])];
                          blocks.splice(idx, 1);
                          setContent({ ...content, blocks });
                        }}
                        onMoveUp={() => {
                          const blocks = [...(content.blocks || [])];
                          if (idx > 0) {
                            [blocks[idx], blocks[idx - 1]] = [blocks[idx - 1], blocks[idx]];
                          }
                          setContent({ ...content, blocks });
                        }}
                        onMoveDown={() => {
                          const blocks = [...(content.blocks || [])];
                          if (idx < blocks.length - 1) {
                            [blocks[idx], blocks[idx + 1]] = [blocks[idx + 1], blocks[idx]];
                          }
                          setContent({ ...content, blocks });
                        }}
                        isFirst={idx === 0}
                        isLast={idx === (content.blocks?.length || 0) - 1}
                      />
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
