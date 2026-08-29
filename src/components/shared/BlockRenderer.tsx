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
function StatItem({ prefix = '', value, suffix = '', label, light = true, fontSize }: {
  prefix?: string; value: string; suffix?: string; label: string; light?: boolean; fontSize?: string;
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
        fontSize && fontSize !== 'auto' ? fontSize : (
          fullText.length > 8 ? "text-xl xs:text-2xl sm:text-4xl md:text-5xl lg:text-6xl" :
          fullText.length > 5 ? "text-3xl sm:text-5xl md:text-6xl" :
          "text-4xl sm:text-5xl md:text-6xl"
        ),
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
    <section className="py-16 md:py-24 px-6 md:px-12 xl:px-24 bg-white">
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12 md:mt-16">
          {loading ? (
            <div className="col-span-full flex justify-center py-16">
              <Loader2 className="animate-spin text-primary size-12" />
            </div>
          ) : posts.length === 0 ? (
            <p className="col-span-full text-center text-stone-400 text-lg font-light italic">בקרוב יעלו תכנים חדשים ומאירי פנים...</p>
          ) : (
            posts.map((post: any) => (
              <Link href={`/blog/${post.slug || post.id}`} key={post.id} className="group cursor-pointer border border-slate-100/85 bg-white hover:border-slate-300 hover:shadow-md p-4 rounded-3xl transition-all duration-300">
                <div className="bg-stone-50 aspect-video mb-6 overflow-hidden relative rounded-2xl shadow-sm">
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
                        <span className="font-handwriting text-3xl text-stone-300">יאיר כהן</span>
                     </div>
                   )}
                   <div className="absolute top-4 right-4 boutique-label text-[10px] bg-white px-3 py-1 shadow-sm">{post.category}</div>
                </div>
                <div className="space-y-3.5">
                  <span className="boutique-label text-stone-400 block">{formatDisplayDate(post.date)}</span>
                  <h3 className="text-xl md:text-2xl font-serif font-bold text-accent group-hover:text-primary transition-colors leading-tight">{post.title}</h3>
                  <p className="text-sm font-light text-slate-500 leading-relaxed line-clamp-3">
                    {post.summary || post.subtitle || "לחצו לקריאת המאמר המלא..."}
                  </p>
                  <div className="flex items-center gap-2 text-primary boutique-label text-[10px] pt-2 font-bold">
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
              <section key={block.id} className="relative w-full flex flex-col items-center justify-center px-4 overflow-hidden bg-slate-900 shadow-sm" style={{ minHeight: block.heroHeight || '60vh' }}>
                <div className="absolute inset-0 z-0">
                  {block.imageUrl && (
                    <div className="hidden md:block absolute inset-0">
                      <Image 
                        src={safeEncodeURI(block.imageUrl)} 
                        alt={block.title || "Hero"} 
                        fill 
                        className="object-cover" 
                        style={{ 
                          opacity: (100 - (block.heroCloudiness ?? 30)) / 100,
                          objectPosition: block.heroImagePosition || 'center'
                        }}
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
                        style={{ 
                          opacity: (100 - (block.heroCloudiness ?? 30)) / 100,
                          objectPosition: block.heroImagePositionMobile || block.heroImagePosition || 'center'
                        }}
                        priority 
                      />
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-background via-background/20 to-transparent z-0 pointer-events-none" style={{ opacity: (block.heroCloudiness ?? 30) / 100 }} />
                </div>
                <div className={cn("relative z-[5] w-full max-w-5xl mx-auto px-6 flex flex-col pt-16 pb-12", block.heroTextAlign === 'center' ? 'items-center text-center' : block.heroTextAlign === 'left' ? 'items-start text-left' : 'items-end text-right')}>
                    {block.titleSettings && (
                      <h1 className={cn("font-serif font-light leading-tight hero-title-shadow break-words w-full", block.titleSettings.fontSize || 'text-4xl sm:text-6xl lg:text-7xl')} style={{ color: block.titleSettings.color || 'white' }}>
                        {block.titleSettings.text || block.title}
                      </h1>
                    )}
                    {block.subtitleSettings && (
                      <h2 className={cn("font-sans font-light mt-4 text-white/90 max-w-2xl xl:max-w-3xl leading-relaxed hero-para-shadow", block.subtitleSettings.fontSize || 'text-base md:text-lg')} style={{ color: block.subtitleSettings.color || 'white' }}>
                        {block.subtitleSettings.text}
                      </h2>
                    )}
                    {/* Scroll-down CTA Button */}
                    <a href="#services" className="mt-8 flex items-center gap-2 px-6 py-3 rounded-full bg-white text-slate-900 text-sm font-semibold hover:bg-slate-50 transition-all duration-300 w-fit shadow-md group">
                      <span>גלו את השירותים שלנו</span>
                      <ChevronDown size={14} className="animate-bounce group-hover:animate-none" />
                    </a>
                </div>
              </section>
            );

          case 'intro':
            return (
              <section key={block.id} className={cn("py-16 md:py-24 px-6 md:px-12 xl:px-24 border-b border-slate-100/60 relative overflow-hidden", block.bg === 'stone-50' ? 'bg-slate-50/50' : 'bg-white')}>
                <div className="max-w-7xl mx-auto">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-20 items-center">
                    <div className={cn("lg:col-span-5 order-2 relative pt-4 pb-8", block.portraitPosition === 'right' ? 'lg:order-2' : 'lg:order-1')}>
                      <PortraitImage 
                        src={block.portraitImageUrl || ''} 
                        shape={(block.portraitShape as any) || 'rectangle'} 
                        size={block.portraitSize || (block.portraitShape === 'circle' ? 250 : 400)}
                        alt={block.title || "Portrait"} 
                        className="image-zoom-container mx-auto lg:max-w-none shadow-[0_20px_50px_rgba(0,0,0,0.08)] rounded-[2rem]" 
                      />
                    </div>
                    <div className={cn("lg:col-span-7 order-1 space-y-8", block.portraitPosition === 'right' ? 'lg:order-1' : 'lg:order-2')}>
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

          case 'features': {
            const columnsClass = 
              block.featuresColumns === 'md:grid-cols-3' ? 'md:grid-cols-3' :
              block.featuresColumns === 'md:grid-cols-4' ? 'md:grid-cols-2 lg:grid-cols-4' :
              'md:grid-cols-2';

            const bgStyle = block.featuresBg || 'white';
            const sizeStyle = block.featuresSize || 'comfortable';

            return (
              <section key={block.id} id="services" className={cn("py-16 md:py-24 px-6 md:px-12 border-y border-slate-100/60", block.bg === 'white' ? 'bg-white' : 'bg-slate-50/50')}>
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
                  <div className={cn("grid grid-cols-1 gap-8 mt-12 sm:mt-16", columnsClass)}>
                    {(block.features || []).map((point, i) => {
                      const Icon = ICON_MAP[point.icon] || Heart;

                      // Define card bg style classes (Flat, premium 2026 feel)
                      const cardBgClass = 
                        bgStyle === 'slate' ? 'bg-slate-50/50 border border-slate-100 shadow-sm' :
                        bgStyle === 'navy' ? 'bg-slate-900 border border-white/5 shadow-md text-white' :
                        bgStyle === 'glass' ? 'bg-white border border-slate-150 shadow-sm' :
                        bgStyle === 'border' ? 'bg-transparent border border-slate-200 hover:border-slate-350 shadow-sm' :
                        'bg-white shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-slate-100/80';

                      const titleColorClass = bgStyle === 'navy' ? 'text-white' : 'text-accent';
                      const descColorClass = bgStyle === 'navy' ? 'text-white/70' : 'text-slate-500';
                      const iconBgClass = 
                        bgStyle === 'navy' ? 'text-white bg-white/10' : 
                        'text-primary bg-primary/5';

                      // Define card size style classes
                      const cardPaddingClass = 
                        sizeStyle === 'compact' ? 'p-6 sm:p-8 rounded-2xl' :
                        sizeStyle === 'large' ? 'p-8 sm:p-12 rounded-[2rem]' :
                        'p-6 sm:p-10 rounded-[1.5rem]';

                      const gapClass = 
                        sizeStyle === 'compact' ? 'gap-4' :
                        sizeStyle === 'large' ? 'gap-8' :
                        'gap-6';

                      const titleSizeClass = 
                        sizeStyle === 'compact' ? 'text-lg sm:text-xl' :
                        sizeStyle === 'large' ? 'text-xl sm:text-2xl lg:text-3xl' :
                        'text-lg sm:text-xl lg:text-2xl';

                      const descSizeClass = 
                        sizeStyle === 'compact' ? 'text-xs sm:text-sm' :
                        sizeStyle === 'large' ? 'text-base sm:text-lg lg:text-xl' :
                        'text-sm sm:text-base';

                      const iconSizeClass = 
                        sizeStyle === 'compact' ? 'w-12 h-12' :
                        sizeStyle === 'large' ? 'w-16 h-16' :
                        'w-14 h-14';

                      const iconSvgSize = 
                        sizeStyle === 'compact' ? 20 :
                        sizeStyle === 'large' ? 28 :
                        24;

                      return (
                        <div key={i} className={cn(
                          "group relative cursor-default flex flex-col items-start text-right transition-all duration-300 hover:border-slate-300 hover:shadow-md",
                          cardBgClass,
                          cardPaddingClass,
                          `stagger-${Math.min(i + 1, 5)}`
                        )}>
                          <div className={cn("flex flex-col items-start relative z-10 w-full", gapClass)}>
                            <div className={cn("rounded-2xl flex items-center justify-center relative transition-transform duration-300", iconSizeClass, iconBgClass)}>
                              <Icon size={iconSvgSize} strokeWidth={1.5} />
                            </div>
                            
                            <div className="space-y-2.5 w-full">
                              <h3 className={cn("font-serif font-bold tracking-tight transition-colors duration-300", titleSizeClass, titleColorClass)}>
                                {point.title}
                              </h3>
                              <p className={cn("font-light leading-relaxed font-sans", descSizeClass, descColorClass)}>
                                {point.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>
            );
          }

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
              <section key={block.id} className="relative py-16 md:py-24 px-6 bg-slate-900 overflow-hidden text-center">
                <div className="max-w-3xl mx-auto relative z-10">
                  {/* Trust strip */}
                  <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 mb-8">
                    {['ייעוץ ראשוני חינם', 'ללא התחייבות', '500+ לקוחות מרוצים'].map((t, i) => (
                      <span key={i} className="text-white/70 text-sm flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold">✓</span>
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* Headline */}
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white leading-tight mb-5">
                    {block.titleSettings?.text || 'מוכנים לחסוך עשרות אלפי שקלים?'}
                  </h2>
                  {block.titleSettings?.subtitle && (
                    <p className="text-white/70 text-base md:text-lg mb-8 leading-relaxed font-light">
                      {block.titleSettings.subtitle}
                    </p>
                  )}

                  {/* CTA Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-10">
                    {(block.ctaButtons || []).map((btn: any, i: number) => {
                      return (
                        <a
                          key={i}
                          href={btn.href}
                          className={cn(
                            "px-8 py-4 rounded-full font-semibold text-base transition-all min-w-[200px] text-center shadow-sm",
                            i === 0
                              ? "bg-[#d4af37] text-white hover:bg-[#c5a028]"
                              : "bg-white/10 text-white border border-white/25 hover:bg-white/15"
                          )}
                        >
                          {btn.label}
                        </a>
                      );
                    })}
                  </div>
                </div>
              </section>
            );

          case 'contact':
            return (
              <section key={block.id} id="contact" className="py-16 md:py-24 px-6 bg-slate-50/50">
                <div className="w-full">
                  <ContactForm 
                     title={block.titleSettings?.text}
                     description={block.titleSettings?.subtitle}
                     imageUrl={block.imageUrl}
                  />
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

          case 'video': {
            const videoItems = block.videos && block.videos.length > 0
              ? block.videos
              : block.videoUrl
                ? [{ id: block.id, url: block.videoUrl, title: block.videoTitle }]
                : [];

            const videoColumnsClass =
              block.videoColumns === 'md:grid-cols-2' ? 'md:grid-cols-2' :
              block.videoColumns === 'md:grid-cols-3' ? 'md:grid-cols-2 lg:grid-cols-3' :
              block.videoColumns === 'md:grid-cols-4' ? 'md:grid-cols-2 lg:grid-cols-4' :
              '';

            const containerMaxWidth = videoColumnsClass ? 'max-w-7xl' : 'max-w-4xl';

            return (
              <section key={block.id} className="py-20 md:py-32 px-6 bg-white">
                <div className={cn(containerMaxWidth, "mx-auto")}>
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
                  {videoItems.length > 0 ? (
                    <div className={cn("grid grid-cols-1 gap-6 w-full", videoColumnsClass)}>
                      {videoItems.map((video, i) => (
                        <div key={video.id || i} className="aspect-video w-full rounded-2xl overflow-hidden shadow-2xl border border-slate-100">
                          <iframe
                            src={getEmbedUrl(video.url)}
                            title={video.title || block.title || 'Video'}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full"
                            style={{ border: 0 }}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="aspect-video rounded-2xl bg-slate-100 flex items-center justify-center">
                      <p className="boutique-label text-slate-400">הזינו קישור YouTube/Vimeo בהגדרות הבלוק</p>
                    </div>
                  )}
                </div>
              </section>
            );
          }

          case 'stats':
            return (
              <section key={block.id} className={cn(
                "relative py-16 md:py-20 px-6 overflow-hidden",
                (!block.statsBg || block.statsBg === 'navy') ? 'bg-slate-900' :
                block.statsBg === 'blue' ? 'bg-primary' : 'bg-white border-y border-slate-100/60'
              )}>
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
                          fontSize={block.statsFontSize}
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
              block.insightBg === 'slate'       ? 'bg-slate-50/50' :
              block.insightBg === 'navy'        ? 'bg-slate-900' :
              'bg-white';
            return (
              <section key={block.id} className={cn("py-12 md:py-16 px-6 md:px-12", sectionBg)}>
                <div className="max-w-6xl mx-auto">
                  <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-2">

                    {/* ── Image ── */}
                    <div className={cn("relative min-h-[280px] md:min-h-[420px]", imgLeft ? 'md:order-2' : 'md:order-1')}>
                      {block.insightImageUrl ? (
                        <Image src={safeEncodeURI(block.insightImageUrl)} alt={block.title || 'Insight'} fill className="object-cover" />
                      ) : (
                        <div className="absolute inset-0 bg-primary/5 flex items-center justify-center">
                          <span className="boutique-label text-primary/40">הוסיפו תמונה</span>
                        </div>
                      )}
                    </div>

                    {/* ── Content ── */}
                    <div className={cn("p-8 md:p-12 flex flex-col justify-center text-right gap-6", imgLeft ? 'md:order-1' : 'md:order-2')}>
                      {/* Title — split regular + bold italic */}
                      {(block.titleSettings?.text || block.title) && (
                        <div>
                          <h2 className="text-2xl md:text-3xl font-serif font-bold text-accent leading-[1.25]">
                            {block.titleSettings?.text || block.title}
                            {block.insightTitleBold && (
                              <> <em className="not-italic text-primary font-normal">{block.insightTitleBold}</em></>
                            )}
                          </h2>
                          {block.titleSettings?.subtitle && (
                            <span className="boutique-label text-primary mt-2 block">{block.titleSettings.subtitle}</span>
                          )}
                        </div>
                      )}

                      {/* Bullet points */}
                      {(block.insightPoints || []).length > 0 && (
                        <ul className="space-y-3.5">
                          {(block.insightPoints || []).map((pt, i) => (
                            <li key={i} className="flex items-start gap-3 text-right">
                              <span className={cn(
                                "shrink-0 mt-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold",
                                pt.type === 'negative' ? 'bg-red-50 text-red-500' :
                                pt.type === 'positive' ? 'bg-emerald-50 text-emerald-600' :
                                'bg-primary/10 text-primary'
                              )}>
                                {pt.type === 'negative' ? '✗' : pt.type === 'positive' ? '✓' : '→'}
                              </span>
                              <p className="text-slate-600 text-sm md:text-base leading-relaxed">{pt.text}</p>
                            </li>
                          ))}
                        </ul>
                      )}

                      {/* Conclusion */}
                      {block.insightConclusion && (
                        <div className="border-t border-slate-100 pt-5">
                          <p className="font-semibold text-accent text-base leading-relaxed">{block.insightConclusion}</p>
                        </div>
                      )}

                      {/* CTA Button */}
                      {(block.ctaButtons || []).length > 0 && (
                        <div className="mt-2">
                          {block.ctaButtons?.map((btn, i) => (
                            <Link 
                              key={i} 
                              href={btn.href} 
                              className={cn(
                                "rounded-full px-6 py-3.5 text-base font-semibold transition-all w-fit flex items-center gap-2 shadow-sm",
                                i === 0 ? "bg-[#d4af37] text-white hover:bg-[#c5a028]" : "bg-white text-primary border border-slate-200 hover:bg-slate-50"
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
              <section key={block.id} className="py-16 md:py-24 bg-transparent px-6 overflow-hidden relative">
                <div className="max-w-7xl mx-auto">
                  <SectionTitle
                    subtitle={block.titleSettings?.subtitle || "למה כדאי ליווי מקצועי?"}
                    title={block.titleSettings?.text || "ההבדל בין לבד בבנק - לבין איתנו"}
                    className="flex flex-col items-center text-center mb-10 md:mb-16"
                    fontSize={block.titleSettings?.fontSize}
                    fontFamily={block.titleSettings?.fontFamily}
                    color={block.titleSettings?.color}
                    align={block.titleSettings?.align || 'center'}
                  />

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                    {/* Left: Solo at Bank */}
                    <div className="lg:col-span-4 p-8 md:p-10 rounded-3xl border border-slate-100 bg-slate-50/50 flex flex-col">
                      <div className="text-center mb-8">
                        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-4">
                          <X size={24} />
                        </div>
                        <h3 className="text-xl font-serif font-bold text-slate-500">לבד בבנק</h3>
                        <div className="w-12 h-[1px] bg-slate-200 mx-auto mt-4" />
                      </div>
                      <div className="space-y-6 flex-grow">
                        {(block.insightPoints || []).filter(p => p.type === 'negative').map((point, i) => (
                          <div key={i} className="flex gap-3 items-start">
                            <div className="shrink-0 w-5 h-5 rounded-full border border-slate-200 flex items-center justify-center text-slate-300 mt-0.5">
                              <X size={10} />
                            </div>
                            <p className="text-slate-500 text-sm font-light leading-relaxed">{point.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Middle: Professional Help (Highlighted) */}
                    <div className="lg:col-span-5 p-8 md:p-10 relative z-10 flex flex-col bg-white border border-primary/20 rounded-3xl shadow-sm">
                      <div className="absolute top-0 right-0 left-0 h-1 bg-primary" />
                      <div className="text-center mb-8">
                        <div className="w-14 h-14 rounded-full bg-primary/5 text-primary mx-auto mb-4 flex items-center justify-center">
                          <ShieldCheck size={28} />
                        </div>
                        <h3 className="text-2xl font-serif font-bold text-primary">עם יאיר כהן</h3>
                        <p className="text-primary/60 text-xs font-bold mt-1 uppercase tracking-widest italic">המסלול הבטוח לחיסכון</p>
                      </div>
                      <div className="space-y-6 flex-grow">
                        {(block.insightPoints || []).filter(p => p.type === 'positive').map((point, i) => (
                          <div key={i} className="flex gap-4 items-start">
                            <div className="shrink-0 w-6 h-6 rounded-lg bg-primary/5 flex items-center justify-center text-primary mt-0.5 shadow-sm">
                              <Check size={14} strokeWidth={3} />
                            </div>
                            <p className="text-slate-700 font-medium leading-relaxed text-base">{point.text}</p>
                          </div>
                        ))}
                      </div>
                      <div className="mt-8 pt-6 border-t border-slate-100">
                        <div className="flex items-center gap-3 text-primary text-sm font-bold">
                          <Star size={16} className="fill-primary text-primary" />
                          <span>חיסכון ממוצע של 80,000₪ ללקוח</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Key Differences / Advantages */}
                    <div className="lg:col-span-3 p-8 md:p-10 bg-slate-900 text-white rounded-3xl flex flex-col justify-between">
                      <div>
                        <h3 className="text-lg font-serif font-bold mb-8 text-white/60 border-r-2 border-white/20 pr-3">היתרונות שלנו</h3>
                        <div className="space-y-8">
                          {[
                            { title: 'כוח מיקוח', desc: 'אנחנו מביאים עשרות תיקים בחודש ומקבלים ריביות שאין ללקוח פרטי.' },
                            { title: 'שקט נפשי', desc: 'אנחנו מטפלים בכל הבירוקרטיה המייגעת מול הבנקים והביטוחים.' },
                            { title: 'תכנון קדימה', desc: 'בניית תמהיל חכם שמתאים לחיים שלכם גם בעוד 10 שנים.' }
                          ].map((item, i) => (
                            <div key={i} className="space-y-1">
                              <h4 className="font-bold text-sm text-white flex items-center gap-1.5">
                                <ChevronRight size={14} className="text-primary" /> {item.title}
                              </h4>
                              <p className="text-white/60 text-xs font-light leading-relaxed">{item.desc}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="pt-8">
                        <Link href="#contact" className="block w-full py-3.5 rounded-full bg-[#d4af37] hover:bg-[#c5a028] text-center font-semibold text-white shadow-sm transition-all duration-300">
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
