"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Monitor, Plus, Box, Quote, HelpCircle, UserRound, Type, ImageIcon,
  BarChart2, Mail, Video, Music, Sparkles, Compass, ChevronUp, ChevronDown, Trash2
} from 'lucide-react';

interface PageEditorProps {
  content: any;
  onChange: (content: any) => void;
  onAddBlock: (blockType: string) => void;
}

const PRESET_COLORS = [
  { name: 'כחול מקצועי', value: '213 75% 35%' },
  { name: 'כחול נייבי', value: '220 60% 18%' },
  { name: 'כחול בהיר', value: '210 80% 50%' },
  { name: 'זהב', value: '42 70% 48%' },
  { name: 'ירוק כסף', value: '155 15% 45%' },
  { name: 'אפור כחלחל', value: '215 25% 40%' },
  { name: 'טרקוטה', value: '15 35% 50%' },
  { name: 'אפור כהה', value: '220 10% 30%' },
];

const BLOCK_TEMPLATES = [
  { type: 'hero', label: 'כותרת (Hero)', icon: Monitor },
  { type: 'intro', label: 'אודות / פורטרט', icon: UserRound },
  { type: 'text', label: 'בלוק טקסט', icon: Type },
  { type: 'image-text', label: 'תמונה וטקסט', icon: ImageIcon },
  { type: 'features', label: 'קוביות תוכן', icon: Box },
  { type: 'testimonials', label: 'המלצות', icon: Quote },
  { type: 'faqs', label: 'שאלות ותשובות', icon: HelpCircle },
  { type: 'stats', label: 'סטטיסטיקות', icon: BarChart2 },
  { type: 'contact', label: 'טופס יצירת קשר', icon: Mail },
  { type: 'video', label: 'וידאו', icon: Video },
  { type: 'blog-grid', label: 'בלוג', icon: Music },
  { type: 'cta', label: 'כפתורי פעולה', icon: Sparkles },
];

export function PageEditor({ content, onChange, onAddBlock }: PageEditorProps) {
  const set = (patch: any) => onChange({ ...content, ...patch });

  const handleBlockChange = (index: number, block: any) => {
    const blocks = [...(content.blocks || [])];
    blocks[index] = block;
    set({ blocks });
  };

  const handleRemoveBlock = (index: number) => {
    const blocks = [...(content.blocks || [])];
    blocks.splice(index, 1);
    set({ blocks });
  };

  const handleMoveBlock = (index: number, direction: 'up' | 'down') => {
    const blocks = [...(content.blocks || [])];
    if (direction === 'up' && index > 0) {
      [blocks[index], blocks[index - 1]] = [blocks[index - 1], blocks[index]];
    } else if (direction === 'down' && index < blocks.length - 1) {
      [blocks[index], blocks[index + 1]] = [blocks[index + 1], blocks[index]];
    }
    set({ blocks });
  };

  return (
    <div className="space-y-6">
      {/* SEO Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Monitor size={20} />
            הגדרות עמוד (SEO)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="metaTitle">כותרת לתוצאות חיפוש</Label>
            <Input
              id="metaTitle"
              value={content.metaTitle || ''}
              onChange={(e) => set({ metaTitle: e.target.value })}
              placeholder="כותרת המופיעה בגוגל"
              maxLength={60}
            />
            <p className="text-xs text-stone-500 mt-1">
              {content.metaTitle?.length || 0} / 60 תווים
            </p>
          </div>

          <div>
            <Label htmlFor="metaDescription">תיאור לתוצאות חיפוש</Label>
            <Textarea
              id="metaDescription"
              value={content.metaDescription || ''}
              onChange={(e) => set({ metaDescription: e.target.value })}
              placeholder="תיאור קצר עבור מנועי חיפוש"
              rows={3}
              maxLength={160}
            />
            <p className="text-xs text-stone-500 mt-1">
              {content.metaDescription?.length || 0} / 160 תווים
            </p>
          </div>

          <div>
            <Label htmlFor="primaryColor">צבע ראשי לעמוד זה</Label>
            <Select value={content.primaryColor || ''} onValueChange={(v) => set({ primaryColor: v })}>
              <SelectTrigger className="bg-stone-50">
                <SelectValue placeholder="בחר צבע" />
              </SelectTrigger>
              <SelectContent>
                {PRESET_COLORS.map((color) => (
                  <SelectItem key={color.value} value={color.value}>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: `hsl(${color.value})` }}
                      />
                      {color.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Blocks Management */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Box size={20} />
            ניהול בלוקים
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-stone-600">
            הוסיפו בלוקים לעמוד. בכל בלוק תוכלו לערוך את התוכן והסגנון בנפרד.
          </p>

          {(content.blocks || []).length === 0 ? (
            <div className="text-center py-8 bg-stone-50 rounded border border-dashed border-stone-200">
              <p className="text-stone-500 text-sm">אין בלוקים עדיין</p>
              <p className="text-xs text-stone-400 mt-1">בחרו בלוק להוספה מלמטה</p>
            </div>
          ) : (
            <div className="space-y-4 mb-6">
              {(content.blocks || []).map((block: any, idx: number) => (
                <div
                  key={block.id || idx}
                  className="bg-stone-50 border border-stone-200 rounded p-3 pr-4 flex items-center justify-between hover:bg-stone-100/50 transition-colors"
                >
                  <div
                    className="flex flex-col cursor-pointer flex-grow min-w-0"
                    onClick={() => {
                      const el = document.getElementById(`block-editor-${block.id || idx}`);
                      if (el) {
                        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        el.classList.add('ring-2', 'ring-primary', 'ring-offset-2');
                        setTimeout(() => {
                          el.classList.remove('ring-2', 'ring-primary', 'ring-offset-2');
                        }, 1500);
                      }
                    }}
                  >
                    <span className="font-semibold text-sm text-stone-800">
                      בלוק #{idx + 1} — {block.type === 'hero' ? 'כותרת (Hero)' :
                                         block.type === 'intro' ? 'אודות / פורטרט' :
                                         block.type === 'text' ? 'בלוק טקסט' :
                                         block.type === 'image-text' ? 'תמונה וטקסט' :
                                         block.type === 'features' ? 'קוביות תוכן (גריד)' :
                                         block.type === 'testimonials' ? 'המלצות ממליצים' :
                                         block.type === 'faqs' ? 'שאלות ותשובות' :
                                         block.type === 'cta' ? 'כפתורי פעולה' :
                                         block.type === 'contact' ? 'טופס יצירת קשר' :
                                         block.type === 'map' ? 'מפת מיקום' :
                                         block.type === 'logos' ? 'לוגואים (גריד)' :
                                         block.type === 'video' ? 'וידאו (גריד)' :
                                         block.type === 'blog-grid' ? 'רשימת מאמרים (Blog Grid)' :
                                         block.type === 'stats' ? 'סטטיסטיקות / מספרים' :
                                         block.type === 'insight' ? 'כרטיס תובנה' :
                                         block.type}
                    </span>
                    <span className="text-xs text-stone-500 mt-1 truncate">
                      {block.title ? `כותרת: "${block.title}"` : 'ללא כותרת'}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1.5 shrink-0 pr-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-stone-500 hover:text-stone-900"
                      disabled={idx === 0}
                      onClick={() => handleMoveBlock(idx, 'up')}
                      title="הזז למעלה"
                    >
                      <ChevronUp size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-stone-500 hover:text-stone-900"
                      disabled={idx === (content.blocks?.length || 0) - 1}
                      onClick={() => handleMoveBlock(idx, 'down')}
                      title="הזז למטה"
                    >
                      <ChevronDown size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleRemoveBlock(idx)}
                      title="מחק בלוק"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add Block Templates */}
          <div>
            <p className="text-sm font-medium mb-3">הוספת בלוק חדש:</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {BLOCK_TEMPLATES.map(({ type, label, icon: Icon }) => (
                <button
                  key={type}
                  onClick={() => onAddBlock(type)}
                  className="h-20 border-2 border-primary/20 border-dashed rounded text-primary hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-1 text-xs font-medium hover:border-primary/40"
                >
                  <Icon size={16} />
                  <span className="text-center leading-tight">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
