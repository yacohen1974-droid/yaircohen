# SEO Agent SOP — ארכיטקטורת 3 שכבות לניהול עבודה עם Claude

> **ניידות:** קובץ זה מיועד להעתקה לכל פרויקט Next.js עם SEO. עדכן את הפרטים הספציפיים בסעיף "קונפיגורציה".

---

## הרעיון המרכזי

**Claude = מנכ"ל.** לא עושה עבודת שטח. מקבל תוצרים מזוקקים מ-3 "עבדים" ומחזיר החלטות אסטרטגיות.

```
┌─────────────────────────────────────────────────────┐
│                   CLAUDE (מנכ"ל)                     │
│  ניתוח אסטרטגי · קבלת החלטות · כתיבה בעברית רהוטה   │
└───────────┬─────────────┬──────────────┬────────────┘
            │             │              │
    ┌───────▼──────┐  ┌───▼────────┐  ┌─▼──────────────┐
    │  BASH/Python │  │  Ollama    │  │  Gemini Worker  │
    │  (סיירת)     │  │  (מסנן)    │  │  (בוחן)         │
    │  0 טוקנים    │  │  מקומי 🔒  │  │  context ענקי   │
    └──────────────┘  └────────────┘  └─────────────────┘
```

---

## קונפיגורציה לפרויקט זה

```bash
PROJECT_DIR="/Users/amireyal/mysite"
OLLAMA_URL="http://localhost:11434"
OLLAMA_MODEL="llama3.2"
GEMINI_WORKER="node scripts/gemini-worker.mjs"
TEMP_DIR="temp/"
LIVE_DOMAIN="https://www.amireyal.co.il"
```

---

## שלב 0 — הסיירת (Bash) — מיפוי Routes

**מתי להפעיל:** תחילת כל audit — לפני קריאת קובץ אחד.

```bash
# מיפוי כל ה-Routes
find src/app -name "page.tsx" | sort

# חיפוש תבניות SEO
grep -rn '"@type"' src/app --include="page.tsx"         # כל ה-schemas
grep -rn 'export const metadata' src/app --include="page.tsx"  # כל ה-metadata
grep -rn '<h1' src/app --include="page.tsx"             # כל ה-H1

# חיפוש בעיות ספציפיות
grep -rn '"Service"' src/app --include="page.tsx" | xargs grep -L "MedicalBusiness"  # schemas חסרי MedicalBusiness
grep -rn '\.mp4\|<video' src/app --include="page.tsx"   # וידאו
```

**כלל:** אם הפקודה לוקחת פחות מ-2 שניות — לא צריך Ollama.

---

## שלב א' — המסנן (Ollama llama3.2) — עיבוד מקומי

**מתי להפעיל:** חילוץ metadata מהרבה קבצים, בדיקת תבניות, סיכום ראשוני.

### שליחת prompt ל-Ollama

```python
import json, subprocess

def ask_ollama(prompt: str, model: str = "llama3.2", max_tokens: int = 2000) -> str:
    payload = json.dumps({
        "model": model,
        "prompt": prompt,
        "stream": False,
        "options": {"num_predict": max_tokens}
    })
    result = subprocess.run(
        ["curl", "-s", "-X", "POST", "http://localhost:11434/api/generate",
         "-H", "Content-Type: application/json", "-d", payload],
        capture_output=True, text=True, timeout=120
    )
    return json.loads(result.stdout)["response"]
```

### חילוץ Metadata מכל הדפים (Python)

```python
import re, os

def extract_all_metadata(app_dir="src/app"):
    results = []
    for root, dirs, files in os.walk(app_dir):
        for f in files:
            if f != "page.tsx": continue
            path = os.path.join(root, f)
            if "[" in path: continue   # דפים דינמיים — דלג
            route = path.replace(app_dir, "").replace("/page.tsx", "") or "/"
            with open(path) as fp:
                content = fp.read()
            title = re.search(r"title:\s*['\"]([^'\"]+)['\"]", content)
            desc  = re.search(r"description:\s*['\"]([^'\"]+)['\"]", content)
            results.append({
                "route": route,
                "title": title.group(1) if title else "MISSING",
                "title_len": len(title.group(1)) if title else 0,
                "desc": desc.group(1) if desc else "MISSING",
                "desc_len": len(desc.group(1)) if desc else 0,
            })
    return results

for r in extract_all_metadata():
    t_flag = "🔴" if r["title_len"] > 60 else "✅"
    d_flag = "🔴" if r["desc_len"] > 160 else "✅"
    print(f"{r['route']}: title={r['title_len']}ch{t_flag} desc={r['desc_len']}ch{d_flag}")
```

**כלל:** Ollama מתאים לקבצים מקומיים בלבד. לא לשלוח אליו פרטי לקוח רגישים.

---

## שלב ב' — הבוחן (Gemini Worker) — עיבוד מאסיבי

**מתי להפעיל:** ניתוח של כל האתר, יצירת דוחות ארוכים, קיצור/שיפור תוכן בהיקף.

### הפעלת Worker

```bash
node scripts/gemini-worker.mjs "הprompt כאן" [temp/output.txt]
```

### Prompt לאודיט SEO מלא

```
אתה SEO Auditor לאתרי פסיכותרפיה בישראל. קיבלת את הנתונים הבאים:

=== METADATA מקוד מקומי ===
[הכנס כאן את output של extract_all_metadata]

=== נתוני Live Site ===
[הכנס כאן curl data]

צור דוח Markdown עם:
1. ממצאים קריטיים (לפי עדיפות)
2. ממצאים טכניים בינוניים
3. ניתוח keyword coverage
4. המלצות אסטרטגיות
5. ACTION ITEMS: טבלת עדיפויות (השפעה × מאמץ)
```

### בדיקת Live Site עם curl

```bash
BASE="https://www.amireyal.co.il"
for page in "/" "/karmiel-therapy" "/online-therapy" "/cbt-in-karmiel"; do
  url="${BASE}${page}"
  TIMING=$(curl -s -L -o /dev/null -w "HTTP:%{http_code} | Total:%{time_total}s | Size:%{size_download}b" "$url")
  HTML=$(curl -s -L "$url" | head -c 20000)
  TITLE=$(echo "$HTML" | grep -o '<title>[^<]*</title>' | head -1)
  H1=$(echo "$HTML" | grep -c '<h1')
  SCHEMA=$(echo "$HTML" | grep -c 'application/ld+json')
  echo "### $page | $TIMING | H1:$H1 | Schema:$SCHEMA | $TITLE"
done
```

---

## שלב ג' — המנכ"ל (Claude) — ניתוח אסטרטגי

**מתי:** רק אחרי שיש תוצרים מ-ב'. Claude לא קורא קבצים בשלב זה — רק מנתח.

### template לניתוח אסטרטגי
```
לקרוא: temp/live_audit.txt
לשאול:
1. מה הבעיות הקריטיות שפגיעתן הכי מיידית ב-CTR?
2. מה פערי ה-keyword שמתחרים מנצלים?
3. מה ה-E-E-A-T gaps ביחס לדף "אודות"?
4. Action items: HIGH impact × LOW effort תחילה
```

---

## Playbooks — זרימות עבודה שלמות

### Playbook A — Full Site SEO Audit

```
שלב 0: find src/app -name "page.tsx" | sort          → רשימת routes
שלב א': Python extract_all_metadata()                 → metadata table
שלב ב': Gemini Worker + curl live checks              → temp/live_audit.txt
שלב ג': Claude קורא temp/live_audit.txt               → ניתוח + action plan
```

### Playbook B — תיקון Schema רוחבי

```bash
# מצא את כל הבעיות
grep -rn '"@type": "Service"' src/app --include="page.tsx" | cut -d: -f1

# תקן רוחבי
sed -i '' 's/"@type": "Service",/"@type": ["MedicalBusiness", "Service"],/g' \
  src/app/online-therapy/page.tsx \
  "src/app/services/[service]/page.tsx"

# אמת
grep -rn '"@type".*Service' src/app --include="page.tsx"
```

### Playbook C — קיצור Descriptions עם Gemini

```bash
# איסוף כל ה-descriptions הארוכים (מעל 160 תווים)
python3 -c "
import re, os
app_dir = 'src/app'
for root,_,files in os.walk(app_dir):
    for f in files:
        if f != 'page.tsx': continue
        path = os.path.join(root, f)
        content = open(path).read()
        m = re.search(r\"description:\s*['\\\"]([^'\\\"]+)['\\\"]\", content)
        if m and len(m.group(1)) > 160:
            print(f'{len(m.group(1))}ch — {path}')
            print(f'  {m.group(1)[:80]}...')
"

# שלח לGemini לקיצור
node scripts/gemini-worker.mjs \
  'קצר כל description לעברית שיווקית עד 155 תווים. שמור מילות מפתח. החזר: /route: תיאור חדש' \
  temp/fixed_descriptions.txt
```

### Playbook D — הוספת VideoObject Schema

```bash
# מצא דפים עם וידאו
grep -rn '\.mp4\|<video' src/app --include="page.tsx"

# לכל דף: הוסף לפני export default
const videoSchema = {
  "@context": "https://schema.org",
  "@type": "VideoObject",
  "name": "[PAGE_TITLE] background atmospheric video",
  "description": "Atmospheric visual background for therapy services",
  "thumbnailUrl": "https://www.amireyal.co.il/images/amireyal.webp",
  "uploadDate": "2026-01-01",
  "contentUrl": "[MP4_URL]"
};

# הוסף ב-JSX (לפני <Breadcrumbs>)
<script id="video-schema-[slug]" type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(videoSchema) }} />
```

---

## בדיקות שגרתיות לפני כל Commit

```bash
# 1. title > 60 תווים?
python3 -c "
import re,os
for root,_,files in os.walk('src/app'):
    for f in files:
        if f!='page.tsx': continue
        c=open(os.path.join(root,f)).read()
        m=re.search(r\"title:\s*['\\\"]([^'\\\"]+)['\\\"]\",c)
        if m and len(m.group(1))>60: print(f'🔴 {len(m.group(1))}ch: {root}')
"

# 2. כפילות "עמיר אייל" ב-title?
grep -rn 'עמיר אייל.*עמיר אייל' src/app --include="page.tsx"

# 3. schema strategy תקינה?
grep -rn 'lazyOnload' src/app --include="page.tsx"    # אמור להיות ריק

# 4. H1 יחיד?
grep -c '<h1' src/app/*/page.tsx src/app/blog/*/page.tsx 2>/dev/null | grep -v ':1$'
```

---

## כלל זהב

> **"אל תבזבז טוקן של Claude על מה שBash יכול למצוא בחינם,
> ואל תבזבז טוקן של Bash על מה שOllama יכול לעכל מקומית,
> ואל תבזבז context של Claude על מה שGemini יכול לסכם ב-2.5 Flash."**

---

## קונפיגורציה ל-gemini-worker.mjs

הקובץ נמצא ב-`scripts/gemini-worker.mjs`. דורש:
- `.env` עם `GEMINI_API_KEY=...`
- `npm install @google/generative-ai dotenv`

```javascript
// שימוש:
node scripts/gemini-worker.mjs "prompt" "output/path.txt"
```

---

*עודכן לאחרונה: אפריל 2026 | פרויקט: amireyal.co.il*
