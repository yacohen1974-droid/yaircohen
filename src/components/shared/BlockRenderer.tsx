"use client";

import React from 'react';
import Image from 'next/image';
import { SectionTitle } from './SectionTitle';
import { ContactForm } from './ContactForm';
import { TestimonialsSection } from './TestimonialsSection';
import { FaqSection } from './FaqSection';
import { PortraitImage } from './PortraitImage';
import { DynamicSections } from './DynamicSections';
import { Orbit, Heart, Sparkles, Compass, Users, Star, MessageSquare, HelpCircle, ChevronDown, ArrowLeft, Loader2, Check, X, ShieldCheck, ChevronRight } from 'lucide-react';
import { cn, safeEncodeURI } from '@/lib/utils';
import { DynamicSection } from '@/config/page-defaults';
import Link from 'next/link';
import { MORTGAGE_ICON_MAP } from './MortgageIcons';
import { MortgageCalculator } from './MortgageCalculator';

const ICON_MAP: Record<string, React.ElementType> = {
  Orbit, Heart, Sparkles, Compass, Users, Star, MessageSquare, HelpCircle,
  ...MORTGAGE_ICON_MAP,
};

/* ── Animated counter for stats ─────────────────────────────── */
function StatItem({ prefix = '', value, suffix = '', label, light = true }: {
  prefix?: string; value: string; suffix?: string; label: string; light?: boolean;
}) {
  const numeric = parseInt(value.replace(/\D/g, ''), 10);
  const isNumeric = !isNaN(numeric) && numeric > 0 && value === String(numeric);
  const [count, setCount] = React.useState(isNumeric ? 0 : null);
  const ref = React.useRef<HTMLDivElement>(null);
  const fired = React.useRef(false);

  React.useEffect(() => {
    if (!isNumeric) return;
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !fired.current) {
        fired.current = true;
        const dur = 1800;
        const start = Date.now();
        const tick = () => {
          const p = Math.min((Date.now() - start) / dur, 1);
          const ease = 1 - Math.pow(1 - p, 3);
          setCount(Math.round(ease * numeric));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.4 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [isNumeric, numeric]);

  const display = isNumeric ? String(count) : value;
  const fullText = `${prefix}${display}${suffix}`;

  return (
    <div ref={ref} className="text-center pop-in">
      <div className={cn(
        "font-bold leading-none mb-3 tabular-nums whitespace-nowrap",
        fullText.length > 8 ? "text-xl xs:text-2xl sm:text-4xl md:text-5xl lg:text-6xl" :
        fullText.length > 5 ? "text-3xl sm:text-5xl md:text-6xl" :
        "text-4xl sm:text-5xl md:text-6xl",
        light ? 'text-white finance-3d-text-light' : 'text-primary finance-3d-text'
      )}>
        {prefix}{display}{suffix}
      </div>
      <div className={cn("text-xs sm:text-sm md:text-base font-semibold tracking-wide", light ? 'text-white/65' : 'text-slate-500')}>
        {label}
      </div>
    </div>
  );
}

function BlogGrid({ titleSettings }: { titleSettings?: any }) {
  const [posts, setPosts] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch('/api/blog/list-posts', { cache: 'no-store' });
        const data = await res.json();
        if (data.success) {
          const sorted = (data.posts || []).sort((a: any, b: any) => {
            return new Date(b.date || b.createdAt).getTime() - new Date(a.date || a.createdAt).getTime();
          });
          setPosts(sorted);
        }
      } catch (e) {
        console.error("Error fetching posts:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
    return dateStr;
  };

  return (
    <section className="py-24 md:py-32 xl:py-40 px-6 md:px-12 xl:px-24 bg-white">
      <div className="max-w-7xl mx-auto">
        <SectionTitle 
          subtitle={titleSettings?.subtitle || "Journal"} 
          title={titleSettings?.text || "השראה ושיתופים"} 
          fontSize={titleSettings?.fontSize}
          fontFamily={titleSettings?.fontFamily}
          color={titleSettings?.color}
          align={titleSettings?.align || 'center'}
          className="flex flex-col items-center text-center" 
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 xl:gap-16 mt-20 md:mt-32">
          {loading ? (
            <div className="col-span-full flex justify-center py-20">
              <Loader2 className="animate-spin text-primary size-12" />
            </div>
          ) : posts.length === 0 ? (
            <p className="col-span-full text-center text-stone-400 text-xl font-light font-headline italic">בקרוב יעלו תכנים חדשים ומאירי פנים...</p>
          ) : (
            posts.map((post: any) => (
              <Link href={`/blog/${post.slug || post.id}`} key={post.id} className="group cursor-pointer glass-3d-card p-4 rounded-3xl">
                <div className="bg-stone-50 aspect-video mb-8 overflow-hidden relative rounded-2xl shadow-sm group-hover:shadow-xl transition-all duration-700">
                   {post.heroImageUrlDesktop ? (
                     <>
                       <div className="hidden md:block absolute inset-0">
                         <Image 
                           src={safeEncodeURI(post.heroImageUrlDesktop)} 
                           alt={post.title} 
                           fill 
                           className="object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000"
                         />
                       </div>
                       <div className="md:hidden absolute inset-0">
                         <Image 
                           src={safeEncodeURI(post.heroImageUrlMobile || post.heroImageUrlDesktop)} 
                           alt={post.title} 
                           fill 
                           className="object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000"
                         />
                       </div>
                     </>
                   ) : (
                     <div className="absolute inset-0 bg-stone-100 flex items-center justify-center">
                        <span className="font-handwriting text-4xl text-stone-300">יאיר כהן</span>
                     </div>
                   )}
                   <div className="absolute top-4 right-4 boutique-label text-[10px] bg-white px-3 py-1 shadow-sm">{post.category}</div>
                </div>
                <div className="space-y-4">
                  <span className="boutique-label text-stone-400 block">{formatDisplayDate(post.date)}</span>
                  <h3 className="text-2xl md:text-3xl font-headline font-bold text-accent group-hover:text-primary transition-colors leading-tight">{post.title}</h3>
                  <p className="text-lg font-light text-stone-500 leading-relaxed line-clamp-3 font-headline italic">
                    {post.summary || post.subtitle || "לחצו לקריאת המאמר המלא..."}
                  </p>
                  <div className="flex items-center gap-4 text-primary boutique-label text-[10px] pt-4 font-bold">
                    קריאת המאמר <ArrowLeft size={14} />
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

export function BlockRenderer({ blocks }: { blocks: DynamicSection[] }) {
  if (!blocks || blocks.length === 0) return null;

  return (
    <>
      {blocks.map((block) => {
        switch (block.type) {
          case 'hero':
            return (
              <section key={block.id} className="relative w-full flex flex-col items-center justify-center px-4 overflow-hidden bg-[#0D2347] shadow-2xl" style={{ minHeight: block.heroHeight || '70vh' }}>
                <div className="absolute inset-0 z-0">
                  {block.imageUrl && (
                    <div className="hidden md:block absolute inset-0">
                      <Image 
                        src={safeEncodeURI(block.imageUrl)} 
                        alt={block.title || "Hero"} 
                        fill 
                        className="object-cover" 
                        style={{ opacity: (100 - (block.heroCloudiness ?? 30)) / 100 }}
                        priority 
                      />
                    </div>
                  )}
                  {(block.imageUrlMobile || block.imageUrl) && (
                    <div className="md:hidden absolute inset-0">
                      <Image 
                        src={safeEncodeURI(block.imageUrlMobile || block.imageUrl || '')} 
                        alt={block.title || "Hero"} 
                        fill 
                        className="object-cover"
                        style={{ opacity: (100 - (block.heroCloudiness ?? 30)) / 100 }}
                        priority 
                      />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-b from-[#0D2347]/70 via-[#0D2347]/20 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-background via-background/30 to-transparent z-0 pointer-events-none" style={{ opacity: (block.heroCloudiness ?? 30) / 100 }} />
                  {/* Floating decorative elements */}
                  <div className="absolute inset-0 z-[2] pointer-events-none overflow-hidden">
                    <div className="absolute top-[10%] left-[10%] w-24 h-24 opacity-[0.07] hover:opacity-10 transition-opacity duration-700">
                      <Image src="/logo.png" alt="" fill className="object-contain brightness-0 invert" />
                    </div>
                    <div className="absolute top-1/4 left-[6%] text-white/[0.04] text-[220px] font-black select-none leading-none">₪</div>
                    <div className="absolute bottom-1/3 right-[8%] w-40 h-40 rounded-full border border-white/[0.06]" />
                    <div className="absolute top-[15%] right-[20%] w-5 h-5 rounded-full bg-white/10" />
                    <div className="absolute bottom-[25%] left-[30%] w-3 h-3 rounded-full bg-primary/30" />
                    <div className="absolute top-[40%] left-[18%] w-1.5 h-1.5 rounded-full bg-white/20" />
                    <div className="absolute top-[20%] left-[40%] w-24 h-24 rounded-full border border-white/[0.05]" />
                  </div>
                </div>
                {/* Diagonal wave bottom */}
                <div className="absolute bottom-0 left-0 right-0 z-[3] pointer-events-none overflow-hidden leading-none">
                  <svg viewBox="0 0 1440 70" xmlns="http://www.w3.org/2000/svg" className="w-full block" preserveAspectRatio="none">
                    <path d="M0,70 L0,35 Q360,0 720,35 Q1080,70 1440,28 L1440,70 Z" fill="hsl(var(--background))" />
                  </svg>
                </div>
                <div className={cn("relative z-[5] w-full max-w-5xl mx-auto px-6 flex flex-col", block.heroTextAlign === 'center' ? 'items-center text-center' : block.heroTextAlign === 'left' ? 'items-start text-left' : 'items-end text-right')}>
                    {block.titleSettings && (
                      <h1 className={cn("font-bold leading-tight hero-title-shadow break-words w-full gradient-text-hero", block.titleSettings.fontSize || 'text-5xl sm:text-7xl lg:text-9xl', block.titleSettings.fontFamily || 'font-handwriting')} style={{ color: block.titleSettings.color || 'white' }}>
                        {block.titleSettings.text || block.title}
                      </h1>
                    )}
                    {block.subtitleSettings && (
                      <h2 className={cn("font-headline font-semibold mt-6 text-white/95 max-w-2xl xl:max-w-3xl leading-relaxed hero-para-shadow", block.subtitleSettings.fontSize || 'text-base md:text-xl lg:text-3xl')} style={{ color: block.subtitleSettings.color || 'white' }}>
                        {block.subtitleSettings.text}
                      </h2>
                    )}
                    {/* Scroll-down pill CTA */}
                    <a href="#services" className="mt-10 flex items-center gap-2.5 px-6 py-3 rounded-full bg-white/15 backdrop-blur-sm border border-white/25 text-white text-sm font-semibold hover:bg-white/25 transition-all duration-300 w-fit group">
                      <span>גלו את השירותים שלנו</span>
                      <ChevronDown size={16} className="animate-bounce group-hover:animate-none" />
                    </a>
                </div>
              </section>
            );

          case 'intro':
            return (
              <section key={block.id} className={cn("py-24 md:py-32 xl:py-40 px-6 md:px-12 xl:px-24 border-b border-slate-100 relative overflow-hidden", block.bg === 'stone-50' ? 'bg-slate-50' : 'bg-white')}>
                <div className="max-w-7xl mx-auto">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 xl:gap-24 items-center">
                    <div className={cn("lg:col-span-5 order-2 relative pt-6 pb-12", block.portraitPosition === 'right' ? 'lg:order-2' : 'lg:order-1')}>
                      <div className={cn("absolute w-3/4 h-4/5 bg-primary/10 rounded-2xl -z-10", block.portraitPosition === 'right' ? '-bottom-4 -left-4' : '-bottom-4 -right-4')} />
                      <PortraitImage 
                        src={block.portraitImageUrl || ''} 
                        shape={(block.portraitShape as any) || 'rectangle'} 
                        size={block.portraitSize || (block.portraitShape === 'circle' ? 250 : 400)}
                        alt={block.title || "Portrait"} 
                        className="image-zoom-container mx-auto lg:max-w-none shadow-[0_40px_80px_rgba(30,58,138,0.15)]" 
                      />
                      <div className={cn("absolute -bottom-2 bg-white rounded-2xl shadow-xl border border-slate-100 px-5 py-3 flex items-center gap-3 float-badge", block.portraitPosition === 'right' ? 'left-6' : 'right-6')}>
                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xs shrink-0">15+</div>
                        <div><p className="text-xs font-bold text-slate-800">שנות ניסיון</p><p className="text-[10px] text-slate-400">500+ לקוחות מרוצים</p></div>
                      </div>
                    </div>
                    <div className={cn("lg:col-span-7 order-1 space-y-10", block.portraitPosition === 'right' ? 'lg:order-1' : 'lg:order-2')}>
                      <SectionTitle
                        subtitle={block.titleSettings?.subtitle || ""}
                        title={block.titleSettings?.text || block.title || ""}
                        fontSize={block.titleSettings?.fontSize}
                        fontFamily={block.titleSettings?.fontFamily}
                        color={block.titleSettings?.color}
                        align={block.titleSettings?.align || 'right'}
                      />
                      {block.content && (
                        <div className={cn("boutique-para text-slate-600", block.titleSettings?.align === 'center' ? 'text-center' : block.titleSettings?.align === 'left' ? 'text-left' : 'text-right')}>
                          <div className="page-content-container" dangerouslySetInnerHTML={{ __html: block.content.replace(/&nbsp;|\u00A0/g, ' ') }} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </section>
            );

          case 'features':
            return (
              <section key={block.id} id="services" className={cn("py-24 md:py-40 px-6 md:px-12 border-y border-slate-100", block.bg === 'white' ? 'bg-white' : 'bg-slate-50')}>
                <div className="max-w-7xl mx-auto">
                  <SectionTitle
                    subtitle={block.titleSettings?.subtitle || ""}
                    title={block.titleSettings?.text || block.title || ""}
                    className="flex flex-col items-center text-center"
                    fontSize={block.titleSettings?.fontSize}
                    fontFamily={block.titleSettings?.fontFamily}
                    color={block.titleSettings?.color}
                    align={block.titleSettings?.align || 'center'}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16 sm:mt-24">
                    {(block.features || []).map((point, i) => {
                      const Icon = ICON_MAP[point.icon] || Heart;
                      const num = String(i + 1).padStart(2, '0');
                      return (
                        <div key={i} className={cn(
                          "group relative glass-3d-card rounded-[2.5rem] p-10 cursor-default flex flex-col items-center text-center",
                          `stagger-${Math.min(i + 1, 5)}`
                        )}>
                          {/* Pattern Background */}
                          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                               style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '24px 24px' }} />
                          
                          {/* Big faded number - repositioned for centering */}
                          <span className="absolute top-6 right-8 text-[120px] font-black text-primary/[0.03] leading-none select-none pointer-events-none group-hover:text-primary/[0.06] transition-all duration-700 font-sans italic">{num}</span>
                          
                          <div className="flex flex-col items-center gap-8 relative z-10 w-full">
                            <div className="icon-3d-wrapper text-primary shadow-2xl group-hover:scale-110 transition-all duration-500">
                              <Icon size={32} strokeWidth={1.5} />
                              <div className="absolute -inset-2 bg-primary/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            
                            <div className="space-y-4 w-full">
                              <h3 className="text-2xl sm:text-3xl font-headline font-black text-accent tracking-tight group-hover:text-primary transition-colors duration-300">
                                {point.title}
                              </h3>
                              <div className="w-12 h-1 bg-primary/20 mx-auto rounded-full group-hover:w-24 group-hover:bg-primary transition-all duration-500" />
                              <p className="text-base sm:text-lg font-light text-slate-600 leading-relaxed max-w-sm mx-auto">
                                {point.description}
                              </p>
                            </div>

                            <div className="pt-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                                <div className="text-primary font-bold text-sm flex items-center gap-2">
                                  גלו עוד על השירות
                                  <ArrowLeft size={14} />
                                </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>
            );

          case 'testimonials':
            return (
              <TestimonialsSection 
                key={block.id}
                customTestimonials={block.testimonials || []} 
                titleSettings={block.titleSettings}
              />
            );

          case 'faqs':
            return (
              <FaqSection 
                key={block.id}
                items={block.faqs || []} 
                titleSettings={block.titleSettings}
              />
            );

          case 'cta':
            return (
              <section key={block.id} className="relative py-24 md:py-32 px-6 finance-gradient overflow-hidden">
                {/* Decorative circles */}
                <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-white/[0.04] pointer-events-none" />
                <div className="absolute -left-16 -bottom-16 w-72 h-72 rounded-full bg-white/[0.04] pointer-events-none" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-white/[0.04] pointer-events-none" />

                <div className="max-w-3xl mx-auto text-center relative z-10">
                  {/* Trust strip */}
                  <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 mb-10">
                    {['ייעוץ ראשוני חינם', 'ללא התחייבות', '500+ לקוחות מרוצים'].map((t, i) => (
                      <span key={i} className="text-white/70 text-sm flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-bold">✓</span>
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* Headline */}
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-headline font-bold text-white leading-tight mb-5">
                    {block.titleSettings?.text || 'מוכנים לחסוך עשרות אלפי שקלים?'}
                  </h2>
                  {block.titleSettings?.subtitle && (
                    <p className="text-white/75 text-lg md:text-xl mb-10 leading-relaxed">
                      {block.titleSettings.subtitle}
                    </p>
                  )}

                  {/* CTA Buttons */}
                  <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-12">
                    {(block.ctaButtons || []).map((btn: any, i: number) => {
                      return (
                        <a
                          key={i}
                          href={btn.href}
                          className={cn(
                            "px-12 py-5 rounded-full font-bold text-lg transition-all min-w-[240px] text-center",
                            i === 0
                              ? "btn-3d btn-3d-gold text-white shadow-gold/20"
                              : "btn-3d bg-white/10 text-white border border-white/20 hover:bg-white/20"
                          )}
                        >
                          {btn.label}
                        </a>
                      );
                    })}
                  </div>

                  {/* Social proof avatars */}
                  <div className="mt-10 flex justify-center items-center gap-3">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-white/30 bg-white/10 -ml-2 first:ml-0" />
                      ))}
                    </div>
                    <p className="text-white/60 text-sm">הצטרפו ל-500+ לקוחות שכבר חסכו</p>
                  </div>
                </div>
              </section>
            );

          case 'contact':
            return (
              <section key={block.id} id="contact" className="py-24 md:py-48 px-6 bg-slate-50">
                <div className="w-full">
                  <ContactForm />
                </div>
              </section>
            );

          case 'map':
            return (
              <section key={block.id} className="w-full h-[500px] relative bg-slate-100">
                <iframe
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  src={`https://www.google.com/maps/embed/v1/place?key=REPLACE_WITH_YOUR_KEY&q=${encodeURIComponent(block.mapAddress || 'Israel')}`}
                  allowFullScreen
                ></iframe>
                {!block.mapAddress && (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-100/80">
                    <p className="boutique-label text-slate-400">אנא הזינו כתובת בהגדרות המפה</p>
                  </div>
                )}
              </section>
            );

          case 'video':
            return (
              <section key={block.id} className="py-20 md:py-32 px-6 bg-white">
                <div className="max-w-4xl mx-auto">
                  {block.titleSettings && (
                    <SectionTitle
                      subtitle={block.titleSettings.subtitle || ''}
                      title={block.titleSettings.text || block.title || ''}
                      fontSize={block.titleSettings.fontSize}
                      fontFamily={block.titleSettings.fontFamily}
                      color={block.titleSettings.color}
                      align={block.titleSettings.align || 'center'}
                      className="flex flex-col items-center text-center mb-10"
                    />
                  )}
                  {block.videoUrl && (
                    <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl border border-slate-100">
                      <iframe
                        src={getEmbedUrl(block.videoUrl)}
                        title={block.videoTitle || block.title || 'Video'}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                        style={{ border: 0 }}
                      />
                    </div>
                  )}
                  {!block.videoUrl && (
                    <div className="aspect-video rounded-2xl bg-slate-100 flex items-center justify-center">
                      <p className="boutique-label text-slate-400">הזינו קישור YouTube/Vimeo בהגדרות הבלוק</p>
                    </div>
                  )}
                </div>
              </section>
            );

          case 'stats':
            return (
              <section key={block.id} className={cn(
                "relative py-16 md:py-24 px-6 overflow-hidden",
                (!block.statsBg || block.statsBg === 'navy') ? 'finance-gradient' :
                block.statsBg === 'blue' ? 'bg-primary' : 'bg-white border-y border-slate-100'
              )}>
                {/* Bottom wave */}
                <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none pointer-events-none">
                  <svg viewBox="0 0 1440 32" xmlns="http://www.w3.org/2000/svg" className="w-full block" preserveAspectRatio="none">
                    <path d="M0,32 L0,16 Q360,32 720,16 Q1080,0 1440,16 L1440,32 Z" fill="hsl(var(--background))" />
                  </svg>
                </div>
                <div className="max-w-6xl mx-auto relative z-10">
                  {block.titleSettings?.text && (
                    <SectionTitle
                      subtitle={block.titleSettings.subtitle || ''}
                      title={block.titleSettings.text}
                      fontSize={block.titleSettings.fontSize || 'text-3xl'}
                      fontFamily={block.titleSettings.fontFamily}
                      color={block.titleSettings.color || '#ffffff'}
                      align={block.titleSettings.align || 'center'}
                      className="flex flex-col items-center text-center mb-12"
                    />
                  )}
                  <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-x-reverse divide-white/10">
                    {(block.stats || []).map((stat, i) => (
                      <div key={i} className="px-6 md:px-10 first:pr-0 last:pl-0">
                        <StatItem
                          prefix={stat.prefix}
                          value={stat.value}
                          suffix={stat.suffix}
                          label={stat.label}
                          light={!block.statsBg || block.statsBg !== 'white'}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            );

          case 'blog-grid':
            return <BlogGrid key={block.id} titleSettings={block.titleSettings} />;

          case 'calculator':
            return <MortgageCalculator key={block.id} titleSettings={block.titleSettings} />;

          case 'insight': {
            const imgLeft = block.insightImagePosition !== 'right';
            const sectionBg =
              block.insightBg === 'light-blue' ? 'bg-[hsl(213,40%,97%)]' :
              block.insightBg === 'slate'       ? 'bg-slate-50' :
              block.insightBg === 'navy'        ? 'finance-gradient' :
              'bg-white';
            return (
              <section key={block.id} className={cn("py-14 md:py-20 px-6 md:px-12", sectionBg)}>
                <div className="max-w-6xl mx-auto">
                  <div className="bg-white rounded-[2rem] shadow-[0_8px_60px_rgba(30,58,138,0.1)] border border-slate-100/80 overflow-hidden grid grid-cols-1 md:grid-cols-2">

                    {/* ── Image ── */}
                    <div className={cn("relative min-h-[280px] md:min-h-[420px]", imgLeft ? 'md:order-2' : 'md:order-1')}>
                      {block.insightImageUrl ? (
                        <Image src={safeEncodeURI(block.insightImageUrl)} alt={block.title || 'Insight'} fill className="object-cover" />
                      ) : (
                        <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                          <span className="boutique-label text-primary/40">הוסיפו תמונה</span>
                        </div>
                      )}
                      {/* Gradient bleed into text side */}
                      <div className={cn("absolute inset-y-0 w-16 from-white to-transparent hidden md:block pointer-events-none",
                        imgLeft ? 'right-0 bg-gradient-to-l' : 'left-0 bg-gradient-to-r'
                      )} />
                    </div>

                    {/* ── Content ── */}
                    <div className={cn("p-10 md:p-14 flex flex-col justify-center text-right gap-7", imgLeft ? 'md:order-1' : 'md:order-2')}>
                      {/* Title — split regular + bold italic */}
                      {(block.titleSettings?.text || block.title) && (
                        <div>
                          {block.titleSettings?.subtitle && (
                            <span className="boutique-label text-primary mb-3 block">{block.titleSettings.subtitle}</span>
                          )}
                          <h2 className="text-3xl md:text-4xl font-headline font-bold text-accent leading-[1.25]">
                            {block.titleSettings?.text || block.title}
                            {block.insightTitleBold && (
                              <> <em className="not-italic text-primary">{block.insightTitleBold}</em></>
                            )}
                          </h2>
                        </div>
                      )}

                      {/* Bullet points */}
                      {(block.insightPoints || []).length > 0 && (
                        <ul className="space-y-4">
                          {(block.insightPoints || []).map((pt, i) => (
                            <li key={i} className="flex items-start gap-3.5 text-right">
                              <span className={cn(
                                "shrink-0 mt-0.5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-black",
                                pt.type === 'negative' ? 'bg-red-100 text-red-500' :
                                pt.type === 'positive' ? 'bg-emerald-100 text-emerald-600' :
                                'bg-primary/10 text-primary'
                              )}>
                                {pt.type === 'negative' ? '✗' : pt.type === 'positive' ? '✓' : '→'}
                              </span>
                              <p className="text-slate-600 text-base md:text-[17px] leading-relaxed">{pt.text}</p>
                            </li>
                          ))}
                        </ul>
                      )}

                      {/* Conclusion */}
                      {block.insightConclusion && (
                        <div className="border-t border-slate-100/60 pt-6">
                          <p className="font-bold text-accent text-base md:text-lg leading-relaxed">{block.insightConclusion}</p>
                        </div>
                      )}

                      {/* CTA Button */}
                      {(block.ctaButtons || []).length > 0 && (
                        <div className="mt-4">
                          {block.ctaButtons?.map((btn, i) => (
                            <Link 
                              key={i} 
                              href={btn.href} 
                              className={cn(
                                "btn-3d w-fit px-8 py-3.5 rounded-xl font-bold flex items-center gap-2",
                                i === 0 ? "btn-3d-gold" : "bg-white text-primary border border-slate-200"
                              )}
                            >
                              {btn.label}
                              <ArrowLeft size={16} />
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </section>
            );
          }

          case 'comparison':
            return (
              <section key={block.id} className="py-24 md:py-40 bg-transparent px-6 overflow-hidden relative">
                <div className="max-w-7xl mx-auto">
                  <SectionTitle
                    subtitle={block.titleSettings?.subtitle || "למה כדאי ליווי מקצועי?"}
                    title={block.titleSettings?.text || "ההבדל בין לבד בבנק - לבין איתנו"}
                    className="flex flex-col items-center text-center mb-16 md:mb-24"
                    fontSize={block.titleSettings?.fontSize}
                    fontFamily={block.titleSettings?.fontFamily}
                    color={block.titleSettings?.color}
                    align={block.titleSettings?.align || 'center'}
                  />

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch bg-white/40 backdrop-blur-md rounded-[3rem] border border-white/60 overflow-hidden shadow-2xl">
                    {/* Left: Solo at Bank */}
                    <div className="lg:col-span-4 p-8 md:p-12 border-b lg:border-b-0 lg:border-l border-slate-100 flex flex-col bg-slate-50/30">
                      <div className="text-center mb-10">
                        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-4">
                          <X size={32} />
                        </div>
                        <h3 className="text-2xl font-headline font-bold text-slate-400">לבד בבנק</h3>
                        <div className="w-12 h-1 bg-slate-200 mx-auto mt-4" />
                      </div>
                      <div className="space-y-8 flex-grow">
                        {(block.insightPoints || []).filter(p => p.type === 'negative').map((point, i) => (
                          <div key={i} className="flex gap-4 items-start group">
                            <div className="shrink-0 w-6 h-6 rounded-full border-2 border-slate-200 flex items-center justify-center text-slate-300 group-hover:border-red-200 group-hover:text-red-300 transition-colors">
                              <X size={12} />
                            </div>
                            <p className="text-slate-500 font-light leading-relaxed">{point.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Middle: Professional Help (Highlighted) */}
                    <div className="lg:col-span-5 p-8 md:p-12 relative z-10 flex flex-col bg-white shadow-[0_0_50px_rgba(0,0,0,0.05)] ring-4 ring-primary/5">
                      <div className="absolute top-0 right-0 left-0 h-2 bg-gradient-to-r from-primary via-primary/80 to-primary" />
                      <div className="text-center mb-12">
                        <div className="icon-3d-wrapper bg-primary text-white mx-auto mb-6 scale-110">
                          <ShieldCheck size={36} />
                        </div>
                        <h3 className="text-3xl font-headline font-bold text-primary">עם ויידר משכנתאות</h3>
                        <p className="text-primary/60 text-sm font-bold mt-2 uppercase tracking-widest italic">המסלול הבטוח לחיסכון</p>
                      </div>
                      <div className="space-y-10 flex-grow">
                        {(block.insightPoints || []).filter(p => p.type === 'positive').map((point, i) => (
                          <div key={i} className="flex gap-5 items-start group">
                            <div className="shrink-0 w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm">
                              <Check size={18} strokeWidth={3} />
                            </div>
                            <p className="text-slate-700 font-medium leading-relaxed md:text-lg">{point.text}</p>
                          </div>
                        ))}
                      </div>
                      <div className="mt-12 pt-8 border-t border-slate-100">
                        <div className="flex items-center gap-4 text-primary font-bold">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Star size={20} className="fill-primary" />
                          </div>
                          <span>חיסכון ממוצע של 80,000₪ ללקוח</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Key Differences / Advantages */}
                    <div className="lg:col-span-3 p-8 md:p-12 bg-accent text-white flex flex-col">
                      <h3 className="text-xl font-headline font-bold mb-10 text-white/50 border-r-2 border-white/20 pr-4">היתרונות שלנו</h3>
                      <div className="space-y-12">
                        {[
                          { title: 'כוח מיקוח', desc: 'אנחנו מביאים עשרות תיקים בחודש ומקבלים ריביות שאין ללקוח פרטי.' },
                          { title: 'שקט נפשי', desc: 'אנחנו מטפלים בכל הבירוקרטיה המייגעת מול הבנקים והביטוחים.' },
                          { title: 'תכנון קדימה', desc: 'בניית תמהיל חכם שמתאים לחיים שלכם גם בעוד 10 שנים.' }
                        ].map((item, i) => (
                          <div key={i} className="space-y-2">
                            <h4 className="font-bold text-lg text-white flex items-center gap-2">
                              <ChevronRight size={16} className="text-primary" /> {item.title}
                            </h4>
                            <p className="text-white/60 text-sm font-light leading-relaxed">{item.desc}</p>
                          </div>
                        ))}
                      </div>
                      <div className="mt-auto pt-10">
                        <Link href="#contact" className="btn-3d btn-3d-gold block w-full py-4 rounded-xl text-center font-bold">
                          בואו נחסוך לכם
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            );

          case 'text':
          case 'image-text':
          case 'logos':
          case 'title-only':
            return <DynamicSections key={block.id} sections={[block]} />;

          default:
            return null;
        }
      })}
    </>
  );
}

function getEmbedUrl(url: string | null | undefined): string {
  if (!url) return "";
  
  let cleanUrl = url.trim();
  
  // YouTube
  if (cleanUrl.includes('youtube.com') || cleanUrl.includes('youtu.be')) {
    let videoId = "";
    
    if (cleanUrl.includes('youtu.be/')) {
      videoId = cleanUrl.split('youtu.be/')[1]?.split(/[?#]/)[0];
    } else if (cleanUrl.includes('embed/')) {
      return cleanUrl;
    } else if (cleanUrl.includes('v=')) {
      videoId = cleanUrl.split('v=')[1]?.split(/[&#]/)[0];
    } else if (cleanUrl.includes('watch/')) {
      videoId = cleanUrl.split('watch/')[1]?.split(/[?#]/)[0];
    } else if (cleanUrl.includes('shorts/')) {
      videoId = cleanUrl.split('shorts/')[1]?.split(/[?#]/)[0];
    }
    
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }
  }
  
  // Vimeo
  if (cleanUrl.includes('vimeo.com')) {
    if (cleanUrl.includes('player.vimeo.com/video/')) {
      return cleanUrl;
    }
    const match = cleanUrl.match(/vimeo\.com\/(\d+)/);
    if (match && match[1]) {
      return `https://player.vimeo.com/video/${match[1]}`;
    }
  }

  return cleanUrl;
}
