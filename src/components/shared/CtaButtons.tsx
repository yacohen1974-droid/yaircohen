
"use client";

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface CtaButton {
  label: string;
  href: string;
  variant: 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  bgColor?: string;
}

interface CtaButtonsProps {
  buttons?: CtaButton[];
  align?: string;
  className?: string;
}

export function CtaButtons({ buttons, align = 'center', className }: CtaButtonsProps) {
  if (!buttons || buttons.length === 0) return null;

  const justifyClass = align === 'right' ? 'justify-end' : align === 'left' ? 'justify-start' : 'justify-center';

  return (
    <div className={cn("flex flex-wrap gap-6 mt-16", justifyClass, className)}>
      {buttons.map((btn, i) => {
        const isExternal = btn.href?.startsWith('http');
        const Component = isExternal ? 'a' : Link;
        const extraProps = isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {};

        const sizeClass = btn.size === 'lg'
          ? 'px-16 py-5 text-base'
          : btn.size === 'sm'
            ? 'px-8 py-3 text-xs'
            : 'px-12 py-4 text-sm';

        return (
          <Component
            key={i}
            href={btn.href as any}
            {...extraProps}
            className={cn(
              "boutique-label transition-all duration-500 rounded-full shadow-xl min-w-[200px] text-center",
              sizeClass,
              btn.variant === 'primary'
                ? (btn.bgColor || "bg-primary text-white hover:bg-accent hover:scale-105 pulse-glow")
                : btn.variant === 'outline'
                  ? "border-2 border-primary text-primary hover:bg-primary hover:text-white hover:scale-105"
                  : "text-primary hover:text-accent bg-transparent",
              (btn.variant === 'primary' && btn.bgColor) && "text-white"
            )}
          >
            {btn.label}
          </Component>
        );
      })}
    </div>
  );
}
