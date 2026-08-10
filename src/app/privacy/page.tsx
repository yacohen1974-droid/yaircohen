
"use client";

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SectionTitle } from '@/components/shared/SectionTitle';
import { BlockRenderer } from '@/components/shared/BlockRenderer';
import { usePageContent } from '@/hooks/use-page-content';
import { Loader2 } from 'lucide-react';

export default function PrivacyPage() {
  const { content: pageContent, loading } = usePageContent('privacy');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-primary size-12" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      {pageContent.blocks && pageContent.blocks.length > 0 ? (
        <BlockRenderer blocks={pageContent.blocks} />
      ) : (
        <section className="pt-56 pb-32 px-4 md:px-8 xl:px-24">
          <div className="max-w-4xl mx-auto text-right">
            <SectionTitle subtitle="Legal" title="מדיניות פרטיות" />
            <div className="boutique-para space-y-8 mt-12 text-slate-800 leading-relaxed font-light">
              <p className="text-lg">
                אנו במשרד <strong>יאיר כהן – ייעוץ משכנתאות ופיננסים</strong> מייחסים חשיבות עליונה להגנה על פרטיות הגולשים והלקוחות שלנו. 
                מדיניות פרטיות זו מפרטת את סוגי המידע הנאספים באתר, כיצד אנו משתמשים בהם, ומהן זכויותיכם בכל הנוגע למידע זה, 
                בהתאמה מלאה לתיקון 13 לחוק הגנת הפרטיות (הוראות לעניין שימוש בעוגיות וכלי מעקב צד שלישי).
              </p>

              <h3 className="text-2xl font-headline font-bold text-accent">1. המידע שאנו אוספים</h3>
              <div className="space-y-4">
                <p>
                  <strong>א. מידע הנמסר על ידך מרצונך החופשי:</strong> בעת מילוי טופס יצירת הקשר באתר, הנך מתבקש/ת למסור פרטים מזהים וליצירת קשר כגון: שם מלא, מספר טלפון, יעד הפנייה (למשל: רכישת דירה ראשונה, מיחזור משכנתא וכדומה) והודעה חופשית. מסירת פרטים אלו אינה חובה על פי חוק, אך היא נדרשת על מנת שנוכל לחזור אליך ולהעניק לך שירות.
                </p>
                <p>
                  <strong>ב. מידע שנאסף באופן אוטומטי (עוגיות וכלי מעקב):</strong> אנו משתמשים בכלים סטטיסטיים ואנליטיים (Google Analytics) לצורך ניתוח ביצועי האתר, שיפור התכנים וחוויית הגלישה. מידע זה כולל נתונים אנונימיים בלבד כגון כתובת IP חלקית, סוג הדפדפן, דפי עניין וזמני הגלישה.
                </p>
              </div>

              <h3 className="text-2xl font-headline font-bold text-accent">2. שימוש בעוגיות (Cookies)</h3>
              <p>
                עוגיות הן קבצי טקסט קטנים הנשמרים במכשירך. בהתאם להנחיות החוק, חילקנו את העוגיות באתר לקטגוריות הבאות:
              </p>
              <ul className="list-disc list-inside space-y-3 mr-4">
                <li>
                  <strong>עוגיות חיוניות (Necessary):</strong> עוגיות הנדרשות לפעילותו התקינה והבטוחה של האתר, לרבות שמירת העדפות הפרטיות שלך (אישור או דחייה של עוגיות אחרות). עוגיות אלו פעילות תמיד ולא ניתן לבטלן.
                </li>
                <li>
                  <strong>עוגיות אנליטיקה (Analytics):</strong> משמשות לניתוח סטטיסטי של תנועת הגולשים באתר. <strong>עוגיות אלו חסומות כברירת מחדל</strong> ויופעלו אך ורק במידה ונתת את הסכמתך המפורשת לכך באמצעות באנר ההסכמה.
                </li>
                <li>
                  <strong>עוגיות שיווק ופרסום (Marketing):</strong> משמשות להתאמת פרסום רלוונטי בדפי צד שלישי (במידה ויוטמעו בעתיד). גם עוגיות אלו חסומות כברירת מחדל ודורשות הסכמה מפורשת מראש.
                </li>
              </ul>
              <p>
                באפשרותך לעדכן או לבטל את העדפותיך בכל עת באמצעות לחיצה על האייקון הצף של <strong>הגדרות עוגיות ופרטיות</strong> המופיע בפינת המסך התחתונה.
              </p>

              <h3 className="text-2xl font-headline font-bold text-accent">3. שימוש במידע ושיתוף עם צדדים שלישיים</h3>
              <p>
                המידע האישי הנאסף בטפסים משמש אך ורק לצורך מתן מענה לפנייתך, יצירת קשר ראשוני ותיאום פגישת ייעוץ משכנתא. 
                משרדנו אינו מוכר, משכיר או מעביר את פרטיך לצדדים שלישיים ללא הסכמתך המפורשת. המידע מהטפסים מועבר בצורה מאובטחת 
                למערכת ניהול הטפסים Formspree לצורך קבלת הפניות.
              </p>

              <h3 className="text-2xl font-headline font-bold text-accent">4. אבטחת מידע</h3>
              <p>
                אנו נוקטים באמצעי אבטחה טכנולוגיים וארגוניים מתאימים (כמו פרוטוקול SSL/HTTPS להצפנת תקשורת) על מנת להגן על המידע האישי 
                שלך מפני גישה לא מורשית, שינוי או אובדן.
              </p>

              <h3 className="text-2xl font-headline font-bold text-accent">5. זכויותיך על פי החוק</h3>
              <p>
                על פי חוק הגנת הפרטיות, התשמ"א-1981, הנך זכאי/ת לעיין במידע השמור עליך במאגר המידע שלנו, לבקש את תיקונו או את מחיקתו 
                במידה והוא אינו מדויק או שאינך מעוניין/ת עוד בקבלת שירותים מאיתנו. לפניות בנושא זה, ניתן לפנות אלינו במייל: 
                <a href="mailto:yacohen1974@gmail.com" className="underline text-primary hover:text-accent mr-1">yacohen1974@gmail.com</a>.
              </p>
            </div>
          </div>
        </section>
      )}
      <Footer />
    </main>
  );
}
