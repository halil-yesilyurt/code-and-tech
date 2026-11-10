'use client';

import { useEffect, useState } from 'react';

/** Page-local progress, measured against the article body rather than the whole website. */
export default function ArticleReadingProgress({ articleSlug }: { articleSlug: string }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const article = document.getElementById('ct-post-content');
      if (!article) return;
      const start = article.getBoundingClientRect().top + window.scrollY;
      const end = start + article.offsetHeight - window.innerHeight * .55;
      const range = Math.max(1, end - start);
      const value = Math.max(0, Math.min(100, ((window.scrollY - start) / range) * 100));
      setProgress(value);
    };

    const scheduleUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);
    return () => {
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [articleSlug]);

  return <div className="ct-reading-progress" aria-hidden="true"><span style={{ transform: `scaleX(${progress / 100})` }} /></div>;
}
