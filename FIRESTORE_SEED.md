# Firestore Seed Instructions

## Manual setup (via Firebase Console)

בפורטל Firebase (https://console.firebase.google.com):

1. בחר את הפרויקט `yaircohen-7823a`
2. לך לـ Firestore Database
3. יצור את הcolleections הבאות **בסדר הזה**:

### Collections

**`sites/default/global/settings`** (document)
```json
{
  "published": {
    "siteName": "יאיר כהן",
    "siteTagline": "...",
    "navItems": [/* ... */],
    // ... כל עמוד global settings
  },
  "draft": {
    // כפי ל-published (או חלקית)
  },
  "updatedAt": "2026-08-29T..."
}
```

**`sites/default/pages/{pageId}`** (documents, for each page)

לכל דף ב-`site-data.json:pages`:
```json
{
  "published": { /* כל תוכן הדף */ },
  "draft": { /* כפי ל-published */ },
  "updatedAt": "2026-08-29T..."
}
```

דוגמה עבור `home`:
```
sites/default/pages/home
  published: { heroTitle: "...", sections: [...] }
  draft: { heroTitle: "...", sections: [...] }
  updatedAt: "2026-08-29T..."
```

**`sites/default/blogPosts/{postId}`** (documents, for each post)

```json
{
  "published": { /* כל תוכן הפוסט */ },
  "draft": { /* כפי ל-published */ },
  "updatedAt": "2026-08-29T..."
}
```

## Automated seed script (TODO)

בעתיד, אפשר לכתוב `scripts/seed-firestore.ts` שיטעין את `site-data.json` באוטומציה:

```typescript
import { db } from '@/firebase/init';
import { writeBatch } from 'firebase/firestore';
import siteData from '@/content/site-data.json';

const batch = writeBatch(db);
const now = new Date().toISOString();

// Global
batch.set(doc(db, 'sites/default/global/settings'), {
  published: siteData.global,
  draft: siteData.global,
  updatedAt: now
});

// Pages
Object.entries(siteData.pages).forEach(([pageId, content]) => {
  batch.set(doc(db, `sites/default/pages/${pageId}`), {
    published: content,
    draft: content,
    updatedAt: now
  });
});

// Blog posts
siteData.blogPosts.forEach((post) => {
  batch.set(doc(db, `sites/default/blogPosts/${post.id}`), {
    published: post,
    draft: post,
    updatedAt: now
  });
});

await batch.commit();
console.log('Firestore seeded successfully');
```

## Security Rules

הגדר את Security Rules בFirestore:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /sites/{siteId}/pages/{pageId} {
      allow read: if resource.data.published != null;
      allow read: if request.auth != null && isAdmin(request.auth.uid);
      allow write: if request.auth != null && isAdmin(request.auth.uid);
    }
    
    match /sites/{siteId}/global/settings {
      allow read: if resource.data.published != null;
      allow read: if request.auth != null && isAdmin(request.auth.uid);
      allow write: if request.auth != null && isAdmin(request.auth.uid);
    }
    
    match /sites/{siteId}/blogPosts/{postId} {
      allow read: if resource.data.published != null;
      allow read: if request.auth != null && isAdmin(request.auth.uid);
      allow write: if request.auth != null && isAdmin(request.auth.uid);
    }
    
    match /admins/{uid} {
      allow read: if request.auth.uid == uid || isAdmin(request.auth.uid);
      allow write: if isAdmin(request.auth.uid);
    }
    
    function isAdmin(uid) {
      return get(/databases/$(database)/documents/admins/$(uid)).data.role == 'admin';
    }
  }
}
```

## Verification

לאחר seeding:
1. הפעל את ה-CMS (`npm run dev`)
2. היכנס לחשבון (`/admin/login`)
3. בדוק כי `/admin/pages` מראה את כל הדפים
4. בדוק כי `/api/publish-status` מחזיר את הנתונים מFirestore
5. פתח עמוד והציג אם הוא מעדכן

## Once seeded

- `site-data.json` עדיין יהיה שם (לbackup בלבד)
- כל קריאה/כתיבה CMS תעבור לFirestore
- Firestore הוא SSoT מעכשיו
