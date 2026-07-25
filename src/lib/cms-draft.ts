const DRAFT_KEY = 'yaircohen_draft_site_data';

export interface SiteData {
  pages: Record<string, any>;
  blogPosts: any[];
  global?: any;
  blog?: any;
}

export function getDraftData(): SiteData | null {
  if (typeof window === 'undefined') return null;
  const val = localStorage.getItem(DRAFT_KEY);
  if (!val) return null;
  try {
    return JSON.parse(val);
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

export function hasDraftChanges(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(DRAFT_KEY) !== null;
}

export function clearDraftData() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(DRAFT_KEY);
  window.dispatchEvent(new Event('cms_draft_updated'));
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
  return liveData;
}
