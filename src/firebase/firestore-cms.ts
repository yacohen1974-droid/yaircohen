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
  try {
    const data: SiteData = { pages: {}, blogPosts: [], global: {} };

    // Read global published
    const globalRef = doc(db, `sites/${SITE_ID}/global/settings`);
    const globalSnap = await getDoc(globalRef);
    if (globalSnap.exists() && globalSnap.data().published) {
      data.global = globalSnap.data().published;
    }

    // Read all published pages
    const pagesRef = collection(db, `sites/${SITE_ID}/pages`);
    const pagesSnap = await getDocs(pagesRef);
    pagesSnap.forEach((doc) => {
      if (doc.data().published) {
        data.pages[doc.id] = doc.data().published;
      }
    });

    // Read all published blog posts
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

    return data;
  } catch (error: any) {
    // During build time, Firestore reads will fail with permission-denied.
    // Return empty data gracefully — the live site will have real data when it loads.
    if (error?.code === 'permission-denied') {
      console.warn('[build-time] Firestore read blocked by security rules (expected during build)');
      return { pages: {}, blogPosts: [], global: {} };
    }
    console.error('Failed to read published Firestore data:', error);
    throw error;
  }
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
  try {
    const batch = writeBatch(db);
    const now = new Date().toISOString();

    // Publish global
    if (data.global) {
      const globalRef = doc(db, `sites/${SITE_ID}/global/settings`);
      batch.set(
        globalRef,
        {
          published: data.global,
          updatedAt: now,
        },
        { merge: true }
      );
    }

    // Publish pages
    if (data.pages) {
      for (const [pageId, pageData] of Object.entries(data.pages)) {
        const pageRef = doc(db, `sites/${SITE_ID}/pages/${pageId}`);
        batch.set(
          pageRef,
          {
            published: pageData,
            updatedAt: now,
          },
          { merge: true }
        );
      }
    }

    // Publish blog posts
    if (data.blogPosts) {
      for (const post of data.blogPosts) {
        if (!post.id) continue;
        const postRef = doc(db, `sites/${SITE_ID}/blogPosts/${post.id}`);
        batch.set(
          postRef,
          {
            published: post,
            updatedAt: now,
          },
          { merge: true }
        );
      }
    }

    await batch.commit();
    console.log('Successfully published site data to Firestore');
  } catch (error) {
    console.error('Failed to publish site data:', error);
    throw error;
  }
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
