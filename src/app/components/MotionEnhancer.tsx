'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Progressive enhancement: content starts visible and is animated only
 * when IntersectionObserver is supported and motion is allowed.
 */
export default function MotionEnhancer() {
  const pathname = usePathname();

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (media.matches || !('IntersectionObserver' in window)) return;
    const elements = document.querySelectorAll<HTMLElement>(
      '.ct-home .ct-section-heading, .ct-home .ct-article-card, .ct-home .ct-featured-grid, ' +
      '.ct-editorial-page .ct-blog-card, .ct-editorial-page .ct-p3-section-line, ' +
      '.ct-editorial-page .ct-p3-project-grid > *, .ct-editorial-page .ct-post-header-inner'
    );
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('ct-motion-visible');
          observer.unobserve(entry.target);
        }
      }
    }, { threshold: .06, rootMargin: '0px 0px -24px 0px' });

    elements.forEach((element) => {
      // Never hide content before the browser can render it.
      if (element.getBoundingClientRect().top > window.innerHeight - 24) {
        element.classList.add('ct-motion-pending');
        observer.observe(element);
      }
    });
    return () => {
      elements.forEach((element) => element.classList.remove('ct-motion-pending'));
      observer.disconnect();
    };
  }, [pathname]);

  return null;
}
