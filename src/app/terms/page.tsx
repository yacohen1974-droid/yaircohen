
"use client";

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SectionTitle } from '@/components/shared/SectionTitle';
import { BlockRenderer } from '@/components/shared/BlockRenderer';
import { usePageContent } from '@/hooks/use-page-content';
import { Loader2 } from 'lucide-react';

export default function TermsPage() {
  const { content: pageContent, loading } = usePageContent('terms');

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
            <SectionTitle subtitle="Legal" title="תנאי שימוש" />
            <div className="boutique-para space-y-8 mt-12 text-slate-800 leading-relaxed font-light">
              <p className="text-lg">
                ברוכים הבאים לאתר של <strong>יאיר כהן – ייעוץ משכנתאות ופיננסים</strong>. השימוש באתר ובשירותים המוצעים בו כפוף לתנאי השימוש המפורטים להלן.
                עצם הגלישה באתר ו/או מילוי טפסים בו מהווים הסכמה מצדך לתנאים אלו.
              </p>
              <h3 className="text-2xl font-headline font-bold text-accent">1. כללי והגדרת השירות</h3>
              <p>
                האתר נועד לספק מידע אינפורמטיבי ותדמיתי אודות שירותי ייעוץ המשכנתאות והליווי הפיננסי המוענקים על ידי יאיר כהן. 
                התכנים, המחשבונים והמידע המוצגים באתר הם כלליים בלבד ומטרתם לסייע לגולשים להבין מושגי יסוד. 
                <strong>אין לראות במידע זה תחליף לייעוץ פיננסי או משכנתאות מקצועי ופרטני</strong> המתחשב בנתונים האישיים של כל אדם.
              </p>
              <h3 className="text-2xl font-headline font-bold text-accent">2. קניין רוחני</h3>
              <p>
                כל התכנים המופיעים באתר, לרבות טקסטים, תיאורי שירות, סרטונים, לוגו, תמונות ועיצוב האתר, הם רכושו הבלעדי של 
                יאיר כהן (או של צדדים שלישיים שהתירו שימוש בהם). אין להעתיק, להפיץ, לשכפל או לעשות כל שימוש מסחרי בתכנים אלו 
                ללא אישור מפורש ובכתב מראש.
              </p>
              <h3 className="text-2xl font-headline font-bold text-accent">3. הגבלת אחריות</h3>
              <p>
                המידע באתר מסופק כפי שהוא (As-Is). יאיר כהן אינו נושא באחריות לכל נזק, הפסד או אובדן רווח שעלולים להיגרם, 
                במישרין או בעקיפין, כתוצאה מהסתמכות על המידע הכללי המופיע באתר ללא התייעצות אישית ומקצועית מותאמת. 
                החלטות פיננסיות ונטילת התחייבויות כספיות משמעותיות (כמו משכנתא) דורשות בדיקה פרטנית של מכלול הנתונים של הלווה.
              </p>
              <h3 className="text-2xl font-headline font-bold text-accent">4. שינויים באתר ובתנאים</h3>
              <p>
                אנו שומרים לעצמנו את הזכות לעדכן את מבנה האתר, התכנים המוצגים בו ותנאי שימוש אלו מעת לעת ללא הודעה מראש. 
                המשך השימוש באתר לאחר עדכון התנאים מהווה הסכמה לתנאים החדשים.
              </p>
            </div>
          </div>
        </section>
      )}
      <Footer />
    </main>
  );
}
