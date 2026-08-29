"use client";

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2 } from 'lucide-react';
import { slugifyPageId } from '@/lib/slug';

interface NewPageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (pageId: string, addToNav: boolean) => void;
  isLoading?: boolean;
}

export function NewPageDialog({ open, onOpenChange, onCreate, isLoading }: NewPageDialogProps) {
  const [pageName, setPageName] = useState('');
  const [addToNav, setAddToNav] = useState(true);

  const slug = slugifyPageId(pageName);
  const isValid = slug.length > 0;

  const handleCreate = () => {
    if (isValid) {
      onCreate(slug, addToNav);
      setPageName('');
      setAddToNav(true);
      onOpenChange(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isValid && !isLoading) {
      handleCreate();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>עמוד חדש</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="page-name">שם העמוד</Label>
            <Input
              id="page-name"
              value={pageName}
              onChange={(e) => setPageName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="למשל: אודות שלי"
              autoFocus
              disabled={isLoading}
            />
          </div>

          {pageName && (
            <div className="space-y-1 p-3 bg-stone-50 rounded-sm">
              <p className="text-xs text-stone-500">כתובת בפועל:</p>
              <code className="text-sm font-mono text-primary dir-ltr block">/{slug}</code>
            </div>
          )}

          <div className="flex items-center gap-2">
            <Checkbox
              id="add-to-nav"
              checked={addToNav}
              onCheckedChange={(checked) => setAddToNav(checked as boolean)}
              disabled={isLoading}
            />
            <Label htmlFor="add-to-nav" className="cursor-pointer">הוסף לתפריט הראשי</Label>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            ביטול
          </Button>
          <Button
            onClick={handleCreate}
            disabled={!isValid || isLoading}
            className="bg-primary hover:bg-accent"
          >
            {isLoading ? <><Loader2 className="ml-2 size-4 animate-spin" /> יוצר...</> : 'צור עמוד'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
