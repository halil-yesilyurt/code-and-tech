'use client';

import { useState, useMemo, useEffect, useRef, useId } from 'react';

interface Project {
  title: string;
  description: string;
  techStack?: string[];
}

interface ProjectFiltersProps {
  projects: Project[];
  onFilterChange: (projects: Project[]) => void;
}

export default function ProjectFilters({ projects, onFilterChange }: ProjectFiltersProps) {
  const [selectedTech, setSelectedTech] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const menuId = useId();
  const root = useRef<HTMLDivElement>(null);
  const options = useRef<Array<HTMLButtonElement | null>>([]);

  const technologies = useMemo(() => {
    const values = new Set<string>();
    projects.forEach((project) => project.techStack?.forEach((tech) => values.add(tech)));
    return ['all', ...Array.from(values).sort((a, b) => a.localeCompare(b))];
  }, [projects]);

  const filtered = useMemo(() => {
    const needle = searchTerm.trim().toLocaleLowerCase();
    return projects.filter((project) =>
      (!needle || [project.title, project.description].some((value) => (value || '').toLocaleLowerCase().includes(needle))) &&
      (selectedTech === 'all' || project.techStack?.includes(selectedTech))
    );
  }, [projects, searchTerm, selectedTech]);

  useEffect(() => { onFilterChange(filtered); }, [filtered, onFilterChange]);
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const pick = (technology: string) => {
    setSelectedTech(technology);
    setOpen(false);
  };
  const selectedIndex = Math.max(0, technologies.indexOf(selectedTech));

  return (
    <div className="ct-project-filters">
      <div className="ct-project-filter-fields">
        <div className="ct-project-filter-search">
          <label htmlFor="ct-project-search">Search projects</label>
          <div className="ct-project-search-field">
            <svg aria-hidden="true" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="10.5" cy="10.5" r="7.5"/><path d="m16 16 5 5"/></svg>
            <input id="ct-project-search" type="search" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search by title or description..." />
          </div>
        </div>
        <div className="ct-project-filter-tech" ref={root}>
          <label id="ct-tech-label">Technology</label>
          <button
            type="button"
            className="ct-project-select-trigger"
            aria-labelledby="ct-tech-label ct-tech-value"
            aria-expanded={open}
            aria-haspopup="listbox"
            aria-controls={menuId}
            onClick={() => { setHighlight(selectedIndex); setOpen((value) => !value); }}
            onKeyDown={(event) => {
              if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
                event.preventDefault();
                setHighlight(Math.max(0, Math.min(technologies.length - 1, selectedIndex + (event.key === 'ArrowDown' ? 1 : -1))));
                setOpen(true);
              }
              if (event.key === 'Escape') setOpen(false);
            }}
          >
            <span id="ct-tech-value">{selectedTech === 'all' ? 'All technologies' : selectedTech}</span>
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m6 9 6 6 6-6"/></svg>
          </button>
          <div className={`ct-project-select-popover ${open ? 'is-open' : ''}`} inert={!open}>
            <div id={menuId} className="ct-project-select-options" role="listbox" aria-label="Filter by technology" tabIndex={-1} onKeyDown={(event) => {
              if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
                event.preventDefault();
                const next = (highlight + (event.key === 'ArrowDown' ? 1 : -1) + technologies.length) % technologies.length;
                setHighlight(next);
                options.current[next]?.focus();
              }
              if (event.key === 'Home' || event.key === 'End') {
                event.preventDefault();
                const next = event.key === 'Home' ? 0 : technologies.length - 1;
                setHighlight(next);
                options.current[next]?.focus();
              }
              if (event.key === 'Escape') {
                setOpen(false);
                root.current?.querySelector<HTMLButtonElement>('.ct-project-select-trigger')?.focus();
              }
            }}>
              {technologies.map((tech, i) => (
                <button
                  ref={(element) => { options.current[i] = element; }}
                  type="button"
                  role="option"
                  aria-selected={selectedTech === tech}
                  key={tech}
                  className="ct-project-option"
                  tabIndex={open ? 0 : -1}
                  onMouseEnter={() => setHighlight(i)}
                  onClick={() => pick(tech)}
                >
                  <span>{tech === 'all' ? 'All technologies' : tech}</span>
                  {selectedTech === tech && <span aria-hidden="true">✓</span>}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      {(searchTerm || selectedTech !== 'all') && (
        <div className="ct-project-active-filters" aria-live="polite">
          <span>{filtered.length} matching projects</span>
          {searchTerm && <button type="button" onClick={() => setSearchTerm('')}>“{searchTerm}” <span aria-hidden="true">×</span><span className="sr-only"> Clear search</span></button>}
          {selectedTech !== 'all' && <button type="button" onClick={() => pick('all')}>{selectedTech} <span aria-hidden="true">×</span><span className="sr-only"> Clear technology</span></button>}
          <button type="button" className="ct-project-clear" onClick={() => { setSearchTerm(''); pick('all'); }}>Clear all</button>
        </div>
      )}
    </div>
  );
}
