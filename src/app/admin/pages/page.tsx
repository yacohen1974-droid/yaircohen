"use client";


import React, { useState, useEffect, useMemo, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { cn } from '@/lib/utils';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import {
  Loader2, Save, Plus, Trash2, Box, Heart, Sparkles, Image as ImageIcon, Type, Layout,
  Orbit, Compass, Users, Star, Palette, MessageSquare, HelpCircle,
  MousePointerClick, Quote, AlignLeft, AlignCenter, AlignRight, UserRound, RefreshCcw,
  ChevronRight, Monitor, Smartphone, Globe, X, Search, BookOpen, FileText, ShieldCheck, Check,
  Video, BarChart2, Mail, Phone, Lock, Instagram, Linkedin, Youtube, Music, ArrowLeftRight
} from 'lucide-react';

const ReactQuill = dynamic(() => import('react-quill-new'), {
  ssr: false,
  loading: () => <div className="h-48 w-full bg-stone-50 flex items-center justify-center font-headline text-stone-400">טוען עורך... </div>
});
import 'react-quill-new/dist/quill.snow.css';
import {
  ContentState,
  PAGE_FALLBACKS,
  getInitialPageContent,
  DEFAULT_CONTENT_VALUES,
  TitleSettings
} from '@/config/page-defaults';
import { ADMIN_HELP_CONTENT } from '@/config/admin-help-content';


// Quill toolbar with RTL + image support
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

// ─── Constants ────────────────────────────────────────────────────────────────

const DEFAULT_PAGES = [
  { id: 'home', name: '🏠 ראשי' },
  { id: 'services', name: '💼 שירותים' },
  { id: 'about', name: '👤 אודות' },
  { id: 'contact', name: '📩 צור קשר' },
  { id: 'blog', name: '📝 בלוג' },
  { id: 'first-apartment', name: '🔑 דירה ראשונה' },
  { id: 'refinancing', name: '🔄 מחזור משכנתא' },
  { id: 'investment', name: '📈 נדל"ן להשקעה' },
  { id: 'faq-mortgage', name: '❓ שאלות נפוצות' },
  { id: 'privacy', name: '📄 מדיניות פרטיות' },
  { id: 'terms', name: '⚖️ תנאי שימוש' },
  { id: 'accessibility', name: '♿ נגישות' },
];

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

const PRESET_COLORS = [
  { name: 'כחול מקצועי (Professional Blue)', value: '213 75% 35%' },
  { name: 'כחול נייבי (Deep Navy)', value: '220 60% 18%' },
  { name: 'כחול בהיר (Light Blue)', value: '210 80% 50%' },
  { name: 'זהב (Gold)', value: '42 70% 48%' },
  { name: 'ירוק כסף (Silver Green)', value: '155 15% 45%' },
  { name: 'אפור כחלחל (Slate)', value: '215 25% 40%' },
  { name: 'טרקוטה (Terracotta)', value: '15 35% 50%' },
  { name: 'אפור כהה (Dark Gray)', value: '220 10% 30%' },
];

const HERO_HEIGHTS = [
  { label: 'קצר (50vh)', value: '50vh' },
  { label: 'בינוני (70vh)', value: '70vh' },
  { label: 'גבוה (80vh)', value: '80vh' },
  { label: 'מסך מלא (100vh)', value: '100vh' },
];

const SECTION_BG_OPTIONS = [
  { label: 'לבן', value: 'white' },
  { label: 'אפור בהיר (Slate)', value: 'stone-50' },
  { label: 'כחול עדין', value: 'bg-[hsl(213,30%,97%)]' },
  { label: 'ראשי (Primary)', value: 'primary' },
];

const CTA_VARIANTS = [
  { label: 'ראשי (מלא)', value: 'primary' },
  { label: 'מסגרת (Outline)', value: 'outline' },
  { label: 'שקוף (Ghost)', value: 'ghost' },
];

const CTA_SIZES = [
  { label: 'קטן', value: 'sm' },
  { label: 'רגיל', value: 'default' },
  { label: 'גדול', value: 'lg' },
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

const EMPTY_CONTENT: ContentState = getInitialPageContent('home');

// ─── Small reusable sub-components ────────────────────────────────────────────

function TitleEditor({ settings, onChange, label }: { settings?: TitleSettings, onChange: (s: TitleSettings) => void, label: string }) {
  const s = settings || { text: '', fontSize: 'text-4xl', fontFamily: 'font-headline', align: 'right', color: 'text-foreground' };
  
  return (
    <div className="bg-white p-6 border border-stone-100 rounded-none shadow-sm space-y-6 mb-8">
      <div className="flex items-center gap-3 border-b border-stone-50 pb-4">
        <div className="w-1.5 h-6 bg-primary" />
        <Label className="boutique-label text-primary text-lg">{label}</Label>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <Field label="טקסט הכותרת">
            <Input value={s.text} onChange={e => onChange({ ...s, text: e.target.value })} className="bg-stone-50 border-none h-12" />
          </Field>
        </div>
        <Field label="כותרת משנה (Optional)">
          <Input value={s.subtitle || ''} onChange={e => onChange({ ...s, subtitle: e.target.value })} className="bg-stone-50 border-none h-12" />
        </Field>
        <Field label="יישור">
          <AlignPicker value={s.align || 'right'} onChange={v => onChange({ ...s, align: v as any })} />
        </Field>
        <Field label="גופן">
          <Select value={s.fontFamily} onValueChange={v => onChange({ ...s, fontFamily: v })}>
            <SelectTrigger className="bg-stone-50 border-none h-12"><SelectValue /></SelectTrigger>
            <SelectContent>{FONT_OPTIONS.map(f => <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>)}</SelectContent>
          </Select>
        </Field>
        <Field label="גודל">
          <Select value={s.fontSize} onValueChange={v => onChange({ ...s, fontSize: v })}>
            <SelectTrigger className="bg-stone-50 border-none h-12"><SelectValue /></SelectTrigger>
            <SelectContent>{SIZE_OPTIONS.map(z => <SelectItem key={z.value} value={z.value}>{z.label}</SelectItem>)}</SelectContent>
          </Select>
        </Field>
        <div className="md:col-span-2">
          <Field label="צבע (Class/Hex)">
            <Input value={s.color || ''} onChange={e => onChange({ ...s, color: e.target.value })} placeholder="text-primary או #000000" className="bg-stone-50 border-none h-12" />
          </Field>
        </div>
      </div>
      <div className="pt-4 border-t border-stone-50 mt-4">
        <p className="text-[10px] text-stone-400 mb-2">תצוגה מקדימה של הכותרת</p>
        <div className={`p-4 rounded border border-dashed border-stone-200 ${s.align === 'center' ? 'text-center' : s.align === 'left' ? 'text-left' : 'text-right'}`}>
          {s.subtitle && <span className="boutique-label block text-primary text-xs mb-2">{s.subtitle}</span>}
          <h2 className={`${s.fontFamily} ${s.fontSize} ${s.color?.startsWith('#') ? '' : s.color}`}>{s.text || 'כותרת לדוגמה'}</h2>
          <div className={`w-12 h-[2px] bg-primary/20 mt-4 ${s.align === 'center' ? 'mx-auto' : s.align === 'left' ? 'mr-auto ml-0' : 'ml-auto mr-0'}`} />
        </div>
      </div>
    </div>
  );
}

function SectionCard({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <Card className="border-none shadow-xl rounded-none overflow-hidden">
      <CardHeader className="bg-stone-50/80 border-b border-stone-100 py-4 md:py-6">
        <CardTitle className="font-headline text-xl md:text-2xl flex items-center gap-3">
          <span className="text-primary">{icon}</span> {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 md:pt-8 space-y-5">{children}</CardContent>
    </Card>
  );
}

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

function DynamicSectionEditor({ section, onChange, onRemove, onMoveUp, onMoveDown, isFirst, isLast }: { 
  section: any, 
  onChange: (s: any) => void, 
  onRemove: () => void,
  onMoveUp: () => void,
  onMoveDown: () => void,
  isFirst: boolean,
  isLast: boolean
}) {
  return (
    <div className="bg-white p-6 border border-stone-100 rounded-none shadow-sm space-y-6 mb-8 relative group">
      <div className="flex justify-between items-center border-b border-stone-50 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-6 bg-accent" />
          <Label className="boutique-label text-accent text-lg">
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
             section.type === 'video' ? 'וידאו (YouTube/Vimeo)' :
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
            className="text-red-400 hover:text-red-600 transition-colors h-8 w-8 flex items-center justify-center"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field label="סוג הבלוק">
          <Select value={section.type} onValueChange={v => onChange({ ...section, type: v })}>
            <SelectTrigger className="bg-stone-50 border-none h-12"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="hero">כותרת (Hero)</SelectItem>
              <SelectItem value="intro">אודות / פורטרט</SelectItem>
              <SelectItem value="text">טקסט בלבד</SelectItem>
              <SelectItem value="image-text">תמונה וטקסט</SelectItem>
              <SelectItem value="features">קוביות תוכן (Features)</SelectItem>
              <SelectItem value="testimonials">המלצות</SelectItem>
              <SelectItem value="faqs">שאלות ותשובות</SelectItem>
              <SelectItem value="cta">כפתורי פעולה</SelectItem>
              <SelectItem value="contact">טופס Contact</SelectItem>
              <SelectItem value="map">מפה</SelectItem>
              <SelectItem value="logos">לוגואים (גריד)</SelectItem>
              <SelectItem value="blog-grid">רשימת מאמרים (Blog Grid)</SelectItem>
              <SelectItem value="title-only">כותרת בלבד</SelectItem>
              <SelectItem value="video">וידאו (YouTube/Vimeo)</SelectItem>
              <SelectItem value="stats">סטטיסטיקות / מספרים</SelectItem>
              <SelectItem value="insight">כרטיס תובנה (Insight)</SelectItem>
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

        {/* Hero Specific Fields */}
        {section.type === 'hero' && (
          <div className="md:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field label="גובה">
                <Select value={section.heroHeight || '70vh'} onValueChange={v => onChange({ ...section, heroHeight: v })}>
                  <SelectTrigger className="bg-stone-50"><SelectValue /></SelectTrigger>
                  <SelectContent>{HERO_HEIGHTS.map(h => <SelectItem key={h.value} value={h.value}>{h.label}</SelectItem>)}</SelectContent>
                </Select>
              </Field>
              <Field label="יישור">
                <AlignPicker value={section.heroTextAlign || 'center'} onChange={v => onChange({ ...section, heroTextAlign: v })} />
              </Field>
              <Field label="תמונה - דסקטופ">
                <Input value={section.imageUrl || ''} onChange={e => onChange({ ...section, imageUrl: e.target.value })} placeholder="URL" className="font-sans" dir="ltr" />
              </Field>
              <Field label="תמונה - מובייל">
                <Input value={section.imageUrlMobile || ''} onChange={e => onChange({ ...section, imageUrlMobile: e.target.value })} placeholder="URL" className="font-sans" dir="ltr" />
              </Field>
              <div className="md:col-span-2 space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="boutique-label">מידת עננות (אטימות רקע)</Label>
                  <span className="text-xs font-bold text-primary">{section.heroCloudiness ?? 30}%</span>
                </div>
                <Slider 
                  value={[section.heroCloudiness ?? 30]} 
                  min={0} 
                  max={100} 
                  step={5} 
                  onValueChange={([v]) => onChange({ ...section, heroCloudiness: v })} 
                  className="py-4"
                />
              </div>
            </div>
            <TitleEditor 
              label="כותרת ראשית" 
              settings={section.titleSettings} 
              onChange={s => onChange({ ...section, titleSettings: s, title: s.text })} 
            />
            <TitleEditor 
              label="כותרת משנה" 
              settings={section.subtitleSettings} 
              onChange={s => onChange({ ...section, subtitleSettings: s })} 
            />
          </div>
        )}

        {/* Intro Specific Fields */}
        {section.type === 'intro' && (
          <div className="md:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field label="תמונת פורטרט">
                <Input value={section.portraitImageUrl || ''} onChange={e => onChange({ ...section, portraitImageUrl: e.target.value })} placeholder="URL" className="font-sans" dir="ltr" />
              </Field>
              <Field label="מיקום תמונה">
                <Select value={section.portraitPosition || 'left'} onValueChange={v => onChange({ ...section, portraitPosition: v })}>
                  <SelectTrigger className="bg-stone-50"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="left">שמאל</SelectItem>
                    <SelectItem value="right">ימין</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="צורת תמונה">
                <Select value={section.portraitShape || 'circle'} onValueChange={v => onChange({ ...section, portraitShape: v })}>
                  <SelectTrigger className="bg-stone-50"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="circle">עגולה</SelectItem>
                    <SelectItem value="square">מרובעת</SelectItem>
                    <SelectItem value="rectangle">מלבנית (פורטרט)</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="גודל תמונה (בפיקסלים)">
                <div className="flex items-center gap-4">
                  <Input 
                    type="number" 
                    value={section.portraitSize || 300} 
                    onChange={e => onChange({ ...section, portraitSize: parseInt(e.target.value) || 300 })} 
                    className="h-10 bg-stone-50 w-24"
                  />
                  <span className="text-xs text-stone-400">px</span>
                </div>
              </Field>
            </div>
            <TitleEditor 
              label="כותרת" 
              settings={section.titleSettings} 
              onChange={s => onChange({ ...section, titleSettings: s, title: s.text })} 
            />
          </div>
        )}

        {/* Testimonials */}
        {section.type === 'testimonials' && (
          <div className="md:col-span-2 space-y-6">
             <TitleEditor label="כותרת הקטע" settings={section.titleSettings} onChange={s => onChange({ ...section, titleSettings: s })} />
             <div className="space-y-4">
                {(section.testimonials || []).map((t: any, idx: number) => (
                  <div key={idx} className="bg-stone-50 p-4 border border-stone-100 space-y-3">
                    <div className="flex justify-between"><span className="text-xs font-bold">עדות #{idx+1}</span> <Button variant="ghost" size="icon" onClick={() => { const next = [...(section.testimonials || [])]; next.splice(idx,1); onChange({...section, testimonials: next}); }} className="text-red-400 h-6 w-6"><Trash2 size={12}/></Button></div>
                    <Textarea value={t.text} onChange={e => { const next = [...(section.testimonials || [])]; next[idx].text = e.target.value; onChange({...section, testimonials: next}); }} rows={2} className="bg-white" />
                    <div className="grid grid-cols-2 gap-2">
                      <Input value={t.author} onChange={e => { const next = [...(section.testimonials || [])]; next[idx].author = e.target.value; onChange({...section, testimonials: next}); }} placeholder="שם" className="bg-white" />
                      <Input value={t.location} onChange={e => { const next = [...(section.testimonials || [])]; next[idx].location = e.target.value; onChange({...section, testimonials: next}); }} placeholder="מיקום" className="bg-white" />
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full" onClick={() => { const next = [...(section.testimonials || []), {text: '', author: '', location: ''}]; onChange({...section, testimonials: next}); }}><Plus size={14} className="ml-2"/> הוספת עדות</Button>
             </div>
          </div>
        )}

        {/* FAQ */}
        {section.type === 'faqs' && (
          <div className="md:col-span-2 space-y-6">
             <TitleEditor label="כותרת הקטע" settings={section.titleSettings} onChange={s => onChange({ ...section, titleSettings: s })} />
             <div className="space-y-4">
                {(section.faqs || []).map((f: any, idx: number) => (
                  <div key={idx} className="bg-stone-50 p-4 border border-stone-100 space-y-3">
                    <div className="flex justify-between"><span className="text-xs font-bold">שאלה #{idx+1}</span> <Button variant="ghost" size="icon" onClick={() => { const next = [...(section.faqs || [])]; next.splice(idx,1); onChange({...section, faqs: next}); }} className="text-red-400 h-6 w-6"><Trash2 size={12}/></Button></div>
                    <Input value={f.question} onChange={e => { const next = [...(section.faqs || [])]; next[idx].question = e.target.value; onChange({...section, faqs: next}); }} placeholder="שאלה" className="bg-white" />
                    <Textarea value={f.answer} onChange={e => { const next = [...(section.faqs || [])]; next[idx].answer = e.target.value; onChange({...section, faqs: next}); }} rows={2} className="bg-white" />
                  </div>
                ))}
                <Button variant="outline" className="w-full" onClick={() => { const next = [...(section.faqs || []), {question: '', answer: ''}]; onChange({...section, faqs: next}); }}><Plus size={14} className="ml-2"/> הוספת שאלה</Button>
             </div>
          </div>
        )}

        {/* CTA */}
        {section.type === 'cta' && (
          <div className="md:col-span-2 space-y-6">
             <Field label="יישור כפתורים">
                <AlignPicker value={section.ctaAlign || 'center'} onChange={v => onChange({ ...section, ctaAlign: v })} />
             </Field>
             <div className="space-y-4">
                {(section.ctaButtons || []).map((btn: any, idx: number) => (
                  <div key={idx} className="bg-stone-50 p-4 border border-stone-100 space-y-3">
                    <div className="flex justify-between"><span className="text-xs font-bold">כפתור #{idx+1}</span> <Button variant="ghost" size="icon" onClick={() => { const next = [...(section.ctaButtons || [])]; next.splice(idx,1); onChange({...section, ctaButtons: next}); }} className="text-red-400 h-6 w-6"><Trash2 size={12}/></Button></div>
                    <div className="grid grid-cols-2 gap-2">
                      <Input value={btn.label} onChange={e => { const next = [...(section.ctaButtons || [])]; next[idx].label = e.target.value; onChange({...section, ctaButtons: next}); }} placeholder="טקסט" className="bg-white" />
                      <Input value={btn.href} onChange={e => { const next = [...(section.ctaButtons || [])]; next[idx].href = e.target.value; onChange({...section, ctaButtons: next}); }} placeholder="URL" className="bg-white font-sans" dir="ltr" />
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full" onClick={() => { const next = [...(section.ctaButtons || []), {label: '', href: '#', variant: 'primary', size: 'default'}]; onChange({...section, ctaButtons: next}); }}><Plus size={14} className="ml-2"/> הוספת כפתור</Button>
             </div>
          </div>
        )}

        {/* Map */}
        {section.type === 'map' && (
          <div className="md:col-span-2">
            <Field label="כתובת למפה (Google Maps)">
              <Input value={section.mapAddress || ''} onChange={e => onChange({ ...section, mapAddress: e.target.value })} placeholder="למשל: תל אביב, ישראל" className="bg-stone-50 h-12" />
            </Field>
          </div>
        )}

        {/* Contact */}
        {section.type === 'contact' && (
          <div className="md:col-span-2 space-y-6">
            <TitleEditor label="כותרת טופס" settings={section.titleSettings} onChange={s => onChange({ ...section, titleSettings: s })} />
            <Field label="קישור לתמונת פורטרט (בצד הטופס)">
              <Input 
                value={section.imageUrl || ''} 
                onChange={e => onChange({ ...section, imageUrl: e.target.value })} 
                placeholder="https://..." 
                className="bg-stone-50 border-none h-12 font-sans" 
                dir="ltr" 
              />
            </Field>
          </div>
        )}

        {/* Original Dynamic Section Fields (Features, Logos, Text) */}
        {section.type === 'image-text' && (
          <>
            <Field label="קישור לתמונה">
              <Input value={section.imageUrl || ''} onChange={e => onChange({ ...section, imageUrl: e.target.value })} placeholder="https://..." className="bg-stone-50 border-none h-12 font-sans" dir="ltr" />
            </Field>
            <Field label="מיקום תמונה">
              <Select value={section.imagePosition || 'right'} onValueChange={v => onChange({ ...section, imagePosition: v })}>
                <SelectTrigger className="bg-stone-50 border-none h-12"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="right">ימין</SelectItem>
                  <SelectItem value="left">שמאל</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </>
        )}
        
        {section.type === 'logos' && (
          <div className="md:col-span-2 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label="גודל לוגואים">
                <Select value={section.logoSize || 'md'} onValueChange={v => onChange({ ...section, logoSize: v })}>
                  <SelectTrigger className="bg-stone-50 border-none h-12"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sm">קטן</SelectItem>
                    <SelectItem value="md">בינוני</SelectItem>
                    <SelectItem value="lg">גדול</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="מסגרת">
                <Select value={section.logoShape || 'square'} onValueChange={v => onChange({ ...section, logoShape: v })}>
                  <SelectTrigger className="bg-stone-50 border-none h-12"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="square">מרובע</SelectItem>
                    <SelectItem value="circle">עגול</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>
            <Label className="boutique-label">רשימת לוגואים</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {(section.logos || []).map((logo: any, idx: number) => (
                <div key={logo.id || idx} className="flex gap-2 items-center bg-stone-50 p-2">
                  <Input 
                    value={logo.imageUrl} 
                    onChange={e => {
                      const nextLogos = [...(section.logos || [])];
                      nextLogos[idx] = { ...nextLogos[idx], imageUrl: e.target.value };
                      onChange({ ...section, logos: nextLogos });
                    }} 
                    placeholder="URL תמונה" 
                    className="flex-1 bg-white h-10 text-xs font-sans" 
                  />
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => {
                      const nextLogos = [...(section.logos || [])];
                      nextLogos.splice(idx, 1);
                      onChange({ ...section, logos: nextLogos });
                    }}
                    className="text-red-400 h-8 w-8"
                  >
                    <X size={14} />
                  </Button>
                </div>
              ))}
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  const id = Math.random().toString(36).substr(2, 9);
                  const nextLogos = [...(section.logos || []), { id, imageUrl: '' }];
                  onChange({ ...section, logos: nextLogos });
                }}
                className="border-dashed border-primary/20 h-10"
              >
                <Plus size={14} className="ml-1" /> הוספת לוגו
              </Button>
            </div>
          </div>
        )}

        {section.type === 'comparison' && (
          <div className="md:col-span-2 space-y-6">
            <TitleEditor 
              label="כותרת הקטע" 
              settings={section.titleSettings} 
              onChange={s => onChange({ ...section, titleSettings: s, title: s.text })} 
            />
            <div className="space-y-4">
              <Label className="boutique-label">נקודות השוואה (לבד בבנק - Negative)</Label>
              <div className="grid grid-cols-1 gap-3">
                {(section.insightPoints || []).filter((p: any) => p.type === 'negative').map((point: any, idx: number) => (
                  <div key={idx} className="flex gap-2">
                    <Input 
                      value={point.text} 
                      onChange={e => {
                        const nextPoints = [...(section.insightPoints || [])];
                        const realIdx = nextPoints.indexOf(point);
                        nextPoints[realIdx] = { ...point, text: e.target.value };
                        onChange({ ...section, insightPoints: nextPoints });
                      }}
                      className="bg-red-50/30 border-red-100"
                    />
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => {
                        const nextPoints = [...(section.insightPoints || [])];
                        nextPoints.splice(nextPoints.indexOf(point), 1);
                        onChange({ ...section, insightPoints: nextPoints });
                      }}
                    >
                      <Trash2 size={14} className="text-red-400" />
                    </Button>
                  </div>
                ))}
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    const nextPoints = [...(section.insightPoints || []), { text: '', type: 'negative' }];
                    onChange({ ...section, insightPoints: nextPoints });
                  }}
                  className="w-fit"
                >
                  <Plus size={14} className="ml-1" /> הוספת נקודה שלילית
                </Button>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-stone-50">
              <Label className="boutique-label">נקודות השוואה (איתנו - Positive)</Label>
              <div className="grid grid-cols-1 gap-3">
                {(section.insightPoints || []).filter((p: any) => p.type === 'positive').map((point: any, idx: number) => (
                  <div key={idx} className="flex gap-2">
                    <Input 
                      value={point.text} 
                      onChange={e => {
                        const nextPoints = [...(section.insightPoints || [])];
                        const realIdx = nextPoints.indexOf(point);
                        nextPoints[realIdx] = { ...point, text: e.target.value };
                        onChange({ ...section, insightPoints: nextPoints });
                      }}
                      className="bg-green-50/30 border-green-100"
                    />
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => {
                        const nextPoints = [...(section.insightPoints || [])];
                        nextPoints.splice(nextPoints.indexOf(point), 1);
                        onChange({ ...section, insightPoints: nextPoints });
                      }}
                    >
                      <Trash2 size={14} className="text-red-400" />
                    </Button>
                  </div>
                ))}
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    const nextPoints = [...(section.insightPoints || []), { text: '', type: 'positive' }];
                    onChange({ ...section, insightPoints: nextPoints });
                  }}
                  className="w-fit"
                >
                  <Plus size={14} className="ml-1" /> הוספת נקודה חיובית
                </Button>
              </div>
            </div>
          </div>
        )}


        {section.type === 'features' && (
          <div className="md:col-span-2 space-y-6">
            <TitleEditor 
              label="כותרת הקטע" 
              settings={section.titleSettings} 
              onChange={s => onChange({ ...section, titleSettings: s, title: s.text })} 
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-stone-50 p-6 border border-stone-100 rounded-none mb-6">
              <Field label="פריסת עמודות (דסקטופ)">
                <Select value={section.featuresColumns || 'md:grid-cols-2'} onValueChange={v => onChange({ ...section, featuresColumns: v })}>
                  <SelectTrigger className="bg-white"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="md:grid-cols-2">2 עמודות</SelectItem>
                    <SelectItem value="md:grid-cols-3">3 עמודות</SelectItem>
                    <SelectItem value="md:grid-cols-4">4 עמודות</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="צבע מילוי (רקע קובייה)">
                <Select value={section.featuresBg || 'white'} onValueChange={v => onChange({ ...section, featuresBg: v })}>
                  <SelectTrigger className="bg-white"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="white">לבן בוטיק (White)</SelectItem>
                    <SelectItem value="slate">אפור בהיר (Slate)</SelectItem>
                    <SelectItem value="navy">כחול עמוק (Navy)</SelectItem>
                    <SelectItem value="glass">זכוכית מודרנית (Glassmorphism)</SelectItem>
                    <SelectItem value="border">רקע שקוף עם מסגרת (Border)</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="גודל קוביות">
                <Select value={section.featuresSize || 'comfortable'} onValueChange={v => onChange({ ...section, featuresSize: v })}>
                  <SelectTrigger className="bg-white"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="compact">קומפקטי (קטן)</SelectItem>
                    <SelectItem value="comfortable">רגיל (נוח)</SelectItem>
                    <SelectItem value="large">גדול (מרווח)</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>
            <div className="grid grid-cols-1 gap-6">
              {(section.features || []).map((feat: any, idx: number) => (
                <div key={idx} className="bg-stone-50 p-6 border border-stone-100 rounded-none space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-accent">קובייה #{idx + 1}</span>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => {
                        const nextFeats = [...(section.features || [])];
                        nextFeats.splice(idx, 1);
                        onChange({ ...section, features: nextFeats });
                      }}
                      className="text-red-400 h-8 w-8"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="אייקון">
                      <Select value={feat.icon || 'Heart'} onValueChange={v => {
                        const nextFeats = [...(section.features || [])];
                        nextFeats[idx] = { ...nextFeats[idx], icon: v };
                        onChange({ ...section, features: nextFeats });
                      }}>
                        <SelectTrigger className="bg-white"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {ICON_OPTIONS.map(opt => (
                            <SelectItem key={opt.value} value={opt.value}>
                              <div className="flex items-center gap-2">{opt.icon} {opt.value}</div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                    <Field label="כותרת">
                      <Input 
                        value={feat.title || ''} 
                        onChange={e => {
                          const nextFeats = [...(section.features || [])];
                          nextFeats[idx] = { ...nextFeats[idx], title: e.target.value };
                          onChange({ ...section, features: nextFeats });
                        }} 
                        className="bg-white" 
                      />
                    </Field>
                  </div>
                  <Field label="תיאור">
                    <Textarea 
                      value={feat.description || ''} 
                      onChange={e => {
                        const nextFeats = [...(section.features || [])];
                        nextFeats[idx] = { ...nextFeats[idx], description: e.target.value };
                        onChange({ ...section, features: nextFeats });
                      }} 
                      rows={2} 
                      className="bg-white resize-none" 
                    />
                  </Field>
                </div>
              ))}
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  const nextFeats = [...(section.features || []), { title: '', description: '', icon: 'Heart' }];
                  onChange({ ...section, features: nextFeats });
                }}
                className="border-dashed border-primary/20 h-12"
              >
                <Plus size={14} className="ml-2" /> הוספת קובייה לסט הזה
              </Button>
            </div>
          </div>
        )}

        {(section.type === 'text' || section.type === 'image-text' || section.type === 'intro') && (
          <div className="md:col-span-2">
            {section.type !== 'intro' && (
              <TitleEditor 
                label="כותרת הבלוק (אופציונלי)" 
                settings={section.titleSettings} 
                onChange={s => onChange({ ...section, titleSettings: s, title: s.text })} 
              />
            )}
            <Field label="תוכן">
              <div className="min-h-[200px]" dir="rtl">
                <ReactQuill
                  theme="snow"
                  value={section.content || ''}
                  onChange={val => onChange({ ...section, content: val })}
                  modules={QUILL_MODULES}
                  formats={QUILL_FORMATS}
                />
              </div>
            </Field>
          </div>
        )}

        {section.type === 'title-only' && (
          <div className="md:col-span-2">
            <TitleEditor
              label="כותרת"
              settings={section.titleSettings}
              onChange={s => onChange({ ...section, titleSettings: s, title: s.text })}
            />
          </div>
        )}

        {section.type === 'insight' && (
          <div className="md:col-span-2 space-y-6">
            <TitleEditor
              label="כותרת הכרטיס"
              settings={section.titleSettings}
              onChange={s => onChange({ ...section, titleSettings: s, title: s.text })}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="טקסט מודגש בסוף הכותרת (אופציונלי)">
                <Input value={section.insightTitleBold || ''} onChange={e => onChange({ ...section, insightTitleBold: e.target.value })} placeholder="לדוג': במשכנתא שלכם" className="bg-stone-50" />
              </Field>
              <Field label="תמונה (URL)">
                <Input value={section.insightImageUrl || ''} onChange={e => onChange({ ...section, insightImageUrl: e.target.value })} placeholder="https://..." className="bg-stone-50 font-sans" dir="ltr" />
              </Field>
              <Field label="מיקום תמונה">
                <Select value={section.insightImagePosition || 'left'} onValueChange={v => onChange({ ...section, insightImagePosition: v })}>
                  <SelectTrigger className="bg-stone-50"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="left">שמאל</SelectItem>
                    <SelectItem value="right">ימין</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="צבע רקע">
                <Select value={section.insightBg || 'white'} onValueChange={v => onChange({ ...section, insightBg: v })}>
                  <SelectTrigger className="bg-stone-50"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="white">לבן</SelectItem>
                    <SelectItem value="light-blue">כחול בהיר</SelectItem>
                    <SelectItem value="slate">אפור</SelectItem>
                    <SelectItem value="navy">נייבי (גרדיאנט)</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>
            <Field label="מסקנה / טקסט מודגש בסוף">
              <Textarea value={section.insightConclusion || ''} onChange={e => onChange({ ...section, insightConclusion: e.target.value })} rows={2} className="bg-stone-50" placeholder="לדוג': ללא ייעוץ מקצועי – זה עלול לעלות לכם ביוקר" />
            </Field>
            <Label className="boutique-label">נקודות (✗ שלילי / ✓ חיובי / → מידע)</Label>
            <div className="space-y-3">
              {(section.insightPoints || []).map((pt: any, idx: number) => (
                <div key={idx} className="bg-stone-50 p-3 border border-stone-100 grid grid-cols-[120px_1fr_32px] gap-2 items-center">
                  <Select value={pt.type || 'negative'} onValueChange={v => { const next = [...(section.insightPoints || [])]; next[idx] = { ...next[idx], type: v }; onChange({ ...section, insightPoints: next }); }}>
                    <SelectTrigger className="bg-white h-9 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="negative">✗ שלילי</SelectItem>
                      <SelectItem value="positive">✓ חיובי</SelectItem>
                      <SelectItem value="neutral">→ מידע</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input value={pt.text || ''} onChange={e => { const next = [...(section.insightPoints || [])]; next[idx] = { ...next[idx], text: e.target.value }; onChange({ ...section, insightPoints: next }); }} placeholder="טקסט הנקודה" className="bg-white h-9" />
                  <Button type="button" variant="ghost" size="icon" onClick={() => { const next = [...(section.insightPoints || [])]; next.splice(idx, 1); onChange({ ...section, insightPoints: next }); }} className="text-red-400 h-8 w-8"><Trash2 size={14} /></Button>
                </div>
              ))}
              <Button variant="outline" className="w-full" type="button" onClick={() => { const next = [...(section.insightPoints || []), { text: '', type: 'negative' }]; onChange({ ...section, insightPoints: next }); }}><Plus size={14} className="ml-2" /> הוספת נקודה</Button>
            </div>

            <div className="pt-6 border-t border-stone-100">
              <Label className="boutique-label mb-4 block">כפתור הנעה לפעולה (CTA)</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="טקסט הכפתור">
                  <Input 
                    value={section.ctaButtons?.[0]?.label || ''} 
                    onChange={e => {
                      const btns = [...(section.ctaButtons || [])];
                      btns[0] = { ...(btns[0] || { variant: 'primary', size: 'default', href: '' }), label: e.target.value };
                      onChange({ ...section, ctaButtons: btns });
                    }} 
                    placeholder="לדוג': לתיאום פגישה" 
                    className="bg-stone-50" 
                  />
                </Field>
                <Field label="קישור (URL)">
                  <Input 
                    value={section.ctaButtons?.[0]?.href || ''} 
                    onChange={e => {
                      const btns = [...(section.ctaButtons || [])];
                      btns[0] = { ...(btns[0] || { variant: 'primary', size: 'default', label: '' }), href: e.target.value };
                      onChange({ ...section, ctaButtons: btns });
                    }} 
                    placeholder="#contact" 
                    className="bg-stone-50 font-sans" 
                    dir="ltr" 
                  />
                </Field>
              </div>
            </div>
          </div>
        )}

        {/* Video Block */}
        {section.type === 'video' && (
          <div className="md:col-span-2 space-y-6">
            <TitleEditor label="כותרת (אופציונלי)" settings={section.titleSettings} onChange={s => onChange({ ...section, titleSettings: s })} />
            <Field label="קישור וידאו (YouTube embed / Vimeo embed)">
              <Input value={section.videoUrl || ''} onChange={e => onChange({ ...section, videoUrl: e.target.value })} placeholder="https://www.youtube.com/embed/..." className="font-sans" dir="ltr" />
            </Field>
            <p className="text-xs text-slate-400">השתמשו בקישור embed — ב-YouTube: לחצו שיתוף → הטמעה, והדביקו את ה-URL מתוך src="..."</p>
          </div>
        )}

        {/* Stats Block */}
        {section.type === 'stats' && (
          <div className="md:col-span-2 space-y-6">
            <TitleEditor label="כותרת הקטע (אופציונלי)" settings={section.titleSettings} onChange={s => onChange({ ...section, titleSettings: s })} />
            <Field label="צבע רקע">
              <Select value={section.statsBg || 'navy'} onValueChange={v => onChange({ ...section, statsBg: v })}>
                <SelectTrigger className="bg-stone-50 border-none h-12"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="navy">כחול נייבי (ברירת מחדל)</SelectItem>
                  <SelectItem value="blue">כחול בהיר</SelectItem>
                  <SelectItem value="white">לבן</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Label className="boutique-label">מספרים / סטטיסטיקות</Label>
            <div className="space-y-3">
              {(section.stats || []).map((s: any, idx: number) => (
                <div key={idx} className="bg-stone-50 p-4 border border-stone-100 grid grid-cols-4 gap-2 items-center">
                  <Input value={s.prefix || ''} onChange={e => { const next = [...(section.stats || [])]; next[idx] = {...next[idx], prefix: e.target.value}; onChange({...section, stats: next}); }} placeholder="קידומת (₪)" className="bg-white col-span-1 text-center" />
                  <Input value={s.value || ''} onChange={e => { const next = [...(section.stats || [])]; next[idx] = {...next[idx], value: e.target.value}; onChange({...section, stats: next}); }} placeholder="ערך (500+)" className="bg-white col-span-1 text-center font-bold" />
                  <Input value={s.suffix || ''} onChange={e => { const next = [...(section.stats || [])]; next[idx] = {...next[idx], suffix: e.target.value}; onChange({...section, stats: next}); }} placeholder="סיומת (%)" className="bg-white col-span-1 text-center" />
                  <div className="flex gap-1 col-span-1">
                    <Input value={s.label || ''} onChange={e => { const next = [...(section.stats || [])]; next[idx] = {...next[idx], label: e.target.value}; onChange({...section, stats: next}); }} placeholder="תיאור" className="bg-white flex-1" />
                    <Button type="button" variant="ghost" size="icon" onClick={() => { const next = [...(section.stats || [])]; next.splice(idx,1); onChange({...section, stats: next}); }} className="text-red-400 h-10 w-10 flex-shrink-0"><Trash2 size={14}/></Button>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full" type="button" onClick={() => { const next = [...(section.stats || []), {value: '', label: '', prefix: '', suffix: ''}]; onChange({...section, stats: next}); }}><Plus size={14} className="ml-2"/> הוספת מספר</Button>
            </div>
          </div>
        )}

        {/* Blog Grid Specific Fields */}
        {section.type === 'blog-grid' && (
          <div className="md:col-span-2 space-y-6">
            <TitleEditor 
              label="כותרת הקטע" 
              settings={section.titleSettings} 
              onChange={s => onChange({ ...section, titleSettings: s, title: s.text })} 
            />
            <p className="text-sm text-stone-400 bg-stone-50 p-4 border border-dashed border-stone-200">
              בלוק זה מציג אוטומטית את כל המאמרים שפורסמו במערכת הניהול (Blog Admin). ניתן לערוך את הכותרת וכותרת המשנה בלבד.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
function CharCounter({ value, limit }: { value: string; limit: number }) {
  const len = value.length;
  const color = len > limit ? 'text-red-500' : len > Math.floor(limit * 0.85) ? 'text-amber-500' : 'text-stone-400';
  return <span className={`text-[10px] font-headline tabular-nums ${color}`}>{len}/{limit}</span>;
}

function GoogleSearchPreview({ title, url, description }: { title: string; url: string; description: string }) {
  if (!title && !description) return null;
  return (
    <div className="p-4 border border-stone-100 bg-stone-50 shadow-sm" dir="ltr">
      <p className="text-[10px] boutique-label text-stone-400 mb-3 text-right">תצוגה מקדימה — כך יופיע בגוגל</p>
      <div className="space-y-0.5 font-sans">
        <p className={`text-[15px] font-normal leading-snug truncate ${title.length > 60 ? 'text-red-500' : 'text-[#1a0dab]'}`}>{title || 'כותרת הדף'}</p>
        <p className="text-[13px] text-[#006621] truncate">{url}</p>
        <p className="text-[13px] text-[#545454] leading-snug line-clamp-2">{description || 'תיאור הדף יופיע כאן...'}</p>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

// ─── Help Guide Component ──────────────────────────────────────────────────
function AdminGuide() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const ICON_MAP: Record<string, React.ReactNode> = {
    Lock: <ShieldCheck size={18} />,
    Layout: <Layout size={18} />,
    Type: <Type size={18} />,
    Image: <ImageIcon size={18} />,
    Box: <Box size={18} />,
    FileText: <FileText size={18} />,
    Sparkles: <Sparkles size={18} />,
    MousePointerClick: <MousePointerClick size={18} />,
    Globe: <Globe size={18} />,
    Palette: <Palette size={18} />,
    HelpCircle: <HelpCircle size={18} />,
    BookOpen: <BookOpen size={18} />,
  };

  const filtered = ADMIN_HELP_CONTENT.filter(topic =>
    search === '' ||
    topic.title.includes(search) ||
    topic.content.some(c => c.sub.includes(search) || c.text.includes(search))
  );

  if (!open) return (
    <button
      onClick={() => setOpen(true)}
      className="fixed bottom-8 left-8 z-[500] w-14 h-14 bg-accent text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform group"
    >
      <HelpCircle size={28} />
      <span className="absolute right-full mr-4 bg-accent text-white px-3 py-1.5 rounded-sm text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none font-headline">מדריך עורך</span>
    </button>
  );

  return (
    <div className="fixed inset-0 z-[500] flex justify-end" dir="rtl">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setOpen(false)} />
      <div className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-stone-100 bg-accent text-white flex-shrink-0">
          <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white p-1 transition-colors">
            <X size={22} />
          </button>
          <div className="text-right">
            <h2 className="text-2xl font-handwriting">מדריך העורך</h2>
            <p className="text-xs text-white/70 font-headline mt-0.5">כל מה שצריך לדעת על העורך</p>
          </div>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-stone-100 flex-shrink-0">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-300 size-4" />
            <input
              type="text"
              placeholder="חפשי נושא (למשל: Slug, Hero, CTA...)"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pr-9 pl-4 h-10 bg-stone-50 border border-stone-100 text-sm font-headline focus:outline-none focus:border-primary/40 text-right"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-stone-300">
              <HelpCircle size={40} className="mb-3" />
              <p className="font-headline text-sm">לא נמצאו תוצאות</p>
            </div>
          ) : (
            filtered.map((topic) => (
              <details key={topic.id} className="border-b border-stone-50 group">
                <summary className="flex items-center justify-between gap-3 px-6 py-4 cursor-pointer hover:bg-stone-50 transition-colors list-none">
                  <ChevronRight className="text-stone-300 group-open:rotate-90 transition-transform flex-shrink-0 size-4" />
                  <div className="flex items-center gap-3 flex-1 justify-end">
                    <span className="font-headline font-bold text-stone-700 text-sm">{topic.title}</span>
                    <span className="text-primary flex-shrink-0">{ICON_MAP[topic.icon] ?? <HelpCircle size={18} />}</span>
                  </div>
                </summary>
                <div className="px-6 pb-4 space-y-4">
                  {topic.content.map((item, idx) => (
                    <div key={idx} className="border-r-2 border-primary/20 pr-4">
                      <p className="text-xs font-bold text-accent mb-1.5 font-headline">{item.sub}</p>
                      <p className="text-xs text-stone-500 leading-relaxed font-headline">{item.text}</p>
                    </div>
                  ))}
                </div>
              </details>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-100 bg-stone-50 flex-shrink-0">
          <a href="/admin/help" className="flex items-center justify-center gap-2 text-xs text-stone-400 hover:text-primary font-headline transition-colors">
            <BookOpen size={14} />
            פתיחת מרכז הידע המלא
          </a>
        </div>
      </div>
    </div>
  );
}

export default function AdminPages() {
  const router = useRouter();
  const { user, loading: authLoading } = useUser();
  const { toast } = useToast();

  const [mounted, setMounted] = useState(false);
  const [selectedPage, setSelectedPage] = useState('home');
  const [customPageId, setCustomPageId] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [content, setContent] = useState<ContentState>(EMPTY_CONTENT);
  const [isDirty, setIsDirty] = useState(false);
  const [allPages, setAllPages] = useState<{id: string, name: string}[]>(DEFAULT_PAGES);
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const loadAllPages = async () => {
    try {
      const res = await fetch('/api/list-pages');
      const data = await res.json();
      if (data.pages) {
        const combined = [...DEFAULT_PAGES];
        data.pages.forEach((p: string) => {
          if (!combined.find(cp => cp.id === p)) {
            combined.push({ id: p, name: `📄 ${p}` });
          }
        });
        setAllPages(combined);
      }
    } catch (e) {
      console.error("Error loading pages:", e);
    }
  };

  useEffect(() => {
    loadAllPages();
  }, []);

  const set = (patch: Partial<ContentState>) => {
    setContent(prev => {
      const isChanged = Object.entries(patch).some(([k, v]) => prev[k as keyof ContentState] !== v);
      if (!isChanged) return prev;
      if (!isFetching && mounted) setIsDirty(true);
      return { ...prev, ...patch };
    });
  };

  useEffect(() => {
    setMounted(true);
    if (!authLoading && !user) router.push('/admin/login');
  }, [user, authLoading, router]);

  const handlePageSelect = (newPage: string) => {
    if (isDirty) {
      if (!window.confirm('יש לך שינויים שלא נשמרו. האם את בטוחה שברצונך לעבור דף? השינויים יאבדו.')) return;
    }
    setSelectedPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    if (selectedPage !== 'custom') fetchPageContent(selectedPage);
  }, [selectedPage]);

  const fetchPageContent = async (id: string) => {
    setIsFetching(true);
    try {
      const res = await fetch(`/api/get-content?pageId=${id}`);
      const data = await res.json();
      const fb = PAGE_FALLBACKS[id] || {};
      const d = data.success ? data.content : null;
      
      if (d) {
        setContent({
          ...getInitialPageContent(id),
          ...d,
          pageId: id
        });
      } else {
        setContent(getInitialPageContent(id));
      }
      setTimeout(() => {
        setIsDirty(false);
        setIsFetching(false);
      }, 500);
    } catch (e) {
      toast({ variant: 'destructive', title: 'שגיאה בטעינת הדף', description: String(e) });
      setIsFetching(false);
    } 
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;
    const rawId = selectedPage === 'custom' ? customPageId : selectedPage;
    let targetId = rawId.toLowerCase().trim().replace(/[^a-z0-9-]/g, '-');
    
    if (!targetId) {
      toast({ variant: 'destructive', title: 'אנא הזינו מזהה עמוד (Slug)' });
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch('/api/save-content', {
        method: 'POST',
        body: JSON.stringify({ [targetId]: content }),
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      
      if (data.success) {
        setIsDirty(false);
        await loadAllPages();
        toast({ title: '✅ נשמר בהצלחה!', description: `התוכן נשמר בתיקיית הפרויקט.` });
        if (selectedPage === 'custom') setSelectedPage(targetId);
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      toast({ variant: 'destructive', title: '❌ שמירה נכשלה', description: err.message });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeletePage = async () => {
    if (!selectedPage || selectedPage === 'global') return;
    if (!window.confirm(`האם אתם בטוחים שברצונכם למחוק את הדף "${selectedPage}" מהפרויקט?`)) return;
    
    setIsSaving(true);
    try {
      const res = await fetch('/api/delete-page', {
        method: 'POST',
        body: JSON.stringify({ pageId: selectedPage }),
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      if (data.success) {
        toast({ title: '✅ נמחק בהצלחה', description: `הדף ${selectedPage} הוסר מהמערכת.` });
        await loadAllPages();
        setSelectedPage('home');
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'מחיקה נכשלה', description: err.message });
    } finally {
      setIsSaving(false);
    }
  };

  const addItem = <K extends 'ctaButtons' | 'features' | 'testimonials' | 'faqs' | 'navItems' | 'footerItems' | 'journeySteps'>(
    key: K, 
    item: ContentState[K] extends any[] ? ContentState[K][number] : any
  ) => {
    setContent(prev => ({ ...prev, [key]: [...(prev[key] as any[]), item] }));
    setIsDirty(true);
  };
  const removeItem = (key: keyof ContentState, i: number) => {
    setContent(prev => { const a = [...(prev[key] as any[])]; a.splice(i, 1); return { ...prev, [key]: a }; });
    setIsDirty(true);
  };
  const updateItem = (key: keyof ContentState, i: number, field: string, val: string) => {
    setContent(prev => { const a = [...(prev[key] as any[])]; a[i] = { ...a[i], [field]: val }; return { ...prev, [key]: a }; });
    setIsDirty(true);
  };
  const moveItem   = (key: keyof ContentState, i: number, dir: 'up' | 'down') => {
    setContent(prev => {
      const a = [...(prev[key] as any[])];
      const j = dir === 'up' ? i - 1 : i + 1;
      if (j < 0 || j >= a.length) return prev;
      [a[i], a[j]] = [a[j], a[i]];
      return { ...prev, [key]: a };
    });
    setIsDirty(true);
  };

  if (!mounted || authLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-stone-50"><Loader2 className="animate-spin text-primary size-12" /></div>;
  }

  return (
    <main className="min-h-screen bg-stone-50 text-right pb-44">
      <Navbar />
      <section className="pt-28 md:pt-48 px-4 md:px-6 max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div className="w-full">
            <button 
              type="button"
              onClick={() => router.push('/admin/dashboard')} 
              className="mb-4 text-stone-400 p-0 hover:text-primary h-auto flex items-center transition-colors"
            >
              <ChevronRight className="ml-2 size-4" /> חזרה ללוח הבקרה
            </button>
            <h1 className="text-4xl md:text-6xl font-handwriting text-accent">Admin תוכן ועיצוב</h1>
          </div>

          <div className="w-full md:w-96 flex flex-col gap-4 md:sticky md:top-[88px] md:z-[40]">
            <div className="flex gap-2">
              <div className="flex-1">
                <Field label="בחר דף לעריכה">
                  <Select value={selectedPage} onValueChange={handlePageSelect}>
                    <SelectTrigger className="bg-white border-none h-12 rounded-none shadow-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="global" className="font-bold text-primary">⚙️ הגדרות כלליות, תפריטים ופוטר</SelectItem>
                      {allPages.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                      <SelectItem value="custom" className="italic text-stone-400">✚ עמוד חדש</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              </div>
              <button 
                type="button" 
                onClick={loadAllPages} 
                className="mt-7 text-stone-400 hover:text-primary transition-colors p-2"
              >
                <RefreshCcw size={16} />
              </button>
            </div>
            {(selectedPage === 'custom' || (selectedPage !== 'global' && selectedPage !== 'custom')) && (
              <Field label="מזהה עמוד (Slug)">
                <Input 
                  value={selectedPage === 'custom' ? customPageId : customPageId || selectedPage} 
                  onChange={e => setCustomPageId(e.target.value)} 
                  placeholder="my-new-page" 
                  className="bg-white h-12" 
                />
              </Field>
            )}
            {selectedPage !== 'global' && selectedPage !== 'custom' && (
              <button 
                type="button" 
                onClick={handleDeletePage} 
                className="text-red-500 hover:text-red-700 self-end text-xs transition-colors hover:underline mt-1"
              >
                מחיקת דף זה לצמיתות
              </button>
            )}
          </div>
        </div>

        {isFetching ? (
          <div className="h-96 flex flex-col items-center justify-center text-stone-400 gap-4">
            <Loader2 className="animate-spin size-12" />
            <p className="boutique-label">טוען נתונים...</p>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-12">
            
            {selectedPage === 'global' ? (
              <SectionCard icon={<Globe size={20} />} title="הגדרות כלליות וסלוגן">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Field label="שם האתר">
                    <Input value={content.siteName} onChange={e => set({ siteName: e.target.value })} />
                  </Field>
                  <Field label="סלוגן ראשי">
                    <Input value={content.siteSubtitle} onChange={e => set({ siteSubtitle: e.target.value })} />
                  </Field>
                  <Field label="טקסט כפתור הנעה לפעולה (Navbar)">
                    <Input value={content.ctaLabel || ''} onChange={e => set({ ctaLabel: e.target.value })} placeholder="למשל: לקביעת פגישה" />
                  </Field>
                  <div className="md:col-span-2">
                    <Field label="תיאור האתר (מופיע בפוטר)">
                      <Textarea value={content.siteDescription || ''} onChange={e => set({ siteDescription: e.target.value })} rows={3} placeholder="הכניסו כאן את הטקסט שיופיע בפוטר של האתר..." />
                    </Field>
                  </div>
                  <Field label="אימייל לContact Us">
                    <Input value={content.siteEmail || ''} onChange={e => set({ siteEmail: e.target.value })} dir="ltr" />
                  </Field>
                  <Field label="טלפון לContact Us">
                    <Input value={content.sitePhone || ''} onChange={e => set({ sitePhone: e.target.value })} dir="ltr" />
                  </Field>
                  <Field label="הודעת וואטסאפ (אוטומטית)">
                    <Input value={content.whatsappMsg || ''} onChange={e => set({ whatsappMsg: e.target.value })} placeholder="היי, הגעתי מהאתר..." />
                  </Field>
                  <Field label="כתובת / מיקום">
                    <Input value={content.siteAddress || ''} onChange={e => set({ siteAddress: e.target.value })} />
                  </Field>
                  <Field label="לינק פייסבוק">
                    <Input value={content.facebookLink || ''} onChange={e => set({ facebookLink: e.target.value })} dir="ltr" />
                  </Field>
                  <Field label="לינק אינסטגרם">
                    <Input value={content.instagramLink || ''} onChange={e => set({ instagramLink: e.target.value })} dir="ltr" />
                  </Field>
                  <Field label="לינק לינקדין">
                    <Input value={content.linkedinLink || ''} onChange={e => set({ linkedinLink: e.target.value })} dir="ltr" />
                  </Field>
                  <Field label="לינק יוטיוב">
                    <Input value={content.youtubeLink || ''} onChange={e => set({ youtubeLink: e.target.value })} dir="ltr" />
                  </Field>
                  <Field label="לינק טיקטוק">
                    <Input value={content.tiktokLink || ''} onChange={e => set({ tiktokLink: e.target.value })} dir="ltr" />
                  </Field>
                </div>
                {/* Global Nav Editor */}
                <div className="pt-8 space-y-4">
                  <Label className="boutique-label flex items-center gap-2">תפריט עליון (Navbar)</Label>
                  {content.navItems.map((item: any, i: number) => (
                    <div key={i} className="flex gap-2 items-end">
                      <div className="flex-1 space-y-1">
                        <Label className="text-[10px]">תווית</Label>
                        <Input value={item.label} onChange={e => updateItem('navItems', i, 'label', e.target.value)} />
                      </div>
                      <div className="flex-1 space-y-1">
                        <Label className="text-[10px]">קישור (Slug/URL)</Label>
                        <Input value={item.href} onChange={e => updateItem('navItems', i, 'href', e.target.value)} />
                      </div>
                      <MoveButtons onUp={() => moveItem('navItems', i, 'up')} onDown={() => moveItem('navItems', i, 'down')} disableUp={i === 0} disableDown={i === content.navItems.length - 1} />
                      <Button type="button" variant="ghost" onClick={() => removeItem('navItems', i)} className="text-destructive"><Trash2 size={16} /></Button>
                    </div>
                  ))}
                  <Button type="button" onClick={() => addItem('navItems', { label: '', href: '' })} variant="outline" className="w-full h-12 border-dashed">
                    <Plus className="mr-2 size-4" /> הוספת קישור לתפריט
                  </Button>
                </div>

                {/* Global Footer Editor */}
                <div className="pt-8 border-t border-stone-100 mt-8 space-y-4">
                  <Label className="boutique-label flex items-center gap-2 text-primary">קישורים בפוטר (Footer Links)</Label>
                  <p className="text-xs text-stone-400">אם רשימה זו ריקה, הפוטר ישתמש אוטומטית בקישורי התפריט העליון.</p>
                  {(content.footerItems || []).map((item: any, i: number) => (
                    <div key={i} className="flex gap-2 items-end">
                      <div className="flex-1 space-y-1">
                        <Label className="text-[10px]">תווית</Label>
                        <Input value={item.label} onChange={e => updateItem('footerItems', i, 'label', e.target.value)} />
                      </div>
                      <div className="flex-1 space-y-1">
                        <Label className="text-[10px]">קישור (Slug/URL)</Label>
                        <Input value={item.href} onChange={e => updateItem('footerItems', i, 'href', e.target.value)} />
                      </div>
                      <MoveButtons onUp={() => moveItem('footerItems', i, 'up')} onDown={() => moveItem('footerItems', i, 'down')} disableUp={i === 0} disableDown={i === (content.footerItems?.length || 0) - 1} />
                      <Button type="button" variant="ghost" onClick={() => removeItem('footerItems', i)} className="text-destructive"><Trash2 size={16} /></Button>
                    </div>
                  ))}
                  <Button type="button" onClick={() => addItem('footerItems', { label: '', href: '' })} variant="outline" className="w-full h-12 border-dashed">
                    <Plus className="mr-2 size-4" /> הוספת קישור לפוטר
                  </Button>
                </div>
              </SectionCard>
            ) : (
              <>
                <SectionCard icon={<Monitor size={20} />} title="הגדרות עמוד (SEO)">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Field label="כותרת העמוד (Meta Title)">
                      <Input value={content.metaTitle || ''} onChange={e => set({ metaTitle: e.target.value })} placeholder="כותרת המופיעה בגוגל" />
                    </Field>
                    <div className="md:col-span-2">
                      <Field label="תיאור העמוד (Meta Description)">
                        <Textarea value={content.metaDescription || ''} onChange={e => set({ metaDescription: e.target.value })} rows={2} placeholder="תיאור קצר עבור מנועי חיפוש" />
                      </Field>
                    </div>
                    <Field label="צבע ראשי לעמוד זה">
                      <Select value={content.primaryColor} onValueChange={v => set({ primaryColor: v })}>
                        <SelectTrigger className="bg-stone-50"><SelectValue /></SelectTrigger>
                        <SelectContent>{PRESET_COLORS.map(c => <SelectItem key={c.value} value={c.value || 'default'}>{c.name}</SelectItem>)}</SelectContent>
                      </Select>
                    </Field>
                  </div>
                  <Button type="button" onClick={() => addItem('ctaButtons', { label: 'לחצו כאן', href: '#', variant: 'primary', size: 'default' })} className="w-full h-12 border-dashed border-2 border-primary/20 bg-transparent text-primary hover:bg-primary/5">
                    <Plus className="mr-2 size-4" /> הוספת כפתור
                  </Button>
                </SectionCard>

                <SectionCard icon={<Box size={20} />} title="ניהול בלוקים (Page Blocks)">
                  <p className="text-sm text-stone-500 mb-6 font-bold">הוסיפו בלוקים לעמוד. ניתן לגרור ולשנות את הסדר שלהם.</p>
                  {(content.blocks || []).map((block, i) => (
                    <DynamicSectionEditor 
                      key={block.id || i}
                      section={block}
                      onChange={s => {
                        const next = [...(content.blocks || [])];
                        next[i] = s;
                        set({ blocks: next });
                      }}
                      onRemove={() => {
                        const next = [...(content.blocks || [])];
                        next.splice(i, 1);
                        set({ blocks: next });
                      }}
                      onMoveUp={() => {
                        const next = [...(content.blocks || [])];
                        if (i > 0) {
                          [next[i], next[i-1]] = [next[i-1], next[i]];
                          set({ blocks: next });
                        }
                      }}
                      onMoveDown={() => {
                        const next = [...(content.blocks || [])];
                        if (i < next.length - 1) {
                          [next[i], next[i+1]] = [next[i+1], next[i]];
                          set({ blocks: next });
                        }
                      }}
                      isFirst={i === 0}
                      isLast={i === (content.blocks?.length || 0) - 1}
                    />
                  ))}
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-12 pt-12 border-t border-stone-100">
                    <button 
                      type="button" 
                      onClick={() => {
                        const id = Math.random().toString(36).substr(2, 9);
                        const next = [...(content.blocks || []), { id, type: 'hero', title: 'כותרת גדולה', titleSettings: { text: 'כותרת גדולה', fontSize: 'text-9xl', fontFamily: 'font-handwriting', align: 'center', color: '#ffffff' }, heroHeight: '70vh', heroTextAlign: 'center', heroCloudiness: 30 }];
                        set({ blocks: next as any });
                      }} 
                      className="h-24 border-2 border-primary/20 border-dashed rounded-sm text-primary hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-2 font-bold"
                    >
                      <Monitor className="size-5" /> כותרת (Hero)
                    </button>
                    <button 
                      type="button" 
                      onClick={() => {
                        const id = Math.random().toString(36).substr(2, 9);
                        const next = [...(content.blocks || []), { id, type: 'intro', title: 'אודות', content: '', portraitPosition: 'left', bg: 'white' }];
                        set({ blocks: next as any });
                      }} 
                      className="h-24 border-2 border-primary/20 border-dashed rounded-sm text-primary hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-2 font-bold"
                    >
                      <UserRound className="size-5" /> אודות / פורטרט
                    </button>
                    <button 
                      type="button" 
                      onClick={() => {
                        const id = Math.random().toString(36).substr(2, 9);
                        const next = [...(content.blocks || []), { id, type: 'text', content: '', title: '', bg: 'white' }];
                        set({ blocks: next as any });
                      }} 
                      className="h-24 border-2 border-primary/20 border-dashed rounded-sm text-primary hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-2 font-bold"
                    >
                      <Type className="size-5" /> בלוק טקסט
                    </button>
                    <button 
                      type="button" 
                      onClick={() => {
                        const id = Math.random().toString(36).substr(2, 9);
                        const next = [...(content.blocks || []), { id, type: 'image-text', content: '', title: '', imageUrl: '', imagePosition: 'right', bg: 'white' }];
                        set({ blocks: next as any });
                      }} 
                      className="h-24 border-2 border-primary/20 border-dashed rounded-sm text-primary hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-2 font-bold"
                    >
                      <ImageIcon className="size-5" /> תמונה וטקסט
                    </button>
                    <button 
                      type="button" 
                      onClick={() => {
                        const id = Math.random().toString(36).substr(2, 9);
                        const next = [...(content.blocks || []), { id, type: 'features', title: 'יתרונות', features: [], bg: 'stone-50' }];
                        set({ blocks: next as any });
                      }} 
                      className="h-24 border-2 border-primary/20 border-dashed rounded-sm text-primary hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-2 font-bold"
                    >
                      <Box className="size-5" /> קוביות תוכן
                    </button>
                    <button 
                      type="button" 
                      onClick={() => {
                        const id = Math.random().toString(36).substr(2, 9);
                        const next = [...(content.blocks || []), { id, type: 'testimonials', title: 'ממליצים', testimonials: [], bg: 'white' }];
                        set({ blocks: next as any });
                      }} 
                      className="h-24 border-2 border-primary/20 border-dashed rounded-sm text-primary hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-2 font-bold"
                    >
                      <Quote className="size-5" /> המלצות
                    </button>
                    <button 
                      type="button" 
                      onClick={() => {
                        const id = Math.random().toString(36).substr(2, 9);
                        const next = [...(content.blocks || []), { id, type: 'faqs', title: 'שאלות נפוצות', faqs: [], bg: 'stone-50' }];
                        set({ blocks: next as any });
                      }} 
                      className="h-24 border-2 border-primary/20 border-dashed rounded-sm text-primary hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-2 font-bold"
                    >
                      <HelpCircle className="size-5" /> שאלות ותשובות
                    </button>
                    <button 
                      type="button" 
                      onClick={() => {
                        const id = Math.random().toString(36).substr(2, 9);
                        const next = [...(content.blocks || []), { 
                          id, 
                          type: 'comparison', 
                          title: 'השוואת שירות',
                          insightPoints: [
                            { text: 'מגיע לבנק כעוד לקוח אחד מיני רבים ללא כוח מיקוח', type: 'negative' },
                            { text: 'מקבל מסלולים סטנדרטיים שרווחיים בעיקר לבנק', type: 'negative' },
                            { text: 'טובע בבירוקרטיה, טפסים וטלפונים ללא סוף', type: 'negative' },
                            { text: 'אנחנו מביאים כוח קנייה של עשרות תיקים ומשיגים ריביות VIP', type: 'positive' },
                            { text: 'בניית תמהיל מותאם אישית שחוסך עשרות אלפי שקלים', type: 'positive' },
                            { text: 'ליווי מלא מאלף ועד תו - אנחנו עושים את העבודה השחורה', type: 'positive' }
                          ]
                        }];
                        set({ blocks: next as any });
                      }} 
                      className="h-24 border-2 border-primary/20 border-dashed rounded-sm text-primary hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-2 font-bold"
                    >
                      <ArrowLeftRight className="size-5" /> רכיב השוואה
                    </button>
                    <button 
                      type="button" 
                      onClick={() => {
                        const id = Math.random().toString(36).substr(2, 9);
                        const next = [...(content.blocks || []), { id, type: 'cta', ctaButtons: [], ctaAlign: 'center' }];
                        set({ blocks: next as any });
                      }} 
                      className="h-24 border-2 border-primary/20 border-dashed rounded-sm text-primary hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-2 font-bold"
                    >
                      <MousePointerClick className="size-5" /> כפתורי פעולה
                    </button>
                    <button 
                      type="button" 
                      onClick={() => {
                        const id = Math.random().toString(36).substr(2, 9);
                        const next = [...(content.blocks || []), { id, type: 'contact', title: 'צרו קשר' }];
                        set({ blocks: next as any });
                      }} 
                      className="h-24 border-2 border-primary/20 border-dashed rounded-sm text-primary hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-2 font-bold"
                    >
                      <MessageSquare className="size-5" /> טופס Contact
                    </button>
                    <button 
                      type="button" 
                      onClick={() => {
                        const id = Math.random().toString(36).substr(2, 9);
                        const next = [...(content.blocks || []), { id, type: 'map', title: 'המיקום שלנו', mapAddress: '' }];
                        set({ blocks: next as any });
                      }} 
                      className="h-24 border-2 border-primary/20 border-dashed rounded-sm text-primary hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-2 font-bold"
                    >
                      <Globe className="size-5" /> מפה
                    </button>
                    <button 
                      type="button" 
                      onClick={() => {
                        const id = Math.random().toString(36).substr(2, 9);
                        const next = [...(content.blocks || []), { id, type: 'logos', title: 'שותפים', logos: [], bg: 'white' }];
                        set({ blocks: next as any });
                      }} 
                      className="h-24 border-2 border-primary/20 border-dashed rounded-sm text-primary hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-2 font-bold"
                    >
                      <RefreshCcw className="size-5" /> לוגואים
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const id = Math.random().toString(36).substr(2, 9);
                        const next = [...(content.blocks || []), { id, type: 'title-only', title: 'כותרת בלבד' }];
                        set({ blocks: next as any });
                      }}
                      className="h-24 border-2 border-primary/20 border-dashed rounded-sm text-primary hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-2 font-bold"
                    >
                      <Type className="size-5" /> כותרת בלבד
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const id = Math.random().toString(36).substr(2, 9);
                        const next = [...(content.blocks || []), { id, type: 'video', videoUrl: '', title: '', statsBg: 'navy' }];
                        set({ blocks: next as any });
                      }}
                      className="h-24 border-2 border-primary/20 border-dashed rounded-sm text-primary hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-2 font-bold"
                    >
                      <Video className="size-5" /> וידאו
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const id = Math.random().toString(36).substr(2, 9);
                        const next = [...(content.blocks || []), { id, type: 'blog-grid', title: 'השראה ושיתופים', titleSettings: { text: 'השראה ושיתופים', subtitle: 'Journal', fontSize: 'text-4xl', fontFamily: 'font-headline', align: 'center', color: 'text-accent' } }];
                        set({ blocks: next as any });
                      }}
                      className="h-24 border-2 border-primary/20 border-dashed rounded-sm text-primary hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-2 font-bold"
                    >
                      <FileText className="size-5" /> רשימת מאמרים
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const id = Math.random().toString(36).substr(2, 9);
                        const next = [...(content.blocks || []), { id, type: 'stats', stats: [{value: '', label: '', prefix: '', suffix: ''}], statsBg: 'navy' }];
                        set({ blocks: next as any });
                      }}
                      className="h-24 border-2 border-primary/20 border-dashed rounded-sm text-primary hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-2 font-bold"
                    >
                      <BarChart2 className="size-5" /> מספרים / סטטיסטיקות
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const id = Math.random().toString(36).substr(2, 9);
                        const next = [...(content.blocks || []), {
                          id, type: 'insight',
                          title: 'כותרת הכרטיס',
                          insightImagePosition: 'left',
                          insightBg: 'light-blue',
                          insightPoints: [{ text: '', type: 'negative' }],
                          insightConclusion: ''
                        }];
                        set({ blocks: next as any });
                      }}
                      className="h-24 border-2 border-primary/20 border-dashed rounded-sm text-primary hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-2 font-bold"
                    >
                      <ImageIcon className="size-5" /> כרטיס תובנה
                    </button>
                  </div>
                </SectionCard>
              </>
            )}

            {/* ── Save Button ── */}
            <div className="fixed bottom-0 left-0 right-0 z-[250] bg-background/95 backdrop-blur-md border-t border-border/40">
              {autoSaveStatus !== 'idle' && (
                <div className={`flex items-center justify-center gap-1.5 text-xs font-headline py-1.5 transition-all ${
                  autoSaveStatus === 'saving' ? 'text-stone-400 bg-stone-50/80' :
                  autoSaveStatus === 'saved' ? 'text-green-700 bg-green-50/80' : 'text-red-600 bg-red-50/80'
                }`}>
                  {autoSaveStatus === 'saving' && <Loader2 size={11} className="animate-spin" />}
                  {autoSaveStatus === 'saved' && <Check size={11} />}
                  {autoSaveStatus === 'saving' ? 'שומר אוטומטית...' : autoSaveStatus === 'saved' ? 'נשמר אוטומטית ✓' : '⚠ שגיאה בשמירה האוטומטית'}
                </div>
              )}
              <div className="p-3 md:p-4">
                <Button type="submit" disabled={isSaving || autoSaveStatus === 'saving'} className="w-full bg-primary hover:bg-accent h-13 text-white text-base boutique-label rounded-none shadow-xl flex items-center justify-center gap-3">
                  {isSaving ? (
                    <><Loader2 className="animate-spin size-4" /> שומר...</>
                  ) : (
                    <><Save className="size-4" /> {isDirty ? 'שמירת שינויים ידנית' : 'כל השינויים שמורים ✓'}</>
                  )}
                </Button>
              </div>
            </div>

          </form>
        )}
      </section>
      <Footer />
    </main>
  );
}
