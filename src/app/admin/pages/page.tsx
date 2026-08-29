"use client";

import React, { useState, useEffect } from 'react';
import { useUser, getAdminIdToken } from '@/firebase';
import { getDraftData, saveDraftData } from '@/lib/cms-draft';
import { listAllPages } from '@/lib/cms-pages';
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

  // Load pages
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

  // Load content when page selected
  useEffect(() => {
    if (!selectedPageId) return;
    try {
      const draft = getDraftData(selectedPageId);
      setContent(draft);
      setIsDraft(!!draft);
    } catch (e) {
      console.error('Load failed:', e);
    }
  }, [selectedPageId]);

  // Auto-save draft every 1s
  useEffect(() => {
    if (!content || !selectedPageId) return;
    const timer = setTimeout(() => {
      saveDraftData(selectedPageId, content);
      setIsDraft(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, [content, selectedPageId]);

  const handlePublish = async () => {
    if (!auth.user || !selectedPageId || !content) return;
    setIsPublishing(true);
    try {
      const token = await getAdminIdToken();
      const res = await fetch('/api/admin/publish', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(content)
      });
      if (res.ok) {
        toast({ description: '✅ פורסם בהצלחה!' });
        setIsDraft(false);
      } else {
        toast({ description: '❌ פרסום נכשל', variant: 'destructive' });
      }
    } catch (error) {
      toast({ description: '❌ שגיאה בשרת', variant: 'destructive' });
    } finally {
      setIsPublishing(false);
    }
  };

  const handleCreatePage = async (pageId: string, addToNav: boolean) => {
    try {
      const token = await getAdminIdToken();
      const res = await fetch('/api/admin/create-page', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ pageId, addToNav })
      });
      if (res.ok) {
        setSelectedPageId(pageId);
        toast({ description: `✅ עמוד ${pageId} נוצר!` });
      }
    } catch (error) {
      toast({ description: '❌ יצירת עמוד נכשלה', variant: 'destructive' });
    }
  };

  if (!auth.user) return <AdminShell><div className="text-center">טוען...</div></AdminShell>;
  if (!content) return <AdminShell><div className="flex items-center justify-center gap-2"><Loader2 className="animate-spin size-5" /> טוען...</div></AdminShell>;

  const availablePages = pages.map(p => ({ id: p.id, name: p.name || p.id }));

  return (
    <AdminShell>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-4">
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
        <div className="lg:col-span-3 space-y-6">
          {/* Global Settings (if home page) */}
          {selectedPageId === 'home' && (
            <GlobalSettingsEditor
              settings={content.global || {}}
              onChange={(global) => setContent({ ...content, global })}
              availablePages={availablePages}
            />
          )}

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
              <BlockEditor
                key={block.id || idx}
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
            ))}
          </div>
        </div>
      </div>

    </AdminShell>
  );
}
