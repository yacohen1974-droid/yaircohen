
"use client";

import { useCallback, useEffect, useRef, useState } from 'react';

export function useReveal() {
  const [element, setElement] = useState<HTMLElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const refCallback = useCallback((node: HTMLElement | null) => {
    if (node) {
      setElement(node);
    }
  }, []);

  useEffect(() => {
    if (!element) return;

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { 
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    observer.observe(element);
    observerRef.current = observer;

    return () => observer.disconnect();
  }, [element]);

  return refCallback;
}
