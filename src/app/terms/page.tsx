
"use client";

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SectionTitle } from '@/components/shared/SectionTitle';

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-56 pb-32 px-4 md:px-8 xl:px-24">
        <div className="max-w-4xl mx-auto text-right">
          <SectionTitle subtitle="Legal" title="תנאי שימוש" />
          <div className="boutique-para space-y-8 mt-12">
            <p>ברוכים הבאים לאתר של Brand Name. השימוש באתר כפוף לTerms המפורטים להלן.</p>
            <h3 className="text-2xl font-headline font-bold text-accent">1. כללי</h3>
            <p>האתר נועד לספק מידע על שירותי הייעוץ והפעילויות של Brand Name. המידע באתר אינו מהווה תחליף לייעוץ מקצועי פרטני.</p>
            <h3 className="text-2xl font-headline font-bold text-accent">2. קניין רוחני</h3>
            <p>כל התכנים המופיעים באתר, לרבות טקסטים, תמונות ועיצוב, הם רכושה הבלעדי של Brand Name ואין לעשות בהם שימוש ללא אישור בכתב.</p>
            <h3 className="text-2xl font-headline font-bold text-accent">3. אחריות</h3>
            <p>Brand Name אינה אחראית לכל נזק שייגרם כתוצאה מהסתמכות על המידע הכללי המוצג באתר ללא התייעצות אישית.</p>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
