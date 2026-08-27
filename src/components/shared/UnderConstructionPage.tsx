"use client";

import React from 'react';
import Image from 'next/image';
import { Hammer, Phone, Mail, MapPin, Facebook, Instagram, Linkedin, MessageSquare, Lock } from 'lucide-react';
import { ContentState } from '@/config/page-defaults';

interface UnderConstructionPageProps {
  globalData?: ContentState;
}

export function UnderConstructionPage({ globalData }: UnderConstructionPageProps) {
  const siteName = globalData?.siteName || 'יאיר כהן – יועץ משכנתאות';
  const sitePhone = globalData?.sitePhone || '';
  const siteEmail = globalData?.siteEmail || '';
  const siteAddress = globalData?.siteAddress || '';
  const siteLogo = globalData?.siteLogo;
  const whatsappMsg = globalData?.whatsappMsg || 'היי יאיר, הגעתי מהאתר בבנייה ונשמח לקבל פרטים...';

  // Format WhatsApp Link
  let waUrl = '';
  if (sitePhone) {
    const cleanPhone = sitePhone.replace(/\D/g, '');
    const waPhone = cleanPhone.startsWith('0') ? '972' + cleanPhone.substring(1) : cleanPhone;
    waUrl = `https://wa.me/${waPhone}?text=${encodeURIComponent(whatsappMsg)}`;
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-stone-50 text-foreground px-4 py-12 relative overflow-hidden font-body">
      {/* Background Decorative Blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-primary/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-gold/5 blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-2xl w-full bg-white/70 backdrop-blur-md border border-stone-200/80 rounded-2xl p-8 md:p-12 shadow-2xl text-center space-y-8 relative z-10">
        
        {/* Logo / Branding */}
        <div className="flex flex-col items-center gap-3">
          {siteLogo ? (
            <div className="relative w-36 h-16 md:w-44 md:h-20 flex items-center justify-center">
              <Image 
                src={siteLogo} 
                alt={siteName} 
                fill 
                className="object-contain"
                priority
              />
            </div>
          ) : (
            <span className="font-serif text-3xl font-light text-primary tracking-tight">
              {siteName}
            </span>
          )}
          
          <div className="h-[2px] w-16 bg-gold/50 mt-2" />
        </div>

        {/* Animated Maintenance Icon */}
        <div className="flex justify-center">
          <div className="relative flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full text-primary border-2 border-primary/20 animate-pulse">
            <Hammer size={32} className="text-primary transform -rotate-12" />
          </div>
        </div>

        {/* Main Headings */}
        <div className="space-y-3">
          <h1 className="font-serif text-3xl md:text-4xl font-light text-primary leading-tight">
            האתר זמנית בבנייה ושדרוג
          </h1>
          <p className="text-stone-500 max-w-md mx-auto text-sm md:text-base leading-relaxed">
            אנו משפרים ומעדכנים את האתר כדי להעניק לכם חוויה דיגיטלית טובה ומקצועית יותר. נשמח לעמוד לשירותכם בקרוב!
          </p>
        </div>

        {/* Dynamic Buttons Section */}
        {sitePhone && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
            {waUrl && (
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-6 rounded-lg transition-colors shadow-md text-sm md:text-base cursor-pointer"
              >
                <MessageSquare size={20} className="fill-current" />
                שיחה בוואטסאפ
              </a>
            )}
            <a
              href={`tel:${sitePhone}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/95 text-white font-medium py-3 px-6 rounded-lg transition-colors shadow-md text-sm md:text-base"
            >
              <Phone size={18} />
              התקשרו אלינו: {sitePhone}
            </a>
          </div>
        )}

        {/* Admin Login Button */}
        <div className="pt-2 max-w-md mx-auto">
          <a
            href="/admin/login"
            className="w-full inline-flex items-center justify-center gap-2 border border-stone-200 hover:border-primary hover:bg-stone-50 text-stone-500 hover:text-primary font-medium py-2.5 px-6 rounded-lg transition-all text-xs"
          >
            <Lock size={13} />
            כניסת מנהל
          </a>
        </div>

        {/* Divider */}
        <div className="border-t border-stone-200/60 my-6" />

        {/* Contact Info list */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto text-right text-xs md:text-sm text-stone-600">
          {siteEmail && (
            <div className="flex items-center gap-3 bg-stone-50/50 p-3 rounded-lg border border-stone-100 justify-end">
              <span className="font-medium text-stone-700 truncate select-all">{siteEmail}</span>
              <Mail size={16} className="text-gold shrink-0" />
            </div>
          )}
          {siteAddress && (
            <div className="flex items-center gap-3 bg-stone-50/50 p-3 rounded-lg border border-stone-100 justify-end">
              <span className="font-medium text-stone-700 truncate">{siteAddress}</span>
              <MapPin size={16} className="text-gold shrink-0" />
            </div>
          )}
        </div>

        {/* Social Media Links */}
        {(globalData?.facebookLink || globalData?.instagramLink || globalData?.linkedinLink) && (
          <div className="flex justify-center items-center gap-5 mt-4">
            {globalData?.facebookLink && (
              <a 
                href={globalData.facebookLink} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-stone-400 hover:text-primary transition-colors p-2 bg-stone-100 rounded-full hover:bg-primary/10"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
            )}
            {globalData?.instagramLink && (
              <a 
                href={globalData.instagramLink} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-stone-400 hover:text-primary transition-colors p-2 bg-stone-100 rounded-full hover:bg-primary/10"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
            )}
            {globalData?.linkedinLink && (
              <a 
                href={globalData.linkedinLink} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-stone-400 hover:text-primary transition-colors p-2 bg-stone-100 rounded-full hover:bg-primary/10"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
            )}
          </div>
        )}

      </div>

      {/* Footer copyright */}
      <div className="mt-8 flex flex-col items-center gap-2 text-xs text-stone-400 font-light relative z-10">
        <p>© {new Date().getFullYear()} {siteName}. כל הזכויות שמורות.</p>
        <a href="/admin/login" className="hover:text-primary transition-colors flex items-center gap-1.5 opacity-60 hover:opacity-100 mt-1">
          <Lock size={10} />
          <span>כניסת מנהל</span>
        </a>
      </div>
    </div>
  );
}
