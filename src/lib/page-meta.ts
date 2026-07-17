/**
 * Server-side Firestore metadata fetcher (no Admin SDK needed).
 * Reads metaTitle / metaDescription from siteContent/{pageId} via REST API.
 * Falls back to provided defaults if the doc is missing or fields are empty.
 */

const PROJECT_ID = 'ateam-3cf3d';
const API_KEY = 'AIzaSyDuN9MotAPhb2Efy6EYvITzQaCNjnZCPcM';
const FIRESTORE_BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

interface PageMetaDefaults {
  title: string;
  description: string;
}

interface PageMeta {
  title: string;
  description: string;
}

export async function fetchPageMeta(
  pageId: string,
  defaults: PageMetaDefaults
): Promise<PageMeta> {
  try {
    const url = `${FIRESTORE_BASE}/siteContent/${pageId}?key=${API_KEY}`;
    const res = await fetch(url, { next: { revalidate: 3600 } }); // cache 1 hour

    if (!res.ok) return defaults;

    const data = await res.json();
    const fields = data?.fields ?? {};

    const metaTitle = fields?.metaTitle?.stringValue?.trim();
    const metaDescription = fields?.metaDescription?.stringValue?.trim();

    return {
      title: metaTitle || defaults.title,
      description: metaDescription || defaults.description,
    };
  } catch {
    return defaults;
  }
}
