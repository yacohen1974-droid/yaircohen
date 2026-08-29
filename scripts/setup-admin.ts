/**
 * Setup admin collection in Firestore
 * Run: npx tsx scripts/setup-admin.ts
 *
 * This creates an /admins/{uid} document with role: "admin"
 * You'll be prompted to enter your Firebase User ID
 */

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function prompt(question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

async function main() {
  try {
    console.log('🔧 Firebase Admin Setup\n');

    // Get User ID
    console.log('1️⃣  Go to Firebase Console → Authentication');
    console.log('   Click on your user (amirher@gmail.com)');
    console.log('   Copy the UID from the top\n');

    const uid = await prompt('Enter your Firebase User ID (UID): ');
    if (!uid || uid.length < 20) {
      console.error('❌ Invalid UID. Must be at least 20 characters.');
      process.exit(1);
    }

    // Initialize Firebase Admin
    const serviceAccountPath = path.join(process.cwd(), 'firebase-adminsdk.json');
    if (!fs.existsSync(serviceAccountPath)) {
      console.error('❌ firebase-adminsdk.json not found');
      console.error('   Download it from Firebase Console → Project Settings → Service Accounts');
      process.exit(1);
    }

    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf-8'));
    const apps = getApps();
    const app = apps.length === 0 ? initializeApp({ credential: cert(serviceAccount) }) : apps[0];
    const db = getFirestore(app);

    // Create admin document
    console.log('\n📝 Creating admin document...');
    const adminRef = db.collection('admins').doc(uid);
    await adminRef.set({
      role: 'admin',
      createdAt: new Date().toISOString(),
    });

    console.log('✅ Admin collection created!');
    console.log(`   /admins/${uid}`);
    console.log('   └── role: "admin"');

    console.log('\n📋 Next steps:');
    console.log('1. Publish Security Rules (FIRESTORE_SCHEMA.md → Firebase Console)');
    console.log('2. Seed Firestore: npx tsx scripts/seed-firestore.ts');
    console.log('3. Test: npm run dev → login → edit a page');

    rl.close();
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

main();
