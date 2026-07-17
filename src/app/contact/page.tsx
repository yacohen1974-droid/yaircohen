
"use client";

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SectionTitle } from '@/components/shared/SectionTitle';
import { ContactForm } from '@/components/shared/ContactForm';
import { Phone, Mail, MapPin, MessageSquare } from 'lucide-react';
import { usePageContent } from '@/hooks/use-page-content';

export default function ContactPage() {
  const { content: globalSettings } = usePageContent('global');

  const phone = globalSettings?.sitePhone || '050-628-5476';
  const email = globalSettings?.siteEmail || 'yairmashkantaot@gmail.com';
  const address = globalSettings?.siteAddress || 'תל אביב';
  const whatsappMsg = globalSettings?.whatsappMsg || 'היי יאיר, הגעתי מהאתר ומעוניין לייעוץ משכנתא. תודה!';
  const whatsappLink = `https://wa.me/${phone.replace(/-/g, '').replace(/^0/, '972')}?text=${encodeURIComponent(whatsappMsg)}`;

  return (
    <main className="min-h-screen bg-background text-right overflow-x-hidden">
      <Navbar />

      {/* Hero */}
      <section className="relative h-[55vh] w-full flex flex-col items-center justify-center px-6 overflow-hidden finance-gradient">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1560520031-3a4dc4e9de0c?w=1920&auto=format&fit=crop&q=60')] bg-cover bg-center opacity-20" />
        <div className="relative z-10 text-center">
          <span className="boutique-label text-white/60 mb-6 block">נשמח לשמוע מכם</span>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-headline font-bold text-white mb-6 hero-title-shadow">
            צרו קשר
          </h1>
          <p className="text-xl md:text-2xl font-headline text-white/85 hero-para-shadow">
            ייעוץ ראשוני חינם – ללא התחייבות
          </p>
        </div>
      </section>

      <section className="py-20 md:py-32 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Top Bar: Contact Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <a href={`tel:${phone.replace(/-/g, '')}`} className="flex items-center gap-5 p-8 bg-white rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-100 hover:border-primary/20 hover:shadow-primary/5 transition-all duration-500 group">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 shrink-0">
                <Phone size={24} strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">טלפון ישיר</p>
                <p className="text-xl font-headline text-accent font-bold">{phone}</p>
              </div>
            </a>

            <a href={`mailto:${email}`} className="flex items-center gap-5 p-8 bg-white rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-100 hover:border-primary/20 hover:shadow-primary/5 transition-all duration-500 group">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 shrink-0">
                <Mail size={24} strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">מייל</p>
                <p className="text-lg font-headline text-accent font-bold truncate max-w-[180px] md:max-w-none">{email}</p>
              </div>
            </a>

            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-5 p-8 bg-white rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-100 hover:border-[#25D366]/20 hover:shadow-green-500/5 transition-all duration-500 group">
              <div className="w-12 h-12 bg-[#25D366]/10 rounded-2xl flex items-center justify-center text-[#25D366] group-hover:bg-[#25D366] group-hover:text-white transition-all duration-500 shrink-0">
                <MessageSquare size={24} strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">וואטסאפ</p>
                <p className="text-xl font-headline text-[#25D366] font-bold">שיחה ישירה</p>
              </div>
            </a>
          </div>

          {/* Main Form: Centered Single Column */}
          <div className="w-full">
            <div className="bg-white rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.08)] border border-slate-100 overflow-hidden">
               <ContactForm />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
