# ניתוח פרויקט: Moran Paz - BeinMe

מסמך זה מספק סקירה מקיפה של מבנה הפרויקט, הטכנולוגיות בשימוש, מטרות האתר והמלצות לשיפור SEO.

## 1. סקירת פרויקט ומטרות
האתר **BeinMe - מורן פז** הוא אתר תדמיתי ומקצועי עבור קליניקה לפסיכותרפיה הוליסטית. 
**מטרה מרכזית:** יצירת נוכחות דיגיטלית מקצועית, גיוס מטופלים חדשים (נשים ונוער) ומתן מידע על גישת הטיפול הייחודית של מורן פז.
**קהל יעד:** נשים ונוער המחפשים ליווי רגשי, חיבור לסמכות פנימית וטיפול בחרדות.
**מיקוד גאוגרפי:** קרית טבעון, עמק יזרעאל ואונליין.

---

## 2. מבנה תיקיות (Architecture)
הפרויקט בנוי ב-**Next.js 15** תוך שימוש ב-**App Router**.

-   `/src/app`: מכיל את ה-Routes (דפי האתר).
    -   `layout.tsx`: הגדרות גלובליות, Metadata בסיסי ו-Fonts.
    -   `page.tsx`: דף הבית.
    -   `about/`: דף אודות וגישת הטיפול.
    -   `blog/`: בלוג "נקודות של אור" (דינמי מ-Firestore).
    -   `contact/`: דף יצירת קשר.
    -   `audience/`: דפים ייעודיים לקהלי יעד (נשים/נוער).
    -   `tivon/`, `emeq-izrael/`: דפי נחיתה לשיפור SEO מקומי.
    -   `online-therapy/`: דף שירות טיפול אונליין.
    -   `admin/`: ממשק ניהול תוכן (CMS).
-   `/src/components`: קומפוננטות UI.
    -   `layout/`: Navbar, Footer.
    -   `shared/`: קומפוננטות חוזרות כמו SectionTitle, ContactForm, FaqSection.
    -   `ui/`: רכיבי בסיס (Radix UI / shadcn style).
-   `/src/firebase`: הגדרות ו-Hooks לעבודה עם Firebase (Firestore, Storage).
-   `/src/ai`: אינטגרציה של **Genkit** ליכולות AI.
-   `/src/lib`: פונקציות עזר (Utils) ותמונות Placeholder.
-   `/public`: נכסים סטטיים (Favicon, assets).

---

## 3. טכנולוגיות בשימוש (Tech Stack)
-   **Framework**: Next.js 15.5.9 (React 19).
-   **Language**: TypeScript.
-   **Styling**: Tailwind CSS + PostCSS + CSS Variables.
-   **UI Components**: Radix UI (Headless components), Lucide React (Icons).
-   **Backend/Database**: Firebase (Firestore) - משמש לניהול תוכן דינמי (בלוג, תוכן דפים).
-   **AI**: Genkit @genkit-ai/google-genai.
-   **Validation**: Zod (עבור סכמות נתונים וטפסים).
-   **Forms**: React Hook Form.
-   **Animations**: שימוש ב-Hooks מותאמים אישית (`useReveal`) ככל הנראה מבוססי CSS/Framer-motion.
-   **Fonts**: Google Fonts (Assistant, Amatic SC).

---

## 4. ניתוח תוכן ועיצוב
-   **אסתטיקה**: עיצוב "Boutique", נקי ויוקרתי. שימוש בצבעי אדמה, גופני כתב יד (Amatic SC) וגופנים קריאים (Assistant).
-   **UX**: האתר מגיב (Responsive), כולל תפריט ניווט נוח, כפתורי WhatsApp צפים (Floating) וטפסי צור קשר נגישים.
-   **תוכן**: השפה היא פנייה אישית, חמה ומקצועית (גוף ראשון נקבה). ישנו דגש רב על מונחים מקצועיים כמו "פוקוסינג", "עבודת צללים" ו"מיינדפולנס".

---

## 5. SEO - מצב קיים ושיפורים נדרשים
### מצב קיים:
-   קיימים תגיות Title ו-Description בסיסיות ב-`layout.tsx`.
-   שימוש ב-Semantic HTML (סקציות, H1 בדפים).
-   קיימים דפי נחיתה מקומיים (טבעון, עמק יזרעאל).
-   האתר תומך ב-RTL (עברית).

### מבנה שצריך לשפר (SEO Action Items):
1.  **Schema Markup (נתונים מובנים)**: 
    -   חסרה סכמת `MedicalBusiness` או `Psychotherapist` לשיפור הנראות בחיפושים מקומיים (Google Maps/Knowledge Graph).
    -   חסרה סכמת `Article` בדפי הבלוג.
    -   חסרה סכמת `FAQPage` בדפים הכוללים שאלות ותשובות.
2.  **Metadata דינמי**:
    -   יש לוודא שלכל דף (במיוחד בבלוג ובשירותים) יש Meta Title ו-Description ייחודיים שחולצו מהתוכן הדינמי.
3.  **Robots & Sitemap**:
    -   הוספת `robots.ts` ו-`sitemap.ts` ב-Next.js כדי לעזור לגוגל לסרוק את האתר בצורה יעילה (כרגע חסר).
4.  **שיפור נגישות ותגיות Alt**:
    -   בדיקה שכל התמונות הדינמיות מה-Firestore מקבלות תגית `alt` רלוונטית למנועי חיפוש.
5.  **היררכיית כותרות (H-Tags)**:
    -   בדיקה שאין כפילות של H1 בדפים.
    -   שימוש נכון ב-H2 ו-H3 לסידור התוכן (למשל בדפי הבלוג).
6.  **Canonical URLs**:
    -   הוספת תגית `canonical` למנוע בעיות של תוכן כפול (Duplicate Content).
7.  **ביצועים (Core Web Vitals)**:
    -   אופטימיזציה של תמונות (Next/Image בשימוש, אך יש לוודא גדלים נכונים).
    -   טעינת גופנים מקומית או שימוש ב-`swap` למניעת Layout Shift.

---

## 6. המלצות לשיפור כללי (Next Steps)
-   **ניהול תוכן**: להרחיב את הבלוג עם מילות מפתח ממוקדות ("טיפול בחרדה בטבעון", "מטפלת רגשית לנוער").
-   **יצירת קשר**: הוספת הוכחה חברתית (Social Proof) - עדויות מטופלים בצורה בולטת יותר (קיימת סקציה אך ניתן לחזק אותה).
-   **Security**: הוספת `Security Headers` ב-`next.config.ts`.
-   **Analytics**: הטמעת Google Search Console ו-Google Analytics אם טרם הוטמעו.

---
**נכתב על ידי:** Antigravity AI
**תאריך:** 2026-04-04
