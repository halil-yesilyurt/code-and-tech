'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { decodeHtmlEntities, stripHtml, type WordPressPost } from '@/lib/wordpress';

type Props = { posts: WordPressPost[] };

function dateLabel(value: string) {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(new Date(value));
}

/** Text-first carousel: real archived posts, no fabricated covers or canvas effects. */
export default function FeaturedStoriesSlider({ posts }: Props) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduceMotion(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  useEffect(() => {
    if (posts.length <= 1 || paused || reduceMotion) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) setIndex((current) => (current + 1) % posts.length);
    }, 8500);
    return () => window.clearInterval(timer);
  }, [posts.length, paused, reduceMotion]);
  if (!posts.length) return null;

  const select = (value: number) => setIndex((value + posts.length) % posts.length);
  const activePost = posts[index];
  const description = stripHtml(activePost.excerpt?.rendered || activePost.content?.rendered || '').trim();
  const summary = description.length > 175 ? `${description.slice(0, 175).trimEnd()}…` : description;
  return (
    <section className="ct-feature-lead ct-feature-carousel"
      aria-label="Featured articles"
      aria-roledescription="carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false); }}
    >
      <div className="ct-feature-topline">
        <span className="ct-feature-label">FEATURED / {String(index + 1).padStart(2, '0')}</span>
        <span className="ct-slider-count">{String(index + 1).padStart(2, '0')} / {String(posts.length).padStart(2, '0')}</span>
      </div>
      <div key={activePost.id} className="ct-slider-content" aria-live="off">
        <div className="ct-slider-date"><time dateTime={activePost.date}>{dateLabel(activePost.date)}</time></div>
        <h3><Link href={`/blog/${activePost.slug}`}>{decodeHtmlEntities(activePost.title.rendered)}</Link></h3>
        {summary && <p>{summary}</p>}
      </div>
      <div className="ct-slider-bottom">
        <Link href={`/blog/${activePost.slug}`} className="ct-slider-read">Read article <span aria-hidden="true">↗</span></Link>
        {posts.length > 1 && <div className="ct-slider-controls" aria-label="Slide controls">
          <button type="button" aria-label="Previous article" onClick={() => select(index - 1)}>←</button>
          <button type="button" aria-label="Next article" onClick={() => select(index + 1)}>→</button>
        </div>}
      </div>
      {posts.length > 1 && <div className="ct-slider-dots" role="group" aria-label="Select featured article">
        {posts.map((post, i) => (
          <button key={post.id} type="button" aria-label={`Show featured article ${i + 1}: ${decodeHtmlEntities(post.title.rendered)}`} aria-current={i === index ? 'true' : undefined} onClick={() => select(i)} />
        ))}
      </div>}
    </section>
  );
}
