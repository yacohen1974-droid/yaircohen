// Single source of truth for turning a user-typed page identifier into the
// slug that is actually used as the page's key/URL everywhere in the CMS
// (draft.pages keys, /admin/pages editor, nav/footer/legal links, live routing).
// Anything that stores or displays a "page id" must go through this so the
// value a user sees while typing always matches what gets saved.
export function slugifyPageId(raw: string): string {
  return raw
    .toLowerCase()
    .trim()
    .replace(/^\/+/, '') // a leading "/" is a common typo when users think in URLs, not ids
    .replace(/[^\u0590-\u05FFa-z0-9-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function pageIdToHref(pageId: string): string {
  return pageId === 'home' ? '/' : `/${pageId}`;
}

export function hrefToPageId(href: string): string | null {
  const trimmed = href.trim();
  if (trimmed === '/' || trimmed === '') return 'home';
  if (
    trimmed.startsWith('http') ||
    trimmed.startsWith('#') ||
    trimmed.startsWith('tel:') ||
    trimmed.startsWith('mailto:')
  ) {
    return null;
  }
  
  try {
    const decoded = decodeURIComponent(trimmed);
    return decoded.startsWith('/') ? decoded.slice(1) : decoded;
  } catch (e) {
    return trimmed.startsWith('/') ? trimmed.slice(1) : trimmed;
  }
}
