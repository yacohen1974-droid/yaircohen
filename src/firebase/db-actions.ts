import { dataConnect } from './init';
import { 
  getPage, 
  upsertPage, 
  deletePage, 
  listBlogPosts, 
  upsertBlogPost, 
  deleteBlogPost as sdkDeleteBlogPost
} from '@/lib/dataconnect';
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
  if (!dataConnect) return getLocalFallback(pageId);
  try {
    const result = await getPage(dataConnect, { pageId });
    if (result.data?.page) {
      return result.data.page.content;
    }
    return getLocalFallback(pageId);
  } catch (e) {
    console.warn(`DataConnect getPageContent failed for ${pageId}, falling back to local:`, e);
    return getLocalFallback(pageId);
  }
}

export async function savePageContent(pageId: string, content: any) {
  if (dataConnect) {
    try {
      await upsertPage(dataConnect, { pageId, content });
    } catch (e) {
      console.warn(`DataConnect savePageContent failed for ${pageId}:`, e);
      throw e;
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
  if (dataConnect) {
    try {
      await deletePage(dataConnect, { pageId });
    } catch (e) {
      console.warn(`DataConnect deletePageContent failed for ${pageId}:`, e);
      throw e;
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
  if (!dataConnect) return getLocalAllPostsFallback();
  try {
    const result = await listBlogPosts(dataConnect);
    if (result.data?.blogPosts) {
      return result.data.blogPosts;
    }
    return getLocalAllPostsFallback();
  } catch (e) {
    console.warn("DataConnect getBlogPosts failed, falling back to local:", e);
    return getLocalAllPostsFallback();
  }
}

export async function saveBlogPost(post: any) {
  let savedPost = { ...post };
  if (!savedPost.id) {
    savedPost.id = Math.random().toString(36).substr(2, 9);
    savedPost.createdAt = new Date().toISOString();
  } else {
    // Standardize dates to ISO strings for PostgreSQL/GraphQL Timestamps
    if (typeof savedPost.createdAt === 'number') {
      savedPost.createdAt = new Date(savedPost.createdAt).toISOString();
    } else if (!savedPost.createdAt) {
      savedPost.createdAt = new Date().toISOString();
    }
    savedPost.updatedAt = new Date().toISOString();
  }

  if (dataConnect) {
    try {
      await upsertBlogPost(dataConnect, {
        id: savedPost.id,
        title: savedPost.title || "",
        content: savedPost.content || "",
        slug: savedPost.slug || savedPost.id,
        category: savedPost.category || null,
        tags: savedPost.tags || null,
        published: savedPost.published ?? false,
        excerpt: savedPost.excerpt || null,
        heroImageUrlDesktop: savedPost.heroImageUrlDesktop || null,
        heroImageUrlMobile: savedPost.heroImageUrlMobile || null,
        author: savedPost.author || null,
        seoTitle: savedPost.seoTitle || null,
        seoDescription: savedPost.seoDescription || null,
      });
    } catch (e) {
      console.warn(`DataConnect saveBlogPost failed for ${savedPost.id}:`, e);
      throw e;
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
  if (dataConnect) {
    try {
      await sdkDeleteBlogPost(dataConnect, { id });
    } catch (e) {
      console.warn(`DataConnect deleteBlogPost failed for ${id}:`, e);
      throw e;
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
