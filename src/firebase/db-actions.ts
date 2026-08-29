import { unstable_cache } from 'next/cache';
import {
  readPublishedSiteData,
  readDraftSiteData,
  publishSiteData,
  saveDraftSiteData,
  SiteData
} from '@/firebase/firestore-cms';

export const SITE_CONTENT_CACHE_TAG = 'site-content';

// Read published content from Firestore (what the live site sees).
// This is now the canonical read path for the public site.
async function readSiteData(): Promise<any> {
  try {
    return await readPublishedSiteData();
  } catch (e) {
    console.error("Failed to read published Firestore data:", e);
    return { pages: {}, blogPosts: [] };
  }
}

// Write to Firestore (the single source of truth).
// No GitHub commits, no disk writes — Firestore handles it all.
async function writeSiteData(data: any) {
  try {
    await publishSiteData(data);
  } catch (e) {
    console.error("Failed to write to Firestore:", e);
    throw e;
  }
}


export async function getPageContent(pageId: string) {
  const data = await readSiteData();
  return data.pages?.[pageId] || null;
}

export async function getBlogPosts() {
  const data = await readSiteData();
  const posts = data.blogPosts || [];

  // Sort by date descending
  posts.sort((a: any, b: any) => {
    const dateA = a.createdAt || '';
    const dateB = b.createdAt || '';
    return dateB.localeCompare(dateA);
  });

  return posts;
}

async function fetchDbInitialData() {
  // Reads the whole file once and returns every page it finds — so a page
  // created in the CMS gets real SSR content immediately, instead of only
  // the handful of page IDs that used to be hardcoded here.
  const raw = await readSiteData();
  const data: any = { pages: { ...(raw.pages || {}) } };
  if (raw.global) data.global = raw.global;
  if (raw.blog) data.blog = raw.blog;

  const posts = (raw.blogPosts || []).slice().sort((a: any, b: any) => {
    const dateA = a.createdAt || '';
    const dateB = b.createdAt || '';
    return dateB.localeCompare(dateA);
  });
  data.blogPosts = posts;

  return data;
}

export const getDbInitialData = unstable_cache(
  fetchDbInitialData,
  ['db-initial-data'],
  { tags: [SITE_CONTENT_CACHE_TAG], revalidate: 300 }
);

// ─── Draft (preview, not deployed) ────────────────────────────────────────
// Draft content lives in Firestore (separate from published).
// Admins can preview changes without affecting the live site.

export async function commitDraftSiteData(data: any) {
  try {
    await saveDraftSiteData(data);
  } catch (e) {
    console.error('Failed to save draft to Firestore:', e);
    throw e;
  }
}

export async function fetchDraftSiteData(): Promise<any | null> {
  try {
    return await readDraftSiteData();
  } catch (e) {
    console.warn('Failed to fetch draft site data from Firestore:', e);
    return null;
  }
}

// TODO: Publish history + one-click revert
// After Firestore migration, this would use Firestore document versioning.
// For now, these are stubs — not currently used in admin routes.

export interface PublishHistoryEntry {
  sha: string;
  message: string;
  date: string;
}

export async function getPublishHistory(limit = 5): Promise<PublishHistoryEntry[]> {
  // Placeholder: no version history implemented yet for Firestore
  return [];
}

export async function revertToPreviousPublish(): Promise<{ date: string; message: string }> {
  throw new Error('Publish revert not yet implemented for Firestore');
}
