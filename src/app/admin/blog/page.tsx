
"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useAuth, useUser } from '@/firebase';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, LogOut, ArrowRight, Monitor, Smartphone, Trash2, Edit, ChevronRight, Search, HelpCircle, X, ShieldCheck, Layout, Type, Image as ImageIcon, Box, FileText, Sparkles, MousePointerClick, Globe, Palette, BookOpen, Check } from 'lucide-react';
import { ADMIN_HELP_CONTENT } from '@/config/admin-help-content';

import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), {
  ssr: false,
  loading: () => <div className="h-48 w-full bg-stone-50 border border-stone-100 flex items-center justify-center font-headline text-stone-400">טוען עורך...</div>,
});

const BLOG_CATEGORIES = [
  'מדריכי משכנתא',
  'עדכוני שוק וריביות',
  'דירה ראשונה',
  'מחזור משכנתא',
  'נדל"ן להשקעה',
  'משכנתא לכל מטרה',
  'טיפים פיננסיים',
];

function CharCounter({ value, limit }: { value: string; limit: number }) {
  const len = value.length;
  const color = len > limit ? 'text-red-500' : len > Math.floor(limit * 0.85) ? 'text-amber-500' : 'text-stone-400';
  return <span className={`text-[10px] font-headline tabular-nums ${color}`}>{len}/{limit}</span>;
}

function wordCountFromHTML(html: string): number {
  const text = html.replace(/<[^>]+>/g, ' ').replace(/&nbsp;|\u00A0/g, ' ');
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function readingTime(wc: number): number {
  return Math.max(1, Math.round(wc / 200));
}

function GoogleSearchPreview({ title, url, description }: { title: string; url: string; description: string }) {
  if (!title && !description) return null;
  return (
    <div className="mt-2 p-4 border border-stone-100 bg-stone-50 rounded-sm shadow-sm" dir="ltr">
      <p className="text-[10px] boutique-label text-stone-400 mb-3 text-right">תצוגה מקדימה — כך יופיע בגוגל</p>
      <div className="space-y-0.5 font-sans">
        <p className={`text-[15px] font-normal leading-snug truncate ${title.length > 60 ? 'text-red-500' : 'text-[#1a0dab]'}`}>{title || 'כותרת המאמר'}</p>
        <p className="text-[13px] text-[#006621] truncate">{url}</p>
        <p className="text-[13px] text-[#545454] leading-snug line-clamp-2">{description || 'תיאור המאמר יופיע כאן...'}</p>
      </div>
    </div>
  );
}

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
      <span className="absolute right-full mr-4 bg-accent text-white px-3 py-1.5 rounded-sm text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none font-headline">מדריך בלוג</span>
    </button>
  );

  return (
    <div className="fixed inset-0 z-[500] flex justify-end" dir="rtl">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setOpen(false)} />
      <div className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="flex items-center justify-between p-6 border-b border-stone-100 bg-accent text-white flex-shrink-0">
          <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white p-1 transition-colors">
            <X size={22} />
          </button>
          <div className="text-right">
            <h2 className="text-2xl font-handwriting">מדריך הבלוג</h2>
            <p className="text-xs text-white/70 font-headline mt-0.5">הדרכה לAdmin מאמרים</p>
          </div>
        </div>
        <div className="p-4 border-b border-stone-100 flex-shrink-0">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-300 size-4" />
            <input
              type="text"
              placeholder="חפשי נושא (למשל: Slug, תמונות, SEO...)"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pr-9 pl-4 h-10 bg-stone-50 border border-stone-100 text-sm font-headline focus:outline-none focus:border-primary/40 text-right"
            />
          </div>
        </div>
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

export default function BlogManagementPage() {
  const { user, loading: authLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  
  const [mounted, setMounted] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [isDirty, setIsDirty] = useState(false);

  const [newPost, setNewPost] = useState({
    title: '',
    subtitle: '',
    summary: '',
    slug: '',
    content: '',
    heroImageUrlDesktop: '',
    heroImageUrlMobile: '',
    category: 'מדריכי משכנתא',
    date: new Date().toISOString().split('T')[0],
    ctaTitle: '',
    ctaSubtitle: '',
    ctaLabel: '',
    ctaLink: ''
  });

  const [posts, setPosts] = useState<any[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);

  const fetchPosts = async () => {
    setPostsLoading(true);
    try {
      const res = await fetch('/api/blog/list-posts');
      const data = await res.json();
      if (data.success) {
        setPosts(data.posts || []);
      }
    } catch (e) {
      console.error("Error fetching posts:", e);
    } finally {
      setPostsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    setMounted(true);
    if (!authLoading && !user) router.push('/admin/login');
  }, [user, authLoading, router]);

  // Track unsaved changes
  useEffect(() => {
    if (isAdding && mounted) setIsDirty(true);
  }, [newPost]);

  // Auto-save for existing posts (editingId set), debounced 3s
  useEffect(() => {
    if (!isDirty || !editingId || !isAdding) return;
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(async () => {
      const sanitizedSlug = newPost.slug.toLowerCase().trim().replace(/[^a-z0-9-]/g, '-');
      const postData = { ...newPost, id: editingId, slug: sanitizedSlug };
      if (postData.content) postData.content = postData.content.replace(/&nbsp;|\u00A0/g, ' ');
      
      setAutoSaveStatus('saving');
      try {
        const res = await fetch('/api/blog/save-post', {
          method: 'POST',
          body: JSON.stringify(postData),
          headers: { 'Content-Type': 'application/json' }
        });
        const data = await res.json();
        if (data.success) {
          setIsDirty(false);
          setAutoSaveStatus('saved');
          fetchPosts();
          setTimeout(() => setAutoSaveStatus('idle'), 2500);
        } else {
          throw new Error();
        }
      } catch {
        setAutoSaveStatus('error');
        setTimeout(() => setAutoSaveStatus('idle'), 4000);
      }
    }, 3000);
    return () => { if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current); };
  }, [isDirty, newPost, editingId, isAdding]);

  // Warn before leaving with unsaved changes
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (isDirty && isAdding) { e.preventDefault(); e.returnValue = ''; }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [isDirty, isAdding]);

  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;

    setIsSaving(true);
    const sanitizedSlug = newPost.slug.toLowerCase().trim().replace(/[^a-z0-9-]/g, '-');
    const postData = { ...newPost, id: editingId, slug: sanitizedSlug };
    if(postData.content) postData.content = postData.content.replace(/&nbsp;|\u00A0/g, ' ');

    try {
      const res = await fetch('/api/blog/save-post', {
        method: 'POST',
        body: JSON.stringify(postData),
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      if (data.success) {
        toast({ title: editingId ? "מאמר עודכן!" : "מאמר פורסם!" });
        resetForm();
        fetchPosts();
      } else {
        throw new Error();
      }
    } catch (err) {
      toast({ variant: 'destructive', title: "שגיאה בשמירה", description: "לא ניתן היה לשמור את המאמר." });
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (post: any) => {
    setNewPost({
      title: post.title,
      subtitle: post.subtitle || '',
      summary: post.summary || '',
      slug: post.slug || '',
      content: post.content,
      heroImageUrlDesktop: post.heroImageUrlDesktop || '',
      heroImageUrlMobile: post.heroImageUrlMobile || '',
      category: post.category,
      date: post.date,
      ctaTitle: post.ctaTitle || '',
      ctaSubtitle: post.ctaSubtitle || '',
      ctaLabel: post.ctaLabel || '',
      ctaLink: post.ctaLink || ''
    });
    setEditingId(post.id);
    setIsAdding(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("האם למחוק?")) return;
    try {
      const res = await fetch('/api/blog/delete-post', {
        method: 'POST',
        body: JSON.stringify({ id }),
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      if (data.success) {
        toast({ title: "מאמר נמחק." });
        fetchPosts();
      }
    } catch (e) {
      toast({ variant: 'destructive', title: "שגיאה במחיקה" });
    }
  };

  const resetForm = () => {
    setIsAdding(false);
    setEditingId(null);
    setIsDirty(false);
    setAutoSaveStatus('idle');
    setNewPost({ 
      title: '', 
      subtitle: '', 
      summary: '', 
      slug: '', 
      content: '', 
      heroImageUrlDesktop: '', 
      heroImageUrlMobile: '', 
      category: 'מדריכי משכנתא', 
      date: new Date().toISOString().split('T')[0],
      ctaTitle: '',
      ctaSubtitle: '',
      ctaLabel: '',
      ctaLink: ''
    });
  };

  if (!mounted || authLoading) return <div className="min-h-screen flex items-center justify-center bg-stone-50"><Loader2 className="animate-spin text-primary size-12" /></div>;
  if (!user) return null;

  return (
    <main className="min-h-screen bg-stone-50 text-right pb-32">
      <Navbar />
      <section className="pt-28 md:pt-48 px-4 md:px-6 max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div className="w-full">
            <Button variant="ghost" onClick={() => router.push('/admin/dashboard')} className="mb-4 text-stone-400 p-0 hover:text-primary h-auto">
              <ChevronRight className="ml-2 size-4" /> חזרה ללוח הבקרה
            </Button>
            <h1 className="text-4xl md:text-6xl font-handwriting text-accent">Admin בלוג</h1>
          </div>
          <Button 
            onClick={() => isAdding ? resetForm() : setIsAdding(true)} 
            className="w-full md:w-auto bg-accent hover:bg-primary text-white boutique-label h-12 px-8 rounded-none"
          >
            {isAdding ? "ביטול" : "מאמר חדש"} <Plus className="mr-2 size-4" />
          </Button>
        </div>

        {isAdding && (
          <Card className="mb-12 md:mb-20 bg-white shadow-2xl border-none rounded-none animate-in fade-in slide-in-from-top-4">
            <CardHeader className="border-b border-stone-50 py-4 md:py-6">
              <CardTitle className="text-2xl md:text-3xl font-headline text-accent">
                {editingId ? "עריכת מאמר" : "יצירת מאמר חדש"}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 md:pt-10">
              <form onSubmit={handleSavePost} className="space-y-6 md:space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                  <div className="space-y-2 md:space-y-3">
                    <div className="flex items-center justify-between">
                      <CharCounter value={newPost.title} limit={60} />
                      <Label className="boutique-label text-stone-400">כותרת</Label>
                    </div>
                    <Input value={newPost.title} onChange={e => setNewPost({...newPost, title: e.target.value})} required className="h-12 border-stone-100 bg-stone-50" />
                  </div>
                  <div className="space-y-2 md:space-y-3">
                    <Label className="boutique-label text-stone-400">Slug (אנגלית)</Label>
                    <Input value={newPost.slug} onChange={e => setNewPost({...newPost, slug: e.target.value})} required className="h-12 border-stone-100 bg-stone-50 font-sans" />
                  </div>
                  <div className="space-y-2 md:space-y-3">
                    <Label className="boutique-label text-stone-400">כותרת משנה (אופציונלי)</Label>
                    <Input value={newPost.subtitle} onChange={e => setNewPost({...newPost, subtitle: e.target.value})} placeholder="כותרת משנה קצרה..." className="h-12 border-stone-100 bg-stone-50" />
                  </div>
                  <div className="space-y-2 md:space-y-3 md:col-span-2">
                    <div className="flex items-center justify-between">
                      <CharCounter value={newPost.summary} limit={160} />
                      <Label className="boutique-label text-stone-400">תקציר (Meta Description)</Label>
                    </div>
                    <Textarea value={newPost.summary} onChange={e => setNewPost({...newPost, summary: e.target.value})} className="min-h-20 bg-stone-50" placeholder="יופיע בגוגל ובדף הבלוג — 2-3 משפטים" />
                  </div>
                  <div className="space-y-2 md:space-y-3">
                    <Label className="boutique-label text-stone-400">תמונת דסקטופ</Label>
                    <Input value={newPost.heroImageUrlDesktop} onChange={e => setNewPost({...newPost, heroImageUrlDesktop: e.target.value})} className="font-sans" dir="ltr" placeholder="https://..." />
                  </div>
                  <div className="space-y-2 md:space-y-3">
                    <Label className="boutique-label text-stone-400">תמונת מובייל</Label>
                    <Input value={newPost.heroImageUrlMobile} onChange={e => setNewPost({...newPost, heroImageUrlMobile: e.target.value})} className="font-sans" dir="ltr" placeholder="https://..." />
                  </div>
                  <div className="space-y-2 md:space-y-3">
                    <Label className="boutique-label text-stone-400">קטגוריה</Label>
                    <Select value={newPost.category} onValueChange={v => setNewPost({...newPost, category: v})}>
                      <SelectTrigger className="h-12 border-stone-100 bg-stone-50"><SelectValue /></SelectTrigger>
                      <SelectContent>{BLOG_CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 md:space-y-3">
                    <Label className="boutique-label text-stone-400">תאריך פרסום</Label>
                    <Input type="date" value={newPost.date} onChange={e => setNewPost({...newPost, date: e.target.value})} className="h-12 border-stone-100 bg-stone-50 font-sans" dir="ltr" />
                  </div>
                </div>

                <div className="bg-stone-50/50 p-6 border border-stone-100 space-y-6">
                  <h3 className="font-headline font-bold text-accent">הנעה לפעולה (CTA) בסוף המאמר</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="boutique-label text-stone-400">כותרת CTA</Label>
                      <Input value={newPost.ctaTitle} onChange={e => setNewPost({...newPost, ctaTitle: e.target.value})} placeholder="למשל: בואו נתחיל לחסוך ביחד" className="bg-white" />
                    </div>
                    <div className="space-y-2">
                      <Label className="boutique-label text-stone-400">כותרת משנה CTA</Label>
                      <Input value={newPost.ctaSubtitle} onChange={e => setNewPost({...newPost, ctaSubtitle: e.target.value})} placeholder="למשל: ייעוץ ראשוני ללא עלות..." className="bg-white" />
                    </div>
                    <div className="space-y-2">
                      <Label className="boutique-label text-stone-400">טקסט כפתור</Label>
                      <Input value={newPost.ctaLabel} onChange={e => setNewPost({...newPost, ctaLabel: e.target.value})} placeholder="למשל: צרו קשר לייעוץ" className="bg-white" />
                    </div>
                    <div className="space-y-2">
                      <Label className="boutique-label text-stone-400">קישור כפתור</Label>
                      <Input value={newPost.ctaLink} onChange={e => setNewPost({...newPost, ctaLink: e.target.value})} placeholder="/contact" className="bg-white font-sans" dir="ltr" />
                    </div>
                  </div>
                </div>

                <GoogleSearchPreview
                  title={newPost.title}
                  url={`brandname.co.il/blog/${newPost.slug || '...'}`}
                  description={newPost.summary}
                />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    {newPost.content ? (
                      <span className="text-[10px] text-stone-400 font-headline">
                        {wordCountFromHTML(newPost.content).toLocaleString()} מילים · ~{readingTime(wordCountFromHTML(newPost.content))} דקות קריאה
                      </span>
                    ) : <span />}
                    <Label className="boutique-label text-stone-400">תוכן המאמר</Label>
                  </div>
                  <div className="prose-editor min-h-[350px]">
                    <ReactQuill theme="snow" value={newPost.content} onChange={val => setNewPost({...newPost, content: val})} className="bg-stone-50" />
                  </div>
                </div>
                
                {autoSaveStatus !== 'idle' && (
                  <div className={`flex items-center justify-center gap-1.5 text-xs font-headline py-2 mb-2 ${
                    autoSaveStatus === 'saving' ? 'text-stone-400' :
                    autoSaveStatus === 'saved' ? 'text-green-700' : 'text-red-600'
                  }`}>
                    {autoSaveStatus === 'saving' && <Loader2 size={11} className="animate-spin" />}
                    {autoSaveStatus === 'saved' && <Check size={11} />}
                    {autoSaveStatus === 'saving' ? 'שומר אוטומטית...' : autoSaveStatus === 'saved' ? 'נשמר אוטומטית ✓' : '⚠ שגיאה בשמירה'}
                  </div>
                )}
                <Button disabled={isSaving || autoSaveStatus === 'saving'} className="bg-primary text-white boutique-label h-14 w-full rounded-none">
                  {isSaving ? <><Loader2 className="animate-spin mr-2" /> שומר...</> : (editingId ? "עדכון ידני" : "פרסום")}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-headline text-accent border-b border-stone-200 pb-4 mb-6">מאמרים קיימים</h2>
          {postsLoading ? (
            <div className="flex justify-center p-20"><Loader2 className="animate-spin text-stone-300 size-12" /></div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {posts?.map((post: any) => (
                <div key={post.id} className="bg-white p-4 md:p-8 border border-stone-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 group hover:border-primary/30 transition-all">
                  <div className="flex-1">
                    <span className="text-[10px] text-stone-300 uppercase font-bold block mb-1">{post.date} | {post.category}</span>
                    <h3 className="text-xl md:text-2xl font-headline text-accent group-hover:text-primary transition-colors">{post.title}</h3>
                  </div>
                  <div className="flex gap-2 w-full md:w-auto">
                    <Button variant="ghost" onClick={() => handleEdit(post)} className="text-stone-400 hover:text-primary flex-1 h-12 md:h-auto"><Edit size={18} /></Button>
                    <Button variant="ghost" onClick={() => handleDelete(post.id)} className="text-stone-400 hover:text-destructive flex-1 h-12 md:h-auto"><Trash2 size={18} /></Button>
                    <Button variant="ghost" onClick={() => router.push(`/blog/${post.slug || post.id}`)} className="text-stone-300 hover:text-accent flex-1 h-12 md:h-auto"><ArrowRight className="size-5" /></Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      <Footer />
      <AdminGuide />
    </main>
  );
}
