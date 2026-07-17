import { doc, getDoc, setDoc, deleteDoc, collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from './init';
import * as fs from 'fs/promises';
import * as path from 'path';

const getLocalFallback = async (pageId: string) => {
  try {
    const filePath = path.join(process.cwd(), 'src/content/site-data.json');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(fileContent);
    
    // In site-data.json, pages can be at the root or under pages
    return data.pages?.[pageId] || data[pageId] || null;
  } catch (e) {
    console.warn(`Local fallback read failed for page ${pageId}:`, e);
    return null;
  }
};

const getLocalAllPostsFallback = async () => {
  try {
    const filePath = path.join(process.cwd(), 'src/content/site-data.json');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(fileContent);
    return data.blogPosts || [];
  } catch (e) {
    console.warn("Local fallback read failed for blog posts:", e);
    return [];
  }
};

export async function getPageContent(pageId: string) {
  if (!db) return getLocalFallback(pageId);
  try {
    const docRef = doc(db, 'pages', pageId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return getLocalFallback(pageId);
  } catch (e) {
    console.warn(`Firestore getPageContent failed for ${pageId}, falling back to local:`, e);
    return getLocalFallback(pageId);
  }
}

export async function savePageContent(pageId: string, content: any) {
  if (db) {
    try {
      const docRef = doc(db, 'pages', pageId);
      await setDoc(docRef, content, { merge: true });
    } catch (e) {
      console.warn(`Firestore savePageContent failed for ${pageId}:`, e);
    }
  }

  // Always update local fallback as cache/backup
  try {
    const filePath = path.join(process.cwd(), 'src/content/site-data.json');
    let existingData: any = {};
    try {
      const fileContent = await fs.readFile(filePath, 'utf-8');
      existingData = JSON.parse(fileContent);
    } catch (e) {}

    if (!existingData.pages) existingData.pages = {};

    const specialRootKeys = ['global', 'blog', 'blogPosts'];
    if (specialRootKeys.includes(pageId)) {
      existingData[pageId] = { ...existingData[pageId], ...content };
    } else {
      existingData.pages[pageId] = { ...existingData.pages[pageId], ...content };
    }

    await fs.writeFile(filePath, JSON.stringify(existingData, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error saving local fallback:', e);
  }
}

export async function deletePageContent(pageId: string) {
  if (db) {
    try {
      const docRef = doc(db, 'pages', pageId);
      await deleteDoc(docRef);
    } catch (e) {
      console.warn(`Firestore deletePageContent failed for ${pageId}:`, e);
    }
  }

  // Update local fallback
  try {
    const siteDataPath = path.join(process.cwd(), 'src/content/site-data.json');
    const fileContent = await fs.readFile(siteDataPath, 'utf-8');
    const data = JSON.parse(fileContent);
    
    if (data.pages?.[pageId]) {
      delete data.pages[pageId];
    }
    if (data[pageId]) {
      delete data[pageId];
    }
    await fs.writeFile(siteDataPath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error deleting page from local fallback:', e);
  }
}

export async function getBlogPosts() {
  if (!db) return getLocalAllPostsFallback();
  try {
    const blogPostsCol = collection(db, 'blogPosts');
    const q = query(blogPostsCol, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
    return getLocalAllPostsFallback();
  } catch (e) {
    console.warn("Firestore getBlogPosts failed, falling back to local:", e);
    return getLocalAllPostsFallback();
  }
}

export async function saveBlogPost(post: any) {
  let savedPost = { ...post };
  if (!savedPost.id) {
    savedPost.id = Math.random().toString(36).substr(2, 9);
    savedPost.createdAt = Date.now();
  } else {
    savedPost.updatedAt = Date.now();
  }

  if (db) {
    try {
      const docRef = doc(db, 'blogPosts', savedPost.id);
      await setDoc(docRef, savedPost, { merge: true });
    } catch (e) {
      console.warn(`Firestore saveBlogPost failed for ${savedPost.id}:`, e);
    }
  }

  // Update local fallback
  try {
    const filePath = path.join(process.cwd(), 'src/content/site-data.json');
    let data: any = {};
    try {
      const fileContent = await fs.readFile(filePath, 'utf-8');
      data = JSON.parse(fileContent);
    } catch (e) {}

    if (!data.blogPosts) data.blogPosts = [];
    const index = data.blogPosts.findIndex((p: any) => p.id === savedPost.id);
    if (index !== -1) {
      data.blogPosts[index] = savedPost;
    } else {
      data.blogPosts.push(savedPost);
    }
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error saving blog post to local fallback:', e);
  }
}

export async function deleteBlogPost(id: string) {
  if (db) {
    try {
      const docRef = doc(db, 'blogPosts', id);
      await deleteDoc(docRef);
    } catch (e) {
      console.warn(`Firestore deleteBlogPost failed for ${id}:`, e);
    }
  }

  // Update local fallback
  try {
    const filePath = path.join(process.cwd(), 'src/content/site-data.json');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(fileContent);
    if (data.blogPosts) {
      data.blogPosts = data.blogPosts.filter((p: any) => p.id !== id);
      await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
    }
  } catch (e) {
    console.error('Error deleting blog post from local fallback:', e);
  }
}
