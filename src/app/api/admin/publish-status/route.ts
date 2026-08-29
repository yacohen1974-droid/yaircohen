import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const GITHUB_REPO = process.env.GITHUB_REPO || 'yacohen1974-droid/yaircohen';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

function ghHeaders(token: string) {
  return {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/vnd.github+json',
    'User-Agent': 'NextJS-CMS'
  };
}

export const dynamic = 'force-dynamic';

// The app can run multiple instances (see apphosting.yaml maxInstances), each with its
// own independent local filesystem. Reading src/content/site-data.json from local disk
// here would report whatever that specific instance happened to have on disk (which may
// be stale relative to what was actually just published), so we always compare the draft
// against the real published source of truth on GitHub's main branch instead.
export async function GET() {
  try {
    if (!GITHUB_TOKEN) {
      // No GitHub integration configured (e.g. local dev) — fall back to the local file
      // so the CMS is still usable.
      const filePath = path.join(process.cwd(), 'src/content/site-data.json');
      const contentString = await fs.readFile(filePath, 'utf-8');
      const data = JSON.parse(contentString);
      return NextResponse.json(
        { success: true, data, updatedAt: new Date().toISOString() },
        { headers: { 'Cache-Control': 'no-store' } }
      );
    }

    const filePath = 'src/content/site-data.json';
    const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}`;

    const res = await fetch(`${url}?ref=main`, {
      headers: ghHeaders(GITHUB_TOKEN),
      cache: 'no-store'
    });

    if (!res.ok) {
      return NextResponse.json(
        { success: false, error: `GitHub API returned ${res.status}` },
        { status: res.status, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    const info = await res.json();
    const contentString = Buffer.from(info.content, 'base64').toString('utf-8');
    const data = JSON.parse(contentString);

    return NextResponse.json(
      {
        success: true,
        data,
        sha: info.sha,
        updatedAt: new Date().toISOString()
      },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (error: any) {
    console.error('Error fetching publish status from GitHub:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch publish status' },
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}
