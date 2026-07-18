
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
            <div className="boutique-para space-y-8 mt-12">
              <p>פרטיותכם חשובה לנו. דף זה מפרט כיצד אנו אוספים ומשתמשים במידע שלכם.</p>
              <h3 className="text-2xl font-headline font-bold text-accent">1. איסוף מידע</h3>
              <p>אנו אוספים מידע הנמסר על ידכם מרצונכם החופשי בטופס יצירת הקשר (שם, טלפון, מייל) לצורך חזרה אליכם בלבד.</p>
              <h3 className="text-2xl font-headline font-bold text-accent">2. שימוש במידע</h3>
              <p>המידע משמש ליצירת קשר ראשוני ולתיאום פגישות. אנו לא מעבירים את המידע שלכם לצד ג' ללא אישור מפורש.</p>
              <h3 className="text-2xl font-headline font-bold text-accent">3. דיוור</h3>
              <p>במידה ואישרתם קבלת חומר שיווקי, תוכלו להסיר את עצמכם מרשימת התפוצה בכל עת על ידי פנייה אלינו.</p>
            </div>
          </div>
        </section>
      )}
      <Footer />
    </main>
  );
}
