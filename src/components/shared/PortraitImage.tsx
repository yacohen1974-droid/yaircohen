
'use client';

import Image from 'next/image';
import { cn, safeEncodeURI } from '@/lib/utils';

export type PortraitShape = 'circle' | 'rectangle' | 'square';

interface PortraitImageProps {
  src?: string | null;
  loading?: boolean;
  shape?: PortraitShape;
  size?: number;
  alt?: string;
  className?: string;
}

const SHAPE_CLASSES: Record<PortraitShape, string> = {
  circle:    'rounded-full border-4 border-white shadow-xl aspect-square',
  rectangle: 'aspect-[3/4] border-4 sm:border-8 border-background shadow-2xl',
  square:    'aspect-square border-4 border-background shadow-xl',
};

export function PortraitImage({
  src,
  loading = false,
  shape = 'circle',
  size = 300,
  alt = 'תמונת פורטרט',
  className,
}: PortraitImageProps) {
  // Ensure square aspect ratio for circle/square by setting both width and height
  const sizeStyles = { 
    width: `${size}px`, 
    height: (shape === 'circle' || shape === 'square') ? `${size}px` : 'auto',
    maxWidth: '100%' 
  };

  return (
    <div 
      className={cn('shrink-0 relative overflow-hidden', SHAPE_CLASSES[shape], className)}
      style={sizeStyles}
    >
      {loading ? (
        <div className="absolute inset-0 bg-stone-200 animate-pulse" />
      ) : src ? (
        <Image src={safeEncodeURI(src)} alt={alt} fill className="object-cover" />
      ) : (
        <div className="absolute inset-0 bg-stone-100" />
      )}
    </div>
  );
}
