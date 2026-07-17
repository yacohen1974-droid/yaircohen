
"use client";

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SectionTitle } from '@/components/shared/SectionTitle';

export default function AccessibilityPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-56 pb-32 px-4 md:px-8 xl:px-24">
        <div className="max-w-4xl mx-auto text-right">
          <SectionTitle subtitle="Legal" title="הצהרת Accessibility" />
          <div className="boutique-para space-y-8 mt-12">
            <p>אנו רואים חשיבות רבה במתן שירות שוויוני לכלל הגולשים באתר.</p>
            <h3 className="text-2xl font-headline font-bold text-accent">סטטוס Accessibility</h3>
            <p>האתר הונגש בהתאם להנחיות הAccessibility בתקן הישראלי 5568 ברמה AA. בוצעו התאמות טכנולוגיות כדי לאפשר גלישה נוחה עם קוראי מסך וניווט מקלדת.</p>
            <h3 className="text-2xl font-headline font-bold text-accent">סיוע נוסף</h3>
            <p>אם נתקלתם בקושי בAccessibility באתר, נשמח אם תצרו קשר בדוא"ל contact@brandname.com כדי שנוכל לתקן ולשפר.</p>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
