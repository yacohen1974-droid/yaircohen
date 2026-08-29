/**
 * Seed Firestore with published site data from site-data.json
 *
 * Run once to migrate all content from the JSON file to Firestore.
 * After seeding, Firestore becomes the canonical SSoT and site-data.json
 * is only kept for reference/backup.
 *
 * Usage:
 *   npx tsx scripts/seed-firestore.ts
 */

import { db } from '../src/firebase/init';
import { writeBatch, doc } from 'firebase/firestore';
import * as fs from 'fs/promises';
import * as path from 'path';

const SITE_ID = 'default';

async function seedFirestore() {
  try {
    // Read site-data.json
    const jsonPath = path.join(process.cwd(), 'src/content/site-data.json');
    const jsonContent = await fs.readFile(jsonPath, 'utf-8');
    const siteData = JSON.parse(jsonContent);

    const batch = writeBatch(db);
    const now = new Date().toISOString();

    // Seed global settings
    if (siteData.global) {
      const globalRef = doc(db, `sites/${SITE_ID}/global/settings`);
      batch.set(globalRef, {
        published: siteData.global,
        draft: siteData.global,
        updatedAt: now
      });
      console.log('✓ Seeded global settings');
    }

    // Seed pages
    if (siteData.pages && typeof siteData.pages === 'object') {
      let pageCount = 0;
      for (const [pageId, pageContent] of Object.entries(siteData.pages)) {
        const pageRef = doc(db, `sites/${SITE_ID}/pages/${pageId}`);
        batch.set(pageRef, {
          published: pageContent,
          draft: pageContent,
          updatedAt: now
        });
        pageCount++;
      }
      console.log(`✓ Seeded ${pageCount} pages`);
    }

    // Seed blog posts
    if (siteData.blogPosts && Array.isArray(siteData.blogPosts)) {
      let postCount = 0;
      for (const post of siteData.blogPosts) {
        if (!post.id) {
          console.warn(`⚠ Blog post missing id, skipping:`, post);
          continue;
        }
        const postRef = doc(db, `sites/${SITE_ID}/blogPosts/${post.id}`);
        batch.set(postRef, {
          published: post,
          draft: post,
          updatedAt: now
        });
        postCount++;
      }
      console.log(`✓ Seeded ${postCount} blog posts`);
    }

    // Commit all writes in one transaction
    await batch.commit();
    console.log('\n✅ Firestore seeding complete!');
    console.log('   Firestore is now the single source of truth.');
    console.log('   site-data.json is kept for reference only.');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

// Run
seedFirestore();
