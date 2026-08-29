# 🚀 Firestore Deployment Checklist

## Phase 1: Setup Admin Access

- [ ] Go to Firebase Console → Authentication
- [ ] Find your user (amirher@gmail.com)
- [ ] Copy UID
- [ ] Create `/admins` collection in Firestore
- [ ] Add document with UID as ID
- [ ] Set field: `role: "admin"`

**Or use script:**
```bash
npx tsx scripts/setup-admin.ts
```

---

## Phase 2: Deploy Security Rules

- [ ] Open: https://console.firebase.google.com
- [ ] Project: yaircohen-7823a
- [ ] Go to: Firestore Database → Rules tab
- [ ] Click: "Edit Rules"
- [ ] Copy from: `FIRESTORE_SCHEMA.md` (lines 42-72)
- [ ] Paste everything
- [ ] Click: "Publish"
- [ ] Wait for: ✅ "Rules published"

---

## Phase 3: Seed Firestore

```bash
# Build the app
npm run build

# Seed data from site-data.json → Firestore
npx tsx scripts/seed-firestore.ts
```

**Expected output:**
```
✓ Seeded global settings
✓ Seeded 10+ pages
✓ Seeded 5+ blog posts
✅ Firestore seeding complete!
```

---

## Phase 4: Verify

```bash
# Start dev server
npm run dev

# Test in browser
# 1. Go to: http://localhost:3000/admin/login
# 2. Login with: amirher@gmail.com
# 3. Go to: /admin/pages
# 4. Edit a page
# 5. Click: Publish
# 6. Verify: changes appear on live site
```

---

## Phase 5: Monitor

- [ ] Check Firestore Console
  - `/sites/default/pages/{pageId}`
  - Should have `published` and `draft` fields
- [ ] Check browser console for errors
- [ ] Test editing multiple pages
- [ ] Test creating a new page

---

## 🎉 Success Indicators

✅ CMS loads without errors
✅ Can edit and save pages
✅ Publish button works (instant)
✅ Changes appear on live site
✅ Firestore collections growing
✅ No Git commits (unlike before)
✅ No "multiple sources of truth" issues

---

## Rollback Plan

If something breaks:
1. Keep site-data.json as backup
2. Can re-seed Firestore anytime
3. Security Rules can be reverted
4. No permanent damage (Firestore is just data)

---

## Next Steps After Deployment

1. **Archive site-data.json** (backup only)
2. **Stage 4**: Add tests for slug, draft/published sync
3. **Optional**: Finish BlockEditor implementation
4. **Monitor**: Watch Firestore usage (free tier is generous)

---

## Resources

- `FIRESTORE_SCHEMA.md` — Full database design
- `FIRESTORE_SEED.md` — Detailed seeding instructions
- `scripts/seed-firestore.ts` — Automated migration script
- `scripts/setup-admin.ts` — Admin collection setup helper

---

**Ready? Go! 🚀**
