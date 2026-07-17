"use client";

import React from 'react';
import { SectionTitle } from './SectionTitle';
import { useReveal } from '@/hooks/use-reveal';
import { Star, Quote } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Testimonial {
  text: string;
  author: string;
  location: string;
}

const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    text: "הגענו ליאיר אחרי שהבנק הציע לנו ריבית גבוהה משמעותית. יאיר השיג לנו תנאים טובים בהרבה – מקצועי, מסור ואמין לחלוטין.",
    author: "דן ורחל לוי",
    location: "פתח תקווה"
  },
  {
    text: "כרוכשים ראשונים לא ידענו מאיפה להתחיל. יאיר לקח אותנו יד ביד בכל התהליך, הסביר בסבלנות, ודאג שנקבל את התנאים הכי טובים.",
    author: "נועה ואיתי כהן",
    location: "ראשון לציון"
  },
  {
    text: "יאיר עזר לנו למחזר את המשכנתא הישנה וחסך לנו סכום משמעותי בהחזר החודשי. שירות מעולה, מקצועיות ברמה הגבוהה ביותר.",
    author: "משפחת גולדברג",
    location: "הרצליה פיתוח"
  }
];

interface TestimonialsSectionProps {
  customTestimonials?: Testimonial[];
  title?: string;
  subtitle?: string;
  titleSettings?: any;
}



export function TestimonialsSection({ 
  customTestimonials, 
  title = "לקוחות ממליצים", 
  subtitle = "Success Stories",
  titleSettings
}: TestimonialsSectionProps) {
  const displayItems = customTestimonials || DEFAULT_TESTIMONIALS;
  // Triple the items for a truly seamless infinite scroll
  const trackItems = [...displayItems, ...displayItems, ...displayItems];

  if (displayItems.length === 0) return null;

  return (
    <section className="py-24 md:py-40 bg-transparent px-4 overflow-hidden border-y border-slate-100/50">
      <div className="max-w-7xl mx-auto mb-20 md:mb-32">
        <SectionTitle
          subtitle={titleSettings?.subtitle || subtitle}
          title={titleSettings?.text || title}
          className="flex flex-col items-center text-center"
          fontSize={titleSettings?.fontSize}
          fontFamily={titleSettings?.fontFamily}
          color={titleSettings?.color}
          align={titleSettings?.align || 'center'}
        />
      </div>

      <div className="relative w-full overflow-hidden">
        {/* Fade gradients for the edges of the slider */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        <div className="testimonials-track px-8">
          {trackItems.map((t, i) => (
            <div key={i} className={cn(
              "w-[340px] md:w-[480px] glass-3d-card p-10 md:p-14 rounded-[2.5rem] relative flex flex-col justify-between group h-[420px] transition-all duration-700",
              "hover:scale-[1.02] hover:z-20 border-white/40"
            )}>
              {/* Quote Icon Background Overlay */}
              <div className="absolute top-10 left-10 text-primary/5 group-hover:text-primary/10 transition-all duration-700 transform group-hover:scale-110 group-hover:-rotate-12">
                <Quote size={80} fill="currentColor" />
              </div>
              
              <div className="relative z-10">
                <div className="flex mb-8 gap-1.5">
                  {[...Array(5)].map((_, starI) => (
                    <Star key={starI} size={18} className="fill-gold text-gold drop-shadow-sm" />
                  ))}
                </div>
                <p className="text-slate-700 font-headline font-light text-xl md:text-2xl leading-[1.8] italic">
                  &quot;{t.text}&quot;
                </p>
              </div>

              <div className="relative z-10 border-t border-slate-100/60 pt-10 flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center text-primary font-bold text-xl shadow-inner">
                  {t.author.charAt(0)}
                </div>
                <div>
                  <span className="block font-bold text-accent text-xl tracking-tight">{t.author}</span>
                  <span className="block text-slate-400 text-sm mt-0.5 tracking-wide uppercase font-bold text-[10px]">{t.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}