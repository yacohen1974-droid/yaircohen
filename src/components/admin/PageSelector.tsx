"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Download, Upload, Trash2, RefreshCcw, Loader2 } from 'lucide-react';
import { NewPageDialog } from '@/components/admin/NewPageDialog';
import { ConfirmDialog, ConfirmDialogState, CONFIRM_DIALOG_CLOSED } from '@/components/admin/ConfirmDialog';

interface PageSelectorProps {
  pages: Array<{ id: string; name: string }>;
  selectedPageId: string | null;
  onSelectPage: (pageId: string) => void;
  onCreatePage: (pageId: string, addToNav: boolean) => void;
  onPublish: () => Promise<void>;
  onRevert: () => Promise<void>;
  isDraft: boolean;
  isPublishing: boolean;
  isLoading: boolean;
}

export function PageSelector({
  pages,
  selectedPageId,
  onSelectPage,
  onCreatePage,
  onPublish,
  onRevert,
  isDraft,
  isPublishing,
  isLoading
}: PageSelectorProps) {
  const [isNewPageDialogOpen, setIsNewPageDialogOpen] = useState(false);
  const [isCreatingPage, setIsCreatingPage] = useState(false);
  const [confirmState, setConfirmState] = useState<ConfirmDialogState>(CONFIRM_DIALOG_CLOSED);

  const selectedPage = pages.find(p => p.id === selectedPageId);

  const handleCreatePage = async (pageId: string, addToNav: boolean) => {
    setIsCreatingPage(true);
    try {
      onCreatePage(pageId, addToNav);
    } finally {
      setIsCreatingPage(false);
    }
  };

  const handlePublish = async () => {
    try {
      await onPublish();
    } catch (error) {
      console.error('Publish failed:', error);
    }
  };

  const handleRevert = () => {
    setConfirmState({
      open: true,
      title: 'שחזר לגרסה קודמת?',
      description: 'הפעולה זו תחזיר את האתר לגרסה המפורסמת האחרונה.',
      onConfirm: async () => {
        try {
          await onRevert();
          setConfirmState(CONFIRM_DIALOG_CLOSED);
        } catch (error) {
          console.error('Revert failed:', error);
        }
      }
    });
  };

  return (
    <>
      <div className="space-y-4">
        {/* Page Selector */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">בחר דף</label>
          <div className="flex gap-2">
            <Select value={selectedPageId || ''} onValueChange={onSelectPage}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="בחר דף לעריכה" />
              </SelectTrigger>
              <SelectContent>
                {pages.map((page) => (
                  <SelectItem key={page.id} value={page.id}>
                    {page.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              size="icon"
              variant="outline"
              onClick={() => setIsNewPageDialogOpen(true)}
              title="עמוד חדש"
            >
              <Plus size={16} />
            </Button>
          </div>
        </div>

        {/* Page Status */}
        {selectedPage && (
          <Card>
            <CardContent className="pt-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-stone-600">עמוד נבחר:</span>
                <span className="font-medium">{selectedPage.name}</span>
              </div>

              {isDraft && (
                <Badge variant="outline" className="bg-amber-50 text-amber-900 border-amber-200">
                  יש שינויים שלא פורסמו
                </Badge>
              )}

              {!isDraft && (
                <Badge variant="outline" className="bg-green-50 text-green-900 border-green-200">
                  עדכני
                </Badge>
              )}
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 flex-wrap">
          <Button
            onClick={handlePublish}
            disabled={isPublishing || isLoading || !isDraft}
            className="bg-primary hover:bg-accent"
          >
            {isPublishing ? (
              <>
                <Loader2 className="ml-2 size-4 animate-spin" />
                בעיצומו...
              </>
            ) : (
              <>
                <Upload className="ml-2 size-4" />
                פרסם
              </>
            )}
          </Button>

          <Button
            variant="outline"
            onClick={handleRevert}
            disabled={isPublishing || isLoading}
          >
            <RefreshCcw className="ml-2 size-4" />
            שחזר
          </Button>

          <Button
            variant="ghost"
            onClick={() => {
              if (selectedPageId) {
                const content = { pages: { [selectedPageId]: {} } };
                const blob = new Blob([JSON.stringify(content, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${selectedPageId}.json`;
                a.click();
              }
            }}
            disabled={isLoading}
          >
            <Download className="ml-2 size-4" />
            ייצוא
          </Button>
        </div>
      </div>

      <NewPageDialog
        open={isNewPageDialogOpen}
        onOpenChange={setIsNewPageDialogOpen}
        onCreate={handleCreatePage}
        isLoading={isCreatingPage}
      />

      <ConfirmDialog
        state={confirmState}
        onOpenChange={(open) => !open && setConfirmState(CONFIRM_DIALOG_CLOSED)}
      />
    </>
  );
}
