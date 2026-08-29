import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import * as fs from 'fs/promises';
import * as path from 'path';
import { SITE_CONTENT_CACHE_TAG } from '@/firebase/db-actions';
import { requireAdmin } from '@/lib/verify-admin';

export async function POST(request: Request) {
  try {
    if (!(await requireAdmin(request))) {
      return NextResponse.json({ success: false, error: 'לא מורשה' }, { status: 401 });
    }

    const data = await request.json();

    // Validate request body
    if (!data || typeof data !== 'object') {
      return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 });
    }

    const contentString = JSON.stringify(data, null, 2);
    
    // 1. Write locally
    try {
      const filePath = path.join(process.cwd(), 'src/content/site-data.json');
      await fs.writeFile(filePath, contentString, 'utf-8');
    } catch (e) {
      console.warn("Failed to write site-data.json locally:", e);
    }

    // 2. Commit to GitHub in production
    const token = process.env.GITHUB_TOKEN;
    if (token) {
      const repo = process.env.GITHUB_REPO || 'yacohen1974-droid/yaircohen';
      const filePath = 'src/content/site-data.json';
      const url = `https://api.github.com/repos/${repo}/contents/${filePath}`;

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
          message: 'admin: publish website updates via CMS',
          content: Buffer.from(contentString).toString('base64'),
          sha: sha || undefined,
          branch: 'main'
        })
      });

      if (!putRes.ok) {
        const errText = await putRes.text();
        throw new Error(`GitHub API returned ${putRes.status}: ${errText}`);
      }
      console.log("Successfully committed to GitHub!");
    } else {
      console.log("No GITHUB_TOKEN configured. Skipping GitHub commit.");
    }

    // 3. Revalidate Next.js cache
    revalidateTag(SITE_CONTENT_CACHE_TAG);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error publishing site content:', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to publish site content' }, { status: 500 });
  }
}
