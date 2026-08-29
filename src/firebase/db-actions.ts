import * as fs from 'fs/promises';
import * as path from 'path';
import { unstable_cache } from 'next/cache';

export const SITE_CONTENT_CACHE_TAG = 'site-content';

// Helper to read the file
async function readSiteData(): Promise<any> {
  const filePath = path.join(process.cwd(), 'src/content/site-data.json');
  try {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (e) {
    console.error("Failed to read site-data.json:", e);
    return { pages: {}, blogPosts: [] };
  }
}

// Helper to write the file locally and to GitHub
async function writeSiteData(data: any) {
  const contentString = JSON.stringify(data, null, 2);
  
  // 1. Write locally if possible
  try {
    const filePath = path.join(process.cwd(), 'src/content/site-data.json');
    await fs.writeFile(filePath, contentString, 'utf-8');
  } catch (e) {
    console.warn("Failed to write site-data.json locally:", e);
  }

  // 2. Commit to GitHub in production
  await commitToGitHub(contentString);
}

async function commitToGitHub(contentString: string) {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    console.log("No GITHUB_TOKEN configured. Skipping GitHub commit.");
    return;
  }

  const repo = process.env.GITHUB_REPO || 'yacohen1974-droid/yaircohen';
  const filePath = 'src/content/site-data.json';
  const url = `https://api.github.com/repos/${repo}/contents/${filePath}`;

  try {
    console.log("Fetching file SHA from GitHub...");
    const getRes = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github+json',
        'User-Agent': 'NextJS-CMS'
      }
    });

    let sha = '';
    if (getRes.status === 200) {
      const fileInfo = await getRes.json();
      sha = fileInfo.sha;
    }

    console.log("Committing updated site-data.json to GitHub...");
    const putRes = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github+json',
        'User-Agent': 'NextJS-CMS'
      },
      body: JSON.stringify({
        message: 'admin: update website content via CMS',
        content: Buffer.from(contentString).toString('base64'),
        sha: sha || undefined,
        branch: 'main'
      })
    });

    if (!putRes.ok) {
      const errText = await putRes.text();
      throw new Error(`GitHub API returned ${putRes.status}: ${errText}`);
    }

    console.log("Successfully committed updated content to GitHub!");
  } catch (err) {
    console.error("GitHub commit failed:", err);
  }
}

export async function getPageContent(pageId: string) {
  const data = await readSiteData();
  return data.pages?.[pageId] || data[pageId] || null;
}

export async function savePageContent(pageId: string, content: any) {
  const data = await readSiteData();
  
  if (!data.pages) data.pages = {};
  
  const specialRootKeys = ['global', 'blog', 'blogPosts'];
  if (specialRootKeys.includes(pageId)) {
    data[pageId] = { ...data[pageId], ...content };
  } else {
    data.pages[pageId] = { ...data.pages[pageId], ...content };
  }

  await writeSiteData(data);
}

export async function deletePageContent(pageId: string) {
  const data = await readSiteData();
  
  if (data.pages?.[pageId]) {
    delete data.pages[pageId];
  }
  if (data[pageId]) {
    delete data[pageId];
  }
  
  await writeSiteData(data);
}

export async function getBlogPosts() {
  const data = await readSiteData();
  const posts = data.blogPosts || [];
  
  // Sort by date or createdAt descending
  posts.sort((a: any, b: any) => {
    const dateA = a.createdAt || '';
    const dateB = b.createdAt || '';
    return dateB.localeCompare(dateA);
  });
  
  return posts;
}

export async function saveBlogPost(post: any) {
  const data = await readSiteData();
  if (!data.blogPosts) data.blogPosts = [];

  let savedPost = { ...post };
  if (!savedPost.id) {
    savedPost.id = Math.random().toString(36).substr(2, 9);
    savedPost.createdAt = new Date().toISOString();
  } else {
    if (typeof savedPost.createdAt === 'number') {
      savedPost.createdAt = new Date(savedPost.createdAt).toISOString();
    } else if (!savedPost.createdAt) {
      savedPost.createdAt = new Date().toISOString();
    }
    savedPost.updatedAt = new Date().toISOString();
  }

  const index = data.blogPosts.findIndex((p: any) => p.id === savedPost.id);
  if (index !== -1) {
    data.blogPosts[index] = savedPost;
  } else {
    data.blogPosts.push(savedPost);
  }

  await writeSiteData(data);
}

export async function deleteBlogPost(id: string) {
  const data = await readSiteData();
  if (data.blogPosts) {
    data.blogPosts = data.blogPosts.filter((p: any) => p.id !== id);
    await writeSiteData(data);
  }
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

// ─── Draft branch (preview, not deployed) ──────────────────────────────────
// Lets the admin push a draft to a separate 'draft' git branch so it can be
// previewed from any device/browser via a cookie, without touching 'main'
// (which is what triggers a real deploy) and without a database.

const DRAFT_BRANCH = 'draft';

function ghHeaders(token: string) {
  return {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/vnd.github+json',
    'User-Agent': 'NextJS-CMS'
  };
}

async function ensureBranchExists(repo: string, token: string, branch: string) {
  const checkRes = await fetch(`https://api.github.com/repos/${repo}/git/ref/heads/${branch}`, {
    headers: ghHeaders(token)
  });
  if (checkRes.status === 200) return;

  const mainRefRes = await fetch(`https://api.github.com/repos/${repo}/git/ref/heads/main`, {
    headers: ghHeaders(token)
  });
  if (!mainRefRes.ok) throw new Error('לא ניתן לקרוא את ה-branch הראשי ב-GitHub');
  const mainRef = await mainRefRes.json();

  const createRes = await fetch(`https://api.github.com/repos/${repo}/git/refs`, {
    method: 'POST',
    headers: { ...ghHeaders(token), 'Content-Type': 'application/json' },
    body: JSON.stringify({ ref: `refs/heads/${branch}`, sha: mainRef.object.sha })
  });
  if (!createRes.ok && createRes.status !== 422) {
    const errText = await createRes.text();
    throw new Error(`יצירת branch לטיוטה נכשלה: ${createRes.status} ${errText}`);
  }
}

export async function commitDraftSiteData(data: any) {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error('GITHUB_TOKEN אינו מוגדר בשרת — לא ניתן לשמור טיוטה לתצוגה מקדימה');
  const repo = process.env.GITHUB_REPO || 'yacohen1974-droid/yaircohen';
  const filePath = 'src/content/site-data.json';
  const url = `https://api.github.com/repos/${repo}/contents/${filePath}`;

  await ensureBranchExists(repo, token, DRAFT_BRANCH);

  const contentString = JSON.stringify(data, null, 2);
  const getRes = await fetch(`${url}?ref=${DRAFT_BRANCH}`, { headers: ghHeaders(token) });
  let sha = '';
  if (getRes.status === 200) {
    const info = await getRes.json();
    sha = info.sha;
  }

  const putRes = await fetch(url, {
    method: 'PUT',
    headers: { ...ghHeaders(token), 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: 'admin: save draft via CMS (preview only, not deployed)',
      content: Buffer.from(contentString).toString('base64'),
      sha: sha || undefined,
      branch: DRAFT_BRANCH
    })
  });
  if (!putRes.ok) {
    const errText = await putRes.text();
    throw new Error(`שמירת הטיוטה ל-GitHub נכשלה: ${putRes.status} ${errText}`);
  }
}

export async function fetchDraftSiteData(): Promise<any | null> {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO || 'yacohen1974-droid/yaircohen';
  const filePath = 'src/content/site-data.json';
  if (!token) return null;

  try {
    const res = await fetch(`https://api.github.com/repos/${repo}/contents/${filePath}?ref=${DRAFT_BRANCH}`, {
      headers: ghHeaders(token),
      cache: 'no-store'
    });
    if (!res.ok) return null;
    const info = await res.json();
    const contentString = Buffer.from(info.content, 'base64').toString('utf-8');
    return JSON.parse(contentString);
  } catch (e) {
    console.warn('Failed to fetch draft site data from GitHub:', e);
    return null;
  }
}

// ─── Publish history + one-click revert ────────────────────────────────────
// Every publish is already a commit on GitHub, so version history is free —
// no separate backup mechanism needed.

export interface PublishHistoryEntry {
  sha: string;
  message: string;
  date: string;
}

export async function getPublishHistory(limit = 5): Promise<PublishHistoryEntry[]> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return [];
  const repo = process.env.GITHUB_REPO || 'yacohen1974-droid/yaircohen';
  const filePath = 'src/content/site-data.json';

  const res = await fetch(
    `https://api.github.com/repos/${repo}/commits?path=${encodeURIComponent(filePath)}&sha=main&per_page=${limit}`,
    { headers: ghHeaders(token), cache: 'no-store' }
  );
  if (!res.ok) return [];
  const commits = await res.json();
  if (!Array.isArray(commits)) return [];

  return commits.map((c: any) => ({
    sha: c.sha,
    message: c.commit?.message || '',
    date: c.commit?.author?.date || '',
  }));
}

export async function revertToPreviousPublish(): Promise<{ date: string; message: string }> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error('GITHUB_TOKEN אינו מוגדר בשרת');
  const repo = process.env.GITHUB_REPO || 'yacohen1974-droid/yaircohen';
  const filePath = 'src/content/site-data.json';
  const url = `https://api.github.com/repos/${repo}/contents/${filePath}`;

  const history = await getPublishHistory(5);
  if (history.length < 2) {
    throw new Error('אין גרסה קודמת לשחזר');
  }
  const previous = history[1];

  const prevContentRes = await fetch(`${url}?ref=${previous.sha}`, { headers: ghHeaders(token) });
  if (!prevContentRes.ok) throw new Error('לא ניתן לטעון את הגרסה הקודמת מ-GitHub');
  const prevInfo = await prevContentRes.json();
  const prevContentString = Buffer.from(prevInfo.content, 'base64').toString('utf-8');

  // The Contents API requires the current file's sha to authorize the update
  const currentRes = await fetch(url, { headers: ghHeaders(token) });
  if (!currentRes.ok) throw new Error('לא ניתן לקרוא את המצב הנוכחי מ-GitHub');
  const currentInfo = await currentRes.json();

  const putRes = await fetch(url, {
    method: 'PUT',
    headers: { ...ghHeaders(token), 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: 'admin: revert to previous version via CMS',
      content: Buffer.from(prevContentString).toString('base64'),
      sha: currentInfo.sha,
      branch: 'main'
    })
  });
  if (!putRes.ok) {
    const errText = await putRes.text();
    throw new Error(`שחזור הגרסה נכשל: ${putRes.status} ${errText}`);
  }

  // Keep the local file (and thus this instance's SSR reads) in sync too
  try {
    const localPath = path.join(process.cwd(), 'src/content/site-data.json');
    await fs.writeFile(localPath, prevContentString, 'utf-8');
  } catch (e) {
    console.warn('Failed to write reverted site-data.json locally:', e);
  }

  return { date: previous.date, message: previous.message };
}
