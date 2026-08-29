
export type NavItem = { label: string; href: string };
export type CtaButton = { label: string; href: string; variant: 'primary' | 'outline' | 'ghost'; size: 'sm' | 'default' | 'lg' };
export type Feature = { 
  title: string; 
  description: string; 
  icon: string;
  bg?: string;
  titleColor?: string;
};
export type Testimonial = { text: string; author: string; location: string };
export type Faq = { question: string; answer: string };
export type LogoItem = { imageUrl: string; id: string };
export type VideoItem = { id: string; url: string; title?: string };

export type TitleSettings = {
  text: string;
  fontSize?: string; // e.g. 'text-4xl'
  color?: string; // e.g. '#333333' or tailwind class
  fontFamily?: string; // 'font-headline', 'font-handwriting', 'font-sans'
  align?: 'right' | 'center' | 'left';
  subtitle?: string;
};

export type DynamicSection = {
  id: string;
  type: 'hero' | 'intro' | 'text' | 'image-text' | 'title-only' | 'logos' | 'features' | 'testimonials' | 'faqs' | 'cta' | 'contact' | 'map' | 'video' | 'stats' | 'blog-grid' | 'insight' | 'comparison' | 'calculator';
  content?: string;
  title?: string;
  titleSettings?: TitleSettings;
  subtitleSettings?: TitleSettings;
  imageUrl?: string;
  imageUrlMobile?: string;
  imagePosition?: 'left' | 'right';
  bg?: string;
  logos?: LogoItem[];
  logoSize?: 'sm' | 'md' | 'lg';
  logoShape?: 'circle' | 'square';
  logosAlign?: 'right' | 'center' | 'left';
  logosTitlePosition?: 'above' | 'side';
  features?: Feature[];
  featuresColumns?: string;
  featuresBg?: string;
  featuresSize?: string;
  testimonials?: Testimonial[];
  faqs?: Faq[];
  ctaButtons?: CtaButton[];
  ctaAlign?: string;
  heroHeight?: string;
  heroTextAlign?: string;
  heroCloudiness?: number;
  heroImagePosition?: string;
  heroImagePositionMobile?: string;
  portraitImageUrl?: string;
  portraitShape?: string;
  portraitPosition?: string;
  portraitSize?: number;
  portraitRadius?: string;
  spaceImageUrl?: string;
  mapAddress?: string;
  videoUrl?: string;
  videoTitle?: string;
  videos?: VideoItem[];
  videoColumns?: string;
  stats?: { value: string; label: string; prefix?: string; suffix?: string }[];
  statsBg?: 'navy' | 'white' | 'blue';
  statsFontSize?: string;
  /* ── Insight card ─────────────────────────────────────────── */
  insightPoints?: { text: string; type: 'negative' | 'positive' | 'neutral' }[];
  insightConclusion?: string;
  insightImageUrl?: string;
  insightImagePosition?: 'left' | 'right';
  insightBg?: 'white' | 'light-blue' | 'slate' | 'navy';
  insightTitleBold?: string;
};

export type ContentState = {
  // Global settings
  underConstruction?: boolean;
  primaryColor: string;
  siteName: string;
  siteSubtitle: string;
  siteDescription?: string;
  siteEmail?: string;
  sitePhone?: string;
  siteAddress?: string;
  siteLogo?: string;
  siteFavicon?: string;
  facebookLink?: string;
  instagramLink?: string;
  linkedinLink?: string;
  navItems: NavItem[];
  footerItems: NavItem[];
  legalItems: NavItem[];
  
  // Page specific
  metaTitle: string;
  metaDescription: string;
  
  // Dynamic blocks
  blocks: DynamicSection[];
  
  // Backward compatibility (optional but keeping to avoid breakage during transition)
  sectionOrder?: string[];
  [key: string]: any;
};

// The "Global settings" fields above (site branding/contact/menus) are seeded
// with real default values by getInitialPageContent() for every page, purely
// so a single page's editor can render the global-settings screen too. They
// don't belong in any individual page's own saved content — merging them in
// makes that page's draft permanently differ from its published version (a
// phantom "needs publishing" diff) even when nothing page-specific changed.
export const GLOBAL_ONLY_CONTENT_FIELDS: (keyof ContentState)[] = [
  'underConstruction', 'primaryColor', 'siteName', 'siteSubtitle', 'siteDescription',
  'siteEmail', 'sitePhone', 'siteAddress', 'siteLogo', 'siteFavicon',
  'facebookLink', 'instagramLink', 'linkedinLink', 'navItems', 'footerItems', 'legalItems',
];

export const DEFAULT_CONTENT_VALUES: Partial<ContentState> = {
  heroHeight: '80vh',
  heroTextAlign: 'center',
  heroCloudiness: 40,
  primaryColor: '213 75% 35%',
  sectionBg: 'white',
  portraitShape: 'circle',
  portraitPosition: 'left',
  ctaAlign: 'center',
  navItems: [],
  footerItems: [],
  legalItems: [],
  ctaButtons: [],
  features: [],
  testimonials: [],
  faqs: [],
  dynamicSections: [],
  sectionOrder: ['hero', 'stats', 'intro', 'features', 'video', 'testimonials', 'faqs', 'cta', 'contact']
};

export const PAGE_FALLBACKS: Record<string, Partial<ContentState>> = {
  home: {
    heroTitle: "יועץ משכנתאות מקצועי",
    heroSubtitle: "ליווי אישי – מהשוואת הצעות ועד קבלת המפתחות",
    features: [
      { title: "ייעוץ מקצועי", icon: "Star", description: "ייעוץ מוסמך שמביא לחיסכון מרבי בריבית ובעמלות." },
      { title: "כל הבנקים", icon: "Users", description: "עבודה מול כל הבנקים המובילים – ללא תלות בבנק אחד." },
      { title: "ליווי מלא", icon: "Compass", description: "מלווים אתכם בכל השלבים עד קבלת המשכנתא הטובה ביותר." }
    ]
  },
  about: {
    heroTitle: "אודות",
    heroSubtitle: "הכירו את היועץ שלכם",
    features: [
      { title: "ניסיון", icon: "Star", description: "שנים של ניסיון בתחום המשכנתאות." },
      { title: "מקצועיות", icon: "Compass", description: "הסמכות מלאות ורישיון מטעם רשות שוק ההון." },
      { title: "אמינות", icon: "Heart", description: "עשרות לקוחות מרוצים בכל שנה." }
    ]
  }
};

export function getInitialPageContent(id: string): ContentState {
  const fallback = PAGE_FALLBACKS[id] || {};
  
  // Convert old structure to blocks if necessary
  const initialBlocks: DynamicSection[] = [];
  
  if (id === 'home' || id === 'about') {
    initialBlocks.push({
      id: 'hero-1',
      type: 'hero',
      title: fallback.heroTitle || '',
      titleSettings: { text: fallback.heroTitle || '', fontSize: 'text-9xl', fontFamily: 'font-headline', align: 'center', color: '#ffffff' },
      heroHeight: '70vh',
      heroTextAlign: 'center',
      heroCloudiness: 30
    });
    
    initialBlocks.push({
      id: 'intro-1',
      type: 'intro',
      title: fallback.introTitle || '',
      content: fallback.introContent || '',
      bg: 'white'
    });
  }

  return {
    underConstruction:    false,
    primaryColor:         fallback.primaryColor         || '35 40% 45%',
    siteName:             fallback.siteName             || '',
    siteSubtitle:         fallback.siteSubtitle         || '',
    siteDescription:      fallback.siteDescription      || '',
    siteEmail:            fallback.siteEmail            || '',
    sitePhone:            fallback.sitePhone            || '',
    siteAddress:          fallback.siteAddress          || '',
    siteLogo:             fallback.siteLogo             || '/logo.png',
    siteFavicon:          fallback.siteFavicon          || '/favicon.ico',
    facebookLink:         fallback.facebookLink         || '',
    instagramLink:        fallback.instagramLink        || '',
    linkedinLink:         fallback.linkedinLink         || '',
    navItems:             fallback.navItems             || [],
    footerItems:          fallback.footerItems          || [],
    legalItems:           fallback.legalItems           || [],
    metaTitle:            '',
    metaDescription:      '',
    blocks:               initialBlocks,
    sectionOrder:         ['hero', 'intro', 'dynamic', 'features', 'journey', 'testimonials', 'faqs', 'cta', 'contact']
  };
}
