import { getDraftData } from '@/lib/cms-draft';
import { hrefToPageId } from '@/lib/slug';

export interface KnownPage {
  id: string;
  name: string;
  isDraftOnly: boolean;
}

export const DEFAULT_PAGES: KnownPage[] = [
  { id: 'home', name: '🏠 ראשי', isDraftOnly: false },
  { id: 'contact', name: '📩 צור קשר', isDraftOnly: false },
  { id: 'global', name: '⚙️ הגדרות כלליות', isDraftOnly: false },
];

/**
 * The one place that knows "what pages exist" for the admin UI: published
 * pages (file routes + site-data.json, via /api/list-pages), plus whatever
 * pages/menu links exist only in the local unpublished draft. Both
 * /admin/pages and /admin/manage-pages render from this so they can never
 * disagree with each other.
 */
export async function listAllPages(): Promise<KnownPage[]> {
  const combined: KnownPage[] = [...DEFAULT_PAGES];
  const upsert = (id: string, name: string, isDraftOnly: boolean) => {
    const existing = combined.find((p) => p.id === id);
    if (!existing) combined.push({ id, name, isDraftOnly });
  };

  try {
    const res = await fetch('/api/list-pages', { cache: 'no-store' });
    const data = await res.json();
    if (Array.isArray(data.pages)) {
      data.pages.forEach((id: string) => upsert(id, `📄 ${id}`, false));
    }
  } catch (e) {
    console.error('Error loading published pages:', e);
  }

  const draft = getDraftData();
  if (draft) {
    if (draft.pages) {
      Object.keys(draft.pages).forEach((id) => upsert(id, `📄 ${id} (טיוטה)`, true));
    }

    if (draft.global) {
      const menuKeys = ['navItems', 'footerItems', 'legalItems'];
      menuKeys.forEach((key) => {
        const items = draft.global[key];
        if (!Array.isArray(items)) return;
        items.forEach((item: any) => {
          const rawId = typeof item?.href === 'string' ? hrefToPageId(item.href) : null;
          const id = rawId?.toLowerCase();
          if (id && id !== 'blog' && /^[a-z0-9-]+$/.test(id)) {
            upsert(id, `📄 ${id} (מתוך תפריט)`, true);
          }
        });
      });
    }
  }

  return combined;
}
