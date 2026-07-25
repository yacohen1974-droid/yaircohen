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
    fontSize ? fontSize : "text-3xl sm:text-5xl lg:text-6xl",
    color ? color : (isLight ? 'text-white' : 'text-accent'),
  );

  return (
    <div ref={revealRef} className={cn("mb-8 sm:mb-16 flex flex-col reveal transition-all duration-1000", alignmentClass, className)}>
      <span className={cn(
        "boutique-label block mb-3 sm:mb-6 stagger-1 opacity-70",
        isLight ? 'text-white/60' : 'text-primary'
      )}>
        {subtitle}
      </span>
      <h2 className={titleStyles}>
        {title}
      </h2>
      <div className={cn(
        "w-10 sm:w-16 h-[1px] mt-6 sm:mt-8 stagger-3",
        isLight ? 'bg-white/20' : 'bg-primary/20',
        align === 'center' ? 'mx-auto' : align === 'left' ? 'mr-auto ml-0' : 'ml-auto mr-0'
      )}></div>
    </div>
  );
}