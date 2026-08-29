"use client";

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import {
  Loader2, Plus, Trash2, Heart, Sparkles, Image as ImageIcon, Type, Layout, Box, Quote,
  HelpCircle, MousePointerClick, AlignLeft, AlignCenter, AlignRight, UserRound, ChevronRight,
  Monitor, Smartphone, Globe, X, Search, BookOpen, FileText, ShieldCheck, Check, Video,
  BarChart2, Mail, Phone, Lock, Instagram, Linkedin, Youtube, Music, Compass, Users, Star,
  MessageSquare, Orbit, RefreshCcw, UploadCloud, FolderOpen, ChevronUp, ChevronDown
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
  onRemove?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  isFirst?: boolean;
  isLast?: boolean;
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
      <div className="flex justify-between items-center border-b border-slate-700 bg-slate-900 px-6 py-4 md:px-8 md:py-5">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-6 bg-primary rounded-full" />
          <span className="font-headline font-bold text-white text-lg">
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
          </span>
        </div>

        <div className="flex items-center gap-2">
          {onMoveUp && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-800"
              disabled={isFirst}
              onClick={onMoveUp}
              title="הזז למעלה"
            >
              <ChevronUp size={16} />
            </Button>
          )}
          {onMoveDown && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-800"
              disabled={isLast}
              onClick={onMoveDown}
              title="הזז למטה"
            >
              <ChevronDown size={16} />
            </Button>
          )}
          {onRemove && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-950/40"
              onClick={onRemove}
              title="מחק בלוק"
            >
              <Trash2 size={16} />
            </Button>
          )}
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

        {/* Block Specific Editors */}

        {/* Hero Section */}
        {section.type === 'hero' && (
          <div className="space-y-4 pt-4 border-t border-stone-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="כותרת הראשית (Hero Title)">
                <Input value={section.title || ''} onChange={e => onChange({ ...section, title: e.target.value })} placeholder="יועץ משכנתאות מקצועי" />
              </Field>
              <Field label="כותרת משנה (Hero Subtitle)">
                <Input value={section.subtitle || ''} onChange={e => onChange({ ...section, subtitle: e.target.value })} placeholder="ליווי אישי – מהשוואת הצעות..." />
              </Field>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="גובה הבלוק">
                <Select value={section.heroHeight || '70vh'} onValueChange={v => onChange({ ...section, heroHeight: v })}>
                  <SelectTrigger className="bg-stone-50 border-none h-12"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {HERO_HEIGHTS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="קישור לתמונת רקע">
                <Input value={section.imageUrl || ''} onChange={e => onChange({ ...section, imageUrl: e.target.value })} placeholder="/hero-bg.jpg" />
              </Field>
            </div>
            <div className="space-y-2">
              <Label className="boutique-label text-slate-700">רמת עננות/אפקט רקע ({section.heroCloudiness || 40}%)</Label>
              <Slider
                value={[section.heroCloudiness || 40]}
                onValueChange={v => onChange({ ...section, heroCloudiness: v[0] })}
                max={100}
                step={5}
              />
            </div>
          </div>
        )}

        {/* Intro/About Section */}
        {section.type === 'intro' && (
          <div className="space-y-4 pt-4 border-t border-stone-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="כותרת">
                <Input value={section.title || ''} onChange={e => onChange({ ...section, title: e.target.value })} />
              </Field>
              <Field label="קישור לתמונת פורטרט">
                <Input value={section.portraitImageUrl || ''} onChange={e => onChange({ ...section, portraitImageUrl: e.target.value })} placeholder="/profile.jpg" />
              </Field>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="מיקום התמונה">
                <Select value={section.portraitPosition || 'left'} onValueChange={v => onChange({ ...section, portraitPosition: v })}>
                  <SelectTrigger className="bg-stone-50 border-none h-12"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="left">שמאל</SelectItem>
                    <SelectItem value="right">ימין</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="צורת התמונה">
                <Select value={section.portraitShape || 'circle'} onValueChange={v => onChange({ ...section, portraitShape: v })}>
                  <SelectTrigger className="bg-stone-50 border-none h-12"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="circle">עיגול</SelectItem>
                    <SelectItem value="square">ריבוע</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>
            <Field label="תוכן האודות (מעוצב)">
              <ReactQuill
                theme="snow"
                value={section.content || ''}
                onChange={v => onChange({ ...section, content: v })}
                modules={QUILL_MODULES}
                formats={QUILL_FORMATS}
                className="bg-white border rounded"
              />
            </Field>
          </div>
        )}

        {/* Text Section */}
        {section.type === 'text' && (
          <div className="space-y-4 pt-4 border-t border-stone-200">
            <Field label="כותרת">
              <Input value={section.title || ''} onChange={e => onChange({ ...section, title: e.target.value })} />
            </Field>
            <Field label="תוכן הטקסט (מעוצב)">
              <ReactQuill
                theme="snow"
                value={section.content || ''}
                onChange={v => onChange({ ...section, content: v })}
                modules={QUILL_MODULES}
                formats={QUILL_FORMATS}
                className="bg-white border rounded"
              />
            </Field>
          </div>
        )}

        {/* Image & Text Section */}
        {section.type === 'image-text' && (
          <div className="space-y-4 pt-4 border-t border-stone-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="כותרת">
                <Input value={section.title || ''} onChange={e => onChange({ ...section, title: e.target.value })} />
              </Field>
              <Field label="קישור לתמונה">
                <Input value={section.imageUrl || ''} onChange={e => onChange({ ...section, imageUrl: e.target.value })} />
              </Field>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="מיקום התמונה">
                <Select value={section.imagePosition || 'left'} onValueChange={v => onChange({ ...section, imagePosition: v })}>
                  <SelectTrigger className="bg-stone-50 border-none h-12"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="left">שמאל (טקסט בימין)</SelectItem>
                    <SelectItem value="right">ימין (טקסט בשמאל)</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>
            <Field label="תוכן (מעוצב)">
              <ReactQuill
                theme="snow"
                value={section.content || ''}
                onChange={v => onChange({ ...section, content: v })}
                modules={QUILL_MODULES}
                formats={QUILL_FORMATS}
                className="bg-white border rounded"
              />
            </Field>
          </div>
        )}

        {/* Features/Grid Section */}
        {section.type === 'features' && (
          <div className="space-y-4 pt-4 border-t border-stone-200">
            <Field label="כותרת הבלוק">
              <Input value={section.title || ''} onChange={e => onChange({ ...section, title: e.target.value })} />
            </Field>
            
            <div className="space-y-4 mt-4">
              <Label className="font-semibold text-stone-700 block">רשימת קוביות התוכן:</Label>
              {(section.features || []).map((feat: any, fIdx: number) => (
                <div key={fIdx} className="bg-white border rounded-lg p-4 space-y-3 relative shadow-sm text-slate-800">
                  <button
                    type="button"
                    onClick={() => {
                      const features = [...(section.features || [])];
                      features.splice(fIdx, 1);
                      onChange({ ...section, features });
                    }}
                    className="absolute top-2 left-2 text-red-500 hover:text-red-700 text-xs font-semibold"
                  >
                    מחק קוביה ✕
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Field label="כותרת הקוביה">
                      <Input value={feat.title || ''} onChange={e => {
                        const features = [...(section.features || [])];
                        features[fIdx] = { ...feat, title: e.target.value };
                        onChange({ ...section, features });
                      }} />
                    </Field>
                    <Field label="אייקון לקוביה">
                      <Select value={feat.icon || 'Star'} onValueChange={v => {
                        const features = [...(section.features || [])];
                        features[fIdx] = { ...feat, icon: v };
                        onChange({ ...section, features });
                      }}>
                        <SelectTrigger className="bg-stone-50 border-none"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {ICON_OPTIONS.map(o => <SelectItem key={o.value} value={o.value}><div className="flex items-center gap-2">{o.icon} {o.value}</div></SelectItem>)}
                        </SelectContent>
                      </Select>
                    </Field>
                  </div>
                  <Field label="תיאור הקוביה">
                    <Textarea value={feat.description || ''} onChange={e => {
                      const features = [...(section.features || [])];
                      features[fIdx] = { ...feat, description: e.target.value };
                      onChange({ ...section, features });
                    }} rows={2} />
                  </Field>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={() => {
                const features = [...(section.features || []), { title: 'קוביה חדשה', description: '', icon: 'Star' }];
                onChange({ ...section, features });
              }} className="w-full">
                <Plus size={14} className="ml-1" /> הוסף קוביה חדשה
              </Button>
            </div>
          </div>
        )}

        {/* Testimonials Section */}
        {section.type === 'testimonials' && (
          <div className="space-y-4 pt-4 border-t border-stone-200">
            <Field label="כותרת הבלוק">
              <Input value={section.title || ''} onChange={e => onChange({ ...section, title: e.target.value })} />
            </Field>

            <div className="space-y-4 mt-4">
              <Label className="font-semibold text-stone-700 block">רשימת המלצות:</Label>
              {(section.testimonials || []).map((testi: any, tIdx: number) => (
                <div key={tIdx} className="bg-white border rounded-lg p-4 space-y-3 relative shadow-sm text-slate-800">
                  <button
                    type="button"
                    onClick={() => {
                      const testimonials = [...(section.testimonials || [])];
                      testimonials.splice(tIdx, 1);
                      onChange({ ...section, testimonials });
                    }}
                    className="absolute top-2 left-2 text-red-500 hover:text-red-700 text-xs font-semibold"
                  >
                    מחק המלצה ✕
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Field label="שם הממליץ">
                      <Input value={testi.author || ''} onChange={e => {
                        const testimonials = [...(section.testimonials || [])];
                        testimonials[tIdx] = { ...testi, author: e.target.value };
                        onChange({ ...section, testimonials });
                      }} />
                    </Field>
                    <Field label="תפקיד / מקום">
                      <Input value={testi.location || ''} onChange={e => {
                        const testimonials = [...(section.testimonials || [])];
                        testimonials[tIdx] = { ...testi, location: e.target.value };
                        onChange({ ...section, testimonials });
                      }} />
                    </Field>
                  </div>
                  <Field label="תוכן ההמלצה">
                    <Textarea value={testi.text || ''} onChange={e => {
                      const testimonials = [...(section.testimonials || [])];
                      testimonials[tIdx] = { ...testi, text: e.target.value };
                      onChange({ ...section, testimonials });
                    }} rows={3} />
                  </Field>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={() => {
                const testimonials = [...(section.testimonials || []), { text: '', author: '', location: '' }];
                onChange({ ...section, testimonials });
              }} className="w-full">
                <Plus size={14} className="ml-1" /> הוסף המלצה חדשה
              </Button>
            </div>
          </div>
        )}

        {/* FAQs Section */}
        {section.type === 'faqs' && (
          <div className="space-y-4 pt-4 border-t border-stone-200">
            <Field label="כותרת הבלוק">
              <Input value={section.title || ''} onChange={e => onChange({ ...section, title: e.target.value })} />
            </Field>

            <div className="space-y-4 mt-4">
              <Label className="font-semibold text-stone-700 block">רשימת שאלות ותשובות:</Label>
              {(section.faqs || []).map((faq: any, fIdx: number) => (
                <div key={fIdx} className="bg-white border rounded-lg p-4 space-y-3 relative shadow-sm text-slate-800">
                  <button
                    type="button"
                    onClick={() => {
                      const faqs = [...(section.faqs || [])];
                      faqs.splice(fIdx, 1);
                      onChange({ ...section, faqs });
                    }}
                    className="absolute top-2 left-2 text-red-500 hover:text-red-700 text-xs font-semibold"
                  >
                    מחק שאלה ✕
                  </button>
                  <Field label="השאלה">
                    <Input value={faq.question || ''} onChange={e => {
                      const faqs = [...(section.faqs || [])];
                      faqs[fIdx] = { ...faq, question: e.target.value };
                      onChange({ ...section, faqs });
                    }} />
                  </Field>
                  <Field label="התשובה">
                    <Textarea value={faq.answer || ''} onChange={e => {
                      const faqs = [...(section.faqs || [])];
                      faqs[fIdx] = { ...faq, answer: e.target.value };
                      onChange({ ...section, faqs });
                    }} rows={3} />
                  </Field>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={() => {
                const faqs = [...(section.faqs || []), { question: '', answer: '' }];
                onChange({ ...section, faqs });
              }} className="w-full">
                <Plus size={14} className="ml-1" /> הוסף שאלה חדשה
              </Button>
            </div>
          </div>
        )}

        {/* CTA Section */}
        {section.type === 'cta' && (
          <div className="space-y-4 pt-4 border-t border-stone-200">
            <Field label="כותרת הבלוק">
              <Input value={section.title || ''} onChange={e => onChange({ ...section, title: e.target.value })} />
            </Field>

            <div className="space-y-4 mt-4">
              <Label className="font-semibold text-stone-700 block">רשימת כפתורי פעולה:</Label>
              {(section.ctaButtons || []).map((btn: any, bIdx: number) => (
                <div key={bIdx} className="bg-white border rounded-lg p-4 space-y-3 relative shadow-sm text-slate-800">
                  <button
                    type="button"
                    onClick={() => {
                      const ctaButtons = [...(section.ctaButtons || [])];
                      ctaButtons.splice(bIdx, 1);
                      onChange({ ...section, ctaButtons });
                    }}
                    className="absolute top-2 left-2 text-red-500 hover:text-red-700 text-xs font-semibold"
                  >
                    מחק כפתור ✕
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <Field label="טקסט הכפתור">
                      <Input value={btn.label || ''} onChange={e => {
                        const ctaButtons = [...(section.ctaButtons || [])];
                        ctaButtons[bIdx] = { ...btn, label: e.target.value };
                        onChange({ ...section, ctaButtons });
                      }} />
                    </Field>
                    <Field label="קישור (URL)">
                      <Input value={btn.href || ''} onChange={e => {
                        const ctaButtons = [...(section.ctaButtons || [])];
                        ctaButtons[bIdx] = { ...btn, href: e.target.value };
                        onChange({ ...section, ctaButtons });
                      }} />
                    </Field>
                    <Field label="סגנון">
                      <Select value={btn.variant || 'primary'} onValueChange={v => {
                        const ctaButtons = [...(section.ctaButtons || [])];
                        ctaButtons[bIdx] = { ...btn, variant: v };
                        onChange({ ...section, ctaButtons });
                      }}>
                        <SelectTrigger className="bg-stone-50 border-none"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="primary">ראשי (צבע מלא)</SelectItem>
                          <SelectItem value="outline">משני (מסגרת)</SelectItem>
                          <SelectItem value="ghost">טקסט בלבד</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                  </div>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={() => {
                const ctaButtons = [...(section.ctaButtons || []), { label: 'כפתור חדש', href: '#', variant: 'primary', size: 'default' }];
                onChange({ ...section, ctaButtons });
              }} className="w-full">
                <Plus size={14} className="ml-1" /> הוסף כפתור פעולה חדש
              </Button>
            </div>
          </div>
        )}

        {/* Stats Section */}
        {section.type === 'stats' && (
          <div className="space-y-4 pt-4 border-t border-stone-200">
            <Field label="כותרת הבלוק">
              <Input value={section.title || ''} onChange={e => onChange({ ...section, title: e.target.value })} />
            </Field>

            <div className="space-y-4 mt-4">
              <Label className="font-semibold text-stone-700 block">נתונים וסטטיסטיקות:</Label>
              {(section.stats || []).map((stat: any, sIdx: number) => (
                <div key={sIdx} className="bg-white border rounded-lg p-4 space-y-3 relative shadow-sm text-slate-800">
                  <button
                    type="button"
                    onClick={() => {
                      const stats = [...(section.stats || [])];
                      stats.splice(sIdx, 1);
                      onChange({ ...section, stats });
                    }}
                    className="absolute top-2 left-2 text-red-500 hover:text-red-700 text-xs font-semibold"
                  >
                    מחק נתון ✕
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Field label="מספר / ערך (למשל: 100, 95)">
                      <Input value={stat.value || ''} onChange={e => {
                        const stats = [...(section.stats || [])];
                        stats[sIdx] = { ...stat, value: e.target.value };
                        onChange({ ...section, stats });
                      }} />
                    </Field>
                    <Field label="תיאור קצר (למשל: לקוחות מרוצים)">
                      <Input value={stat.label || ''} onChange={e => {
                        const stats = [...(section.stats || [])];
                        stats[sIdx] = { ...stat, label: e.target.value };
                        onChange({ ...section, stats });
                      }} />
                    </Field>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Field label="תחילית (למשל: +)">
                      <Input value={stat.prefix || ''} onChange={e => {
                        const stats = [...(section.stats || [])];
                        stats[sIdx] = { ...stat, prefix: e.target.value };
                        onChange({ ...section, stats });
                      }} />
                    </Field>
                    <Field label="סיומת (למשל: %)">
                      <Input value={stat.suffix || ''} onChange={e => {
                        const stats = [...(section.stats || [])];
                        stats[sIdx] = { ...stat, suffix: e.target.value };
                        onChange({ ...section, stats });
                      }} />
                    </Field>
                  </div>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={() => {
                const stats = [...(section.stats || []), { value: '', label: '', prefix: '', suffix: '' }];
                onChange({ ...section, stats });
              }} className="w-full">
                <Plus size={14} className="ml-1" /> הוסף נתון חדש
              </Button>
            </div>
          </div>
        )}

        {/* Video Section */}
        {section.type === 'video' && (
          <div className="space-y-6 pt-4 border-t border-stone-200">
            <Field label="כותרת הבלוק">
              <Input value={section.title || ''} onChange={e => onChange({ ...section, title: e.target.value })} />
            </Field>

            <Field label="פריסת סרטונים (עמודות בשורה)">
              <Select 
                value={section.videoColumns || 'default'} 
                onValueChange={(v) => onChange({ ...section, videoColumns: v === 'default' ? '' : v })}
              >
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="סרטון אחד בשורה" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">סרטון אחד בשורה (גדול)</SelectItem>
                  <SelectItem value="md:grid-cols-2">2 סרטונים בשורה (צמד)</SelectItem>
                  <SelectItem value="md:grid-cols-3">3 סרטונים בשורה (שלשה)</SelectItem>
                  <SelectItem value="md:grid-cols-4">4 סרטונים בשורה (רביעייה)</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <div className="space-y-3">
              <label className="text-sm font-semibold block">רשימת סרטונים</label>
              
              {/* Fallback to legacy single videoUrl if no videos array exists */}
              {!section.videos && section.videoUrl && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded text-xs text-amber-800 flex flex-col gap-2">
                  <span>נמצא סרטון ישן מוגדר. האם ברצונך להעביר אותו לרשימת הסרטונים החדשה?</span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-fit bg-white"
                    onClick={() => {
                      onChange({
                        ...section,
                        videos: [{ id: 'legacy-1', url: section.videoUrl, title: section.title || '' }],
                        videoUrl: '', // Clear legacy url
                        videoTitle: ''
                      });
                    }}
                  >
                    העבר לרשימה
                  </Button>
                </div>
              )}

              {(section.videos || []).map((video: any, idx: number) => (
                <div key={video.id || idx} className="p-4 bg-white border border-stone-200 rounded-2xl space-y-3 relative">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-stone-500">סרטון #{idx + 1}</span>
                    <div className="flex gap-1 items-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        disabled={idx === 0}
                        onClick={() => {
                          const videos = [...(section.videos || [])];
                          [videos[idx], videos[idx - 1]] = [videos[idx - 1], videos[idx]];
                          onChange({ ...section, videos });
                        }}
                      >
                        <ChevronUp size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        disabled={idx === (section.videos?.length || 0) - 1}
                        onClick={() => {
                          const videos = [...(section.videos || [])];
                          [videos[idx], videos[idx + 1]] = [videos[idx + 1], videos[idx]];
                          onChange({ ...section, videos });
                        }}
                      >
                        <ChevronDown size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700 h-7"
                        onClick={() => {
                          const videos = (section.videos || []).filter((_: any, i: number) => i !== idx);
                          onChange({ ...section, videos });
                        }}
                      >
                        מחק
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Field label="כותרת סרטון (מוצג כ-Tooltip)">
                      <Input 
                        value={video.title || ''} 
                        onChange={e => {
                          const videos = [...(section.videos || [])];
                          videos[idx] = { ...videos[idx], title: e.target.value };
                          onChange({ ...section, videos });
                        }} 
                        placeholder="כותרת הסרטון"
                      />
                    </Field>
                    <Field label="קישור ליוטיוב (YouTube)">
                      <Input 
                        value={video.url || ''} 
                        onChange={e => {
                          const videos = [...(section.videos || [])];
                          videos[idx] = { ...videos[idx], url: e.target.value };
                          onChange({ ...section, videos });
                        }} 
                        placeholder="https://www.youtube.com/watch?v=..."
                      />
                    </Field>
                  </div>
                </div>
              ))}

              <Button 
                variant="outline" 
                onClick={() => {
                  const videos = [...(section.videos || [])];
                  const newId = Math.random().toString(36).slice(2, 9);
                  videos.push({ id: newId, url: '', title: '' });
                  onChange({ ...section, videos });
                }} 
                className="w-full font-headline text-xs h-9"
              >
                הוסף סרטון וידאו
              </Button>
            </div>
          </div>
        )}

        {/* Contact Section */}
        {section.type === 'contact' && (
          <div className="space-y-4 pt-4 border-t border-stone-200">
            <Field label="כותרת הבלוק">
              <Input value={section.title || ''} onChange={e => onChange({ ...section, title: e.target.value })} placeholder="צור קשר" />
            </Field>
            <Field label="הסבר קצר">
              <Input value={section.content || ''} onChange={e => onChange({ ...section, content: e.target.value })} placeholder="נשמח לשמוע מכם..." />
            </Field>
          </div>
        )}

        {/* Map Section */}
        {section.type === 'map' && (
          <div className="space-y-4 pt-4 border-t border-stone-200">
            <Field label="כותרת הבלוק">
              <Input value={section.title || ''} onChange={e => onChange({ ...section, title: e.target.value })} />
            </Field>
            <Field label="כתובת מפה">
              <Input value={section.mapAddress || ''} onChange={e => onChange({ ...section, mapAddress: e.target.value })} placeholder="שדרות רוטשילד 1, תל אביב" />
            </Field>
          </div>
        )}

        {/* Logos Section */}
        {section.type === 'logos' && (
          <div className="space-y-4 pt-4 border-t border-stone-200 font-sans text-slate-800">
            <Field label="כותרת הבלוק">
              <Input value={section.title || ''} onChange={e => onChange({ ...section, title: e.target.value })} />
            </Field>
            <p className="text-xs text-stone-600 bg-white p-3 border rounded">
              ℹ️ לוגואים מוצגים באופן אוטומטי מגלריית הלוגואים שקיימת בתיקיית האתר.
            </p>
          </div>
        )}

        {/* Insight Section */}
        {section.type === 'insight' && (
          <div className="space-y-4 pt-4 border-t border-stone-200">
            <Field label="כותרת כרטיס תובנה">
              <Input value={section.title || ''} onChange={e => onChange({ ...section, title: e.target.value })} />
            </Field>
            
            <div className="space-y-4 mt-4">
              <Label className="font-semibold text-stone-700 block">נקודות/תובנות:</Label>
              {(section.insightPoints || []).map((point: any, pIdx: number) => (
                <div key={pIdx} className="bg-white border rounded-lg p-3 space-y-2 relative shadow-sm text-slate-800">
                  <button
                    type="button"
                    onClick={() => {
                      const insightPoints = [...(section.insightPoints || [])];
                      insightPoints.splice(pIdx, 1);
                      onChange({ ...section, insightPoints });
                    }}
                    className="absolute top-2 left-2 text-red-500 hover:text-red-700 text-xs font-semibold"
                  >
                    מחק ✕
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Field label="טקסט הנקודה">
                      <Input value={point.text || ''} onChange={e => {
                        const insightPoints = [...(section.insightPoints || [])];
                        insightPoints[pIdx] = { ...point, text: e.target.value };
                        onChange({ ...section, insightPoints });
                      }} />
                    </Field>
                    <Field label="סוג הנקודה">
                      <Select value={point.type || 'neutral'} onValueChange={v => {
                        const insightPoints = [...(section.insightPoints || [])];
                        insightPoints[pIdx] = { ...point, type: v };
                        onChange({ ...section, insightPoints });
                      }}>
                        <SelectTrigger className="bg-stone-50 border-none"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="positive">חיובית (ירוק)</SelectItem>
                          <SelectItem value="negative">שלילית (אדום)</SelectItem>
                          <SelectItem value="neutral">ניטרלית (אפור)</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                  </div>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={() => {
                const insightPoints = [...(section.insightPoints || []), { text: '', type: 'neutral' }];
                onChange({ ...section, insightPoints });
              }} className="w-full">
                <Plus size={14} className="ml-1" /> הוסף נקודת תובנה
              </Button>
            </div>
            
            <Field label="סיכום / תובנה סופית">
              <Input value={section.insightConclusion || ''} onChange={e => onChange({ ...section, insightConclusion: e.target.value })} />
            </Field>
          </div>
        )}

        {/* Title-only Section */}
        {section.type === 'title-only' && (
          <div className="space-y-4 pt-4 border-t border-stone-200">
            <Field label="כותרת">
              <Input value={section.title || ''} onChange={e => onChange({ ...section, title: e.target.value })} />
            </Field>
          </div>
        )}

        {/* Blog Grid Section */}
        {section.type === 'blog-grid' && (
          <div className="space-y-4 pt-4 border-t border-stone-200">
            <Field label="כותרת הבלוג">
              <Input value={section.title || ''} onChange={e => onChange({ ...section, title: e.target.value })} />
            </Field>
            <p className="text-xs text-stone-600 bg-white p-3 border rounded">
              ℹ️ רשימת המאמרים מוצגת באופן אוטומטי מתוך הבלוג של האתר.
            </p>
          </div>
        )}

        {/* Fallback for block types without specific fields or generic field editor */}
        {!['hero', 'intro', 'text', 'image-text', 'features', 'testimonials', 'faqs', 'cta', 'stats', 'video', 'contact', 'map', 'logos', 'insight', 'title-only', 'blog-grid'].includes(section.type) && (
          <div className="space-y-4 pt-4 border-t border-stone-200">
            <Field label="כותרת">
              <Input value={section.title || ''} onChange={e => onChange({ ...section, title: e.target.value })} />
            </Field>
            <Field label="תוכן">
              <Textarea value={section.content || ''} onChange={e => onChange({ ...section, content: e.target.value })} rows={4} />
            </Field>
          </div>
        )}
      </div>
    </div>
  );
}
