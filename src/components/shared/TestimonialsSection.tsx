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
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#fafaf9] to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#fafaf9] to-transparent z-10 pointer-events-none" />

        <div className="testimonials-track px-8">
          {trackItems.map((t, i) => (
            <div key={i} className={cn(
              "w-[340px] md:w-[440px] bg-white border border-slate-100/80 p-8 md:p-10 rounded-3xl relative flex flex-col justify-between group h-[360px] transition-all duration-300",
              "hover:border-slate-300 hover:shadow-md"
            )}>
              {/* Quote Icon Background Overlay */}
              <div className="absolute top-8 left-8 text-primary/5 group-hover:text-primary/8 transition-all duration-500">
                <Quote size={48} fill="currentColor" />
              </div>
              
              <div className="relative z-10">
                <div className="flex mb-6 gap-1">
                  {[...Array(5)].map((_, starI) => (
                    <Star key={starI} size={14} className="fill-gold text-gold drop-shadow-sm" />
                  ))}
                </div>
                <p className="text-slate-600 font-sans font-light text-base md:text-lg leading-relaxed italic">
                  &quot;{t.text}&quot;
                </p>
              </div>

              <div className="relative z-10 border-t border-slate-100 pt-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary font-bold text-lg shadow-inner">
                  {t.author.charAt(0)}
                </div>
                <div>
                  <span className="block font-bold text-accent text-lg tracking-tight">{t.author}</span>
                  <span className="block text-slate-400 text-xs mt-0.5 tracking-wide uppercase font-bold text-[9px]">{t.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}