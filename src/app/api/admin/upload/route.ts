import { NextResponse } from 'next/server';
import * as fs from 'fs/promises';
import * as path from 'path';

const ALLOWED_TYPES = ['logo', 'favicon', 'partner-logo'] as const;
type UploadType = (typeof ALLOWED_TYPES)[number];

const TYPE_CONFIG: Record<UploadType, { dir: string; extensions: string[] }> = {
  logo: { dir: '', extensions: ['.png', '.jpg', '.jpeg', '.svg', '.webp'] },
  favicon: { dir: '', extensions: ['.png', '.ico', '.svg'] },
  'partner-logo': { dir: 'logos', extensions: ['.png', '.jpg', '.jpeg', '.svg', '.webp', '.gif', '.avif'] },
};

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

function sanitizeBaseName(name: string): string {
  const withoutExt = name.replace(/\.[^.]+$/, '');
  const slug = withoutExt
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  return slug || 'logo';
}

async function commitToGitHub(repoFilePath: string, buffer: Buffer, message: string) {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    console.log('No GITHUB_TOKEN configured. Skipping GitHub commit.');
    return;
  }
  const repo = process.env.GITHUB_REPO || 'yacohen1974-droid/yaircohen';
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
      message,
      content: buffer.toString('base64'),
      sha: sha || undefined,
      branch: 'main'
    })
  });

  if (!putRes.ok) {
    const errText = await putRes.text();
    throw new Error(`GitHub API returned ${putRes.status}: ${errText}`);
  }
}

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
    const config = TYPE_CONFIG[uploadType];
    const ext = path.extname(file.name).toLowerCase();
    if (!config.extensions.includes(ext)) {
      return NextResponse.json({
        success: false,
        error: `סיומת קובץ לא נתמכת. סוגים מותרים: ${config.extensions.join(', ')}`,
      }, { status: 400 });
    }

    let fileName: string;
    if (uploadType === 'partner-logo') {
      const baseName = sanitizeBaseName(file.name);
      fileName = `${baseName}${ext}`;
      const targetDir = path.join(process.cwd(), 'public', config.dir);
      let exists = await fs.access(path.join(targetDir, fileName)).then(() => true).catch(() => false);
      if (exists) {
        fileName = `${baseName}-${Math.random().toString(36).slice(2, 6)}${ext}`;
      }
    } else {
      fileName = `uploaded-${uploadType}${ext}`;
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const relativeDir = config.dir ? `public/${config.dir}` : 'public';
    const publicPath = config.dir ? `/${config.dir}/${fileName}` : `/${fileName}`;

    // 1. Write locally
    try {
      await fs.mkdir(path.join(process.cwd(), relativeDir), { recursive: true });
      await fs.writeFile(path.join(process.cwd(), relativeDir, fileName), buffer);
    } catch (e) {
      console.warn(`Failed to write ${fileName} locally:`, e);
    }

    // 2. Commit to GitHub in production
    await commitToGitHub(`${relativeDir}/${fileName}`, buffer, `admin: upload ${uploadType} via CMS`);

    return NextResponse.json({ success: true, path: publicPath });
  } catch (error: any) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ success: false, error: error.message || 'העלאת הקובץ נכשלה' }, { status: 500 });
  }
}
