const DRAFT_KEY = 'yaircohen_draft_site_data';
const PUBLISHED_BASE_KEY = 'yaircohen_published_base';

export interface SiteData {
  pages: Record<string, any>;
  blogPosts: any[];
  global?: any;
  blog?: any;
  [key: string]: any;
}

export function getDraftData(): SiteData | null {
  if (typeof window === 'undefined') return null;
  const val = localStorage.getItem(DRAFT_KEY);
  if (!val) return null;
  try {
    const data = JSON.parse(val);
    if (data && typeof data === 'object') {
      return data as SiteData;
    }
    return null;
  } catch (e) {
    console.error("Failed to parse draft from localStorage:", e);
    return null;
  }
}

export function saveDraftData(data: SiteData) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
  window.dispatchEvent(new Event('cms_draft_updated'));
}

export function savePublishedBase(data: SiteData) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(PUBLISHED_BASE_KEY, JSON.stringify(canonicalize(data)));
}

export function hasDraftChanges(): boolean {
  if (typeof window === 'undefined') return false;

  const draft = getDraftData();
  if (!draft) return false;

  const publishedBaseStr = localStorage.getItem(PUBLISHED_BASE_KEY);
  if (!publishedBaseStr) return true; // If no base recorded, assume there are changes

  try {
    const draftCanon = JSON.stringify(canonicalize(draft));
    return draftCanon !== publishedBaseStr;
  } catch (e) {
    console.error('Failed to compare draft vs published:', e);
    return true;
  }
}

export function clearDraftData() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(DRAFT_KEY);
  window.dispatchEvent(new Event('cms_draft_updated'));
}

// ─── Plain-language change summary (for the pre-publish confirmation) ─────

const GLOBAL_FIELD_LABELS: Record<string, string> = {
  underConstruction: 'מצב אתר בבנייה (חסימת גלישה)',
  siteName: 'שם האתר',
  siteSubtitle: 'סלוגן',
  siteDescription: 'תיאור האתר (בפוטר)',
  siteLogo: 'לוגו',
  siteFavicon: 'פביקון',
  sitePhone: 'טלפון',
  siteEmail: 'אימייל',
  siteAddress: 'כתובת',
  facebookLink: 'קישור פייסבוק',
  instagramLink: 'קישור אינסטגרם',
  linkedinLink: 'קישור לינקדין',
  youtubeLink: 'קישור יוטיוב',
  tiktokLink: 'קישור טיקטוק',
  navItems: 'תפריט עליון',
  footerItems: 'תפריט פוטר',
  ctaLabel: 'טקסט כפתור הנעה לפעולה',
  whatsappMsg: 'הודעת וואטסאפ',
};

const PAGE_LABELS: Record<string, string> = {
  home: 'עמוד הבית',
  about: 'עמוד אודות',
  services: 'עמוד שירותים',
  contact: 'עמוד צור קשר',
  privacy: 'מדיניות פרטיות',
  terms: 'תנאי שימוש',
  accessibility: 'נגישות',
};

function canonicalize(obj: any): any {
  if (obj === null || obj === undefined) return null;
  if (typeof obj !== 'object') return obj;
  if (obj === '') return null;
  if (Array.isArray(obj)) {
    return obj.map(canonicalize).filter((v) => v !== null && v !== undefined);
  }
  const sorted: Record<string, any> = {};
  Object.keys(obj)
    .sort()
    .forEach((key) => {
      const val = canonicalize(obj[key]);
      if (val !== null && val !== undefined && val !== '') {
        sorted[key] = val;
      }
    });
  return Object.keys(sorted).length === 0 ? null : sorted;
}

export function contentHash(data: any): string {
  const canonical = canonicalize(data);
  return JSON.stringify(canonical);
}

function deepEqual(a: any, b: any): boolean {
  return JSON.stringify(canonicalize(a ?? null)) === JSON.stringify(canonicalize(b ?? null));
}

export interface ChangeSummary {
  labels: string[];
  /** URL paths of pages that changed, for a direct "view it" link after publish */
  changedPagePaths: string[];
}

export function summarizeChanges(published: SiteData | null, draft: SiteData): ChangeSummary {
  const labels: string[] = [];
  const changedPagePaths: string[] = [];
  const pub: SiteData = published || { pages: {}, blogPosts: [] };

  const globalPub = pub.global || {};
  const globalDraft = draft.global || {};
  for (const key of Object.keys(GLOBAL_FIELD_LABELS)) {
    if (!deepEqual(globalPub[key], globalDraft[key])) {
      labels.push(GLOBAL_FIELD_LABELS[key]);
    }
  }

  const pageIds = new Set([...Object.keys(pub.pages || {}), ...Object.keys(draft.pages || {})]);
  for (const id of pageIds) {
    if (!deepEqual(pub.pages?.[id], draft.pages?.[id])) {
      labels.push(PAGE_LABELS[id] || `עמוד "${id}"`);
      changedPagePaths.push(id === 'home' ? '/' : `/${id}`);
    }
  }

  if (!deepEqual(pub.blog, draft.blog)) {
    labels.push('הגדרות הבלוג');
    changedPagePaths.push('/blog');
  }

  if (!deepEqual(pub.blogPosts, draft.blogPosts)) {
    const pubCount = (pub.blogPosts || []).length;
    const draftCount = (draft.blogPosts || []).length;
    if (draftCount > pubCount) labels.push(`${draftCount - pubCount} מאמרים חדשים בבלוג`);
    else if (draftCount < pubCount) labels.push(`${pubCount - draftCount} מאמרים נמחקו מהבלוג`);
    else labels.push('עדכון תוכן בבלוג');
    changedPagePaths.push('/blog');
  }

  return { labels, changedPagePaths };
}

export async function initializeDraft(force = false): Promise<SiteData> {
  const existing = getDraftData();
  if (existing && !force) return existing;

  const res = await fetch('/api/admin/get-backup-data');
  const responseData = await res.json();
  if (!responseData.success) {
    throw new Error(responseData.error || "Failed to load initial site data");
  }

  const liveData: SiteData = responseData.data || { pages: {}, blogPosts: [] };

  // Ensure basic structure exists
  if (!liveData.pages) liveData.pages = {};
  if (!liveData.blogPosts) liveData.blogPosts = [];

  saveDraftData(liveData);
  savePublishedBase(liveData);
  return liveData;
}
