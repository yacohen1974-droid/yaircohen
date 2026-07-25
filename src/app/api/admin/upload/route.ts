import { NextResponse } from 'next/server';
import * as fs from 'fs/promises';
import * as path from 'path';

const ALLOWED_TYPES = ['logo', 'favicon'] as const;
type UploadType = (typeof ALLOWED_TYPES)[number];

const ALLOWED_EXTENSIONS: Record<UploadType, string[]> = {
  logo: ['.png', '.jpg', '.jpeg', '.svg', '.webp'],
  favicon: ['.png', '.ico', '.svg'],
};

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const type = formData.get('type');

    if (!(file instanceof File)) {
      return NextResponse.json({ success: false, error: 'לא סופק קובץ' }, { status: 400 });
    }
    if (typeof type !== 'string' || !ALLOWED_TYPES.includes(type as UploadType)) {
      return NextResponse.json({ success: false, error: 'סוג העלאה לא חוקי' }, { status: 400 });
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json({ success: false, error: 'הקובץ גדול מדי (מקסימום 5MB)' }, { status: 400 });
    }

    const uploadType = type as UploadType;
    const ext = path.extname(file.name).toLowerCase();
    if (!ALLOWED_EXTENSIONS[uploadType].includes(ext)) {
      return NextResponse.json({
        success: false,
        error: `סיומת קובץ לא נתמכת. סוגים מותרים: ${ALLOWED_EXTENSIONS[uploadType].join(', ')}`,
      }, { status: 400 });
    }

    const fileName = `uploaded-${uploadType}${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    // 1. Write locally
    try {
      await fs.writeFile(path.join(process.cwd(), 'public', fileName), buffer);
    } catch (e) {
      console.warn(`Failed to write ${fileName} locally:`, e);
    }

    // 2. Commit to GitHub in production
    const token = process.env.GITHUB_TOKEN;
    if (token) {
      const repo = process.env.GITHUB_REPO || 'yacohen1974-droid/yaircohen';
      const repoFilePath = `public/${fileName}`;
      const url = `https://api.github.com/repos/${repo}/contents/${repoFilePath}`;

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

      const putRes = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/vnd.github+json',
          'User-Agent': 'NextJS-CMS'
        },
        body: JSON.stringify({
          message: `admin: upload ${uploadType} via CMS`,
          content: buffer.toString('base64'),
          sha: sha || undefined,
          branch: 'main'
        })
      });

      if (!putRes.ok) {
        const errText = await putRes.text();
        throw new Error(`GitHub API returned ${putRes.status}: ${errText}`);
      }
    } else {
      console.log('No GITHUB_TOKEN configured. Skipping GitHub commit.');
    }

    return NextResponse.json({ success: true, path: `/${fileName}` });
  } catch (error: any) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ success: false, error: error.message || 'העלאת הקובץ נכשלה' }, { status: 500 });
  }
}
