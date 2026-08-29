# Firestore Schema & Security Rules

## Collection Structure

```
sites/{siteId}/
├── pages/{pageId}/
│   ├── draft: ContentState
│   ├── published: ContentState
│   ├── updatedAt: timestamp
│   └── updatedBy: userId
│
├── global/
│   ├── draft: GlobalSettings
│   ├── published: GlobalSettings
│   └── updatedAt: timestamp
│
└── blogPosts/{postId}/
    ├── draft: BlogPost
    ├── published: BlogPost
    └── updatedAt: timestamp
```

## Key decisions

1. **Dual draft/published per entity** (not separate branches)
   - Simpler than Git-branch approach
   - Instant publish (just copy draft → published)
   - One transaction per publish

2. **Top-level `global` document** (not `pages.global`)
   - Mirrors old `data.global` structure
   - Easier to fetch site-wide settings

3. **No GitHub commit logic needed**
   - Firestore is SSoT
   - Publish = `draft → published`, then `revalidateTag`
   - No Git pollution

## Security Rules

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Public can read published content only
    match /sites/{siteId}/pages/{pageId} {
      allow read: if resource.data.published != null;
      allow read: if request.auth != null && isAdmin(request.auth.uid);
      allow write: if request.auth != null && isAdmin(request.auth.uid);
    }
    
    match /sites/{siteId}/global/{documentId} {
      allow read: if resource.data.published != null;
      allow read: if request.auth != null && isAdmin(request.auth.uid);
      allow write: if request.auth != null && isAdmin(request.auth.uid);
    }
    
    match /sites/{siteId}/blogPosts/{postId} {
      allow read: if resource.data.published != null;
      allow read: if request.auth != null && isAdmin(request.auth.uid);
      allow write: if request.auth != null && isAdmin(request.auth.uid);
    }
    
    // Helper: check if user is admin
    function isAdmin(uid) {
      return get(/databases/$(database)/documents/admins/$(uid)).data.role == 'admin';
    }
  }
}
```

## Migration Plan

1. **Create Firestore collections** (manual or seed script)
2. **Update `db-actions.ts`** to read/write Firestore
3. **Update routes**:
   - `publish/route.ts` → write to Firestore + revalidateTag
   - `save-draft/route.ts` → write to Firestore draft
   - `get-content/route.ts` → read published from Firestore
   - `list-pages/route.ts` → list published pages
4. **Remove Git commit logic**
5. **Test end-to-end**

## Data flow (before → after)

### Before:
```
User edits → localStorage (draft)
            ↓
         "Publish" button
            ↓
       Write to disk (ephemeral)
       + commit to GitHub
       + revalidateTag
            ↓
    Live site reads GitHub (SSoT)
```

### After:
```
User edits → localStorage (draft) + Firestore draft
            ↓
         "Publish" button
            ↓
       Copy draft → published in Firestore
       + revalidateTag
            ↓
    Live site reads Firestore published (SSoT)
```

## Firestore cost estimate

For this site (~5 edits/day, ~100 pages):
- **Reads**: ~1000/day (site loads) → $0.06/month
- **Writes**: ~50/day (edits + publishes) → $0.01/month
- **Total**: ~$0.10/month (free tier covers 50K reads/day)

No cost concern at this scale.
