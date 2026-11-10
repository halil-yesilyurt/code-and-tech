const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const read = (file) => fs.readFileSync(path.join(__dirname, '..', file), 'utf8');

const project = read('src/app/components/ProjectFilters.tsx');
const projectsCss = read('src/app/phase3.css');
const toc = read('src/app/components/ArticleTableOfContents.tsx');
const articleCss = read('src/app/blog/editorial.css');
const cover = read('src/app/components/ArticleCover.tsx');
const client = read('src/app/projects/ProjectsClient.tsx');

assert(project.includes("selectedTech === 'all'") && project.includes("project.techStack?.includes(selectedTech)"), 'Filtering must retain exact technology matching');
assert(project.includes('onFilterChange(filtered)') && project.includes('setSearchTerm'), 'Search and tech filters must update parent');
assert(project.includes('aria-expanded={open}') && project.includes('role="listbox"') && project.includes('role="option"'), 'Technology dropdown must be keyboard-accessible');
assert(project.includes("event.key === 'Escape'") && project.includes("event.key === 'ArrowDown'"), 'Technology dropdown must support keyboard controls');
assert(project.includes('ct-project-select-popover') && !project.includes('<select'), 'Do not reopen native full-height technology menu');
assert(projectsCss.includes('max-height: min(288px, 45dvh)') && projectsCss.includes('overflow-y: auto'), 'Technology options must have a scrollable height cap');
assert(projectsCss.includes('@media(max-width: 760px)') && projectsCss.includes('grid-template-columns: minmax(0, 1fr)'), 'Technology filter must fit phone widths');
assert(client.includes('key={filtersKey}') && client.includes('setFiltersKey'), 'Reset button must clear real project filter state');

assert(toc.includes('querySelectorAll<HTMLHeadingElement>'), 'TOC must follow real article headings');
assert(toc.includes('ct-toc-mobile-toggle') && toc.includes('aria-expanded={mobileOpen}') && toc.includes('ct-toc-drawer'), 'Mobile TOC must become an accessible dropdown');
assert(toc.includes('setMobileOpen(false)') && toc.includes('scrollIntoView'), 'Selecting a heading closes drawer and navigates to section');
assert(articleCss.includes('grid-template-rows: 0fr') && articleCss.includes('.ct-toc-drawer.is-open'), 'Mobile TOC must animate like a drawer');
assert(articleCss.includes('overflow-x: hidden') && articleCss.includes('max-height: min(320px, 42dvh)'), 'Mobile TOC must not overflow horizontally');
assert(articleCss.includes('@media (prefers-reduced-motion: reduce)'), 'TOC must honor reduced motion');

assert(cover.includes('useId()') && cover.includes('patternId') && cover.includes('fadeId'), 'Inline SVG IDs must be unique across repeated cards');
assert(!cover.includes('fetch(') && !cover.includes('<Image'), 'Illustrations should be lightweight vectors without remote requests');
console.log('Project dropdown, mobile TOC and cover IDs contracts passed');
