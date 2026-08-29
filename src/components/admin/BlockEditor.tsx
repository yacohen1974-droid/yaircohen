"use client";

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import {
  Loader2, Plus, Trash2, Heart, Sparkles, Image as ImageIcon, Type, Layout, Box, Quote,
  HelpCircle, MousePointerClick, AlignLeft, AlignCenter, AlignRight, UserRound, ChevronRight,
  Monitor, Smartphone, Globe, X, Search, BookOpen, FileText, ShieldCheck, Check, Video,
  BarChart2, Mail, Phone, Lock, Instagram, Linkedin, Youtube, Music, Compass, Users, Star,
  MessageSquare, Orbit, RefreshCcw, UploadCloud, FolderOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { TitleSettings } from '@/config/page-defaults';

const ReactQuill = dynamic(() => import('react-quill-new'), {
  ssr: false,
  loading: () => <div className="h-48 w-full bg-stone-50 flex items-center justify-center font-headline text-stone-400">טוען עורך...</div>
});
import 'react-quill-new/dist/quill.snow.css';

// ─── Constants ────────────────────────────────────────────────────────────────

const ICON_OPTIONS = [
  { value: 'Heart', icon: <Heart size={14} /> },
  { value: 'Sparkles', icon: <Sparkles size={14} /> },
  { value: 'Orbit', icon: <Orbit size={14} /> },
  { value: 'Compass', icon: <Compass size={14} /> },
  { value: 'Users', icon: <Users size={14} /> },
  { value: 'Star', icon: <Star size={14} /> },
  { value: 'MessageSquare', icon: <MessageSquare size={14} /> },
  { value: 'HelpCircle', icon: <HelpCircle size={14} /> },
];

const HERO_HEIGHTS = [
  { label: 'קצר (50vh)', value: '50vh' },
  { label: 'בינוני (70vh)', value: '70vh' },
  { label: 'גבוה (80vh)', value: '80vh' },
  { label: 'מסך מלא (100vh)', value: '100vh' },
];

const SECTION_BG_OPTIONS = [
  { label: 'לבן', value: 'white' },
  { label: 'אפור בהיר', value: 'stone-50' },
  { label: 'אפור', value: 'stone-100' },
  { label: 'כחול עדין', value: 'sky-tint' },
  { label: 'צבע ראשי (עדין)', value: 'primary-tint' },
  { label: 'צבע ראשי (מלא, טקסט בהיר)', value: 'primary-solid' },
];

const LOGOS_ALIGN_OPTIONS = [
  { label: 'ימין', value: 'right' },
  { label: 'מרכז', value: 'center' },
  { label: 'שמאל', value: 'left' },
];

const LOGOS_TITLE_POSITION_OPTIONS = [
  { label: 'מעל הלוגואים', value: 'above' },
  { label: 'בצד', value: 'side' },
];

const FONT_OPTIONS = [
  { label: 'כותרת (Headline)', value: 'font-headline' },
  { label: 'כתב יד (Handwriting)', value: 'font-handwriting' },
  { label: 'רגיל (Sans)', value: 'font-sans' },
];

const SIZE_OPTIONS = [
  { label: 'קטן (2xl)', value: 'text-2xl' },
  { label: 'בינוני (4xl)', value: 'text-4xl' },
  { label: 'גדול (6xl)', value: 'text-6xl' },
  { label: 'ענק (7xl)', value: 'text-7xl' },
  { label: 'מקסימלי (9xl)', value: 'text-9xl' },
];

const QUILL_MODULES = {
  toolbar: [
    [{ direction: 'rtl' }, { align: [] }],
    [{ font: [] }, { size: ['small', false, 'large', 'huge'] }],
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline'],
    [{ color: [] }, { background: [] }],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link', 'image'],
    ['clean'],
  ],
};

const QUILL_FORMATS = [
  'direction', 'align', 'header', 'font', 'size',
  'bold', 'italic', 'underline',
  'color', 'background',
  'list',
  'link', 'image',
];

// ─── Helper Components ────────────────────────────────────────────────────────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label className="boutique-label">{label}</Label>
      {children}
    </div>
  );
}

function MoveButtons({ onUp, onDown, disableUp, disableDown }: { onUp: () => void, onDown: () => void, disableUp: boolean, disableDown: boolean }) {
  return (
    <div className="flex gap-1 bg-stone-100/50 p-1 rounded-sm">
      <button
        type="button"
        onClick={(e) => { e.preventDefault(); onUp(); }}
        disabled={disableUp}
        className={`h-8 w-10 flex items-center justify-center transition-all ${disableUp ? 'opacity-20 cursor-not-allowed' : 'text-stone-500 hover:text-primary hover:bg-white shadow-sm'}`}
      >
        <ChevronRight className="-rotate-90 size-4" />
      </button>
      <button
        type="button"
        onClick={(e) => { e.preventDefault(); onDown(); }}
        disabled={disableDown}
        className={`h-8 w-10 flex items-center justify-center transition-all ${disableDown ? 'opacity-20 cursor-not-allowed' : 'text-stone-500 hover:text-primary hover:bg-white shadow-sm'}`}
      >
        <ChevronRight className="rotate-90 size-4" />
      </button>
    </div>
  );
}

function AlignPicker({ value, onChange }: { value: string, onChange: (v: string) => void }) {
  const options = [
    { value: 'right', icon: <AlignRight size={16} /> },
    { value: 'center', icon: <AlignCenter size={16} /> },
    { value: 'left', icon: <AlignLeft size={16} /> }
  ];
  return (
    <div className="flex gap-1 bg-stone-50 p-1 w-fit">
      {options.map(opt => (
        <Button
          key={opt.value}
          type="button"
          variant={value === opt.value ? 'default' : 'ghost'}
          onClick={() => onChange(opt.value)}
          className={`h-9 w-12 p-0 ${value === opt.value ? 'bg-primary text-white' : 'text-stone-400'}`}
        >
          {opt.icon}
        </Button>
      ))}
    </div>
  );
}

// ─── Main BlockEditor (DynamicSectionEditor) ──────────────────────────────────

export function BlockEditor({
  section,
  onChange,
  onRemove,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast
}: {
  section: any;
  onChange: (s: any) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
}) {
  const [availableLogos, setAvailableLogos] = useState<string[]>([]);

  const refreshAvailableLogos = () => {
    fetch('/api/admin/list-logos')
      .then(res => res.json())
      .then(data => { if (data.success) setAvailableLogos(data.files); })
      .catch(() => {});
  };

  useEffect(() => {
    if (section.type === 'logos') refreshAvailableLogos();
  }, [section.type]);

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-md space-y-0 mb-8 relative group hover:border-primary/40 transition-all duration-300 overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-slate-700 px-6 py-4 md:px-8 md:py-5">
        <div className="flex items-center gap-3">
          <div className="w-2 h-6 bg-primary rounded-full" />
          <Label className="boutique-label text-slate-100 text-lg">
            {section.type === 'hero' ? 'כותרת גדולה (Hero)' :
             section.type === 'intro' ? 'אודות / פורטרט' :
             section.type === 'text' ? 'בלוק טקסט' :
             section.type === 'image-text' ? 'תמונה וטקסט' :
             section.type === 'features' ? 'קוביות תוכן (גריד)' :
             section.type === 'testimonials' ? 'המלצות ממליצים' :
             section.type === 'faqs' ? 'שאלות ותשובות' :
             section.type === 'cta' ? 'כפתורי פעולה' :
             section.type === 'contact' ? 'טופס יצירת קשר' :
             section.type === 'map' ? 'מפת מיקום' :
             section.type === 'logos' ? 'לוגואים (גריד)' :
             section.type === 'video' ? 'וידאו (גריד)' :
             section.type === 'blog-grid' ? 'רשימת מאמרים (Blog Grid)' :
             section.type === 'stats' ? 'סטטיסטיקות / מספרים' :
             section.type === 'insight' ? 'כרטיס תובנה' :
             'כותרת בלבד'}
          </Label>
        </div>
        <div className="flex items-center gap-3">
          <MoveButtons onUp={onMoveUp} onDown={onMoveDown} disableUp={isFirst} disableDown={isLast} />
          <button
            type="button"
            onClick={onRemove}
            className="text-red-400 hover:text-red-300 transition-colors h-8 w-8 flex items-center justify-center"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="bg-slate-50 p-6 md:p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field label="סוג הבלוק">
            <Select value={section.type} onValueChange={v => onChange({ ...section, type: v })}>
              <SelectTrigger className="bg-stone-50 border-none h-12"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="hero">כותרת (Hero)</SelectItem>
                <SelectItem value="intro">אודות / פורטרט</SelectItem>
                <SelectItem value="text">טקסט בלבד</SelectItem>
                <SelectItem value="image-text">תמונה וטקסט</SelectItem>
                <SelectItem value="features">קוביות תוכן</SelectItem>
                <SelectItem value="testimonials">המלצות</SelectItem>
                <SelectItem value="faqs">שאלות ותשובות</SelectItem>
                <SelectItem value="cta">כפתורי פעולה</SelectItem>
                <SelectItem value="contact">טופס Contact</SelectItem>
                <SelectItem value="map">מפה</SelectItem>
                <SelectItem value="logos">לוגואים (גריד)</SelectItem>
                <SelectItem value="blog-grid">רשימת מאמרים</SelectItem>
                <SelectItem value="title-only">כותרת בלבד</SelectItem>
                <SelectItem value="video">וידאו</SelectItem>
                <SelectItem value="stats">סטטיסטיקות</SelectItem>
                <SelectItem value="insight">כרטיס תובנה</SelectItem>
              </SelectContent>
            </Select>
          </Field>

          {section.type !== 'contact' && section.type !== 'map' && section.type !== 'cta' && (
            <Field label="צבע רקע">
              <Select value={section.bg || 'white'} onValueChange={v => onChange({ ...section, bg: v })}>
                <SelectTrigger className="bg-stone-50 border-none h-12"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {SECTION_BG_OPTIONS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
          )}
        </div>

        {/* Note: Full block-type-specific fields omitted for brevity in this version.
            Production: extend with all hero/intro/features/testimonials/faqs/etc handlers */}

        <div className="text-center py-8 bg-white border-2 border-dashed border-stone-200 rounded">
          <p className="text-sm text-stone-600 font-medium">
            ✎ פרטי הבלוק מ-{section.type}
          </p>
          <p className="text-xs text-stone-400 mt-2">
            בגרסה הקלה זו, עריכת בלוקים פנימיים זמינה בקובץ admin/pages בלבד.
          </p>
          <p className="text-xs text-stone-400 mt-4">
            לפרטים מלאים, ראו את DynamicSectionEditor ב-admin/pages/page.tsx
          </p>
        </div>
      </div>
    </div>
  );
}
