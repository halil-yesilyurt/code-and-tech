'use client';

import { useEffect, useState } from 'react';

interface Section {
  id: string;
  label: string;
  level: 2 | 3;
}

function headingSlug(text: string): string {
  return text.toLowerCase().normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s-]/g, '')
    .trim().replace(/\s+/g, '-').replace(/-+/g, '-') || 'section';
}

export default function ArticleTableOfContents({ articleSlug }: { articleSlug: string }) {
  const [sections, setSections] = useState<Section[]>([]);
  const [active, setActive] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
    const content = document.getElementById('ct-post-content');
    if (!content) return;
    const headings = Array.from(content.querySelectorAll<HTMLHeadingElement>('h2, h3'));
    const seen = new Set<string>();
    const entries = headings.map((heading) => {
      const label = (heading.textContent || '').trim();
      const base = heading.id || headingSlug(label);
      let id = base;
      let count = 2;
      while (seen.has(id)) id = `${base}-${count++}`;
      seen.add(id);
      heading.id = id;
      return { id, label, level: heading.tagName === 'H2' ? 2 as const : 3 as const };
    }).filter((entry) => entry.label);
    setSections(entries);
    setActive(entries[0]?.id ?? '');
    if (!entries.length) return;

    const observer = new IntersectionObserver(
      (observed) => {
        const visible = observed.filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: '-96px 0px -65% 0px', threshold: 0 }
    );
    headings.forEach((heading) => observer.observe(heading));

    let hash = '';
    try { hash = decodeURIComponent(window.location.hash.slice(1)); }
    catch { hash = window.location.hash.slice(1); }
    if (hash && entries.some((entry) => entry.id === hash)) {
      window.requestAnimationFrame(() => document.getElementById(hash)?.scrollIntoView());
    }
    return () => observer.disconnect();
  }, [articleSlug]);

  if (!sections.length) return null;
  const activeLabel = sections.find((section) => section.id === active)?.label || sections[0].label;

  const navigate = (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    setActive(id);
    setMobileOpen(false);
    history.replaceState(null, '', `#${encodeURIComponent(id)}`);
    document.getElementById(id)?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
  };

  return (
    <nav className="ct-toc" aria-label="Table of contents">
      <p className="ct-rail-kicker">ON THIS PAGE</p>
      <button
        className="ct-toc-mobile-toggle"
        type="button"
        aria-expanded={mobileOpen}
        aria-controls="ct-toc-list"
        onClick={() => setMobileOpen((value) => !value)}
      >
        <span>{activeLabel}</span>
        <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6"/></svg>
      </button>
      <div id="ct-toc-list" className={`ct-toc-drawer ${mobileOpen ? 'is-open' : ''}`}>
        <div className="ct-toc-drawer-inner">
          <ol>
            {sections.map((section) => (
              <li key={section.id} className={section.level === 3 ? 'ct-toc-subsection' : ''}>
                <a href={`#${section.id}`}
                  className={active === section.id ? 'ct-toc-active' : undefined}
                  aria-current={active === section.id ? 'location' : undefined}
                  onClick={(event) => navigate(event, section.id)}
                  tabIndex={mobileOpen ? 0 : undefined}
                >{section.label}</a>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </nav>
  );
}
