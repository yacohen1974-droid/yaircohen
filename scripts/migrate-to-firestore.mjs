import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
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
const db = getFirestore(app);

async function migrate() {
  console.log("Starting migration to Firestore...");
  const jsonPath = path.join(process.cwd(), 'src/content/site-data.json');
  const fileContent = await fs.readFile(jsonPath, 'utf-8');
  const data = JSON.parse(fileContent);

  // 1. Migrate global config
  if (data.global) {
    console.log("Migrating global configuration...");
    await setDoc(doc(db, 'pages', 'global'), data.global);
  }

  // 2. Migrate blog config
  if (data.blog) {
    console.log("Migrating blog page configuration...");
    await setDoc(doc(db, 'pages', 'blog'), data.blog);
  }

  // 3. Migrate pages
  if (data.pages) {
    for (const [pageId, pageContent] of Object.entries(data.pages)) {
      console.log(`Migrating page: ${pageId}...`);
      await setDoc(doc(db, 'pages', pageId), pageContent);
    }
  }

  // Migrate other pages defined at root (like home, about, etc.)
  const specialRootKeys = ['global', 'blog', 'blogPosts', 'pages'];
  for (const [key, value] of Object.entries(data)) {
    if (!specialRootKeys.includes(key)) {
      console.log(`Migrating root-level page: ${key}...`);
      await setDoc(doc(db, 'pages', key), value);
    }
  }

  // 4. Migrate blog posts
  if (data.blogPosts && Array.isArray(data.blogPosts)) {
    console.log(`Migrating ${data.blogPosts.length} blog posts...`);
    for (const post of data.blogPosts) {
      if (post.id) {
        console.log(`Migrating blog post: ${post.title || post.id}...`);
        await setDoc(doc(db, 'blogPosts', post.id), post);
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
