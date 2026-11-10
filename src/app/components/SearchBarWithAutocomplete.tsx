'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Spinner from './Spinner';
import { stripHtml } from '@/lib/wordpress';

interface SearchSuggestion {
  type: 'post' | 'category' | 'tag';
  title: string;
  slug: string;
  excerpt?: string;
  url?: string;
}

export default function SearchBarWithAutocomplete({
  initialQuery = '',
  showSuggestions = true,
}: {
  initialQuery?: string;
  showSuggestions?: boolean;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(-1);
  const router = useRouter();
  const menuId = useId();
  const root = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => { setQuery(initialQuery); }, [initialQuery]);

  useEffect(() => {
    const controller = new AbortController();
    if (!showSuggestions || query.trim().length < 2 || query.length > 100) {
      setSuggestions([]);
      setOpen(false);
      setLoading(false);
      return () => controller.abort();
    }
    const timer = window.setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search/suggestions?q=${encodeURIComponent(query.trim())}`, { signal: controller.signal });
        if (!res.ok) throw new Error('Suggestion request failed');
        const result = await res.json();
        if (controller.signal.aborted) return;
        setSuggestions(Array.isArray(result.suggestions) ? result.suggestions.slice(0, 8) : []);
        setActive(-1);
      } catch {
        if (!controller.signal.aborted) setSuggestions([]);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 280);
    return () => { window.clearTimeout(timer); controller.abort(); };
  }, [query, showSuggestions]);

  useEffect(() => {
    const close = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', close);
    return () => document.removeEventListener('pointerdown', close);
  }, []);

  const goTo = (target: string) => {
    setOpen(false);
    setActive(-1);
    router.push(target);
  };

  const destination = (suggestion: SearchSuggestion) =>
    suggestion.url?.startsWith('/') && !suggestion.url.startsWith('//')
      ? suggestion.url
      : suggestion.type === 'post' ? `/blog/${suggestion.slug}`
      : suggestion.type === 'category' ? `/category/${suggestion.slug}`
      : `/tag/${suggestion.slug}`;

  return (
    <div className="ct-search-widget" ref={root}>
      <form
        role="search"
        className="ct-search-form"
        onSubmit={(event) => {
          event.preventDefault();
          if (open && active >= 0 && suggestions[active]) {
            goTo(destination(suggestions[active]));
          } else if (query.trim()) {
            goTo(`/search?query=${encodeURIComponent(query.trim())}`);
          }
        }}
      >
        <div className="ct-search-field">
          <svg aria-hidden="true" className="ct-search-field-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <circle cx="10.8" cy="10.8" r="7.3"/><path d="m16.3 16.3 5.1 5.1"/>
          </svg>
          <input
            ref={input}
            id="search-input"
            type="search"
            name="query"
            maxLength={100}
            autoComplete="off"
            value={query}
            onChange={(event) => { setQuery(event.target.value); setOpen(Boolean(event.target.value.trim())); }}
            onFocus={() => { if (query.trim().length >= 2) setOpen(true); }}
            onKeyDown={(event) => {
              if (event.key === 'Escape') { setOpen(false); setActive(-1); }
              if (event.key === 'ArrowDown' && open && suggestions.length) {
                event.preventDefault();
                setActive((current) => Math.min(current + 1, suggestions.length - 1));
              }
              if (event.key === 'ArrowUp' && open && suggestions.length) {
                event.preventDefault();
                setActive((current) => Math.max(-1, current - 1));
              }
            }}
            aria-label="Search articles"
            aria-controls={menuId}
            aria-expanded={open && (loading || suggestions.length > 0)}
            aria-autocomplete="list"
            aria-activedescendant={open && active >= 0 ? `${menuId}-item-${active}` : undefined}
            placeholder="Search articles and topics..."
          />
          {loading && <span className="ct-search-field-loading"><Spinner size={1.4}/></span>}
        </div>
        <button type="submit" className="ct-search-submit">Search <span aria-hidden="true">↗</span></button>
      </form>
      <div id={menuId} className={`ct-search-suggestions ${open && (loading || suggestions.length > 0) ? 'is-open' : ''}`} role="listbox" aria-label="Search suggestions" aria-hidden={!(open && (loading || suggestions.length > 0))}>
        <div className="ct-search-suggestions-inner">
          {!loading && suggestions.map((suggestion, i) => (
            <button
              id={`${menuId}-item-${i}`}
              role="option"
              aria-selected={i === active}
              className="ct-search-suggestion"
              type="button"
              key={`${suggestion.type}-${suggestion.slug}`}
              tabIndex={open ? 0 : -1}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => goTo(destination(suggestion))}
            >
              <span className="ct-search-suggestion-type">{suggestion.type}</span>
              <span className="ct-search-suggestion-content">
                <strong>{stripHtml(suggestion.title)}</strong>
                {suggestion.excerpt && <span>{stripHtml(suggestion.excerpt).slice(0, 100)}</span>}
              </span>
              <span aria-hidden="true">↗</span>
            </button>
          ))}
          {loading && <div className="ct-search-suggestion-wait">Finding articles…</div>}
        </div>
      </div>
    </div>
  );
}
