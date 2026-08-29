import { db } from '@/firebase/init';
import { doc, getDoc, setDoc, collection, query, where, getDocs, writeBatch } from 'firebase/firestore';

const SITE_ID = 'default'; // Single site for now

export interface SiteData {
  pages: Record<string, any>;
  blogPosts: any[];
  global?: any;
}

/**
 * Read published content from Firestore (what the live site sees)
 *
 * Note: During build time, this may fail with permission-denied errors since the build
 * context is not authenticated. That's OK — the fallback returns empty data, and the
 * live site/API routes will read correctly when authenticated.
 */
export async function readPublishedSiteData(): Promise<SiteData> {
  const data: SiteData = { pages: {}, blogPosts: [], global: {} };
  const errors: string[] = [];

  // Read global published (single doc, cheap)
  try {
    const globalRef = doc(db, `sites/${SITE_ID}/global/settings`);
    const globalSnap = await getDoc(globalRef);
    if (globalSnap.exists() && globalSnap.data().published) {
      data.global = globalSnap.data().published;
    }
  } catch (error: any) {
    if (error?.code === 'permission-denied') {
      console.warn('[read global] Permission denied (expected at build time)');
    } else {
      console.error('[read global] Failed:', error.message);
      errors.push(`global: ${error.message}`);
    }
  }

  // Read all published pages (collection, needs list permission)
  try {
    const pagesRef = collection(db, `sites/${SITE_ID}/pages`);
    const pagesSnap = await getDocs(pagesRef);
    pagesSnap.forEach((doc) => {
      if (doc.data().published) {
        data.pages[doc.id] = doc.data().published;
      }
    });
  } catch (error: any) {
    if (error?.code === 'permission-denied') {
      console.warn('[read pages] Permission denied (expected at build time)');
    } else {
      console.error('[read pages] Failed:', error.message);
      errors.push(`pages: ${error.message}`);
    }
  }

  // Read all published blog posts
  try {
    const postsRef = collection(db, `sites/${SITE_ID}/blogPosts`);
    const postsSnap = await getDocs(postsRef);
    const posts: any[] = [];
    postsSnap.forEach((doc) => {
      if (doc.data().published) {
        posts.push(doc.data().published);
      }
    });
    posts.sort((a, b) => {
      const dateA = a.createdAt || '';
      const dateB = b.createdAt || '';
      return dateB.localeCompare(dateA);
    });
    data.blogPosts = posts;
  } catch (error: any) {
    if (error?.code === 'permission-denied') {
      console.warn('[read blogPosts] Permission denied (expected at build time)');
    } else {
      console.error('[read blogPosts] Failed:', error.message);
      errors.push(`blogPosts: ${error.message}`);
    }
  }

  return data;
}

/**
 * Read draft content from Firestore (what the CMS editor sees)
 */
export async function readDraftSiteData(): Promise<SiteData> {
  try {
    const data: SiteData = { pages: {}, blogPosts: [], global: {} };

    // Read global draft
    const globalRef = doc(db, `sites/${SITE_ID}/global/settings`);
    const globalSnap = await getDoc(globalRef);
    if (globalSnap.exists() && globalSnap.data().draft) {
      data.global = globalSnap.data().draft;
    }

    // Read all draft pages
    const pagesRef = collection(db, `sites/${SITE_ID}/pages`);
    const pagesSnap = await getDocs(pagesRef);
    pagesSnap.forEach((doc) => {
      if (doc.data().draft) {
        data.pages[doc.id] = doc.data().draft;
      }
    });

    // Read all draft blog posts
    const postsRef = collection(db, `sites/${SITE_ID}/blogPosts`);
    const postsSnap = await getDocs(postsRef);
    const posts: any[] = [];
    postsSnap.forEach((doc) => {
      if (doc.data().draft) {
        posts.push(doc.data().draft);
      }
    });
    posts.sort((a, b) => {
      const dateA = a.createdAt || '';
      const dateB = b.createdAt || '';
      return dateB.localeCompare(dateA);
    });
    data.blogPosts = posts;

    return data;
  } catch (error: any) {
    if (error?.code === 'permission-denied') {
      console.warn('[build-time] Firestore read blocked by security rules (expected during build)');
      return { pages: {}, blogPosts: [], global: {} };
    }
    console.error('Failed to read draft Firestore data:', error);
    throw error;
  }
}

/**
 * Publish draft to published (makes it live)
 */
export async function publishSiteData(data: SiteData): Promise<void> {
  const now = new Date().toISOString();
  const failures: string[] = [];

  // Written one doc at a time (not as a single atomic batch) so that one bad
  // document (e.g. a stale/irregular page id) can't take down every other
  // write with the same generic "Missing or insufficient permissions" error.
  if (data.global) {
    try {
      await setDoc(doc(db, `sites/${SITE_ID}/global/settings`), { published: data.global, updatedAt: now }, { merge: true });
    } catch (error: any) {
      console.error('[publish global] Failed:', error);
      failures.push(`הגדרות כלליות: ${error.message || error}`);
    }
  }

  if (data.pages) {
    for (const [pageId, pageData] of Object.entries(data.pages)) {
      try {
        await setDoc(doc(db, `sites/${SITE_ID}/pages/${pageId}`), { published: pageData, updatedAt: now }, { merge: true });
      } catch (error: any) {
        console.error(`[publish page:${pageId}] Failed:`, error);
        failures.push(`עמוד "${pageId}": ${error.message || error}`);
      }
    }
  }

  if (data.blogPosts) {
    for (const post of data.blogPosts) {
      if (!post.id) continue;
      try {
        await setDoc(doc(db, `sites/${SITE_ID}/blogPosts/${post.id}`), { published: post, updatedAt: now }, { merge: true });
      } catch (error: any) {
        console.error(`[publish blogPost:${post.id}] Failed:`, error);
        failures.push(`מאמר "${post.id}": ${error.message || error}`);
      }
    }
  }

  if (failures.length > 0) {
    throw new Error(`פרסום נכשל עבור: ${failures.join('; ')}`);
  }
  console.log('Successfully published site data to Firestore');
}

/**
 * Save draft (user is editing, not publishing yet)
 */
export async function saveDraftSiteData(data: SiteData): Promise<void> {
  try {
    const batch = writeBatch(db);
    const now = new Date().toISOString();

    // Save global draft
    if (data.global) {
      const globalRef = doc(db, `sites/${SITE_ID}/global/settings`);
      batch.set(
        globalRef,
        {
          draft: data.global,
          updatedAt: now,
        },
        { merge: true }
      );
    }

    // Save page drafts
    if (data.pages) {
      for (const [pageId, pageData] of Object.entries(data.pages)) {
        const pageRef = doc(db, `sites/${SITE_ID}/pages/${pageId}`);
        batch.set(
          pageRef,
          {
            draft: pageData,
            updatedAt: now,
          },
          { merge: true }
        );
      }
    }

    // Save blog post drafts
    if (data.blogPosts) {
      for (const post of data.blogPosts) {
        if (!post.id) continue;
        const postRef = doc(db, `sites/${SITE_ID}/blogPosts/${post.id}`);
        batch.set(
          postRef,
          {
            draft: post,
            updatedAt: now,
          },
          { merge: true }
        );
      }
    }

    await batch.commit();
    console.log('Successfully saved draft to Firestore');
  } catch (error) {
    console.error('Failed to save draft:', error);
    throw error;
  }
}
