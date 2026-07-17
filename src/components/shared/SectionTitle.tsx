"use client";

import React from 'react';
import { useReveal } from '@/hooks/use-reveal';
import { cn } from '@/lib/utils';

interface SectionTitleProps {
  subtitle: React.ReactNode;
  title: React.ReactNode;
  isLight?: boolean;
  className?: string;
  fontSize?: string;
  color?: string;
  fontFamily?: string;
  align?: 'right' | 'center' | 'left';
}

export function SectionTitle({ 
  subtitle, 
  title, 
  isLight = false, 
  className,
  fontSize,
  color,
  fontFamily,
  align = 'right'
}: SectionTitleProps) {
  const revealRef = useReveal();

  const alignmentClass = 
    align === 'center' ? 'text-center items-center' : 
    align === 'left' ? 'text-left items-start' : 
    'text-right items-end';

  const titleStyles = cn(
    "stagger-2 transition-all duration-700 break-words",
    fontFamily ? fontFamily : "boutique-title",
    fontSize ? fontSize : "!text-4xl sm:!text-6xl lg:!text-7xl",
    color ? color : (isLight ? 'text-white' : 'text-foreground'),
  );

  return (
    <div ref={revealRef} className={cn("mb-12 sm:mb-24 flex flex-col reveal transition-all duration-1000", alignmentClass, className)}>
      <span className={cn(
        "boutique-label block mb-4 sm:mb-8 stagger-1 tracking-[0.4em] uppercase opacity-60",
        isLight ? 'text-white/50' : 'text-primary'
      )}>
        {subtitle}
      </span>
      <h2 className={titleStyles}>
        {title}
      </h2>
      <div className={cn(
        "w-16 sm:w-24 h-[2px] mt-8 sm:mt-12 stagger-3",
        isLight ? 'bg-white/20' : 'bg-primary/20',
        align === 'center' ? 'mx-auto' : align === 'left' ? 'mr-auto ml-0' : 'ml-auto mr-0'
      )}></div>
    </div>
  );
}