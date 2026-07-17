import { initializeApp } from 'firebase/app';
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, upsertPage, upsertBlogPost } from '../src/lib/dataconnect/esm/index.esm.js';
import fs from 'fs/promises';
import path from 'path';

const firebaseConfig = {
  apiKey: "AIzaSyCFCLyOZCi0HRAPM9iipX7urj4-yBllFFU",
  authDomain: "yaircohen-7823a.firebaseapp.com",
  projectId: "yaircohen-7823a",
  storageBucket: "yaircohen-7823a.firebasestorage.app",
  messagingSenderId: "285959731111",
  appId: "1:285959731111:web:72eab5a5d2e7df32b82882",
  measurementId: "G-CTGVLV3791"
};

const app = initializeApp(firebaseConfig);
const dataConnect = getDataConnect(app, connectorConfig);

async function migrate() {
  console.log("Starting migration to SQL Connect (PostgreSQL)...");
  const jsonPath = path.join(process.cwd(), 'src/content/site-data.json');
  const fileContent = await fs.readFile(jsonPath, 'utf-8');
  const data = JSON.parse(fileContent);

  // 1. Migrate global config
  if (data.global) {
    console.log("Migrating global configuration...");
    await upsertPage(dataConnect, { pageId: 'global', content: data.global });
  }

  // 2. Migrate blog config
  if (data.blog) {
    console.log("Migrating blog page configuration...");
    await upsertPage(dataConnect, { pageId: 'blog', content: data.blog });
  }

  // 3. Migrate pages
  if (data.pages) {
    for (const [pageId, pageContent] of Object.entries(data.pages)) {
      console.log(`Migrating page: ${pageId}...`);
      await upsertPage(dataConnect, { pageId, content: pageContent });
    }
  }

  // Migrate other pages defined at root (like home, about, etc.)
  const specialRootKeys = ['global', 'blog', 'blogPosts', 'pages'];
  for (const [key, value] of Object.entries(data)) {
    if (!specialRootKeys.includes(key)) {
      console.log(`Migrating root-level page: ${key}...`);
      await upsertPage(dataConnect, { pageId: key, content: value });
    }
  }

  // 4. Migrate blog posts
  if (data.blogPosts && Array.isArray(data.blogPosts)) {
    console.log(`Migrating ${data.blogPosts.length} blog posts...`);
    for (const post of data.blogPosts) {
      if (post.id) {
        console.log(`Migrating blog post: ${post.title || post.id}...`);
        
        // Convert dates to ISO strings for PostgreSQL timestamps
        let createdAt = new Date().toISOString();
        if (post.createdAt) {
          createdAt = typeof post.createdAt === 'number'
            ? new Date(post.createdAt).toISOString()
            : new Date(post.createdAt).toISOString();
        }
        
        await upsertBlogPost(dataConnect, {
          id: post.id,
          title: post.title || "",
          content: post.content || "",
          slug: post.slug || post.id,
          category: post.category || null,
          tags: post.tags || null,
          published: post.published ?? false,
          excerpt: post.excerpt || null,
          heroImageUrlDesktop: post.heroImageUrlDesktop || null,
          heroImageUrlMobile: post.heroImageUrlMobile || null,
          author: post.author || null,
          seoTitle: post.seoTitle || null,
          seoDescription: post.seoDescription || null,
        });
      }
    }
  }

  console.log("Migration completed successfully!");
  process.exit(0);
}

migrate().catch(err => {
  console.error("Migration failed:", err);
  process.exit(1);
});
