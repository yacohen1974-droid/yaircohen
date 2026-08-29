import { NextResponse } from 'next/server';

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

export async function GET() {
  try {
    if (!GITHUB_TOKEN) {
      return NextResponse.json(
        { success: false, error: 'GITHUB_TOKEN not configured' },
        { status: 500, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    const filePath = 'src/content/site-data.json';
    const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}`;

    // Fetch the current file from GitHub main branch
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
